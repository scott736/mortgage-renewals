const ELASTIC_EMAIL_API_KEY = import.meta.env.ELASTIC_EMAIL_API_KEY
  || (typeof process !== 'undefined' ? process.env.ELASTIC_EMAIL_API_KEY : undefined);

const FROM_ADDRESS = 'MortgageRenewalHub.ca <booking@mortgagerenewalhub.ca>';
const DEFAULT_REPLY_TO = 'scott@lendcity.ca';
const BASE_URL = 'https://api.elasticemail.com/v4';
const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 1_000;
// 500 deliberately excluded: Elastic may have already accepted the message and
// errored partway, so retrying risks double-sending. 502/503/504 and 429 indicate
// the request didn't reach processing, so retry is safe.
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

type ElasticContentType = 'HTML' | 'PlainText';

interface ElasticBodyPart {
  ContentType: ElasticContentType;
  Content: string;
  Charset: 'UTF-8';
}

interface ElasticContent {
  Body: ElasticBodyPart[];
  From: string;
  Subject: string;
  ReplyTo: string;
}

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
  if (!ELASTIC_EMAIL_API_KEY) {
    throw new Error('ELASTIC_EMAIL_API_KEY environment variable is not set');
  }

  const { to, subject, html, text, replyTo } = params;
  const recipients = Array.isArray(to) ? to : [to];

  const bodyParts: ElasticBodyPart[] = [
    { ContentType: 'HTML', Content: html, Charset: 'UTF-8' },
  ];
  if (text) {
    bodyParts.push({ ContentType: 'PlainText', Content: text, Charset: 'UTF-8' });
  }

  const content: ElasticContent = {
    Body: bodyParts,
    From: FROM_ADDRESS,
    Subject: subject,
    ReplyTo: replyTo ?? DEFAULT_REPLY_TO,
  };

  const reqHeaders = {
    'Content-Type': 'application/json',
    'X-ElasticEmail-ApiKey': ELASTIC_EMAIL_API_KEY,
  };
  const reqBody = JSON.stringify({
    Recipients: { To: recipients },
    Content: content,
  });

  const postTransactional = async (): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      return await fetch(`${BASE_URL}/emails/transactional`, {
        method: 'POST',
        headers: reqHeaders,
        body: reqBody,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };

  let response = await postTransactional();

  if (RETRYABLE_STATUSES.has(response.status)) {
    const delay = parseRetryAfter(response.headers.get('retry-after')) ?? RETRY_DELAY_MS;
    const firstError = await response.text().catch(() => '<unreadable body>');
    console.error(`Elastic Email ${response.status} on first attempt, retrying in ${delay}ms:`, firstError);
    await new Promise((r) => setTimeout(r, delay));
    response = await postTransactional();
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Elastic Email send error:', errorText);
    throw new Error(`Elastic Email send failed (${response.status}): ${errorText}`);
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
