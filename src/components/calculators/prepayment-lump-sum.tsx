import React from 'react';

import { useFormState } from '@/hooks/use-form-state';

// ============================================================================
// Canadian mortgage math — semi-annual compounding
// ============================================================================
function effectiveMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = effectiveMonthlyRate(annualRate);
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function fmt(n: number): string {
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
}

function _fmtPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

// ============================================================================
// Shared UI
// ============================================================================
function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="block text-body-sm-medium text-foreground mb-1">{children}</label>;
}

function Input({ value, onChange, min = 0, max, step = 1, prefix, suffix, id, 'aria-label': ariaLabel }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; prefix?: string; suffix?: string; id?: string; 'aria-label'?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-muted-foreground text-body-sm">{prefix}</span>}
      <input
        type="number"
        id={id}
        aria-label={ariaLabel}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full rounded-lg border border-gray-200 bg-background py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100 ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
      />
      {suffix && <span className="absolute right-3 text-muted-foreground text-body-sm">{suffix}</span>}
    </div>
  );
}

function ResultCard({ label, value, highlight, sublabel }: { label: string; value: string; highlight?: boolean; sublabel?: string }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-secondary-25 border-secondary-50' : 'bg-gray-25 border-gray-100'}`}>
      <div className="text-body-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-secondary-200' : 'text-foreground'}`}>{value}</div>
      {sublabel && <div className="text-body-xs text-muted-foreground mt-1">{sublabel}</div>}
    </div>
  );
}

function BrokerCTA({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-xl bg-primary-0 border border-primary-25 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1">
        <p className="text-body-sm-medium text-primary-200">{message}</p>
        <p className="text-body-xs text-muted-foreground mt-1">A broker will confirm this with real lender quotes, for free.</p>
      </div>
      <a href="/book-a-call/" className="flex-shrink-0 rounded-lg bg-primary-100 text-white px-5 py-2.5 text-body-sm-medium hover:opacity-90 transition-opacity">
        Book Free Call
      </a>
    </div>
  );
}

