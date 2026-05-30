import React from 'react';

import { BrokerCTA, Input, Label, ResultCard } from '@/components/calculators/calculator-ui';
import { usePatchState } from '@/hooks/use-patch-state';
import { fmt, monthlyPayment } from '@/lib/mortgage-math';

type CurrentFreq = 'monthly' | 'biweekly' | 'accelBiweekly' | 'weekly' | 'accelWeekly';

export function AcceleratedPayment() {
  const [state, setState] = usePatchState({
    balance: 500000,
    rate: 4.29,
    amortYears: 25,
    currentFreq: 'monthly' as CurrentFreq,
  });
  const { balance, rate, amortYears, currentFreq } = state;

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
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="interest-rate">Interest Rate</Label>
          <Input id="interest-rate" aria-label="Interest Rate" value={rate} onChange={(v) => setState({ rate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={5} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label htmlFor="your-current-schedule">Your Current Schedule</Label>
          <select id="your-current-schedule" aria-label="Your Current Schedule"
            value={currentFreq}
            onChange={e => setState({ currentFreq: e.target.value as CurrentFreq })}
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
                  <td className="p-3">{savedVsMonthly > 0 ? <span className="text-secondary-200 font-medium">saves {fmt(savedVsMonthly)}</span> : 'N/A'}</td>
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
        <strong className="text-foreground">How acceleration works:</strong> "Accelerated" bi-weekly simply means your monthly payment ÷ 2, paid every two weeks. You make 26 payments a year instead of 24, one extra monthly payment annually, all applied to principal. No fancy math, no extra rate discount, just slightly more money hitting principal each year.
      </div>

      <BrokerCTA message={interestSaved > 0
        ? `Switching to ${bestAccelLabel} saves ${fmt(interestSaved)} and pays off your mortgage ${yearsSaved.toFixed(1)} years earlier.`
        : "You're already on the fastest schedule. A broker can find you a lower rate to save even more."} />
    </div>
  );
}
