export const prerender = false;

import type { APIRoute } from 'astro';
import { isNylasConfigured } from '@/lib/nylas/client';
import { getServiceById, getTeamMemberById, schedulingConfig } from '@/lib/nylas/config';
import { createPendingBooking, hasReachedPendingLimit, cancelPendingBooking } from '@/lib/nylas/pending-bookings';
import type { BookingRequest } from '@/lib/nylas/types';
import { sendBookingConfirmationEmail } from '@/lib/nylas/emails';
import { z } from 'zod';

// Validation schema
const bookingSchema = z.object({
  serviceId: z.string().min(1),
  teamMemberId: z.string().min(1),
  startTime: z.string().datetime(),
  guestName: z.string().min(2).max(100),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  notes: z.string().max(1000).optional(),
  timezone: z.string().min(1),
  // Optional duration override (for profile pages)
  duration: z.number().min(5).max(120).optional(),
  meetingType: z.enum(['phone', 'teams', 'zoom', 'meet']).optional(),
  // Token of previous booking to cancel (when changing time)
  cancelToken: z.string().optional(),
  // Honeypot field
  website: z.string().optional(),
});

/**
 * POST /api/nylas/book
 * Create a pending booking and send confirmation email
 *
 * Body: BookingRequest
 * Response: { pendingBooking: { id, expiresAt } }
 */
export const POST: APIRoute = async ({ request, url }) => {
  try {
    if (!isNylasConfigured()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking is not available' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    // Validate input
    const parseResult = bookingSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid input',
          details: parseResult.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = parseResult.data;

    // Honeypot check
    if (data.website) {
      return new Response(JSON.stringify({ success: true, requiresConfirmation: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if email has too many pending bookings (anti-spam)
    // Normalize to lowercase — pending-bookings.ts queries with .toLowerCase()
    const reachedLimit = await hasReachedPendingLimit(data.guestEmail.toLowerCase());
    if (reachedLimit) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'You have several unconfirmed bookings. Please check your email (including spam/junk folder) for a confirmation link, or wait a few hours and try again.',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate service exists
    const service = getServiceById(data.serviceId);
    if (!service) {
      return new Response(JSON.stringify({ success: false, error: 'Service not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate team member
    const teamMember = getTeamMemberById(data.teamMemberId);
    if (!teamMember) {
      return new Response(JSON.stringify({ success: false, error: 'Team member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check relationship in both directions:
    // - service lists the team member (main booking page services), OR
    // - team member lists the service (profile-only services like strategy-call)
    if (!service.teamMembers.includes(data.teamMemberId) && !teamMember.services.includes(data.serviceId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Team member does not offer this service' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use custom duration if provided (from profile pages), otherwise use service default
    const bookingDuration = data.duration ?? service.duration;

    // Validate booking time
    const startTime = new Date(data.startTime);
    const now = new Date();
    const minNoticeTime = new Date(
      now.getTime() + schedulingConfig.minimumNotice * 60 * 60 * 1000
    );

    if (startTime < minNoticeTime) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Bookings require at least ${schedulingConfig.minimumNotice} hours notice`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const maxAdvanceTime = new Date(
      now.getTime() + schedulingConfig.maxAdvanceBooking * 24 * 60 * 60 * 1000
    );
    if (startTime > maxAdvanceTime) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Bookings can only be made up to ${schedulingConfig.maxAdvanceBooking} days in advance`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If changing time from a previous booking, cancel the old one first
    if (data.cancelToken) {
      await cancelPendingBooking(data.cancelToken);
      console.log(`Cancelled previous booking with token: ${data.cancelToken.substring(0, 8)}...`);
    }

    // Create pending booking
    const bookingRequest: BookingRequest = {
      serviceId: data.serviceId,
      teamMemberId: data.teamMemberId,
      startTime: data.startTime,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      notes: data.notes,
      timezone: data.timezone,
      durationOverride: data.duration,
      meetingType: data.meetingType,
    };

    const pendingBooking = await createPendingBooking(bookingRequest);

    // Build confirmation URL using site config for reliable origin
    const siteOrigin = import.meta.env.SITE || url.origin;
    const confirmUrl = new URL('/book/confirm/', siteOrigin);
    confirmUrl.searchParams.set('token', pendingBooking.token);

    // Send confirmation email
    await sendBookingConfirmationEmail({
      to: data.guestEmail,
      guestName: data.guestName,
      serviceName: service.name,
      serviceDuration: bookingDuration,
      teamMemberName: teamMember.name,
      startTime: new Date(data.startTime),
      timezone: data.timezone,
      confirmUrl: confirmUrl.toString(),
      expiresAt: pendingBooking.expiresAt,
    });

    console.log(
      `Pending booking created: ${pendingBooking.id} - ${data.guestName} with ${teamMember.name} for ${service.name}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        requiresConfirmation: true,
        data: {
          id: pendingBooking.id,
          email: data.guestEmail,
          expiresAt: pendingBooking.expiresAt.toISOString(),
          service: {
            name: service.name,
            duration: bookingDuration,
          },
          teamMember: {
            name: teamMember.name,
          },
          startTime: data.startTime,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create booking',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
