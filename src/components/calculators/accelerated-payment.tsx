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
// Accelerated Payment Calculator
//    Compares monthly vs accelerated bi-weekly vs accelerated weekly to show
//    years saved and total interest reduction.
// ============================================================================
type CurrentFreq = 'monthly' | 'biweekly' | 'accelBiweekly' | 'weekly' | 'accelWeekly';

export function AcceleratedPayment() {
  const [balance, setBalance] = useState(500000);
  const [rate, setRate] = useState(4.29);
  const [amortYears, setAmortYears] = useState(25);
  const [currentFreq, setCurrentFreq] = useState<CurrentFreq>('monthly');

  const months = amortYears * 12;
  const basePmt = monthlyPayment(balance, rate, months);

  function simulate(paymentPerPeriod: number, periodsPerYear: number): { years: number; totalInterest: number; totalPaid: number } {
    const r = Math.pow(1 + rate / 200, 2 / periodsPerYear) - 1;
    if (paymentPerPeriod <= balance * r) {
      return { years: 999, totalInterest: 0, totalPaid: 0 };
    }
    let bal = balance;
    let periods = 0;
    let totalPaid = 0;
    const maxPeriods = periodsPerYear * 50;
    while (bal > 0.01 && periods < maxPeriods) {
      const interest = bal * r;
      const pay = Math.min(paymentPerPeriod, bal + interest);
      bal = bal + interest - pay;
      totalPaid += pay;
      periods++;
    }
    return {
      years: periods / periodsPerYear,
      totalInterest: totalPaid - balance,
      totalPaid,
    };
  }

  const monthly = simulate(basePmt, 12);
  const biweekly = simulate((basePmt * 12) / 26, 26);
  const accelBiweekly = simulate(basePmt / 2, 26);
  const weekly = simulate((basePmt * 12) / 52, 52);
  const accelWeekly = simulate(basePmt / 4, 52);

  const scenarios = [
    { key: 'monthly', label: 'Monthly', payment: basePmt, periodsPerYear: 12, ...monthly },
    { key: 'biweekly', label: 'Bi-Weekly', payment: (basePmt * 12) / 26, periodsPerYear: 26, ...biweekly },
    { key: 'accelBiweekly', label: 'Accelerated Bi-Weekly', payment: basePmt / 2, periodsPerYear: 26, ...accelBiweekly },
    { key: 'weekly', label: 'Weekly', payment: (basePmt * 12) / 52, periodsPerYear: 52, ...weekly },
    { key: 'accelWeekly', label: 'Accelerated Weekly', payment: basePmt / 4, periodsPerYear: 52, ...accelWeekly },
  ];

  const current = scenarios.find(s => s.key === currentFreq)!;
  const bestAccel = accelBiweekly.totalInterest < accelWeekly.totalInterest ? accelBiweekly : accelWeekly;
  const bestAccelLabel = accelBiweekly.totalInterest < accelWeekly.totalInterest ? 'accelerated bi-weekly' : 'accelerated weekly';
  const interestSaved = current.totalInterest - bestAccel.totalInterest;
  const yearsSaved = current.years - bestAccel.years;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Accelerated Payment Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">Compare standard vs. accelerated payment schedules and see exactly how much you save.</p>

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
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={5} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label>Your Current Schedule</Label>
          <select
            value={currentFreq}
            onChange={e => setCurrentFreq(e.target.value as CurrentFreq)}
            className="w-full rounded-lg border border-gray-200 bg-background py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-Weekly (non-accel)</option>
            <option value="accelBiweekly">Accelerated Bi-Weekly</option>
            <option value="weekly">Weekly</option>
            <option value="accelWeekly">Accelerated Weekly</option>
          </select>
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
              <th className="p-3">Total Interest</th>
              <th className="p-3">vs. Monthly</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map(s => {
              const savedVsMonthly = monthly.totalInterest - s.totalInterest;
              const isCurrent = s.key === currentFreq;
              const isAccel = s.key === 'accelBiweekly' || s.key === 'accelWeekly';
              return (
                <tr key={s.key} className={`border-b border-gray-100 ${isAccel ? 'bg-secondary-25' : ''} ${isCurrent ? 'ring-2 ring-inset ring-secondary-100' : ''}`}>
                  <td className={`p-3 ${isAccel ? 'font-bold text-secondary-200' : 'font-medium'}`}>{s.label}{isCurrent ? ' (current)' : ''}</td>
                  <td className="p-3">{fmt(s.payment)}</td>
                  <td className="p-3">{fmt(s.payment * s.periodsPerYear)}</td>
                  <td className="p-3">{s.years.toFixed(1)} yrs</td>
                  <td className="p-3">{fmt(s.totalInterest)}</td>
                  <td className="p-3">{savedVsMonthly > 0 ? <span className="text-secondary-200 font-medium">saves {fmt(savedVsMonthly)}</span> : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <ResultCard label="Interest Saved (vs. current)" value={fmt(Math.max(0, interestSaved))} highlight sublabel={`Switching to ${bestAccelLabel}`} />
        <ResultCard label="Years Saved" value={`${Math.max(0, yearsSaved).toFixed(1)} yrs`} highlight />
        <ResultCard label="Extra Paid Per Year" value={fmt(Math.max(0, bestAccel.totalPaid / bestAccel.years - current.totalPaid / current.years))} sublabel="= ~one extra monthly payment" />
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground mb-6">
        <strong className="text-foreground">How acceleration works:</strong> "Accelerated" bi-weekly simply means your monthly payment ÷ 2, paid every two weeks. You make 26 payments a year instead of 24 — one extra monthly payment annually, all applied to principal. No fancy math, no extra rate discount — just slightly more money hitting principal each year.
      </div>

      <BrokerCTA message={interestSaved > 0
        ? `Switching to ${bestAccelLabel} saves ${fmt(interestSaved)} and pays off your mortgage ${yearsSaved.toFixed(1)} years earlier.`
        : "You're already on the fastest schedule. A broker can find you a lower rate to save even more."} />
    </div>
  );
}
