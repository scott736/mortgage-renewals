import React from 'react';

import { BrokerCTA, Input, Label, ResultCard } from '@/components/calculators/calculator-ui';
import { usePatchState } from '@/hooks/use-patch-state';
import { effectiveMonthlyRate, fmt, fmtPct, monthlyPayment } from '@/lib/mortgage-math';

export function BlendAndExtend() {
  const [state, setState] = usePatchState({
    balance: 500000,
    currentRate: 5.25,
    marketRate: 4.19,
    monthsRemaining: 24,
    newTermYears: 5,
    amortYears: 22,
  });
  const { balance, currentRate, marketRate, monthsRemaining, newTermYears, amortYears } = state;

  const newTermMonths = newTermYears * 12;
  const totalMonths = monthsRemaining + newTermMonths;
  const blendedRate = (monthsRemaining * currentRate + newTermMonths * marketRate) / totalMonths;

  const currentPmt = monthlyPayment(balance, currentRate, amortYears * 12);
  const blendedPmt = monthlyPayment(balance, blendedRate, amortYears * 12);
  const monthlySaving = currentPmt - blendedPmt;
  const newTermSaving = monthlySaving * newTermMonths;

  // Straight-break comparison: 3-month interest penalty (simplified)
  const threeMonthPenalty = balance * effectiveMonthlyRate(currentRate) * 3;
  const breakPmt = monthlyPayment(balance + threeMonthPenalty, marketRate, amortYears * 12);
  const breakTermCost = breakPmt * newTermMonths;
  const blendTermCost = blendedPmt * newTermMonths;
  const blendSavesVsBreak = breakTermCost - blendTermCost;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Blend-and-Extend Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">See your blended rate and whether blend-and-extend beats breaking your mortgage early.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="current-rate">Current Rate</Label>
          <Input id="current-rate" aria-label="Current Rate" value={currentRate} onChange={(v) => setState({ currentRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="today-s-market-rate">Today's Market Rate</Label>
          <Input id="today-s-market-rate" aria-label="Today's Market Rate" value={marketRate} onChange={(v) => setState({ marketRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="months-remaining">Months Remaining</Label>
          <Input id="months-remaining" aria-label="Months Remaining" value={monthsRemaining} onChange={(v) => setState({ monthsRemaining: v })} min={1} max={60} step={1} suffix="mo" />
        </div>
        <div>
          <Label htmlFor="new-term-length">New Term Length</Label>
          <Input id="new-term-length" aria-label="New Term Length" value={newTermYears} onChange={(v) => setState({ newTermYears: v })} min={1} max={10} step={1} suffix="yrs" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Blended Rate" value={fmtPct(blendedRate)} highlight sublabel={`Weighted over ${totalMonths} months`} />
        <ResultCard label="New Monthly Payment" value={fmt(blendedPmt)} sublabel={`Was ${fmt(currentPmt)}`} />
        <ResultCard label="Monthly Saving" value={fmt(monthlySaving)} highlight />
        <ResultCard label={`Saving Over ${newTermYears}-yr Term`} value={fmt(newTermSaving)} />
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-5 mb-6">
        <div className="text-body-sm-medium mb-2">Blend-and-Extend vs. Break & Re-Mortgage</div>
        <div className="grid sm:grid-cols-3 gap-3 text-body-sm">
          <div>
            <div className="text-muted-foreground text-body-xs">Blend-and-Extend cost</div>
            <div className="font-bold">{fmt(blendTermCost)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-body-xs">Break + new mortgage cost</div>
            <div className="font-bold">{fmt(breakTermCost)} <span className="text-body-xs font-normal">(incl. ~{fmt(threeMonthPenalty)} penalty)</span></div>
          </div>
          <div>
            <div className="text-muted-foreground text-body-xs">{blendSavesVsBreak > 0 ? "Blend saves" : "Break saves"}</div>
            <div className={`font-bold ${blendSavesVsBreak > 0 ? 'text-secondary-200' : 'text-warning-200'}`}>{fmt(Math.abs(blendSavesVsBreak))}</div>
          </div>
        </div>
        <p className="text-body-xs text-muted-foreground mt-3">Simplified comparison using 3-month interest penalty. Actual bank IRD penalties can be much higher, use the penalty estimator for a more accurate break scenario.</p>
      </div>

      <BrokerCTA message={monthlySaving > 0
        ? `Your blended rate is ${fmtPct(blendedRate)}, saving ${fmt(monthlySaving)}/month vs. your current rate.`
        : `Your current rate is already competitive. A broker can confirm whether blend-and-extend makes sense.`} />
    </div>
  );
}

export function StressTestCalculator() {
  const [state, setState] = usePatchState({
    income: 120000,
    otherDebts: 500,
    propertyTax: 5000,
    heating: 1800,
    condoFees: 0,
    contractRate: 4.29,
    amortYears: 25,
  });
  const { income, otherDebts, propertyTax, heating, condoFees, contractRate, amortYears } = state;

  const qualifyingRate = Math.max(contractRate + 2, 5.25);
  const monthlyIncome = income / 12;

  // GDS: (PITH) / gross monthly income. Max 39% insured, typically 32-35% uninsured.
  // TDS: (PITH + debts) / gross monthly income. Max 44% insured, typically 40-42% uninsured.
  const maxGDSPayment = monthlyIncome * 0.39 - (propertyTax / 12) - (heating / 12) - (condoFees / 2);
  const maxTDSPayment = (monthlyIncome * 0.44) - (propertyTax / 12) - (heating / 12) - (condoFees / 2) - otherDebts;
  const maxPITH = Math.max(0, Math.min(maxGDSPayment, maxTDSPayment));

  // Back-solve max mortgage at qualifying rate
  const r = effectiveMonthlyRate(qualifyingRate);
  const n = amortYears * 12;
  const maxMortgageQualifying = maxPITH > 0 ? (maxPITH * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)) : 0;

  // Same but at contract rate (shows affordability at actual payment)
  const rContract = effectiveMonthlyRate(contractRate);
  const maxMortgageContract = maxPITH > 0 ? (maxPITH * (Math.pow(1 + rContract, n) - 1)) / (rContract * Math.pow(1 + rContract, n)) : 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Mortgage Stress Test Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">See whether you qualify under the OSFI B-20 stress test.</p>
      <div className="rounded-lg bg-primary-0 border border-primary-25 px-4 py-3 text-body-xs text-primary-200 mb-6">
        ℹ️ Since November 2024, the stress test is <strong>waived</strong> for uninsured <strong>straight-switch renewals</strong> (no new money, same amortization). This calculator shows what you'd need to requalify for at a new purchase or refinance.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="household-gross-income">Household Gross Income</Label>
          <Input id="household-gross-income" aria-label="Household Gross Income" value={income} onChange={(v) => setState({ income: v })} min={20000} max={2000000} step={5000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="other-monthly-debts">Other Monthly Debts</Label>
          <Input id="other-monthly-debts" aria-label="Other Monthly Debts" value={otherDebts} onChange={(v) => setState({ otherDebts: v })} min={0} max={10000} step={50} prefix="$" />
        </div>
        <div>
          <Label htmlFor="annual-property-tax">Annual Property Tax</Label>
          <Input id="annual-property-tax" aria-label="Annual Property Tax" value={propertyTax} onChange={(v) => setState({ propertyTax: v })} min={0} max={30000} step={100} prefix="$" />
        </div>
        <div>
          <Label htmlFor="annual-heating">Annual Heating</Label>
          <Input id="annual-heating" aria-label="Annual Heating" value={heating} onChange={(v) => setState({ heating: v })} min={0} max={10000} step={100} prefix="$" />
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
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Qualifying Rate" value={fmtPct(qualifyingRate)} highlight sublabel={contractRate + 2 > 5.25 ? "Contract rate + 2%" : "5.25% floor applies"} />
        <ResultCard label="Max Monthly PITH" value={fmt(maxPITH)} sublabel="Principal + interest + tax + heat" />
        <ResultCard label="Max Mortgage (Stress Test)" value={fmt(Math.max(0, maxMortgageQualifying))} highlight />
        <ResultCard label="Max Mortgage (Contract Rate)" value={fmt(Math.max(0, maxMortgageContract))} sublabel="Actual affordability" />
      </div>

      <BrokerCTA message={maxMortgageQualifying > 0
        ? `You qualify for up to ${fmt(maxMortgageQualifying)} under the stress test. A broker can find the lender whose ratios best fit your situation.`
        : "Your ratios are tight. A broker can explore credit unions (not bound by OSFI) and alternative lenders."} />
    </div>
  );
}

const LENDER_SWITCH_PRESETS: Record<
  string,
  { label: string; dischargeFee: number; legalFee: number; appraisalFee: number }
> = {
  '': { label: 'Standard charge (typical monoline)', dischargeFee: 325, legalFee: 0, appraisalFee: 0 },
  td: { label: 'TD, collateral charge', dischargeFee: 325, legalFee: 900, appraisalFee: 0 },
  'national-bank': { label: 'National Bank, collateral charge', dischargeFee: 325, legalFee: 900, appraisalFee: 0 },
  rbc: { label: 'RBC', dischargeFee: 300, legalFee: 0, appraisalFee: 0 },
  scotiabank: { label: 'Scotiabank', dischargeFee: 350, legalFee: 0, appraisalFee: 0 },
  bmo: { label: 'BMO', dischargeFee: 300, legalFee: 0, appraisalFee: 0 },
  cibc: { label: 'CIBC', dischargeFee: 300, legalFee: 0, appraisalFee: 0 },
  quebec: { label: 'Quebec (notary switch)', dischargeFee: 325, legalFee: 1200, appraisalFee: 0 },
};

function readLenderPresetFromUrl(): Partial<{
  lenderPreset: string;
  dischargeFee: number;
  legalFee: number;
  appraisalFee: number;
}> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const lender = params.get('lender') || params.get('from');
  if (lender && LENDER_SWITCH_PRESETS[lender]) {
    const p = LENDER_SWITCH_PRESETS[lender];
    return {
      lenderPreset: lender,
      dischargeFee: p.dischargeFee,
      legalFee: p.legalFee,
      appraisalFee: p.appraisalFee,
    };
  }
  return {};
}

export function SwitchVsStay() {
  const [state, setState] = usePatchState(() => ({
    balance: 500000,
    stayRate: 4.89,
    switchRate: 4.19,
    amortYears: 22,
    lenderPreset: '',
    dischargeFee: 325,
    legalFee: 0,
    appraisalFee: 0,
    titleInsurance: 225,
    ...readLenderPresetFromUrl(),
  }));
  const { balance, stayRate, switchRate, amortYears, lenderPreset, dischargeFee, legalFee, appraisalFee, titleInsurance } = state;

  function applyLenderPreset(id: string) {
    const p = LENDER_SWITCH_PRESETS[id] ?? LENDER_SWITCH_PRESETS[''];
    setState({
      lenderPreset: id,
      dischargeFee: p.dischargeFee,
      legalFee: p.legalFee,
      appraisalFee: p.appraisalFee,
    });
  }

  const months = amortYears * 12;
  const stayPmt = monthlyPayment(balance, stayRate, months);
  const switchPmt = monthlyPayment(balance, switchRate, months);
  const monthlySaving = stayPmt - switchPmt;
  const totalCosts = dischargeFee + legalFee + appraisalFee + titleInsurance;
  const breakEvenMonths = monthlySaving > 0 ? Math.ceil(totalCosts / monthlySaving) : Infinity;
  const fiveYearGross = monthlySaving * 60;
  const fiveYearNet = fiveYearGross - totalCosts;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Switch vs. Stay Break-Even Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">Includes real switching costs. See how many months it takes to recover the cost of switching.</p>
      <div className="rounded-lg bg-primary-0 border border-primary-25 px-4 py-3 text-body-xs text-primary-200 mb-6">
        💡 Many lenders waive legal fees on a straight switch. Set fees to $0 to model a cash-back or lender-paid-legal scenario.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="stay-rate-your-lender">Stay Rate (Your Lender)</Label>
          <Input id="stay-rate-your-lender" aria-label="Stay Rate (Your Lender)" value={stayRate} onChange={(v) => setState({ stayRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="switch-rate-new-lender">Switch Rate (New Lender)</Label>
          <Input id="switch-rate-new-lender" aria-label="Switch Rate (New Lender)" value={switchRate} onChange={(v) => setState({ switchRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="current-lender-pre-fills-switching-costs">Current lender (pre-fills switching costs)</Label>
        <select id="current-lender-pre-fills-switching-costs" aria-label="Current lender (pre-fills switching costs)"
          value={lenderPreset}
          onChange={(e) => applyLenderPreset(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2.5 text-body-md mb-3 focus:outline-none focus:ring-2 focus:ring-secondary-100"
        >
          {Object.entries(LENDER_SWITCH_PRESETS).map(([id, p]) => (
            <option key={id || 'default'} value={id}>
              {p.label}
            </option>
          ))}
        </select>
        <Label>Switching Costs</Label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Discharge Fee</div>
            <Input id="discharge-fee" aria-label="Discharge Fee" value={dischargeFee} onChange={(v) => setState({ dischargeFee: v })} min={0} max={2000} step={25} prefix="$" />
          </div>
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Legal Fee</div>
            <Input id="legal-fee" aria-label="Legal Fee" value={legalFee} onChange={(v) => setState({ legalFee: v })} min={0} max={3000} step={25} prefix="$" />
          </div>
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Appraisal</div>
            <Input id="appraisal" aria-label="Appraisal" value={appraisalFee} onChange={(v) => setState({ appraisalFee: v })} min={0} max={1500} step={25} prefix="$" />
          </div>
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Title Insurance</div>
            <Input id="title-insurance" aria-label="Title Insurance" value={titleInsurance} onChange={(v) => setState({ titleInsurance: v })} min={0} max={1000} step={25} prefix="$" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Monthly Saving" value={fmt(monthlySaving)} highlight />
        <ResultCard label="Total Switching Cost" value={fmt(totalCosts)} />
        <ResultCard label="Break-Even" value={breakEvenMonths === Infinity ? 'N/A' : `${breakEvenMonths} mo`} highlight sublabel={breakEvenMonths === Infinity ? 'Switching costs more' : `~${(breakEvenMonths / 12).toFixed(1)} years`} />
        <ResultCard label="5-Year Net Saving" value={fmt(fiveYearNet)} highlight />
      </div>

      <BrokerCTA message={fiveYearNet > 0
        ? `You'd net ${fmt(fiveYearNet)} over 5 years after switching costs. A broker can find lenders who cover legal fees.`
        : "At these rates, switching doesn't pay. A broker may find a better rate or a lender that covers costs."} />
    </div>
  );
}

export function HelocVsRefinance() {
  const [state, setState] = usePatchState({
    mortgageBalance: 400000,
    mortgageRate: 4.29,
    amortYears: 25,
    equityNeeded: 75000,
    helocRate: 5.95,
    newMortgageRate: 4.29,
  });
  const { mortgageBalance, mortgageRate, amortYears, equityNeeded, helocRate, newMortgageRate } = state;

  const months = amortYears * 12;
  const currentMortgagePmt = monthlyPayment(mortgageBalance, mortgageRate, months);

  // HELOC: interest-only minimum, variable rate
  const helocMonthlyInterest = equityNeeded * (helocRate / 100 / 12);
  const helocTotalMonthly = currentMortgagePmt + helocMonthlyInterest;

  // Refinance: blend old + new into new mortgage at new rate, new amortization
  const refiBalance = mortgageBalance + equityNeeded;
  const refiPmt = monthlyPayment(refiBalance, newMortgageRate, months);

  // 5-year interest cost
  const helocInterest5yr = helocMonthlyInterest * 60;
  const refiInterest5yr = refiPmt * 60 - (refiBalance - refiBalance * Math.pow(1 + effectiveMonthlyRate(newMortgageRate), 60) + refiPmt * (Math.pow(1 + effectiveMonthlyRate(newMortgageRate), 60) - 1) / effectiveMonthlyRate(newMortgageRate));
  const currentInterest5yr = currentMortgagePmt * 60 - (mortgageBalance - mortgageBalance * Math.pow(1 + effectiveMonthlyRate(mortgageRate), 60) + currentMortgagePmt * (Math.pow(1 + effectiveMonthlyRate(mortgageRate), 60) - 1) / effectiveMonthlyRate(mortgageRate));
  const refiIncrementalInterest = refiInterest5yr - currentInterest5yr;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">HELOC vs. Refinance Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">Compare accessing equity through a HELOC vs. a cash-out refinance at renewal.</p>
      <div className="rounded-lg bg-warning-0 border border-warning-50 px-4 py-3 text-body-xs text-warning-200 mb-6">
        ⚠️ HELOCs use variable rates tied to prime. If prime rises, your HELOC payment rises. A cash-out refinance locks in a fixed rate but requires a new qualification and stress test.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="current-mortgage-balance">Current Mortgage Balance</Label>
          <Input id="current-mortgage-balance" aria-label="Current Mortgage Balance" value={mortgageBalance} onChange={(v) => setState({ mortgageBalance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="current-mortgage-rate">Current Mortgage Rate</Label>
          <Input id="current-mortgage-rate" aria-label="Current Mortgage Rate" value={mortgageRate} onChange={(v) => setState({ mortgageRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label htmlFor="equity-needed">Equity Needed</Label>
          <Input id="equity-needed" aria-label="Equity Needed" value={equityNeeded} onChange={(v) => setState({ equityNeeded: v })} min={5000} max={500000} step={5000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="heloc-rate-typically-prime-1">HELOC Rate (typically prime+1%)</Label>
          <Input id="heloc-rate-typically-prime-1" aria-label="HELOC Rate (typically prime+1%)" value={helocRate} onChange={(v) => setState({ helocRate: v })} min={1} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="new-mortgage-rate-refi">New Mortgage Rate (refi)</Label>
          <Input id="new-mortgage-rate-refi" aria-label="New Mortgage Rate (refi)" value={newMortgageRate} onChange={(v) => setState({ newMortgageRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-gray-25 border border-gray-100 p-5">
          <div className="text-body-sm-medium mb-3">HELOC Option</div>
          <div className="space-y-2 text-body-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Mortgage payment</span><span>{fmt(currentMortgagePmt)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">HELOC interest-only</span><span>{fmt(helocMonthlyInterest)}</span></div>
            <div className="flex justify-between font-bold pt-2 border-t border-gray-100"><span>Total monthly</span><span>{fmt(helocTotalMonthly)}</span></div>
            <div className="flex justify-between text-body-xs pt-1"><span className="text-muted-foreground">5-yr interest cost</span><span>{fmt(helocInterest5yr)}</span></div>
          </div>
        </div>
        <div className="rounded-xl bg-secondary-25 border border-secondary-50 p-5">
          <div className="text-body-sm-medium mb-3 text-secondary-200">Cash-Out Refinance Option</div>
          <div className="space-y-2 text-body-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">New balance</span><span>{fmt(refiBalance)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">New rate</span><span>{fmtPct(newMortgageRate)}</span></div>
            <div className="flex justify-between font-bold pt-2 border-t border-secondary-50"><span>Total monthly</span><span>{fmt(refiPmt)}</span></div>
            <div className="flex justify-between text-body-xs pt-1"><span className="text-muted-foreground">Extra 5-yr interest vs. no-equity</span><span>{fmt(refiIncrementalInterest)}</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground mb-6">
        <strong>Rule of thumb:</strong> HELOCs suit short-term/flexible needs (renos you'll finish in 1–2 years). Refinances suit larger, one-time draws where you want fixed payments and a lower rate. Over long time horizons, refinance usually costs less total interest, but locks you in.
      </div>

      <BrokerCTA message={`Your ${fmt(equityNeeded)} draw costs ${fmt(helocTotalMonthly - currentMortgagePmt)}/mo via HELOC vs. ${fmt(refiPmt - currentMortgagePmt)}/mo extra via refi. A broker models both with your lender.`} />
    </div>
  );
}

export function PaymentFrequencyCalculator() {
  const [state, setState] = usePatchState({
    balance: 500000,
    rate: 4.29,
    amortYears: 25,
  });
  const { balance, rate, amortYears } = state;

  const months = amortYears * 12;
  const monthlyPmt = monthlyPayment(balance, rate, months);

  const biweekly = monthlyPmt * 12 / 26;
  const accelBiweekly = monthlyPmt / 2;
  const weekly = monthlyPmt * 12 / 52;
  const accelWeekly = monthlyPmt / 4;

  // Amortization reduction for accelerated bi-weekly (approximate closed-form)
  // Accelerated biweekly = 13 monthly payments/year effectively. Use iteration for years.
  function yearsToPayoff(startBalance: number, annualRate: number, paymentPerPeriod: number, periodsPerYear: number): number {
    const r = Math.pow(1 + annualRate / 200, 2 / periodsPerYear) - 1;
    if (paymentPerPeriod <= startBalance * r) return 999;
    let bal = startBalance;
    let periods = 0;
    while (bal > 0.01 && periods < 60 * periodsPerYear) {
      bal = bal * (1 + r) - paymentPerPeriod;
      periods++;
    }
    return periods / periodsPerYear;
  }

  const yrsAccelBiweekly = yearsToPayoff(balance, rate, accelBiweekly, 26);
  const yrsAccelWeekly = yearsToPayoff(balance, rate, accelWeekly, 52);
  const monthlyInterest = monthlyPmt * months - balance;
  const accelBiweeklyInterest = accelBiweekly * yrsAccelBiweekly * 26 - balance;
  const savingsVsMonthly = monthlyInterest - accelBiweeklyInterest;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Payment Frequency Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">Compare weekly, bi-weekly, accelerated bi-weekly, and monthly payments.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="interest-rate">Interest Rate</Label>
          <Input id="interest-rate" aria-label="Interest Rate" value={rate} onChange={(v) => setState({ rate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-body-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Frequency</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Annual Total</th>
              <th className="p-3">Years to Payoff</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-3 font-medium">Monthly</td><td className="p-3">{fmt(monthlyPmt)}</td><td className="p-3">{fmt(monthlyPmt * 12)}</td><td className="p-3">{amortYears} yrs</td></tr>
            <tr className="border-b border-gray-100 bg-gray-25"><td className="p-3 font-medium">Bi-Weekly</td><td className="p-3">{fmt(biweekly)}</td><td className="p-3">{fmt(biweekly * 26)}</td><td className="p-3">~{amortYears} yrs</td></tr>
            <tr className="border-b border-gray-100"><td className="p-3 font-medium">Weekly</td><td className="p-3">{fmt(weekly)}</td><td className="p-3">{fmt(weekly * 52)}</td><td className="p-3">~{amortYears} yrs</td></tr>
            <tr className="border-b border-gray-100 bg-secondary-25"><td className="p-3 font-bold text-secondary-200">Accelerated Bi-Weekly</td><td className="p-3 font-bold">{fmt(accelBiweekly)}</td><td className="p-3 font-bold">{fmt(accelBiweekly * 26)}</td><td className="p-3 font-bold">{yrsAccelBiweekly.toFixed(1)} yrs</td></tr>
            <tr className="bg-secondary-25"><td className="p-3 font-bold text-secondary-200">Accelerated Weekly</td><td className="p-3 font-bold">{fmt(accelWeekly)}</td><td className="p-3 font-bold">{fmt(accelWeekly * 52)}</td><td className="p-3 font-bold">{yrsAccelWeekly.toFixed(1)} yrs</td></tr>
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <ResultCard label="Years Saved (Accel Bi-Weekly)" value={`${(amortYears - yrsAccelBiweekly).toFixed(1)} yrs`} highlight />
        <ResultCard label="Interest Saved" value={fmt(savingsVsMonthly)} highlight />
        <ResultCard label="Extra Paid Per Year" value={fmt((accelBiweekly * 26) - (monthlyPmt * 12))} sublabel="= one extra monthly payment" />
      </div>

      <BrokerCTA message={`Switching to accelerated bi-weekly saves ${fmt(savingsVsMonthly)} interest and pays off your mortgage ${(amortYears - yrsAccelBiweekly).toFixed(1)} years earlier.`} />
    </div>
  );
}
