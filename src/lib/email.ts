const KEPLARS_API_KEY =
  import.meta.env.KEPLARS_API_KEY ||
  (typeof process !== 'undefined' ? process.env.KEPLARS_API_KEY : undefined);

const FROM_EMAIL = 'booking@mortgagerenewalhub.ca';
const FROM_NAME = 'MortgageRenewalHub.ca';
const DEFAULT_REPLY_TO = 'scott@lendcity.ca';
const KEPLARS_SEND_API = 'https://api.keplars.com/api/v1/send-email/instant';
const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 1_000;
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const dateMs = Date.parse(header);
  if (Number.isFinite(dateMs)) return Math.max(0, dateMs - Date.now());
  return null;
}

export async function sendEmail(params: SendEmailParams) {
  if (!KEPLARS_API_KEY) {
    throw new Error('KEPLARS_API_KEY environment variable is not set');
  }

  const recipients = Array.isArray(params.to) ? params.to : [params.to];
  const payload: Record<string, unknown> = {
    from: FROM_EMAIL,
    from_name: FROM_NAME,
    to: recipients,
    subject: params.subject,
    html: params.html,
    reply_to: params.replyTo ?? DEFAULT_REPLY_TO,
  };
  if (params.text) {
    payload.text = params.text;
  }

  const postEmail = async (): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      return await fetch(KEPLARS_SEND_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${KEPLARS_API_KEY}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };

  let response = await postEmail();

  if (RETRYABLE_STATUSES.has(response.status)) {
    const delay = parseRetryAfter(response.headers.get('retry-after')) ?? RETRY_DELAY_MS;
    const firstError = await response.text().catch(() => '<unreadable body>');
    console.error(`Keplars ${response.status} on first attempt, retrying in ${delay}ms:`, firstError);
    await new Promise((r) => setTimeout(r, delay));
    response = await postEmail();
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Keplars send error:', errorText);
    throw new Error(`Keplars send failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
