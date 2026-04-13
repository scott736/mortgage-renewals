import React, { useState } from 'react';

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

function fmtPct(n: number): string {
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
// Affordability / Requalification Calculator
//    GDS and TDS ratios per OSFI B-20. Max mortgage under the stress test
//    qualifying rate (greater of contract+2% or 5.25%). Flags whether ratios
//    exceed insured (39/44) or uninsured (typically 35/42) thresholds.
// ============================================================================
export function AffordabilityRequalification() {
  const [income, setIncome] = useState(140000);
  const [monthlyDebts, setMonthlyDebts] = useState(650);
  const [propertyTax, setPropertyTax] = useState(5200);
  const [heat, setHeat] = useState(1800);
  const [condoFees, setCondoFees] = useState(0);
  const [contractRate, setContractRate] = useState(4.29);
  const [amortYears, setAmortYears] = useState(25);
  const [proposedMortgage, setProposedMortgage] = useState(550000);

  const qualifyingRate = Math.max(contractRate + 2, 5.25);
  const monthlyIncome = income / 12;
  const monthlyTax = propertyTax / 12;
  const monthlyHeat = heat / 12;
  const halfCondo = condoFees / 2; // CMHC counts 50% of condo fees

  const n = amortYears * 12;
  const r = effectiveMonthlyRate(qualifyingRate);

  // Proposed mortgage test
  const proposedPmtQualifying = monthlyPayment(proposedMortgage, qualifyingRate, n);
  const proposedPITH = proposedPmtQualifying + monthlyTax + monthlyHeat + halfCondo;
  const proposedGDS = (proposedPITH / monthlyIncome) * 100;
  const proposedTDS = ((proposedPITH + monthlyDebts) / monthlyIncome) * 100;

  // Max mortgage backsolve under GDS 39% and TDS 44%
  const maxPITHfromGDS = monthlyIncome * 0.39;
  const maxPITHfromTDS = monthlyIncome * 0.44 - monthlyDebts;
  const maxMonthlyPayment = Math.max(0, Math.min(maxPITHfromGDS, maxPITHfromTDS) - monthlyTax - monthlyHeat - halfCondo);
  const maxMortgage = maxMonthlyPayment > 0
    ? (maxMonthlyPayment * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
    : 0;

  // Contract-rate affordability (what you'd actually pay)
  const rContract = effectiveMonthlyRate(contractRate);
  const maxMortgageContract = maxMonthlyPayment > 0
    ? (maxMonthlyPayment * (Math.pow(1 + rContract, n) - 1)) / (rContract * Math.pow(1 + rContract, n))
    : 0;

  const gdsOver = proposedGDS > 39;
  const tdsOver = proposedTDS > 44;
  const qualifies = !gdsOver && !tdsOver;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Affordability & Requalification Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">Check your GDS, TDS, and max mortgage under OSFI B-20 stress test rules.</p>
      <div className="rounded-lg bg-primary-0 border border-primary-25 px-4 py-3 text-body-xs text-primary-200 mb-6">
        ℹ️ Since November 2024, OSFI has <strong>waived</strong> the stress test for uninsured straight-switch renewals (same lender balance, same or shorter amortization). You only requalify when taking new money, extending amortization, or adding a borrower.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Label>Gross Annual Income</Label>
          <Input value={income} onChange={setIncome} min={20000} max={2000000} step={5000} prefix="$" />
        </div>
        <div>
          <Label>Monthly Debts</Label>
          <Input value={monthlyDebts} onChange={setMonthlyDebts} min={0} max={10000} step={50} prefix="$" />
        </div>
        <div>
          <Label>Annual Property Tax</Label>
          <Input value={propertyTax} onChange={setPropertyTax} min={0} max={30000} step={100} prefix="$" />
        </div>
        <div>
          <Label>Annual Heating</Label>
          <Input value={heat} onChange={setHeat} min={0} max={10000} step={100} prefix="$" />
        </div>
        <div>
          <Label>Monthly Condo Fees</Label>
          <Input value={condoFees} onChange={setCondoFees} min={0} max={3000} step={25} prefix="$" />
        </div>
        <div>
          <Label>Contract Rate</Label>
          <Input value={contractRate} onChange={setContractRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={5} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label>Proposed Mortgage</Label>
          <Input value={proposedMortgage} onChange={setProposedMortgage} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <ResultCard label="Qualifying Rate" value={fmtPct(qualifyingRate)} sublabel={contractRate + 2 > 5.25 ? 'Contract + 2%' : '5.25% floor'} />
        <ResultCard label={`GDS (max 39%)`} value={fmtPct(proposedGDS)} highlight={gdsOver} sublabel={gdsOver ? '⚠️ Over limit' : '✓ Within limit'} />
        <ResultCard label={`TDS (max 44%)`} value={fmtPct(proposedTDS)} highlight={tdsOver} sublabel={tdsOver ? '⚠️ Over limit' : '✓ Within limit'} />
        <ResultCard label="Qualifies?" value={qualifies ? 'YES' : 'NO'} highlight sublabel={qualifies ? 'Under B-20 limits' : 'Ratios too high'} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <ResultCard label="Max Mortgage (Stress Test)" value={fmt(maxMortgage)} highlight sublabel={`Qualifying at ${fmtPct(qualifyingRate)}`} />
        <ResultCard label="Max Mortgage (Contract Rate)" value={fmt(maxMortgageContract)} sublabel={`What payment actually buys at ${fmtPct(contractRate)}`} />
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground mb-6">
        <strong className="text-foreground">GDS vs TDS explained:</strong> GDS (Gross Debt Service) = housing costs only (principal, interest, property tax, heat, + 50% condo fees) ÷ gross monthly income. TDS (Total Debt Service) = GDS plus all other debts (car loans, credit cards, LOC minimums, student loans). OSFI caps insured mortgages at 39% GDS / 44% TDS. Credit unions and alternative lenders can stretch these ratios.
      </div>

      <BrokerCTA message={qualifies
        ? `You qualify up to ${fmt(maxMortgage)} under the stress test. A broker can find lenders with best ratio flexibility.`
        : `Your ratios are tight. A broker can explore credit unions (not OSFI-bound) and B lenders with looser ratios.`} />
    </div>
  );
}
