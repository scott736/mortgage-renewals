import React from 'react';

import { BrokerCTA, Input, Label, ResultCard } from '@/components/calculators/calculator-ui';
import { usePatchState } from '@/hooks/use-patch-state';
import { effectiveMonthlyRate, fmt, fmtPct, monthlyPayment } from '@/lib/mortgage-math';

export function MortgagePenalty() {
  const [state, setState] = usePatchState({
    balance: 450000,
    contractRate: 5.29,
    monthsRemaining: 30,
    postedRate: 6.79,
    marketRate: 4.29,
    lenderType: 'big6' as 'big6' | 'monoline',
  });
  const { balance, contractRate, monthsRemaining, postedRate, marketRate, lenderType } = state;

  // 3-month interest penalty
  const threeMonthPenalty = balance * effectiveMonthlyRate(contractRate) * 3;

  // IRD (Big-6 posted-rate method)
  // Rate differential = posted rate when you signed − current posted rate for remaining term
  // Simplified: (contract posted rate − current market rate) × balance × months / 12
  const rateDiff = Math.max(0, postedRate - marketRate);
  const irdPenalty = balance * (rateDiff / 100) * (monthsRemaining / 12);

  // Monolines almost always use 3-month. Big-6 use the greater of the two.
  const applies = lenderType === 'big6' ? Math.max(threeMonthPenalty, irdPenalty) : threeMonthPenalty;
  const appliesLabel = lenderType === 'big6'
    ? (irdPenalty > threeMonthPenalty ? 'IRD penalty applies' : '3-month interest applies')
    : '3-month interest (monoline standard)';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Mortgage Penalty Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">Estimate your prepayment penalty for breaking a Canadian fixed-rate mortgage.</p>
      <div className="rounded-lg bg-warning-0 border border-warning-50 px-4 py-3 text-body-xs text-warning-200 mb-6">
        ⚠️ Big 6 banks (TD, RBC, BMO, Scotiabank, CIBC, National Bank) use posted-rate IRD, which can produce penalties 3–10× larger than the fair 3-month method used by monolines (First National, MCAP, Strive, CMLS).
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="contract-rate">Contract Rate</Label>
          <Input id="contract-rate" aria-label="Contract Rate" value={contractRate} onChange={(v) => setState({ contractRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="months-remaining">Months Remaining</Label>
          <Input id="months-remaining" aria-label="Months Remaining" value={monthsRemaining} onChange={(v) => setState({ monthsRemaining: v })} min={1} max={60} step={1} suffix="mo" />
        </div>
        <div>
          <Label htmlFor="original-posted-rate-for-ird">Original Posted Rate (for IRD)</Label>
          <Input id="original-posted-rate-for-ird" aria-label="Original Posted Rate (for IRD)" value={postedRate} onChange={(v) => setState({ postedRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="current-market-rate">Current Market Rate</Label>
          <Input id="current-market-rate" aria-label="Current Market Rate" value={marketRate} onChange={(v) => setState({ marketRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="lender-type">Lender Type</Label>
          <select id="lender-type" aria-label="Lender Type"
            value={lenderType}
            onChange={e => setState({ lenderType: e.target.value as 'big6' | 'monoline' })}
            className="w-full rounded-lg border border-gray-200 bg-background py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value="big6">Big 6 Bank (posted-rate IRD)</option>
            <option value="monoline">Monoline (fair 3-month)</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <ResultCard label="3-Month Interest" value={fmt(threeMonthPenalty)} sublabel="Balance × rate × 3/12" />
        <ResultCard label="IRD Penalty" value={fmt(irdPenalty)} sublabel="Posted-rate differential method" />
        <ResultCard label="Penalty That Applies" value={fmt(applies)} highlight sublabel={appliesLabel} />
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-5 text-body-sm text-muted-foreground mb-6">
        <strong className="text-foreground">Why monolines charge less:</strong> Monoline lenders (First National, MCAP, RFA, CMLS, Strive, Equitable) use the fair 3-month interest method by default. Big 6 banks use "posted rate" IRD, a rate they rarely offer in practice, which creates an artificial gap that inflates the penalty. This is why switching to a monoline at renewal can save thousands if you break mid-term later.
      </div>

      <BrokerCTA message={`Your estimated penalty is ${fmt(applies)}. A broker can pull your exact payout from the lender and compare switch savings against the cost.`} />
    </div>
  );
}
