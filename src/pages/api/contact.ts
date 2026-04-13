export const prerender = false;

import type { APIRoute } from 'astro';

import { escapeHtml, sendEmail } from '@/lib/email';

interface ContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  message?: unknown;
  confirm?: unknown;
  website?: unknown; // honeypot
}

const MAX_NAME_LEN = 100;
const MAX_MESSAGE_LEN = 5000;
const MAX_EMAIL_LEN = 254;
const RECIPIENT = 'info@lendcity.ca';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= MAX_EMAIL_LEN;
}

function asString(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export const POST: APIRoute = async ({ request }) => {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Honeypot — silently accept
  if (typeof body.website === 'string' && body.website.trim().length > 0) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const firstName = asString(body.firstName, MAX_NAME_LEN);
  const lastName = asString(body.lastName, MAX_NAME_LEN);
  const email = asString(body.email, MAX_EMAIL_LEN);
  const message = asString(body.message, MAX_MESSAGE_LEN);
  const confirmed = body.confirm === true || body.confirm === 'on';

  if (!firstName || !lastName) {
    return new Response(
      JSON.stringify({ success: false, error: 'Please provide your name.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (!isEmail(email)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Please provide a valid email address.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (!confirmed) {
    return new Response(
      JSON.stringify({ success: false, error: 'Please confirm you agree to be contacted.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const safeFirst = escapeHtml(firstName);
  const safeLast = escapeHtml(lastName);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message || '(no message)').replace(/\n/g, '<br>');

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="margin:0 0 16px;font-size:18px;">New contact form submission</h2>
      <p style="margin:0 0 8px;"><strong>From:</strong> ${safeFirst} ${safeLast} &lt;${safeEmail}&gt;</p>
      <p style="margin:0 0 4px;"><strong>Message:</strong></p>
      <div style="padding:12px;border-radius:8px;background:#f5f5f5;white-space:pre-wrap;">${safeMessage}</div>
      <p style="margin:24px 0 0;font-size:12px;color:#666;">Sent via mortgagerenewalhub.ca/contact/</p>
    </div>
  `;
  const text = `New contact form submission\n\nFrom: ${firstName} ${lastName} <${email}>\n\nMessage:\n${message || '(no message)'}\n\nSent via mortgagerenewalhub.ca/contact/`;

  try {
    await sendEmail({
      to: RECIPIENT,
      subject: `Contact form — ${firstName} ${lastName}`,
      html,
      text,
      replyTo: email,
    });
  } catch (error) {
    console.error('[contact] email send failed:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Could not send your message. Please call us at (519) 960-0370.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
