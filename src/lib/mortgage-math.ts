/** Canadian mortgage math — semi-annual compounding */

export function effectiveMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

export function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (!Number.isFinite(principal) || !Number.isFinite(months) || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = effectiveMonthlyRate(annualRate);
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function fmt(n: number): string {
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
}

export function fmtPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

export function totalInterest(payment: number, months: number, principal: number): number {
  return payment * months - principal;
}
