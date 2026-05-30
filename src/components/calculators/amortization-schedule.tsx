import React from 'react';

import { usePatchState } from '@/hooks/use-patch-state';

import { BrokerCTA, Input, Label, ResultCard } from '@/components/calculators/calculator-ui';
import { effectiveMonthlyRate, fmt, fmtPct, monthlyPayment } from '@/lib/mortgage-math';

type Frequency = 'monthly' | 'biweekly' | 'accelBiweekly' | 'weekly' | 'accelWeekly';

export function AmortizationSchedule() {
  const [state, setState] = usePatchState({
    balance: 500000,
    rate: 4.29,
    amortYears: 25,
    freq: 'monthly' as Frequency,
    showFull: false,
  });
  const { balance, rate, amortYears, freq, showFull } = state;

  const months = amortYears * 12;
  const basePmt = monthlyPayment(balance, rate, months);

  // Periods per year and payment per period for each frequency
  const config: Record<Frequency, { periodsPerYear: number; payment: number; label: string }> = {
    monthly: { periodsPerYear: 12, payment: basePmt, label: 'Monthly' },
    biweekly: { periodsPerYear: 26, payment: (basePmt * 12) / 26, label: 'Bi-Weekly' },
    accelBiweekly: { periodsPerYear: 26, payment: basePmt / 2, label: 'Accelerated Bi-Weekly' },
    weekly: { periodsPerYear: 52, payment: (basePmt * 12) / 52, label: 'Weekly' },
    accelWeekly: { periodsPerYear: 52, payment: basePmt / 4, label: 'Accelerated Weekly' },
  };

  const { periodsPerYear, payment } = config[freq];
  // Periodic rate from semi-annual: (1 + annual/2)^(2/periodsPerYear) − 1
  const periodRate = Math.pow(1 + rate / 200, 2 / periodsPerYear) - 1;

  // Build year-by-year schedule
  type Row = { year: number; openingBalance: number; interestYTD: number; principalYTD: number; totalPaidYTD: number; closingBalance: number };
  const rows: Row[] = [];
  let bal = balance;
  let year = 1;
  const maxYears = 40;
  while (bal > 0.01 && year <= maxYears) {
    const opening = bal;
    let yearInt = 0;
    let yearPrin = 0;
    let yearPaid = 0;
    for (let p = 0; p < periodsPerYear; p++) {
      if (bal <= 0.01) break;
      const interest = bal * periodRate;
      const pay = Math.min(payment, bal + interest);
      const principal = pay - interest;
      bal = bal - principal;
      yearInt += interest;
      yearPrin += principal;
      yearPaid += pay;
    }
    rows.push({
      year,
      openingBalance: opening,
      interestYTD: yearInt,
      principalYTD: yearPrin,
      totalPaidYTD: yearPaid,
      closingBalance: Math.max(0, bal),
    });
    year++;
  }

  const displayRows = showFull ? rows : rows.slice(0, 10);
  const payoffYears = rows.length;
  const totalInterestPaid = rows.reduce((sum, r) => sum + r.interestYTD, 0);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Amortization Schedule Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">Year-by-year breakdown of interest, principal, and balance.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
          <Label htmlFor="payment-frequency">Payment Frequency</Label>
          <select id="payment-frequency" aria-label="Payment Frequency"
            value={freq}
            onChange={e => setState({ freq: e.target.value as Frequency })}
            className="w-full rounded-lg border border-gray-200 bg-background py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-Weekly</option>
            <option value="accelBiweekly">Accelerated Bi-Weekly</option>
            <option value="weekly">Weekly</option>
            <option value="accelWeekly">Accelerated Weekly</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <ResultCard label="Payment" value={fmt(payment)} sublabel={config[freq].label} />
        <ResultCard label="Payoff Time" value={`${payoffYears} yrs`} highlight sublabel={freq.startsWith('accel') ? `vs. ${amortYears} yrs monthly` : undefined} />
        <ResultCard label="Total Interest Paid" value={fmt(totalInterestPaid)} highlight />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-body-sm-medium">Year-by-Year Schedule</div>
        <button type="button"
          onClick={() => setState({ showFull: !showFull })}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-body-sm hover:bg-gray-25 transition-colors"
        >
          {showFull ? 'Show first 10 years' : `Show all ${rows.length} years`}
        </button>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-body-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Year</th>
              <th className="p-3">Opening Balance</th>
              <th className="p-3">Interest Paid</th>
              <th className="p-3">Principal Paid</th>
              <th className="p-3">Total Paid</th>
              <th className="p-3">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map(r => (
              <tr key={r.year} className={`border-b border-gray-100 ${r.year % 2 === 0 ? 'bg-gray-25' : ''}`}>
                <td className="p-3 font-medium">{r.year}</td>
                <td className="p-3">{fmt(r.openingBalance)}</td>
                <td className="p-3 text-warning-200">{fmt(r.interestYTD)}</td>
                <td className="p-3 text-secondary-200">{fmt(r.principalYTD)}</td>
                <td className="p-3">{fmt(r.totalPaidYTD)}</td>
                <td className="p-3 font-medium">{fmt(r.closingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BrokerCTA message={`At ${fmtPct(rate)} over ${amortYears} years, you'll pay ${fmt(totalInterestPaid)} in interest. A broker can find a lower rate or better amortization strategy.`} />
    </div>
  );
}
