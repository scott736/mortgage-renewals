import React, { useState, useCallback } from 'react';

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

function totalInterest(payment: number, months: number, principal: number): number {
  return payment * months - principal;
}

function fmt(n: number): string {
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
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

function ResultCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-secondary-25 border-secondary-50' : 'bg-gray-25 border-gray-100'}`}>
      <div className="text-body-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-secondary-200' : 'text-foreground'}`}>{value}</div>
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
// Calculator 1: Renewal Payment Estimator
// ============================================================================
export function PaymentEstimator() {
  const [balance, setBalance] = useState(500000);
  const [rate, setRate] = useState(4.5);
  const [amortYears, setAmortYears] = useState(20);
  const [freq, setFreq] = useState<'monthly' | 'biweekly' | 'accelerated' | 'weekly'>('monthly');

  const months = amortYears * 12;
  const monthlyPmt = monthlyPayment(balance, rate, months);
  const totalInt = totalInterest(monthlyPmt, months, balance);

  const paymentByFreq = {
    monthly: monthlyPmt,
    biweekly: monthlyPmt * 12 / 26,
    accelerated: monthlyPmt / 2,
    weekly: monthlyPmt * 12 / 52,
  };

  const labels = { monthly: 'Monthly', biweekly: 'Bi-Weekly', accelerated: 'Accelerated Bi-Weekly', weekly: 'Weekly' };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Renewal Payment Estimator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">Calculate your new mortgage payment after renewal.</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>New Interest Rate</Label>
          <Input value={rate} onChange={setRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Remaining Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>
      <div className="mb-6">
        <Label>Payment Frequency</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {(Object.keys(labels) as Array<keyof typeof labels>).map(f => (
            <button
              key={f}
              onClick={() => setFreq(f)}
              className={`rounded-lg px-4 py-2 text-body-sm transition-colors ${freq === f ? 'bg-primary-100 text-white' : 'bg-gray-50 text-foreground hover:bg-gray-100'}`}
            >
              {labels[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <ResultCard label={`${labels[freq]} Payment`} value={fmt(paymentByFreq[freq])} highlight />
        <ResultCard label="Total Interest (Term 5yr)" value={fmt(monthlyPmt * 60 - (balance - balance * Math.pow(1 + effectiveMonthlyRate(rate), 60) + monthlyPmt * ((Math.pow(1 + effectiveMonthlyRate(rate), 60) - 1) / effectiveMonthlyRate(rate))))} />
        <ResultCard label="Total Interest (Full Amort)" value={fmt(totalInt)} />
      </div>
      <BrokerCTA message={`Your estimated monthly payment is ${fmt(monthlyPmt)}. Want a broker to find a lower rate?`} />
    </div>
  );
}

// ============================================================================
// Calculator 2: Rate Comparison
// ============================================================================
export function RateComparison() {
  const [balance, setBalance] = useState(500000);
  const [bankRate, setBankRate] = useState(5.0);
  const [brokerRate, setBrokerRate] = useState(4.5);
  const [amortYears, setAmortYears] = useState(20);

  const months = amortYears * 12;
  const bankPmt = monthlyPayment(balance, bankRate, months);
  const brokerPmt = monthlyPayment(balance, brokerRate, months);
  const monthlySaving = bankPmt - brokerPmt;
  const annualSaving = monthlySaving * 12;
  const fiveYearSaving = monthlySaving * 60;
  const totalIntBank = totalInterest(bankPmt, months, balance);
  const totalIntBroker = totalInterest(brokerPmt, months, balance);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Rate Comparison Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">See exactly how much switching rates saves you.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Your Bank's Rate</Label>
          <Input value={bankRate} onChange={setBankRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Better Rate</Label>
          <Input value={brokerRate} onChange={setBrokerRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Monthly Savings" value={fmt(monthlySaving)} highlight />
        <ResultCard label="Annual Savings" value={fmt(annualSaving)} highlight />
        <ResultCard label="5-Year Savings" value={fmt(fiveYearSaving)} highlight />
        <ResultCard label="Total Interest Saved" value={fmt(totalIntBank - totalIntBroker)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-gray-25 p-4">
          <div className="text-body-sm text-muted-foreground mb-2">At {bankRate}% (Bank's Offer)</div>
          <div className="text-xl font-bold">{fmt(bankPmt)}<span className="text-body-sm font-normal text-muted-foreground">/mo</span></div>
        </div>
        <div className="rounded-xl bg-secondary-25 p-4">
          <div className="text-body-sm text-muted-foreground mb-2">At {brokerRate}% (Better Rate)</div>
          <div className="text-xl font-bold text-secondary-200">{fmt(brokerPmt)}<span className="text-body-sm font-normal text-muted-foreground">/mo</span></div>
        </div>
      </div>
      {fiveYearSaving > 0 && (
        <BrokerCTA message={`You could save ${fmt(fiveYearSaving)} over 5 years by switching rates. A broker can find this for you — free.`} />
      )}
    </div>
  );
}

// ============================================================================
// Calculator 3: Amortization Extension
// ============================================================================
export function AmortizationExtension() {
  const [balance, setBalance] = useState(500000);
  const [rate, setRate] = useState(4.5);
  const [currentAmort, setCurrentAmort] = useState(20);
  const [newAmort, setNewAmort] = useState(25);

  const currentPmt = monthlyPayment(balance, rate, currentAmort * 12);
  const newPmt = monthlyPayment(balance, rate, newAmort * 12);
  const monthlySaving = currentPmt - newPmt;
  const extraInterest = totalInterest(newPmt, newAmort * 12, balance) - totalInterest(currentPmt, currentAmort * 12, balance);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Amortization Extension Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">See the trade-off between lower payments and total interest when extending your amortization.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Interest Rate</Label>
          <Input value={rate} onChange={setRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Current Amortization</Label>
          <Input value={currentAmort} onChange={setCurrentAmort} min={1} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label>New Amortization</Label>
          <Input value={newAmort} onChange={setNewAmort} min={currentAmort + 1} max={35} step={1} suffix="yrs" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Current Payment" value={fmt(currentPmt)} />
        <ResultCard label="New Payment" value={fmt(newPmt)} highlight />
        <ResultCard label="Monthly Savings" value={fmt(monthlySaving)} highlight />
        <ResultCard label="Extra Interest Cost" value={extraInterest > 0 ? fmt(extraInterest) : '$0'} />
      </div>
      {monthlySaving > 0 && (
        <BrokerCTA message={`Extending to ${newAmort} years saves ${fmt(monthlySaving)}/month but costs ${fmt(extraInterest)} more in total interest. A broker can help you weigh this trade-off.`} />
      )}
    </div>
  );
}

// ============================================================================
// Calculator 4: Early Renewal Penalty Estimator
// ============================================================================
export function PenaltyEstimator() {
  const [balance, setBalance] = useState(500000);
  const [currentRate, setCurrentRate] = useState(5.5);
  const [newRate, setNewRate] = useState(4.5);
  const [monthsRemaining, setMonthsRemaining] = useState(24);
  const [lenderType, setLenderType] = useState<'bank' | 'monoline'>('bank');

  // 3-month interest penalty
  const threeMonthInterest = balance * effectiveMonthlyRate(currentRate) * 3;

  // IRD penalty — bank uses posted rate (approximate posted as contract + 1.5% for banks)
  const postedRate = lenderType === 'bank' ? currentRate + 1.5 : currentRate;
  const rateSpread = Math.max(0, currentRate - newRate);
  const irdMonthly = balance * effectiveMonthlyRate(rateSpread);
  const ird = irdMonthly * monthsRemaining;

  const penalty = Math.max(threeMonthInterest, ird);
  const savings = (balance * (effectiveMonthlyRate(currentRate) - effectiveMonthlyRate(newRate))) * monthsRemaining;
  const netSaving = savings - penalty;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Early Renewal Penalty Estimator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">Estimate your prepayment penalty for breaking your mortgage early. <strong>Important:</strong> This is an estimate only. Contact your lender for the exact penalty.</p>
      <div className="rounded-lg bg-warning-0 border border-warning-50 px-4 py-3 text-body-xs text-warning-200 mb-6">
        ⚠️ Bank IRD penalties use their posted rate, which significantly inflates the penalty. Monoline lenders use the contract rate, which is much fairer. This calculator estimates both scenarios.
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Label>Current Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Your Current Rate</Label>
          <Input value={currentRate} onChange={setCurrentRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>New Rate Available</Label>
          <Input value={newRate} onChange={setNewRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Months Remaining</Label>
          <Input value={monthsRemaining} onChange={setMonthsRemaining} min={1} max={60} step={1} suffix="mo" />
        </div>
      </div>
      <div className="mb-6">
        <Label>Lender Type</Label>
        <div className="flex gap-2 mt-1">
          <button onClick={() => setLenderType('bank')} className={`rounded-lg px-4 py-2 text-body-sm ${lenderType === 'bank' ? 'bg-primary-100 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>Big Bank</button>
          <button onClick={() => setLenderType('monoline')} className={`rounded-lg px-4 py-2 text-body-sm ${lenderType === 'monoline' ? 'bg-primary-100 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>Monoline Lender</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="3-Month Interest Penalty" value={fmt(threeMonthInterest)} />
        <ResultCard label={`IRD Penalty (${lenderType === 'bank' ? 'Bank Method' : 'Contract Rate'})`} value={fmt(ird)} />
        <ResultCard label="Estimated Penalty" value={fmt(penalty)} highlight />
        <ResultCard label={netSaving > 0 ? "Net Saving After Penalty" : "Net Cost"} value={fmt(Math.abs(netSaving))} />
      </div>
      <BrokerCTA message={netSaving > 0 ? `Even after the penalty, breaking early could save you ${fmt(netSaving)}. A broker can verify with your lender's exact numbers.` : `The penalty of ${fmt(penalty)} exceeds your savings. A broker can advise on timing and blend-and-extend options.`} />
    </div>
  );
}

// ============================================================================
// Calculator 5: Debt Consolidation
// ============================================================================
export function DebtConsolidation() {
  const [mortgageBalance, setMortgageBalance] = useState(500000);
  const [mortgageRate, setMortgageRate] = useState(4.5);
  const [amortYears, setAmortYears] = useState(20);
  const [debts, setDebts] = useState([
    { name: 'Credit Card', balance: 15000, rate: 19.99, payment: 450 },
    { name: 'Car Loan', balance: 20000, rate: 7.5, payment: 400 },
    { name: 'Line of Credit', balance: 10000, rate: 8.0, payment: 200 },
  ]);

  const totalDebtBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalDebtPayment = debts.reduce((s, d) => s + d.payment, 0);
  const newBalance = mortgageBalance + totalDebtBalance;
  const currentMortgagePmt = monthlyPayment(mortgageBalance, mortgageRate, amortYears * 12);
  const newMortgagePmt = monthlyPayment(newBalance, mortgageRate, amortYears * 12);
  const currentTotal = currentMortgagePmt + totalDebtPayment;
  const monthlySaving = currentTotal - newMortgagePmt;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Debt Consolidation at Renewal</h3>
      <p className="text-body-sm text-muted-foreground mb-2">See how rolling high-interest debt into your mortgage at renewal affects your monthly cash flow.</p>
      <div className="rounded-lg bg-warning-0 border border-warning-50 px-4 py-3 text-body-xs text-warning-200 mb-6">
        ⚠️ Debt consolidation into your mortgage lowers monthly payments but extends repayment — increasing total interest. This requires refinancing (not a straight renewal) and a stress test.
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div>
          <Label>Mortgage Balance</Label>
          <Input value={mortgageBalance} onChange={setMortgageBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Mortgage Rate</Label>
          <Input value={mortgageRate} onChange={setMortgageRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>
      <div className="mb-6 space-y-3">
        <Label>Debts to Consolidate</Label>
        {debts.map((debt, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-gray-25 p-3">
            <div>
              <div className="text-body-xs text-muted-foreground mb-1">Debt Name</div>
              <input value={debt.name} onChange={e => { const d=[...debts]; d[i]={...d[i],name:e.target.value}; setDebts(d); }} className="w-full rounded border border-gray-200 px-2 py-1 text-body-sm" />
            </div>
            <div>
              <div className="text-body-xs text-muted-foreground mb-1">Balance</div>
              <input type="number" value={debt.balance} onChange={e => { const d=[...debts]; d[i]={...d[i],balance:Number(e.target.value)}; setDebts(d); }} className="w-full rounded border border-gray-200 px-2 py-1 text-body-sm" />
            </div>
            <div>
              <div className="text-body-xs text-muted-foreground mb-1">Rate %</div>
              <input type="number" value={debt.rate} onChange={e => { const d=[...debts]; d[i]={...d[i],rate:Number(e.target.value)}; setDebts(d); }} className="w-full rounded border border-gray-200 px-2 py-1 text-body-sm" />
            </div>
            <div>
              <div className="text-body-xs text-muted-foreground mb-1">Monthly Pmt</div>
              <input type="number" value={debt.payment} onChange={e => { const d=[...debts]; d[i]={...d[i],payment:Number(e.target.value)}; setDebts(d); }} className="w-full rounded border border-gray-200 px-2 py-1 text-body-sm" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Current Total Monthly" value={fmt(currentTotal)} />
        <ResultCard label="New Mortgage Payment" value={fmt(newMortgagePmt)} highlight />
        <ResultCard label="Monthly Cash Flow Relief" value={fmt(monthlySaving)} highlight />
        <ResultCard label="Total Debt Consolidated" value={fmt(totalDebtBalance)} />
      </div>
      <BrokerCTA message={`Consolidating saves ${fmt(monthlySaving)}/month. A broker can run the full numbers and check if you qualify — free consultation.`} />
    </div>
  );
}

// ============================================================================
// Tab Container
// ============================================================================
export default function MortgageCalculators() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Payment Estimator', id: 'payment-estimator' },
    { label: 'Rate Comparison', id: 'rate-comparison' },
    { label: 'Amortization', id: 'amortization' },
    { label: 'Penalty Estimator', id: 'penalty' },
    { label: 'Debt Consolidation', id: 'debt-consolidation' },
  ];

  const components = [
    <PaymentEstimator key="1" />,
    <RateComparison key="2" />,
    <AmortizationExtension key="3" />,
    <PenaltyEstimator key="4" />,
    <DebtConsolidation key="5" />,
  ];

  return (
    <div>
      {/* Tab nav */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            id={tab.id}
            onClick={() => setActiveTab(i)}
            className={`rounded-lg px-4 py-2.5 text-body-sm-medium transition-colors ${activeTab === i ? 'bg-primary-100 text-white' : 'bg-gray-50 text-foreground hover:bg-gray-100 border border-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {components[activeTab]}
    </div>
  );
}
