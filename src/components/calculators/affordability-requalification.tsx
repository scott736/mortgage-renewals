import React from 'react';

import { BrokerCTA, Input, Label, ResultCard } from '@/components/calculators/calculator-ui';
import { usePatchState } from '@/hooks/use-patch-state';
import { effectiveMonthlyRate, fmt, fmtPct, monthlyPayment } from '@/lib/mortgage-math';

export function AffordabilityRequalification() {
  const [state, setState] = usePatchState({
    income: 140000,
    monthlyDebts: 650,
    propertyTax: 5200,
    heat: 1800,
    condoFees: 0,
    contractRate: 4.29,
    amortYears: 25,
    proposedMortgage: 550000,
    insured: true,
  });
  const { income, monthlyDebts, propertyTax, heat, condoFees, contractRate, amortYears, proposedMortgage, insured } = state;

  const qualifyingRate = Math.max(contractRate + 2, 5.25);
  const monthlyIncome = income / 12;
  const monthlyTax = propertyTax / 12;
  const monthlyHeat = heat / 12;
  const halfCondo = condoFees / 2; // CMHC counts 50% of condo fees

  const gdsCapPct = insured ? 39 : 35;
  const tdsCapPct = insured ? 44 : 42;

  const n = amortYears * 12;
  const r = effectiveMonthlyRate(qualifyingRate);

  // Proposed mortgage test
  const proposedPmtQualifying = monthlyPayment(proposedMortgage, qualifyingRate, n);
  const proposedPITH = proposedPmtQualifying + monthlyTax + monthlyHeat + halfCondo;
  const proposedGDS = (proposedPITH / monthlyIncome) * 100;
  const proposedTDS = ((proposedPITH + monthlyDebts) / monthlyIncome) * 100;

  // Max mortgage backsolve under selected GDS/TDS caps
  const maxPITHfromGDS = monthlyIncome * (gdsCapPct / 100);
  const maxPITHfromTDS = monthlyIncome * (tdsCapPct / 100) - monthlyDebts;
  const maxMonthlyPayment = Math.max(0, Math.min(maxPITHfromGDS, maxPITHfromTDS) - monthlyTax - monthlyHeat - halfCondo);
  const maxMortgage = maxMonthlyPayment > 0
    ? (maxMonthlyPayment * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
    : 0;

  // Contract-rate affordability (what you'd actually pay)
  const rContract = effectiveMonthlyRate(contractRate);
  const maxMortgageContract = maxMonthlyPayment > 0
    ? (maxMonthlyPayment * (Math.pow(1 + rContract, n) - 1)) / (rContract * Math.pow(1 + rContract, n))
    : 0;

  const gdsOver = proposedGDS > gdsCapPct;
  const tdsOver = proposedTDS > tdsCapPct;
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
          <Label htmlFor="gross-annual-income">Gross Annual Income</Label>
          <Input id="gross-annual-income" aria-label="Gross Annual Income" value={income} onChange={(v) => setState({ income: v })} min={20000} max={2000000} step={5000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="monthly-debts">Monthly Debts</Label>
          <Input id="monthly-debts" aria-label="Monthly Debts" value={monthlyDebts} onChange={(v) => setState({ monthlyDebts: v })} min={0} max={10000} step={50} prefix="$" />
        </div>
        <div>
          <Label htmlFor="annual-property-tax">Annual Property Tax</Label>
          <Input id="annual-property-tax" aria-label="Annual Property Tax" value={propertyTax} onChange={(v) => setState({ propertyTax: v })} min={0} max={30000} step={100} prefix="$" />
        </div>
        <div>
          <Label htmlFor="annual-heating">Annual Heating</Label>
          <Input id="annual-heating" aria-label="Annual Heating" value={heat} onChange={(v) => setState({ heat: v })} min={0} max={10000} step={100} prefix="$" />
        </div>
        <div>
          <Label htmlFor="monthly-condo-fees">Monthly Condo Fees</Label>
          <Input id="monthly-condo-fees" aria-label="Monthly Condo Fees" value={condoFees} onChange={(v) => setState({ condoFees: v })} min={0} max={3000} step={25} prefix="$" />
        </div>
        <div>
          <Label htmlFor="contract-rate">Contract Rate</Label>
          <Input id="contract-rate" aria-label="Contract Rate" value={contractRate} onChange={(v) => setState({ contractRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={5} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label htmlFor="proposed-mortgage">Proposed Mortgage</Label>
          <Input id="proposed-mortgage" aria-label="Proposed Mortgage" value={proposedMortgage} onChange={(v) => setState({ proposedMortgage: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="mortgage-type-afford">Mortgage Type</Label>
          <select
            id="mortgage-type-afford"
            aria-label="Mortgage Type"
            value={insured ? 'insured' : 'uninsured'}
            onChange={(e) => setState({ insured: e.target.value === 'insured' })}
            className="w-full rounded-lg border border-gray-200 bg-background py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value="insured">Insured (GDS 39% / TDS 44%)</option>
            <option value="uninsured">Uninsured (GDS 35% / TDS 42%)</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <ResultCard label="Qualifying Rate" value={fmtPct(qualifyingRate)} sublabel={contractRate + 2 > 5.25 ? 'Contract + 2%' : '5.25% floor'} />
        <ResultCard label={`GDS (max ${gdsCapPct}%)`} value={fmtPct(proposedGDS)} highlight={gdsOver} sublabel={gdsOver ? '⚠️ Over limit' : '✓ Within limit'} />
        <ResultCard label={`TDS (max ${tdsCapPct}%)`} value={fmtPct(proposedTDS)} highlight={tdsOver} sublabel={tdsOver ? '⚠️ Over limit' : '✓ Within limit'} />
        <ResultCard label="Qualifies?" value={qualifies ? 'YES' : 'NO'} highlight sublabel={qualifies ? 'Under B-20 limits' : 'Ratios too high'} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <ResultCard label="Max Mortgage (Stress Test)" value={fmt(maxMortgage)} highlight sublabel={`Qualifying at ${fmtPct(qualifyingRate)}`} />
        <ResultCard label="Max Mortgage (Contract Rate)" value={fmt(maxMortgageContract)} sublabel={`What payment actually buys at ${fmtPct(contractRate)}`} />
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground mb-6">
        <strong className="text-foreground">GDS vs TDS explained:</strong> GDS (Gross Debt Service) = housing costs only (principal, interest, property tax, heat, + 50% condo fees) ÷ gross monthly income. TDS (Total Debt Service) = GDS plus all other debts (car loans, credit cards, LOC minimums, student loans). OSFI caps insured mortgages at 39% GDS / 44% TDS; uninsured conventional is typically 35% / 42%. Credit unions and alternative lenders can stretch these ratios.
      </div>

      <BrokerCTA
        message={qualifies
          ? `You qualify up to ${fmt(maxMortgage)} under the stress test. A broker can find lenders with best ratio flexibility.`
          : `Your ratios are tight. A broker can explore credit unions (not OSFI-bound) and B lenders with looser ratios.`}
        calculatorContext={{
          tool: 'Affordability Requalification Calculator',
          summary: `Income $${income.toLocaleString('en-CA')}, qualifying ${fmtPct(qualifyingRate)}, ${insured ? 'insured' : 'uninsured'}. Max mortgage ${fmt(maxMortgage)} (${qualifies ? 'qualifies' : 'tight ratios'}).`,
          data: { income, maxMortgage, qualifies: qualifies ? 1 : 0, insured },
        }}
      />
    </div>
  );
}
