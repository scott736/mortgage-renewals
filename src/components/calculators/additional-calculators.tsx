import React, { useState } from 'react';

// ============================================================================
// Canadian mortgage math — semi-annual compounding (same as main calculators)
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
      <a href="/book-a-call" className="flex-shrink-0 rounded-lg bg-primary-100 text-white px-5 py-2.5 text-body-sm-medium hover:opacity-90 transition-opacity">
        Book Free Call
      </a>
    </div>
  );
}

// ============================================================================
// 1) Blend-and-Extend Calculator
//    Blended rate is a weighted average: (remaining months × current rate +
//    new term months × market rate) / total months. Canadian banks use this
//    as an alternative to breaking the mortgage and paying a penalty.
// ============================================================================
export function BlendAndExtend() {
  const [balance, setBalance] = useState(500000);
  const [currentRate, setCurrentRate] = useState(5.25);
  const [marketRate, setMarketRate] = useState(4.19);
  const [monthsRemaining, setMonthsRemaining] = useState(24);
  const [newTermYears, setNewTermYears] = useState(5);
  const [amortYears, setAmortYears] = useState(22);

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
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Current Rate</Label>
          <Input value={currentRate} onChange={setCurrentRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Today's Market Rate</Label>
          <Input value={marketRate} onChange={setMarketRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Months Remaining</Label>
          <Input value={monthsRemaining} onChange={setMonthsRemaining} min={1} max={60} step={1} suffix="mo" />
        </div>
        <div>
          <Label>New Term Length</Label>
          <Input value={newTermYears} onChange={setNewTermYears} min={1} max={10} step={1} suffix="yrs" />
        </div>
        <div>
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={1} max={30} step={1} suffix="yrs" />
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
        <p className="text-body-xs text-muted-foreground mt-3">Simplified comparison using 3-month interest penalty. Actual bank IRD penalties can be much higher — use the penalty estimator for a more accurate break scenario.</p>
      </div>

      <BrokerCTA message={monthlySaving > 0
        ? `Your blended rate is ${fmtPct(blendedRate)} — saving ${fmt(monthlySaving)}/month vs. your current rate.`
        : `Your current rate is already competitive. A broker can confirm whether blend-and-extend makes sense.`} />
    </div>
  );
}

// ============================================================================
// 2) Stress Test / Qualifying Rate Calculator
//    OSFI B-20: uninsured mortgages at federally regulated lenders must
//    qualify at the greater of contract rate + 2% or 5.25%. Since Nov 2024,
//    this is waived for straight-switch renewals (no new money, same amort).
// ============================================================================
export function StressTestCalculator() {
  const [income, setIncome] = useState(120000);
  const [otherDebts, setOtherDebts] = useState(500);
  const [propertyTax, setPropertyTax] = useState(5000);
  const [heating, setHeating] = useState(1800);
  const [condoFees, setCondoFees] = useState(0);
  const [contractRate, setContractRate] = useState(4.29);
  const [amortYears, setAmortYears] = useState(25);

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
          <Label>Household Gross Income</Label>
          <Input value={income} onChange={setIncome} min={20000} max={2000000} step={5000} prefix="$" />
        </div>
        <div>
          <Label>Other Monthly Debts</Label>
          <Input value={otherDebts} onChange={setOtherDebts} min={0} max={10000} step={50} prefix="$" />
        </div>
        <div>
          <Label>Annual Property Tax</Label>
          <Input value={propertyTax} onChange={setPropertyTax} min={0} max={30000} step={100} prefix="$" />
        </div>
        <div>
          <Label>Annual Heating</Label>
          <Input value={heating} onChange={setHeating} min={0} max={10000} step={100} prefix="$" />
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

// ============================================================================
// 3) Switch-vs-Stay Break-Even Calculator
//    Factors in real switching costs (discharge, legal, appraisal, title)
//    and outputs break-even months plus 5-year net savings.
// ============================================================================
export function SwitchVsStay() {
  const [balance, setBalance] = useState(500000);
  const [stayRate, setStayRate] = useState(4.89);
  const [switchRate, setSwitchRate] = useState(4.19);
  const [amortYears, setAmortYears] = useState(22);
  const [dischargeFee, setDischargeFee] = useState(325);
  const [legalFee, setLegalFee] = useState(0);
  const [appraisalFee, setAppraisalFee] = useState(0);
  const [titleInsurance, setTitleInsurance] = useState(225);

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
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Stay Rate (Your Lender)</Label>
          <Input value={stayRate} onChange={setStayRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Switch Rate (New Lender)</Label>
          <Input value={switchRate} onChange={setSwitchRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>

      <div className="mb-4">
        <Label>Switching Costs</Label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Discharge Fee</div>
            <Input value={dischargeFee} onChange={setDischargeFee} min={0} max={2000} step={25} prefix="$" />
          </div>
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Legal Fee</div>
            <Input value={legalFee} onChange={setLegalFee} min={0} max={3000} step={25} prefix="$" />
          </div>
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Appraisal</div>
            <Input value={appraisalFee} onChange={setAppraisalFee} min={0} max={1500} step={25} prefix="$" />
          </div>
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Title Insurance</div>
            <Input value={titleInsurance} onChange={setTitleInsurance} min={0} max={1000} step={25} prefix="$" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Monthly Saving" value={fmt(monthlySaving)} highlight />
        <ResultCard label="Total Switching Cost" value={fmt(totalCosts)} />
        <ResultCard label="Break-Even" value={breakEvenMonths === Infinity ? '—' : `${breakEvenMonths} mo`} highlight sublabel={breakEvenMonths === Infinity ? 'Switching costs more' : `~${(breakEvenMonths / 12).toFixed(1)} years`} />
        <ResultCard label="5-Year Net Saving" value={fmt(fiveYearNet)} highlight />
      </div>

      <BrokerCTA message={fiveYearNet > 0
        ? `You'd net ${fmt(fiveYearNet)} over 5 years after switching costs. A broker can find lenders who cover legal fees.`
        : "At these rates, switching doesn't pay. A broker may find a better rate or a lender that covers costs."} />
    </div>
  );
}

// ============================================================================
// 4) HELOC vs Refinance Calculator
//    Compares a HELOC (revolving, prime-based, interest-only option) vs. a
//    cash-out refinance (blended into mortgage, amortized, fixed rate).
// ============================================================================
export function HelocVsRefinance() {
  const [mortgageBalance, setMortgageBalance] = useState(400000);
  const [mortgageRate, setMortgageRate] = useState(4.29);
  const [amortYears, setAmortYears] = useState(25);
  const [equityNeeded, setEquityNeeded] = useState(75000);
  const [helocRate, setHelocRate] = useState(5.95); // prime + 0.5-1.5 typical
  const [newMortgageRate, setNewMortgageRate] = useState(4.29);

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
          <Label>Current Mortgage Balance</Label>
          <Input value={mortgageBalance} onChange={setMortgageBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Current Mortgage Rate</Label>
          <Input value={mortgageRate} onChange={setMortgageRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={1} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label>Equity Needed</Label>
          <Input value={equityNeeded} onChange={setEquityNeeded} min={5000} max={500000} step={5000} prefix="$" />
        </div>
        <div>
          <Label>HELOC Rate (typically prime+1%)</Label>
          <Input value={helocRate} onChange={setHelocRate} min={1} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>New Mortgage Rate (refi)</Label>
          <Input value={newMortgageRate} onChange={setNewMortgageRate} min={0.5} max={15} step={0.05} suffix="%" />
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
        <strong>Rule of thumb:</strong> HELOCs suit short-term/flexible needs (renos you'll finish in 1–2 years). Refinances suit larger, one-time draws where you want fixed payments and a lower rate. Over long time horizons, refinance usually costs less total interest — but locks you in.
      </div>

      <BrokerCTA message={`Your ${fmt(equityNeeded)} draw costs ${fmt(helocTotalMonthly - currentMortgagePmt)}/mo via HELOC vs. ${fmt(refiPmt - currentMortgagePmt)}/mo extra via refi. A broker models both with your lender.`} />
    </div>
  );
}

// ============================================================================
// 5) Payment Frequency Comparison Calculator
//    Shows how accelerated bi-weekly/weekly payments shave years off a mortgage.
// ============================================================================
export function PaymentFrequencyCalculator() {
  const [balance, setBalance] = useState(500000);
  const [rate, setRate] = useState(4.29);
  const [amortYears, setAmortYears] = useState(25);

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
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Interest Rate</Label>
          <Input value={rate} onChange={setRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={1} max={30} step={1} suffix="yrs" />
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
