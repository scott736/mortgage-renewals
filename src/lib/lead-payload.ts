/** Webhook-ready lead envelope for CRM/Zapier ingestion via email parsing or future API. */
export interface LeadEnvelope {
  source: "contact_form" | "calculator_lead" | "rate_alert" | "checklist_download";
  submittedAt: string;
  pageUrl?: string;
  contact: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  mortgage?: {
    renewalDate?: string;
    currentLender?: string;
    balance?: string;
    province?: string;
  };
  calculator?: {
    tool: string;
    summary: string;
    data?: Record<string, string | number | boolean>;
  };
  message?: string;
  meta?: Record<string, string>;
}

export function leadEnvelopeJson(envelope: LeadEnvelope): string {
  return JSON.stringify(envelope, null, 2);
}

export function leadEnvelopeHtmlBlock(envelope: LeadEnvelope): string {
  return `<pre style="font-size:11px;background:#f0f4f8;padding:12px;border-radius:8px;overflow:auto;margin-top:16px;">CRM_PAYLOAD\n${escapeForPre(leadEnvelopeJson(envelope))}</pre>`;
}

function escapeForPre(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
