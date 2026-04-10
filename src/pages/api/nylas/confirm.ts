export const prerender = false;

import type { APIRoute } from 'astro';
import { confirmPendingBooking, getPendingBookingByToken } from '@/lib/nylas/pending-bookings';
import { getServiceById, getTeamMemberById } from '@/lib/nylas/config';
import { sendBookingConfirmedEmail, sendBookingNotificationEmail } from '@/lib/nylas/emails';

/**
 * POST /api/nylas/confirm
 * Confirm a pending booking and create the calendar event
 *
 * Body: { token: string }
 * Response: { booking: BookingConfirmation }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid confirmation token' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Confirm the booking
    const result = await confirmPendingBooking(token);

    if (!result.success || !result.booking) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Failed to confirm booking' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { booking } = result;

    // Get the pending booking details for the email
    const pending = await getPendingBookingByToken(token);

    // Send confirmation email with calendar details
    if (pending) {
      const service = getServiceById(pending.service_id);
      const teamMember = pending.team_member_id ? getTeamMemberById(pending.team_member_id) : undefined;

      if (service && teamMember) {
        // Use duration override if set (from profile pages), otherwise use service default
        const actualDuration = pending.duration_override ?? service.duration;

        await sendBookingConfirmedEmail({
          to: pending.guest_email,
          guestName: pending.guest_name,
          serviceName: service.name,
          serviceDuration: actualDuration,
          teamMemberName: teamMember.name,
          startTime: booking.startTime,
          endTime: booking.endTime,
          timezone: pending.timezone,
          meetingLink: booking.meetingLink,
          calendarLinks: booking.calendarLinks,
          token,
        });

        // Send internal notification to team member
        try {
          await sendBookingNotificationEmail({
            teamMemberEmail: teamMember.email,
            teamMemberName: teamMember.name,
            guestName: pending.guest_name,
            guestEmail: pending.guest_email,
            guestPhone: pending.guest_phone || undefined,
            notes: pending.notes || undefined,
            serviceName: service.name,
            serviceDuration: actualDuration,
            startTime: booking.startTime,
            timezone: pending.timezone,
            meetingType: pending.meeting_type || undefined,
            meetingLink: booking.meetingLink,
          });
        } catch (notifyError) {
          // Don't block the booking response if notification fails
          console.error('Failed to send booking notification email:', notifyError);
        }
      }
    }

    console.log(`Booking confirmed: ${booking.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: booking.id,
          service: {
            name: booking.service.name,
            duration: booking.service.duration,
          },
          teamMember: {
            name: booking.teamMember.name,
            email: booking.teamMember.email,
          },
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
          meetingLink: booking.meetingLink,
          calendarLinks: booking.calendarLinks,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Confirmation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to confirm booking',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * GET /api/nylas/confirm?token=xxx
 * Get pending booking details (for showing on confirmation page)
 */
export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, error: 'Missing token' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const pending = await getPendingBookingByToken(token);

  if (!pending) {
    return new Response(
      JSON.stringify({ success: false, error: 'Booking not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const service = getServiceById(pending.service_id);
  const teamMember = pending.team_member_id ? getTeamMemberById(pending.team_member_id) : undefined;

  // Use duration override if set (from profile pages), otherwise use service default
  const actualDuration = pending.duration_override ?? service?.duration ?? 30;

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        status: pending.status,
        service: service ? { name: service.name, duration: actualDuration } : null,
        teamMember: teamMember ? { name: teamMember.name } : null,
        startTime: pending.start_time,
        guestName: pending.guest_name,
        guestEmail: pending.guest_email,
        timezone: pending.timezone,
        expiresAt: pending.expires_at,
        confirmedAt: pending.confirmed_at,
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
