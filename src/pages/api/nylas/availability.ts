export const prerender = false;

import type { APIRoute } from 'astro';

import { getAvailability, isNylasConfigured } from '@/lib/nylas/client';
import { getServiceById, getTeamMemberById, schedulingConfig } from '@/lib/nylas/config';
import type { AvailabilityRequest, DayAvailability, TimeSlot } from '@/lib/nylas/types';

/**
 * POST /api/nylas/availability
 * Get available time slots for a service
 *
 * Body: AvailabilityRequest
 * Response: { slots: TimeSlot[], days: DayAvailability[] }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isNylasConfigured()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Scheduling is not available' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await request.json()) as AvailabilityRequest & { duration?: number };
    const { serviceId, teamMemberId, startDate, endDate, timezone, duration } = body;

    // Validate required fields
    if (!serviceId || !startDate || !endDate || !timezone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'serviceId, startDate, endDate, and timezone are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate service exists
    const service = getServiceById(serviceId);
    if (!service) {
      return new Response(JSON.stringify({ success: false, error: 'Service not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate team member if specified
    if (teamMemberId) {
      const teamMember = getTeamMemberById(teamMemberId);
      if (!teamMember) {
        return new Response(JSON.stringify({ success: false, error: 'Team member not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const memberOffersService = teamMember.services.includes(serviceId);
      if (!service.teamMembers.includes(teamMemberId) && !memberOffersService) {
        return new Response(
          JSON.stringify({ success: false, error: 'Team member does not offer this service' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // Check minimum notice
    const minNoticeTime = new Date(
      now.getTime() + schedulingConfig.minimumNotice * 60 * 60 * 1000
    );
    if (start < minNoticeTime) {
      start.setTime(minNoticeTime.getTime());
    }

    // Check maximum advance booking
    const maxAdvanceTime = new Date(
      now.getTime() + schedulingConfig.maxAdvanceBooking * 24 * 60 * 60 * 1000
    );
    if (end > maxAdvanceTime) {
      end.setTime(maxAdvanceTime.getTime());
    }

    const adjustedStart = start.toISOString().split('T')[0];
    const adjustedEnd = end.toISOString().split('T')[0];

    const rawSlots: TimeSlot[] = await getAvailability({
      serviceId,
      teamMemberId,
      startDate: adjustedStart,
      endDate: adjustedEnd,
      timezone,
      duration,
    });

    // Group slots by day in the user's timezone for correct date boundaries
    const dayMap = new Map<string, DayAvailability>();

    for (const slot of rawSlots) {
      const dateKey = new Date(slot.startTime).toLocaleDateString('en-CA', { timeZone: timezone });

      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, {
          date: dateKey,
          slots: [],
          hasAvailability: false,
        });
      }

      const day = dayMap.get(dateKey)!;
      day.slots.push(slot);
      day.hasAvailability = true;
    }

    // Sort days chronologically
    const days = Array.from(dayMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          slots: rawSlots,
          days,
          service: {
            id: service.id,
            name: service.name,
            duration: duration ?? service.duration,
          },
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[availability] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch availability' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
