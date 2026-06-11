import React, { useEffect, useState } from 'react';

import { BrokerCTA, Input, Label, ResultCard } from '@/components/calculators/calculator-ui';
import { usePatchState } from '@/hooks/use-patch-state';
import { saveCalculatorContext } from '@/lib/calculator-context';
import { effectiveMonthlyRate, fmt, fmtPct, monthlyPayment, totalInterest } from '@/lib/mortgage-math';

// ============================================================================
// Calculator 1: Renewal Payment Estimator
// ============================================================================
function PaymentEstimator() {
  const [state, setState] = usePatchState({
    balance: 500000,
    rate: 4.5,
    amortYears: 20,
    freq: 'monthly' as 'monthly' | 'biweekly' | 'accelerated' | 'weekly',
  });
  const { balance, rate, amortYears, freq } = state;

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
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="new-interest-rate">New Interest Rate</Label>
          <Input id="new-interest-rate" aria-label="New Interest Rate" value={rate} onChange={(v) => setState({ rate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="remaining-amortization">Remaining Amortization</Label>
          <Input id="remaining-amortization" aria-label="Remaining Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>
      <div className="mb-6">
        <Label>Payment Frequency</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {(Object.keys(labels) as Array<keyof typeof labels>).map(f => (
            <button type="button"
              key={f}
              onClick={() => setState({ freq: f })}
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
      <BrokerCTA
        message={`Your estimated monthly payment is ${fmt(monthlyPmt)}. Want a broker to find a lower rate?`}
        calculatorContext={{
          tool: 'Renewal Payment Estimator',
          summary: `Balance $${balance.toLocaleString('en-CA')}, ${fmtPct(rate)}, ${amortYears}-yr amort. Est. ${labels[freq]} payment ${fmt(paymentByFreq[freq])}.`,
          data: { balance, rate, monthlyPmt },
        }}
      />
    </div>
  );
}

// ============================================================================
// Calculator 2: Rate Comparison
// ============================================================================
function RateComparison() {
  const [state, setState] = usePatchState({
    balance: 500000,
    bankRate: 5.0,
    brokerRate: 4.5,
    amortYears: 20,
  });
  const { balance, bankRate, brokerRate, amortYears } = state;

  const months = amortYears * 12;
  const bankPmt = monthlyPayment(balance, bankRate, months);
  const brokerPmt = monthlyPayment(balance, brokerRate, months);
  const monthlySaving = bankPmt - brokerPmt;
  const annualSaving = monthlySaving * 12;
  const fiveYearSaving = monthlySaving * 60;
  const totalIntBank = totalInterest(bankPmt, months, balance);
  const totalIntBroker = totalInterest(brokerPmt, months, balance);

  const calcSummary =
    `Balance $${balance.toLocaleString('en-CA')}, ${amortYears}-yr amort. Bank ${fmtPct(bankRate)} vs broker ${fmtPct(brokerRate)}. Monthly savings ${fmt(monthlySaving)}, 5-yr savings ${fmt(fiveYearSaving)}.`;

  useEffect(() => {
    saveCalculatorContext({
      tool: 'Rate Comparison Calculator',
      summary: calcSummary,
      data: { balance, bankRate, brokerRate, fiveYearSaving },
    });
  }, [calcSummary, balance, bankRate, brokerRate, fiveYearSaving]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Rate Comparison Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">See exactly how much switching rates saves you.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="your-bank-s-rate">Your Bank's Rate</Label>
          <Input id="your-bank-s-rate" aria-label="Your Bank's Rate" value={bankRate} onChange={(v) => setState({ bankRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="better-rate">Better Rate</Label>
          <Input id="better-rate" aria-label="Better Rate" value={brokerRate} onChange={(v) => setState({ brokerRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
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
      <BrokerCTA
        message={
          fiveYearSaving > 0
            ? `You could save ${fmt(fiveYearSaving)} over 5 years by switching rates. A broker can find this for you, free.`
            : `Compare your bank renewal offer to broker-channel rates — a licensed broker can shop 30+ lenders for free.`
        }
        calculatorContext={{
          tool: 'Rate Comparison Calculator',
          summary: calcSummary,
          data: { balance, bankRate, brokerRate, fiveYearSaving },
        }}
      />
    </div>
  );
}

// ============================================================================
// Calculator 3: Amortization Extension
// ============================================================================
function AmortizationExtension() {
  const [state, setState] = usePatchState({
    balance: 500000,
    rate: 4.5,
    currentAmort: 20,
    newAmort: 25,
  });
  const { balance, rate, currentAmort, newAmort } = state;

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
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="interest-rate">Interest Rate</Label>
          <Input id="interest-rate" aria-label="Interest Rate" value={rate} onChange={(v) => setState({ rate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="current-amortization">Current Amortization</Label>
          <Input id="current-amortization" aria-label="Current Amortization" value={currentAmort} onChange={(v) => setState({ currentAmort: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label htmlFor="new-amortization">New Amortization</Label>
          <Input id="new-amortization" aria-label="New Amortization" value={newAmort} onChange={(v) => setState({ newAmort: v })} min={currentAmort + 1} max={35} step={1} suffix="yrs" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Current Payment" value={fmt(currentPmt)} />
        <ResultCard label="New Payment" value={fmt(newPmt)} highlight />
        <ResultCard label="Monthly Savings" value={fmt(monthlySaving)} highlight />
        <ResultCard label="Extra Interest Cost" value={extraInterest > 0 ? fmt(extraInterest) : '$0'} />
      </div>
      <BrokerCTA
        message={
          monthlySaving > 0
            ? `Extending to ${newAmort} years saves ${fmt(monthlySaving)}/month but costs ${fmt(extraInterest)} more in total interest. A broker can help you weigh this trade-off.`
            : `Compare extending amortization vs other renewal options with a licensed broker.`
        }
        calculatorContext={{
          tool: 'Amortization Extension Calculator',
          summary: `Balance $${balance.toLocaleString('en-CA')}, ${fmtPct(rate)}. ${currentAmort}yr → ${newAmort}yr amort. Monthly ${fmt(currentPmt)} → ${fmt(newPmt)} (${fmt(monthlySaving)}/mo change).`,
          data: { balance, rate, currentAmort, newAmort, monthlySaving },
        }}
      />
    </div>
  );
}

// ============================================================================
// Calculator 4: Early Renewal Penalty Estimator
// ============================================================================
function PenaltyEstimator() {
  const [state, setState] = usePatchState({
    balance: 500000,
    currentRate: 5.5,
    newRate: 4.5,
    monthsRemaining: 24,
    lenderType: 'bank' as 'bank' | 'monoline',
  });
  const { balance, currentRate, newRate, monthsRemaining, lenderType } = state;

  // 3-month interest penalty
  const threeMonthInterest = balance * effectiveMonthlyRate(currentRate) * 3;

  // IRD penalty — bank uses posted rate (approximate posted as contract + 1.5% for banks)
  const _postedRate = lenderType === 'bank' ? currentRate + 1.5 : currentRate;
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
          <Label htmlFor="current-balance">Current Balance</Label>
          <Input id="current-balance" aria-label="Current Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="your-current-rate">Your Current Rate</Label>
          <Input id="your-current-rate" aria-label="Your Current Rate" value={currentRate} onChange={(v) => setState({ currentRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="new-rate-available">New Rate Available</Label>
          <Input id="new-rate-available" aria-label="New Rate Available" value={newRate} onChange={(v) => setState({ newRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="months-remaining">Months Remaining</Label>
          <Input id="months-remaining" aria-label="Months Remaining" value={monthsRemaining} onChange={(v) => setState({ monthsRemaining: v })} min={1} max={60} step={1} suffix="mo" />
        </div>
      </div>
      <div className="mb-6">
        <Label>Lender Type</Label>
        <div className="flex gap-2 mt-1">
          <button type="button" onClick={() => setState({ lenderType: 'bank' })} className={`rounded-lg px-4 py-2 text-body-sm ${lenderType === 'bank' ? 'bg-primary-100 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>Big Bank</button>
          <button type="button" onClick={() => setState({ lenderType: 'monoline' })} className={`rounded-lg px-4 py-2 text-body-sm ${lenderType === 'monoline' ? 'bg-primary-100 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>Monoline Lender</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="3-Month Interest Penalty" value={fmt(threeMonthInterest)} />
        <ResultCard label={`IRD Penalty (${lenderType === 'bank' ? 'Bank Method' : 'Contract Rate'})`} value={fmt(ird)} />
        <ResultCard label="Estimated Penalty" value={fmt(penalty)} highlight />
        <ResultCard label={netSaving > 0 ? "Net Saving After Penalty" : "Net Cost"} value={fmt(Math.abs(netSaving))} />
      </div>
      <BrokerCTA
        message={netSaving > 0 ? `Even after the penalty, breaking early could save you ${fmt(netSaving)}. A broker can verify with your lender's exact numbers.` : `The penalty of ${fmt(penalty)} exceeds your savings. A broker can advise on timing and blend-and-extend options.`}
        calculatorContext={{
          tool: 'Early Renewal Penalty Estimator',
          summary: `Balance $${balance.toLocaleString('en-CA')}, ${fmtPct(currentRate)} → ${fmtPct(newRate)}, ${monthsRemaining} mo left. Est. penalty ${fmt(penalty)}, net ${fmt(netSaving)}.`,
          data: { balance, penalty, netSaving, lenderType },
        }}
      />
    </div>
  );
}

// ============================================================================
// Calculator 5: Debt Consolidation
// ============================================================================
function DebtConsolidation() {
  const [state, setState] = usePatchState({
    mortgageBalance: 500000,
    mortgageRate: 4.5,
    amortYears: 20,
    debts: [
      { id: 'credit-card', name: 'Credit Card', balance: 15000, rate: 19.99, payment: 450 },
      { id: 'car-loan', name: 'Car Loan', balance: 20000, rate: 7.5, payment: 400 },
      { id: 'loc', name: 'Line of Credit', balance: 10000, rate: 8.0, payment: 200 },
    ],
  });
  const { mortgageBalance, mortgageRate, amortYears, debts } = state;

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
        ⚠️ Debt consolidation into your mortgage lowers monthly payments but extends repayment, increasing total interest. This requires refinancing (not a straight renewal) and a stress test.
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={mortgageBalance} onChange={(v) => setState({ mortgageBalance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="mortgage-rate">Mortgage Rate</Label>
          <Input id="mortgage-rate" aria-label="Mortgage Rate" value={mortgageRate} onChange={(v) => setState({ mortgageRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
      </div>
      <div className="mb-6 space-y-3">
        <Label>Debts to Consolidate</Label>
        {debts.map((debt, i) => (
          <div key={debt.id} className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-gray-25 p-3">
            <div>
              <div className="text-body-xs text-muted-foreground mb-1">Debt Name</div>
              <input id="debt-name" aria-label="Debt Name" value={debt.name} onChange={e => { const d=[...debts]; d[i]={...d[i],name:e.target.value}; setState({ debts: d }); }} className="w-full rounded border border-gray-200 px-2 py-1 text-body-sm" />
            </div>
            <div>
              <div className="text-body-xs text-muted-foreground mb-1">Balance</div>
              <input id="balance" aria-label="Balance" type="number" value={debt.balance} onChange={e => { const d=[...debts]; d[i]={...d[i],balance:Number(e.target.value)}; setState({ debts: d }); }} className="w-full rounded border border-gray-200 px-2 py-1 text-body-sm" />
            </div>
            <div>
              <div className="text-body-xs text-muted-foreground mb-1">Rate %</div>
              <input id="rate" aria-label="Rate %" type="number" value={debt.rate} onChange={e => { const d=[...debts]; d[i]={...d[i],rate:Number(e.target.value)}; setState({ debts: d }); }} className="w-full rounded border border-gray-200 px-2 py-1 text-body-sm" />
            </div>
            <div>
              <div className="text-body-xs text-muted-foreground mb-1">Monthly Pmt</div>
              <input id="monthly-pmt" aria-label="Monthly Pmt" type="number" value={debt.payment} onChange={e => { const d=[...debts]; d[i]={...d[i],payment:Number(e.target.value)}; setState({ debts: d }); }} className="w-full rounded border border-gray-200 px-2 py-1 text-body-sm" />
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
      <BrokerCTA
        message={`Consolidating saves ${fmt(monthlySaving)}/month. A broker can run the full numbers and check if you qualify, free consultation.`}
        calculatorContext={{
          tool: 'Debt Consolidation Calculator',
          summary: `Mortgage $${mortgageBalance.toLocaleString('en-CA')} + $${totalDebtBalance.toLocaleString('en-CA')} debts. Monthly relief ${fmt(monthlySaving)}.`,
          data: { mortgageBalance, totalDebtBalance, monthlySaving },
        }}
      />
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
          <button type="button"
            key={tab.id}
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
