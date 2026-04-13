/**
 * Nylas Booking Email Templates
 * Sends confirmation and notification emails via Elastic Email
 */

import { escapeHtml,sendEmail } from '@/lib/email';

// Absolute URL for emails. SVG renders in most modern clients (Apple Mail,
// Gmail web, iOS Mail); Outlook desktop will fall back to the alt text.
// Swap to a PNG here if broader Outlook support is needed.
const LOGO_URL = 'https://mortgagerenewalhub.ca/images/layout/logo.svg';
const SITE_URL = 'https://mortgagerenewalhub.ca';

// ============================================================================
// Types
// ============================================================================

interface BookingConfirmationEmailParams {
  to: string;
  guestName: string;
  serviceName: string;
  serviceDuration: number;
  teamMemberName: string;
  startTime: Date;
  timezone: string;
  confirmUrl: string;
  expiresAt: Date;
}

interface BookingConfirmedEmailParams {
  to: string;
  guestName: string;
  serviceName: string;
  serviceDuration: number;
  teamMemberName: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  meetingLink?: string;
  calendarLinks?: { google?: string; outlook?: string; ics?: string };
  token: string;
}

interface BookingNotificationEmailParams {
  teamMemberEmail: string;
  teamMemberName: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  notes?: string;
  serviceName: string;
  serviceDuration: number;
  startTime: Date;
  timezone: string;
  meetingType?: string;
  meetingLink?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function formatTime(date: Date, timezone: string): string {
  try {
    return date.toLocaleString('en-CA', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return date.toLocaleString('en-CA');
  }
}

// ============================================================================
// Email Functions
// ============================================================================

/**
 * Send a confirmation email asking the user to verify their booking
 */
export async function sendBookingConfirmationEmail(
  params: BookingConfirmationEmailParams
): Promise<void> {
  const {
    to,
    guestName,
    serviceName,
    serviceDuration,
    teamMemberName,
    startTime,
    timezone,
    confirmUrl,
    expiresAt,
  } = params;

  const formattedTime = formatTime(startTime, timezone);
  const expiresFormatted = expiresAt.toLocaleString('en-CA', {
    timeZone: timezone,
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="padding: 24px 40px; text-align: center; background: #ffffff;">
      <a href="${SITE_URL}" style="display: inline-block; text-decoration: none;">
        <img src="${LOGO_URL}" alt="MortgageRenewalHub.ca" width="180" style="max-width: 180px; height: auto; display: inline-block;" />
      </a>
    </div>
    <div style="background: #0D2B45; padding: 32px 40px;">
      <h1 style="color: white; margin: 0; font-size: 22px;">MortgageRenewal<span style="color: #00A896;">Hub</span>.ca</h1>
    </div>
    <div style="padding: 40px;">
      <h2 style="color: #0D2B45; margin-top: 0;">Confirm Your Booking</h2>
      <p style="color: #555; line-height: 1.6;">Hi ${escapeHtml(guestName)},</p>
      <p style="color: #555; line-height: 1.6;">
        You requested a <strong>${escapeHtml(serviceName)}</strong> (${serviceDuration} min) with <strong>${escapeHtml(teamMemberName)}</strong>.
      </p>
      <div style="background: #f0f7ff; border: 1px solid #cce0f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; font-weight: 600; color: #0D2B45;">📅 ${escapeHtml(formattedTime)}</p>
      </div>
      <p style="color: #555; line-height: 1.6;">
        To confirm your booking, click the button below. This link expires ${escapeHtml(expiresFormatted)}.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${escapeHtml(confirmUrl)}" style="background: #0D2B45; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
          Confirm My Booking →
        </a>
      </div>
      <p style="color: #888; font-size: 13px; line-height: 1.6;">
        If you didn't request this booking, you can ignore this email. No action is required.
      </p>
    </div>
    <div style="background: #f9f9f9; padding: 20px 40px; border-top: 1px solid #eee;">
      <p style="margin: 0; font-size: 12px; color: #888; text-align: center;">
        MortgageRenewalHub.ca · Free mortgage renewal guidance for Canadians
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  await sendEmail({
    to,
    subject: `Confirm your booking: ${serviceName} with ${teamMemberName}`,
    html,
    text: `Hi ${guestName},\n\nPlease confirm your booking for ${serviceName} with ${teamMemberName} on ${formattedTime}.\n\nConfirm here: ${confirmUrl}\n\nThis link expires ${expiresFormatted}.`,
  });
}

/**
 * Send a confirmed booking email with calendar details
 */
export async function sendBookingConfirmedEmail(
  params: BookingConfirmedEmailParams
): Promise<void> {
  const {
    to,
    guestName,
    serviceName,
    serviceDuration,
    teamMemberName,
    startTime,
    timezone,
    meetingLink,
    calendarLinks,
  } = params;

  const formattedTime = formatTime(startTime, timezone);

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="padding: 24px 40px; text-align: center; background: #ffffff;">
      <a href="${SITE_URL}" style="display: inline-block; text-decoration: none;">
        <img src="${LOGO_URL}" alt="MortgageRenewalHub.ca" width="180" style="max-width: 180px; height: auto; display: inline-block;" />
      </a>
    </div>
    <div style="background: #0D2B45; padding: 32px 40px;">
      <h1 style="color: white; margin: 0; font-size: 22px;">MortgageRenewal<span style="color: #00A896;">Hub</span>.ca</h1>
    </div>
    <div style="padding: 40px;">
      <div style="background: #e8f5e9; border-radius: 8px; padding: 12px 20px; margin-bottom: 24px; display: inline-block;">
        <p style="margin: 0; color: #2e7d32; font-weight: 600;">✓ Booking Confirmed</p>
      </div>
      <h2 style="color: #0D2B45; margin-top: 0;">You're all set!</h2>
      <p style="color: #555; line-height: 1.6;">Hi ${escapeHtml(guestName)},</p>
      <p style="color: #555; line-height: 1.6;">
        Your <strong>${escapeHtml(serviceName)}</strong> (${serviceDuration} min) with <strong>${escapeHtml(teamMemberName)}</strong> is confirmed.
      </p>
      <div style="background: #f0f7ff; border: 1px solid #cce0f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; font-weight: 600; color: #0D2B45;">📅 ${escapeHtml(formattedTime)}</p>
        ${meetingLink ? `<p style="margin: 8px 0 0; color: #555;">📞 <a href="${escapeHtml(meetingLink)}" style="color: #00A896;">Join Meeting</a></p>` : ''}
      </div>
      ${calendarLinks ? `
      <p style="color: #555;">Add to your calendar:</p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 12px 0;">
        ${calendarLinks.google ? `<a href="${escapeHtml(calendarLinks.google)}" style="background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 8px 16px; text-decoration: none; color: #333; font-size: 14px;">Google Calendar</a>` : ''}
        ${calendarLinks.outlook ? `<a href="${escapeHtml(calendarLinks.outlook)}" style="background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 8px 16px; text-decoration: none; color: #333; font-size: 14px;">Outlook</a>` : ''}
        ${calendarLinks.ics ? `<a href="${escapeHtml(calendarLinks.ics)}" style="background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 8px 16px; text-decoration: none; color: #333; font-size: 14px;">Download .ics</a>` : ''}
      </div>
      ` : ''}
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        To prepare for your call, you may want to have handy: your current mortgage statement, your renewal date, and any other offers you've received.
      </p>
    </div>
    <div style="background: #f9f9f9; padding: 20px 40px; border-top: 1px solid #eee;">
      <p style="margin: 0; font-size: 12px; color: #888; text-align: center;">
        MortgageRenewalHub.ca · Free mortgage renewal guidance for Canadians
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  await sendEmail({
    to,
    subject: `Booking confirmed: ${serviceName} with ${teamMemberName}`,
    html,
    text: `Hi ${guestName},\n\nYour ${serviceName} with ${teamMemberName} is confirmed for ${formattedTime}.\n\n${meetingLink ? `Meeting link: ${meetingLink}` : ''}`,
  });
}

/**
 * Send an internal notification email to the team member
 */
export async function sendBookingNotificationEmail(
  params: BookingNotificationEmailParams
): Promise<void> {
  const {
    teamMemberEmail,
    teamMemberName: _teamMemberName,
    guestName,
    guestEmail,
    guestPhone,
    notes,
    serviceName,
    serviceDuration,
    startTime,
    timezone,
    meetingType,
    meetingLink,
  } = params;

  const formattedTime = formatTime(startTime, timezone);

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 12px 0 20px;">
    <a href="${SITE_URL}" style="display: inline-block; text-decoration: none;">
      <img src="${LOGO_URL}" alt="MortgageRenewalHub.ca" width="160" style="max-width: 160px; height: auto;" />
    </a>
  </div>
  <h2 style="color: #0D2B45;">New Booking — ${escapeHtml(serviceName)}</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #555; font-weight: 600; width: 140px;">Guest</td><td style="padding: 8px 0;">${escapeHtml(guestName)}</td></tr>
    <tr><td style="padding: 8px 0; color: #555; font-weight: 600;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(guestEmail)}">${escapeHtml(guestEmail)}</a></td></tr>
    ${guestPhone ? `<tr><td style="padding: 8px 0; color: #555; font-weight: 600;">Phone</td><td style="padding: 8px 0;">${escapeHtml(guestPhone)}</td></tr>` : ''}
    <tr><td style="padding: 8px 0; color: #555; font-weight: 600;">Time</td><td style="padding: 8px 0;">${escapeHtml(formattedTime)}</td></tr>
    <tr><td style="padding: 8px 0; color: #555; font-weight: 600;">Duration</td><td style="padding: 8px 0;">${serviceDuration} minutes</td></tr>
    ${meetingType ? `<tr><td style="padding: 8px 0; color: #555; font-weight: 600;">Meeting Type</td><td style="padding: 8px 0;">${escapeHtml(meetingType)}</td></tr>` : ''}
    ${meetingLink ? `<tr><td style="padding: 8px 0; color: #555; font-weight: 600;">Meeting Link</td><td style="padding: 8px 0;"><a href="${escapeHtml(meetingLink)}">${escapeHtml(meetingLink)}</a></td></tr>` : ''}
    ${notes ? `<tr><td style="padding: 8px 0; color: #555; font-weight: 600; vertical-align: top;">Notes</td><td style="padding: 8px 0;">${escapeHtml(notes)}</td></tr>` : ''}
  </table>
  <p style="color: #888; font-size: 12px; margin-top: 24px;">Booked via MortgageRenewalHub.ca</p>
</body>
</html>
  `.trim();

  await sendEmail({
    to: teamMemberEmail,
    subject: `New booking: ${serviceName} — ${guestName}`,
    html,
    text: `New booking for ${serviceName}\nGuest: ${guestName} (${guestEmail})\nTime: ${formattedTime}`,
    replyTo: guestEmail,
  });
}
