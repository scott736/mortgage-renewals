import { syncLeadToBigin } from '@/lib/bigin-sync';
import type { LeadEnvelope } from '@/lib/lead-payload';

export type CrmWebhookEvent =
  | 'booking_confirmed'
  | 'booking_pending'
  | 'calculator_lead'
  | 'checklist_signup'
  | 'contact_form_submitted'
  | 'content_share'
  | 'guide_lead'
  | 'lead_captured'
  | 'lead_magnet'
  | 'quiz_lead'
  | 'rate_alert'
  | 'renewal_reminder'
  | (string & {});

export type CrmMetadataValue = string | number | boolean | null | undefined;

export interface CrmWebhookPayload {
  event: CrmWebhookEvent;
  source?: string;
  topic?: string;
  toolName?: string;
  name?: string;
  email?: string;
  phone?: string;
  serviceName?: string;
  startTime?: string;
  teamMemberName?: string;
  metadata?: Record<string, CrmMetadataValue>;
}

export function compactCrmMetadata(
  metadata: Record<string, CrmMetadataValue>,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== undefined && value !== null && value !== '') {
      out[key] = value;
    }
  }
  return out;
}

function readEnv(name: string): string | undefined {
  const fromImportMeta =
    typeof import.meta !== 'undefined' ? import.meta.env?.[name] : undefined;
  const fromProcess =
    typeof process !== 'undefined' ? process.env[name] : undefined;
  return fromImportMeta || fromProcess;
}

function getCrmWebhookUrl(): string | undefined {
  return (
    readEnv('CRM_WEBHOOK_URL') ||
    readEnv('ZOHO_LEAD_WEBHOOK_URL') ||
    readEnv('LEAD_WEBHOOK_URL')
  );
}

export function getCrmSiteDomain(): string {
  const site = readEnv('SITE') || readEnv('ZOHO_BIGIN_SITE');
  if (!site) return 'unknown';
  return site.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** Map legacy Zoho / form payloads into the shared CRM shape. */
export function normalizeCrmPayload(
  input: Record<string, unknown>,
): CrmWebhookPayload {
  const name =
    typeof input.name === 'string' && input.name.trim()
      ? input.name.trim()
      : [input.firstName, input.lastName]
          .filter((value) => typeof value === 'string' && value.trim())
          .join(' ')
          .trim() || undefined;

  const rawEvent = String(input.event ?? input.type ?? 'lead_captured');
  const event =
    rawEvent === 'contact_form' ? 'contact_form_submitted' : rawEvent;

  return {
    event,
    name,
    email: typeof input.email === 'string' ? input.email : undefined,
    phone: typeof input.phone === 'string' ? input.phone : undefined,
    source:
      typeof input.source === 'string'
        ? input.source
        : typeof input.sourcePage === 'string'
          ? input.sourcePage
          : undefined,
    toolName:
      typeof input.toolName === 'string'
        ? input.toolName
        : typeof input.calculatorType === 'string'
          ? input.calculatorType
          : typeof input.magnetType === 'string'
            ? input.magnetType
            : typeof input.checklistId === 'string'
              ? input.checklistId
              : undefined,
    topic: typeof input.topic === 'string' ? input.topic : undefined,
    serviceName:
      typeof input.serviceName === 'string' ? input.serviceName : undefined,
    startTime:
      typeof input.startTime === 'string' ? input.startTime : undefined,
    teamMemberName:
      typeof input.teamMemberName === 'string'
        ? input.teamMemberName
        : undefined,
  };
}

export function leadEnvelopeToCrmPayload(envelope: LeadEnvelope): CrmWebhookPayload {
  const name = [envelope.contact.firstName, envelope.contact.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  const metadata = compactCrmMetadata({
    ...(envelope.mortgage?.renewalDate
      ? { 'Renewal date': envelope.mortgage.renewalDate }
      : {}),
    ...(envelope.mortgage?.currentLender
      ? { 'Current lender': envelope.mortgage.currentLender }
      : {}),
    ...(envelope.mortgage?.balance ? { Balance: envelope.mortgage.balance } : {}),
    ...(envelope.mortgage?.province ? { Province: envelope.mortgage.province } : {}),
    ...(envelope.calculator?.summary
      ? { 'Calculator summary': envelope.calculator.summary }
      : {}),
    ...(envelope.message ? { Message: envelope.message } : {}),
    ...Object.fromEntries(
      Object.entries(envelope.meta ?? {}).map(([key, value]) => [key, value]),
    ),
  });

  const base = {
    name: name || undefined,
    email: envelope.contact.email,
    phone: envelope.contact.phone,
    source: envelope.pageUrl || envelope.source,
    ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
  };

  switch (envelope.source) {
    case 'calculator_lead':
      return {
        ...base,
        event: 'calculator_lead',
        toolName: envelope.calculator?.tool || 'Calculator',
      };
    case 'rate_alert':
      return { ...base, event: 'rate_alert' };
    case 'checklist_download':
      return {
        ...base,
        event: 'checklist_signup',
        toolName: 'Renewal checklist PDF',
      };
    case 'renewal_reminder':
      return { ...base, event: 'renewal_reminder' };
    default:
      return {
        ...base,
        event: 'contact_form_submitted',
        topic: envelope.message ? 'message' : 'general',
      };
  }
}

export async function fireCrmWebhook(payload: CrmWebhookPayload) {
  void syncLeadToBigin(payload);

  const url = getCrmWebhookUrl();
  if (!url) return;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        site: getCrmSiteDomain(),
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error(
        'CRM webhook failed:',
        response.status,
        await response.text(),
      );
    }
  } catch (error) {
    console.error('CRM webhook error:', error);
  }
}
