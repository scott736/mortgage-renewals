import React, { useState } from 'react';

// ============================================================================
// Canadian mortgage math — semi-annual compounding
// ============================================================================
function effectiveMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function _monthlyPayment(principal: number, annualRate: number, months: number): number {
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
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-body-sm-medium text-foreground mb-1">{children}</label>;
}

function Input({ value, onChange, min = 0, max, step = 1, prefix, suffix }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; prefix?: string; suffix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-muted-foreground text-body-sm">{prefix}</span>}
      <input
        type="number"
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
        <p className="text-body-xs text-muted-foreground mt-1">A broker will confirm this with real lender quotes — for free.</p>
      </div>
      <a href="/book-a-call/" className="flex-shrink-0 rounded-lg bg-primary-100 text-white px-5 py-2.5 text-body-sm-medium hover:opacity-90 transition-opacity">
        Book Free Call
      </a>
    </div>
  );
}

// ============================================================================
// Mortgage Penalty Calculator
//    3-month interest penalty: balance × monthly effective rate × 3.
//    IRD (Big-6 posted-rate method): balance × (posted rate − discount to
//    market comparison rate) × months remaining / 12.
// ============================================================================
export function MortgagePenalty() {
  const [balance, setBalance] = useState(450000);
  const [contractRate, setContractRate] = useState(5.29);
  const [monthsRemaining, setMonthsRemaining] = useState(30);
  const [postedRate, setPostedRate] = useState(6.79);
  const [marketRate, setMarketRate] = useState(4.29);
  const [lenderType, setLenderType] = useState<'big6' | 'monoline'>('big6');

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
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Contract Rate</Label>
          <Input value={contractRate} onChange={setContractRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Months Remaining</Label>
          <Input value={monthsRemaining} onChange={setMonthsRemaining} min={1} max={60} step={1} suffix="mo" />
        </div>
        <div>
          <Label>Original Posted Rate (for IRD)</Label>
          <Input value={postedRate} onChange={setPostedRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Current Market Rate</Label>
          <Input value={marketRate} onChange={setMarketRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Lender Type</Label>
          <select
            value={lenderType}
            onChange={e => setLenderType(e.target.value as 'big6' | 'monoline')}
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
        <strong className="text-foreground">Why monolines charge less:</strong> Monoline lenders (First National, MCAP, RFA, CMLS, Strive, Equitable) use the fair 3-month interest method by default. Big 6 banks use "posted rate" IRD — a rate they rarely offer in practice — which creates an artificial gap that inflates the penalty. This is why switching to a monoline at renewal can save thousands if you break mid-term later.
      </div>

      <BrokerCTA message={`Your estimated penalty is ${fmt(applies)}. A broker can pull your exact payout from the lender and compare switch savings against the cost.`} />
    </div>
  );
}
