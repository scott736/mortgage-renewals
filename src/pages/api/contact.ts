export const prerender = false;

import type { APIRoute } from 'astro';

import { escapeHtml, sendEmail } from '@/lib/email';
import {
  type LeadEnvelope,
  leadEnvelopeHtmlBlock,
  leadEnvelopeJson,
} from '@/lib/lead-payload';

interface ContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  message?: unknown;
  confirm?: unknown;
  website?: unknown;
  source?: unknown;
  renewalDate?: unknown;
  currentLender?: unknown;
  balance?: unknown;
  province?: unknown;
  pageUrl?: unknown;
  calculator?: unknown;
  meta?: unknown;
}

const MAX_NAME_LEN = 100;
const MAX_MESSAGE_LEN = 5000;
const MAX_EMAIL_LEN = 254;
const MAX_FIELD_LEN = 200;
const RECIPIENT = 'info@lendcity.ca';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= MAX_EMAIL_LEN;
}

function asString(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function sourceLabel(source: string): string {
  switch (source) {
    case 'calculator_lead':
      return 'Calculator lead';
    case 'rate_alert':
      return 'Rate alert signup';
    case 'checklist_download':
      return 'Checklist PDF download';
    default:
      return 'Contact form';
  }
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
  const source = asString(body.source, 50) || 'contact_form';
  const renewalDate = asString(body.renewalDate, MAX_FIELD_LEN);
  const currentLender = asString(body.currentLender, MAX_FIELD_LEN);
  const balance = asString(body.balance, MAX_FIELD_LEN);
  const province = asString(body.province, MAX_FIELD_LEN);
  const pageUrl = asString(body.pageUrl, 500);

  let calculatorBlock: LeadEnvelope['calculator'];
  if (body.calculator && typeof body.calculator === 'object' && body.calculator !== null) {
    const c = body.calculator as Record<string, unknown>;
    calculatorBlock = {
      tool: asString(c.tool, MAX_FIELD_LEN),
      summary: asString(c.summary, MAX_MESSAGE_LEN),
      data:
        c.data && typeof c.data === 'object'
          ? (c.data as Record<string, string | number | boolean>)
          : undefined,
    };
  }

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

  const envelope: LeadEnvelope = {
    source:
      source === 'calculator_lead'
        ? 'calculator_lead'
        : source === 'rate_alert'
          ? 'rate_alert'
          : source === 'checklist_download'
            ? 'checklist_download'
            : 'contact_form',
    submittedAt: new Date().toISOString(),
    pageUrl: pageUrl || undefined,
    contact: {
      firstName,
      lastName,
      email,
    },
    mortgage:
      renewalDate || currentLender || balance || province
        ? { renewalDate, currentLender, balance, province }
        : undefined,
    calculator: calculatorBlock,
    message: message || undefined,
    meta:
      body.meta && typeof body.meta === 'object'
        ? Object.fromEntries(
            Object.entries(body.meta as Record<string, unknown>).map(([k, v]) => [
              k,
              asString(v, MAX_FIELD_LEN),
            ]),
          )
        : undefined,
  };

  const safeFirst = escapeHtml(firstName);
  const safeLast = escapeHtml(lastName);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message || '(no message)').replace(/\n/g, '<br>');

  const mortgageRows = [
    renewalDate && `<tr><td style="padding:4px 8px;color:#666;">Renewal date</td><td>${escapeHtml(renewalDate)}</td></tr>`,
    currentLender && `<tr><td style="padding:4px 8px;color:#666;">Current lender</td><td>${escapeHtml(currentLender)}</td></tr>`,
    balance && `<tr><td style="padding:4px 8px;color:#666;">Balance</td><td>${escapeHtml(balance)}</td></tr>`,
    province && `<tr><td style="padding:4px 8px;color:#666;">Province</td><td>${escapeHtml(province)}</td></tr>`,
  ]
    .filter(Boolean)
    .join('');

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="margin:0 0 16px;font-size:18px;">${escapeHtml(sourceLabel(source))}</h2>
      <p style="margin:0 0 8px;"><strong>From:</strong> ${safeFirst} ${safeLast} &lt;${safeEmail}&gt;</p>
      ${pageUrl ? `<p style="margin:0 0 8px;font-size:13px;color:#666;">Page: ${escapeHtml(pageUrl)}</p>` : ''}
      ${mortgageRows ? `<table style="margin:12px 0;font-size:14px;border-collapse:collapse;">${mortgageRows}</table>` : ''}
      ${calculatorBlock ? `<p style="margin:0 0 4px;"><strong>Calculator:</strong> ${escapeHtml(calculatorBlock.tool)}</p><p style="margin:0 0 12px;font-size:13px;">${escapeHtml(calculatorBlock.summary)}</p>` : ''}
      <p style="margin:0 0 4px;"><strong>Message:</strong></p>
      <div style="padding:12px;border-radius:8px;background:#f5f5f5;white-space:pre-wrap;">${safeMessage}</div>
      ${leadEnvelopeHtmlBlock(envelope)}
      <p style="margin:24px 0 0;font-size:12px;color:#666;">Sent via mortgagerenewalhub.ca</p>
    </div>
  `;

  const text = [
    `${sourceLabel(source)}`,
    '',
    `From: ${firstName} ${lastName} <${email}>`,
    pageUrl ? `Page: ${pageUrl}` : null,
    renewalDate ? `Renewal date: ${renewalDate}` : null,
    currentLender ? `Current lender: ${currentLender}` : null,
    balance ? `Balance: ${balance}` : null,
    province ? `Province: ${province}` : null,
    calculatorBlock ? `Calculator: ${calculatorBlock.tool}\n${calculatorBlock.summary}` : null,
    '',
    'Message:',
    message || '(no message)',
    '',
    'CRM_PAYLOAD',
    leadEnvelopeJson(envelope),
    '',
    'Sent via mortgagerenewalhub.ca',
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    await sendEmail({
      to: RECIPIENT,
      subject: `${sourceLabel(source)} — ${firstName} ${lastName}`,
      html,
      text,
      replyTo: email,
    });
  } catch (error) {
    console.error('[contact] email send failed:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Could not send your message. Please call us at (226) 212-7200.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
