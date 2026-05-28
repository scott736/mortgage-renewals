import { LEAD_INBOX } from '@/consts';

/** Scott + Aya — deduplicated with any extra recipients (e.g. assigned LO). */
export function leadNotificationRecipients(
  ...additional: (string | undefined | null)[]
): string[] {
  const seen = new Set<string>();
  const recipients: string[] = [];
  for (const email of [...additional, ...LEAD_INBOX]) {
    if (!email) continue;
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    recipients.push(email);
  }
  return recipients;
}
