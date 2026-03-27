/**
 * Pending Bookings — In-Memory Implementation
 *
 * Stores unconfirmed bookings in server memory until the user clicks the
 * confirmation link. On confirmation, creates the actual Nylas calendar event.
 *
 * Note: In-memory storage is cleared on server restart. This is acceptable
 * for this satellite site. For persistence, migrate to a database.
 */

import { createBooking } from './client';
import type { BookingRequest, BookingConfirmation } from './types';

// ============================================================================
// Types
// ============================================================================

export interface PendingBooking {
  id: string;
  token: string;
  service_id: string;
  team_member_id: string;
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
  expiresAt: Date;
  bookingRequest: BookingRequest;
}

// ============================================================================
// In-Memory Store
// ============================================================================

// Global store (survives across requests in the same server process)
const pendingBookings = new Map<string, PendingBookingStore>();
const emailPendingCounts = new Map<string, number>();

// Cleanup interval: remove expired bookings every 10 minutes
function pruneExpired() {
  const now = new Date();
  for (const [token, booking] of pendingBookings.entries()) {
    if (booking.expiresAt < now) {
      const emailKey = booking.guest_email.toLowerCase();
      const count = emailPendingCounts.get(emailKey) ?? 0;
      if (count > 0) emailPendingCounts.set(emailKey, count - 1);
      pendingBookings.delete(token);
    }
  }
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

const PENDING_EXPIRY_MINUTES = 30;
const MAX_PENDING_PER_EMAIL = 3;

// ============================================================================
// Public Functions
// ============================================================================

/**
 * Check if an email address has too many pending (unconfirmed) bookings
 */
export async function hasReachedPendingLimit(email: string): Promise<boolean> {
  pruneExpired();
  const count = emailPendingCounts.get(email.toLowerCase()) ?? 0;
  return count >= MAX_PENDING_PER_EMAIL;
}

/**
 * Create a new pending booking (pre-confirmation step)
 */
export async function createPendingBooking(
  bookingRequest: BookingRequest
): Promise<{ id: string; token: string; expiresAt: Date }> {
  pruneExpired();

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
    expiresAt,
    bookingRequest,
  };

  pendingBookings.set(token, store);

  const emailKey = bookingRequest.guestEmail.toLowerCase();
  emailPendingCounts.set(emailKey, (emailPendingCounts.get(emailKey) ?? 0) + 1);

  return { id, token, expiresAt };
}

/**
 * Get a pending booking by its confirmation token
 */
export async function getPendingBookingByToken(
  token: string
): Promise<PendingBooking | null> {
  pruneExpired();
  const booking = pendingBookings.get(token);
  if (!booking) return null;

  // Return without internal fields
  const { expiresAt: _exp, bookingRequest: _req, ...rest } = booking;
  return rest;
}

/**
 * Confirm a pending booking by creating the Nylas calendar event
 */
export async function confirmPendingBooking(
  token: string
): Promise<{ success: boolean; booking?: BookingConfirmation; error?: string }> {
  pruneExpired();

  const store = pendingBookings.get(token);

  if (!store) {
    return { success: false, error: 'Booking not found or expired. Please try booking again.' };
  }

  if (store.status === 'confirmed') {
    return { success: false, error: 'This booking has already been confirmed.' };
  }

  if (store.status === 'cancelled') {
    return { success: false, error: 'This booking was cancelled.' };
  }

  if (new Date() > store.expiresAt) {
    store.status = 'expired';
    return { success: false, error: 'This confirmation link has expired. Please book again.' };
  }

  try {
    // Create the actual Nylas event
    const booking = await createBooking(store.bookingRequest);

    // Mark as confirmed
    store.status = 'confirmed';
    store.confirmed_at = new Date().toISOString();

    // Reduce pending count for this email
    const emailKey = store.guest_email.toLowerCase();
    const count = emailPendingCounts.get(emailKey) ?? 0;
    if (count > 0) emailPendingCounts.set(emailKey, count - 1);

    return { success: true, booking };
  } catch (error) {
    console.error('[pending-bookings] Error confirming booking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create calendar event',
    };
  }
}

/**
 * Cancel a pending booking (e.g., when user selects a new time)
 */
export async function cancelPendingBooking(token: string): Promise<void> {
  const store = pendingBookings.get(token);
  if (!store) return;

  store.status = 'cancelled';

  const emailKey = store.guest_email.toLowerCase();
  const count = emailPendingCounts.get(emailKey) ?? 0;
  if (count > 0) emailPendingCounts.set(emailKey, count - 1);
}
