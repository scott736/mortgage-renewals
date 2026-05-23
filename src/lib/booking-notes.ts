import {
  formatCalculatorContextForNotes,
  loadCalculatorContext,
} from "@/lib/calculator-context";

export interface RenewalBookingDetails {
  maturityDate?: string;
  currentLender?: string;
  balance?: string;
  province?: string;
}

export function buildBookingNotes(
  userNotes: string,
  renewal?: RenewalBookingDetails,
): string {
  const sections: string[] = [];

  const calcBlock = formatCalculatorContextForNotes(loadCalculatorContext());
  if (calcBlock) sections.push(calcBlock);

  const renewalLines: string[] = [];
  if (renewal?.maturityDate) renewalLines.push(`Renewal date: ${renewal.maturityDate}`);
  if (renewal?.currentLender) renewalLines.push(`Current lender: ${renewal.currentLender}`);
  if (renewal?.balance) renewalLines.push(`Mortgage balance: ${renewal.balance}`);
  if (renewal?.province) renewalLines.push(`Province: ${renewal.province}`);
  if (renewalLines.length) sections.push(renewalLines.join("\n"));

  const trimmed = userNotes.trim();
  if (trimmed) sections.push(trimmed);

  return sections.join("\n\n");
}
