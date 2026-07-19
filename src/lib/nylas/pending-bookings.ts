/**
 * Pending Bookings — Durable Storage
 *
 * Stores unconfirmed bookings until the user clicks the confirmation link in
 * their email. On confirmation, creates the actual Nylas calendar event.
 *
 * Primary store: Upstash Redis (via @upstash/redis REST client). Auto-populated
 * by the Vercel Marketplace Upstash integration as UPSTASH_REDIS_REST_URL /
 * UPSTASH_REDIS_REST_TOKEN. Entries TTL after 30 minutes.
 *
 * Fallback: in-memory Map (local dev only — lost between serverless invocations,
 * which is why Redis is required in production).
 *
 * Redis is loaded lazily (dynamic import) so book/confirm routes do not crash
 * at module init on Cloudflare Workers the way a static `@upstash/redis` import can.
 */

import { createBooking } from './client';
import type { BookingConfirmation, BookingRequest } from './types';

// ============================================================================
// Types
// ============================================================================

export interface PendingBooking {
  id: string;
  token: string;
  service_id: string;
  team_member_id?: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  notes?: string;
  start_time: string;
  timezone: string;
  duration_override?: number;
  meeting_type?: string;
  status: 'pending' | 'confirmed' | 'expired' | 'cancelled';
  expires_at: string;
  confirmed_at?: string;
  created_at: string;
}

interface PendingBookingStore extends PendingBooking {
  bookingRequest: BookingRequest;
}

type RedisClient = {
  get: <T>(key: string) => Promise<T | null>;
  set: (
    key: string,
    value: unknown,
    opts?: { ex?: number; nx?: boolean },
  ) => Promise<unknown>;
  incr: (key: string) => Promise<number>;
  decr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<unknown>;
  del: (...keys: string[]) => Promise<unknown>;
};

// ============================================================================
// Storage Adapter
// ============================================================================

const PENDING_EXPIRY_MINUTES = 30;
const MAX_PENDING_PER_EMAIL = 3;
const TOKEN_KEY = (token: string) => `pb:token:${token}`;
const EMAIL_KEY = (email: string) => `pb:email:${email.toLowerCase()}`;

let redisPromise: Promise<RedisClient | null> | null = null;

function readEnv(name: string): string | undefined {
  const fromImportMeta =
    typeof import.meta !== 'undefined'
      ? (import.meta.env?.[name] as string | undefined)
      : undefined;
  const fromProcess =
    typeof process !== 'undefined' ? process.env[name] : undefined;
  return fromImportMeta || fromProcess;
}

async function getRedis(): Promise<RedisClient | null> {
  if (!redisPromise) {
    redisPromise = (async () => {
      const redisUrl =
        readEnv('UPSTASH_REDIS_REST_URL') || readEnv('KV_REST_API_URL');
      const redisToken =
        readEnv('UPSTASH_REDIS_REST_TOKEN') || readEnv('KV_REST_API_TOKEN');
      if (!redisUrl || !redisToken) return null;
      try {
        const { Redis } = await import('@upstash/redis');
        return new Redis({ url: redisUrl, token: redisToken }) as RedisClient;
      } catch (err) {
        console.error('[pending-bookings] Failed to init Redis:', err);
        return null;
      }
    })();
  }
  return redisPromise;
}

// In-memory fallback (local dev only)
const memoryStore = new Map<string, PendingBookingStore>();
const memoryEmailCounts = new Map<string, number>();

function pruneMemory() {
  const now = Date.now();
  for (const [token, booking] of memoryStore.entries()) {
    if (new Date(booking.expires_at).getTime() < now) {
      const emailKey = booking.guest_email.toLowerCase();
      const count = memoryEmailCounts.get(emailKey) ?? 0;
      if (count > 0) memoryEmailCounts.set(emailKey, count - 1);
      memoryStore.delete(token);
    }
  }
}

async function storeGet(token: string): Promise<PendingBookingStore | null> {
  const redis = await getRedis();
  if (redis) {
    try {
      return (await redis.get<PendingBookingStore>(TOKEN_KEY(token))) ?? null;
    } catch (err) {
      console.error('[pending-bookings] Redis get failed:', err);
      redisPromise = null;
    }
  }
  pruneMemory();
  return memoryStore.get(token) ?? null;
}

async function storeSet(
  token: string,
  booking: PendingBookingStore,
  ttlSeconds: number,
): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    try {
      await redis.set(TOKEN_KEY(token), booking, { ex: ttlSeconds });
      return;
    } catch (err) {
      console.error('[pending-bookings] Redis set failed:', err);
      redisPromise = null;
    }
  }
  memoryStore.set(token, booking);
}

async function storeUpdate(
  token: string,
  booking: PendingBookingStore,
): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    const ttl = Math.max(
      60,
      Math.floor((new Date(booking.expires_at).getTime() - Date.now()) / 1000),
    );
    await redis.set(TOKEN_KEY(token), booking, { ex: ttl });
    return;
  }
  memoryStore.set(token, booking);
}

