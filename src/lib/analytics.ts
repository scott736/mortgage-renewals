type LeadEventProps = Record<string, string | number | boolean | undefined>;

export type LeadEventName =
  | "cta_click"
  | "contact_form_submit"
  | "booking_pending"
  | "booking_confirmed"
  | "calculator_lead_submit"
  | "checklist_download"
  | "rate_alert_submit"
  | "exit_intent_cta"
  | "renewal_date_cta";

export function trackLeadEvent(name: LeadEventName, props?: LeadEventProps) {
  if (typeof window === "undefined") return;

  const payload = props
    ? Object.fromEntries(
        Object.entries(props).filter(([, v]) => v !== undefined),
      )
    : undefined;

  // Cloudflare Web Analytics / GTM can be wired later; keep call sites stable.
  if (import.meta.env.DEV) {
    console.debug("[analytics]", name, payload);
  }
}

export function trackCtaClick(location: string, destination: string) {
  trackLeadEvent("cta_click", { location, destination });
}