// ============================================================================
// Prepayment Lump Sum Calculator
//    Simulates applying a lump sum against the principal, either now or at
//    renewal. Calculates interest saved over remaining amortization and
//    months shaved off. Respects Canadian 10/15/20% privilege limits.
// ============================================================================
export function PrepaymentLumpSum() {
  const [state, setState] = useFormState({
    balance: 400000,
    rate: 4.29,
    amortMonths: 240,
    currentPmt: 0,
    lumpSum: 25000,
    timing: 'now' as 'now' | 'renewal',
    privilegePct: 15,
  });
  const { balance, rate, amortMonths, currentPmt, lumpSum, timing, privilegePct } = state;

  const effectivePmt = currentPmt > 0 ? currentPmt : monthlyPayment(balance, rate, amortMonths);
  const privilegeLimit = balance * (privilegePct / 100);
  const allowedLump = Math.min(lumpSum, privilegeLimit);
  const over = Math.max(0, lumpSum - privilegeLimit);

  // Simulate: apply lump sum to principal, keep payment unchanged, calculate
  // new months until payoff and compare total interest.
  function monthsToPayoff(principal: number, annualRate: number, payment: number): number {
    if (principal <= 0) return 0;
    const r = effectiveMonthlyRate(annualRate);
    if (payment <= principal * r) return 999 * 12;
    return Math.log(payment / (payment - principal * r)) / Math.log(1 + r);
  }

  const originalMonths = monthsToPayoff(balance, rate, effectivePmt);
  const originalInterest = effectivePmt * originalMonths - balance;

  // Timing adjustment: if applied at renewal, assume 24 months from now at current rate
  const monthsDeferred = timing === 'renewal' ? 24 : 0;
  const r = effectiveMonthlyRate(rate);
  let balanceAtLump = balance;
  if (monthsDeferred > 0) {
    // amortize for monthsDeferred months
    for (let i = 0; i < monthsDeferred; i++) {
      balanceAtLump = balanceAtLump * (1 + r) - effectivePmt;
    }
  }

  const newBalance = Math.max(0, balanceAtLump - allowedLump);
  const remainingMonths = monthsToPayoff(newBalance, rate, effectivePmt);
  const totalMonthsWithLump = monthsDeferred + remainingMonths;
  const newInterest = effectivePmt * totalMonthsWithLump - (balance - allowedLump);
  const interestSaved = originalInterest - newInterest;
  const monthsSaved = originalMonths - totalMonthsWithLump;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Prepayment Lump Sum Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">See how a one-time lump-sum payment shortens your amortization and saves interest.</p>
      <div className="rounded-lg bg-primary-0 border border-primary-25 px-4 py-3 text-body-xs text-primary-200 mb-6">
        💡 Canadian lenders typically allow annual prepayment privileges of 10% (Big 6 closed), 15% (Scotiabank, First National), or 20% (TD, CIBC, most monolines). Check your mortgage agreement.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="interest-rate">Interest Rate</Label>
          <Input id="interest-rate" aria-label="Interest Rate" value={rate} onChange={(v) => setState({ rate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="amortization-remaining">Amortization Remaining</Label>
          <Input id="amortization-remaining" aria-label="Amortization Remaining" value={amortMonths} onChange={(v) => setState({ amortMonths: v })} min={12} max={360} step={12} suffix="mo" />
        </div>
        <div>
          <Label htmlFor="monthly-payment-0-auto">Monthly Payment (0 = auto)</Label>
          <Input id="monthly-payment-0-auto" aria-label="Monthly Payment (0 = auto)" value={currentPmt} onChange={(v) => setState({ currentPmt: v })} min={0} max={20000} step={50} prefix="$" />
        </div>
        <div>
          <Label htmlFor="lump-sum-amount">Lump Sum Amount</Label>
          <Input id="lump-sum-amount" aria-label="Lump Sum Amount" value={lumpSum} onChange={(v) => setState({ lumpSum: v })} min={1000} max={500000} step={1000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="annual-privilege-limit">Annual Privilege Limit</Label>
          <select id="annual-privilege-limit" aria-label="Annual Privilege Limit"
            value={privilegePct}
            onChange={e => setState({ privilegePct: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-200 bg-background py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value={10}>10% (most Big 6 closed)</option>
            <option value={15}>15% (Scotia, First National)</option>
            <option value={20}>20% (TD, CIBC, monolines)</option>
          </select>
        </div>
        <div>
          <Label htmlFor="timing">Timing</Label>
          <select id="timing" aria-label="Timing"
            value={timing}
            onChange={e => setState({ timing: e.target.value as 'now' | 'renewal' })}
            className="w-full rounded-lg border border-gray-200 bg-background py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value="now">Apply now (mid-term)</option>
            <option value="renewal">Apply at renewal (in 24 mo)</option>
          </select>
        </div>
      </div>

      {over > 0 && (
        <div className="rounded-lg bg-warning-0 border border-warning-50 px-4 py-3 text-body-sm text-warning-200 mb-4">
          ⚠️ Your {fmt(lumpSum)} exceeds your annual {privilegePct}% privilege of {fmt(privilegeLimit)}. Only {fmt(allowedLump)} can be applied without penalty. The remaining {fmt(over)} would trigger a prepayment charge, save it for next anniversary year.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Applied Amount" value={fmt(allowedLump)} sublabel={`Within ${privilegePct}% privilege`} />
        <ResultCard label="Interest Saved" value={fmt(interestSaved)} highlight />
        <ResultCard label="Months Shaved Off" value={`${Math.round(monthsSaved)} mo`} highlight sublabel={`~${(monthsSaved / 12).toFixed(1)} years`} />
        <ResultCard label="New Payoff" value={`${(totalMonthsWithLump / 12).toFixed(1)} yrs`} sublabel={`Was ${(originalMonths / 12).toFixed(1)} yrs`} />
      </div>

      <BrokerCTA message={interestSaved > 0
        ? `A ${fmt(allowedLump)} lump sum saves ${fmt(interestSaved)} in interest and pays off your mortgage ${(monthsSaved / 12).toFixed(1)} years earlier.`
        : `Confirm your lender's exact privilege rules, a broker can check your commitment letter for free.`} />
    </div>
  );
}