async function emailIncr(email: string): Promise<number> {
  const key = EMAIL_KEY(email);
  const redis = await getRedis();
  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, PENDING_EXPIRY_MINUTES * 60);
    return count;
  }
  pruneMemory();
  const next = (memoryEmailCounts.get(email.toLowerCase()) ?? 0) + 1;
  memoryEmailCounts.set(email.toLowerCase(), next);
  return next;
}

async function emailDecr(email: string): Promise<void> {
  const key = EMAIL_KEY(email);
  const redis = await getRedis();
  if (redis) {
    const count = await redis.decr(key);
    if (count <= 0) await redis.del(key);
    return;
  }
  const current = memoryEmailCounts.get(email.toLowerCase()) ?? 0;
  if (current > 0) memoryEmailCounts.set(email.toLowerCase(), current - 1);
}

async function emailCount(email: string): Promise<number> {
  const redis = await getRedis();
  if (redis) {
    const value = await redis.get<number>(EMAIL_KEY(email));
    return value ?? 0;
  }
  pruneMemory();
  return memoryEmailCounts.get(email.toLowerCase()) ?? 0;
}

// ============================================================================
// Helpers
// ============================================================================

function generateId(): string {
  return crypto.randomUUID();
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================================
// Public Functions
// ============================================================================

export async function hasReachedPendingLimit(email: string): Promise<boolean> {
  return (await emailCount(email)) >= MAX_PENDING_PER_EMAIL;
}

export async function createPendingBooking(
  bookingRequest: BookingRequest,
): Promise<{ id: string; token: string; expiresAt: Date }> {
  const id = generateId();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + PENDING_EXPIRY_MINUTES * 60 * 1000);
  const now = new Date().toISOString();

  const store: PendingBookingStore = {
    id,
    token,
    service_id: bookingRequest.serviceId,
    team_member_id: bookingRequest.teamMemberId,
    guest_name: bookingRequest.guestName,
    guest_email: bookingRequest.guestEmail.toLowerCase(),
    guest_phone: bookingRequest.guestPhone,
    notes: bookingRequest.notes,
    start_time: bookingRequest.startTime,
    timezone: bookingRequest.timezone,
    duration_override: bookingRequest.durationOverride,
    meeting_type: bookingRequest.meetingType,
    status: 'pending',
    expires_at: expiresAt.toISOString(),
    created_at: now,
    bookingRequest,
  };

  await storeSet(token, store, PENDING_EXPIRY_MINUTES * 60);
  await emailIncr(bookingRequest.guestEmail);

  return { id, token, expiresAt };
}

export async function getPendingBookingByToken(
  token: string,
): Promise<PendingBooking | null> {
  const booking = await storeGet(token);
  if (!booking) return null;
  const { bookingRequest: _req, ...rest } = booking;
  return rest;
}

export async function confirmPendingBooking(
  token: string,
): Promise<{ success: boolean; booking?: BookingConfirmation; error?: string }> {
  const store = await storeGet(token);

  if (!store) {
    return { success: false, error: 'Booking not found or expired. Please try booking again.' };
  }

  if (store.status === 'confirmed') {
    return { success: false, error: 'This booking has already been confirmed.' };
  }

  if (store.status === 'cancelled') {
    return { success: false, error: 'This booking was cancelled.' };
  }

  if (Date.now() > new Date(store.expires_at).getTime()) {
    store.status = 'expired';
    await storeUpdate(token, store);
    return { success: false, error: 'This confirmation link has expired. Please book again.' };
  }

  // Claim before creating the calendar event so parallel confirms cannot double-book.
  const claimKey = `pb:confirming:${token}`;
  const redis = await getRedis();
  if (redis) {
    const claimed = await redis.set(claimKey, '1', { nx: true, ex: 120 });
    if (!claimed) {
      const latest = await storeGet(token);
      if (latest?.status === 'confirmed') {
        return { success: false, error: 'This booking has already been confirmed.' };
      }
      return { success: false, error: 'Confirmation already in progress. Please wait a moment.' };
    }
  }

  // Mark confirmed before createBooking so a second request sees non-pending status.
  store.status = 'confirmed';
  store.confirmed_at = new Date().toISOString();
  await storeUpdate(token, store);

  try {
    const booking = await createBooking(store.bookingRequest);
    await emailDecr(store.guest_email);
    if (redis) await redis.del(claimKey);
    return { success: true, booking };
  } catch (error) {
    console.error('[pending-bookings] Error confirming booking:', error);
    store.status = 'pending';
    delete store.confirmed_at;
    await storeUpdate(token, store);
    if (redis) await redis.del(claimKey);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create calendar event',
    };
  }
}

export async function cancelPendingBooking(token: string): Promise<void> {
  const store = await storeGet(token);
  if (!store) return;
  store.status = 'cancelled';
  await storeUpdate(token, store);
  await emailDecr(store.guest_email);
}
