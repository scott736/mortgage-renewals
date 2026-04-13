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
// Refinance Debt Consolidation Calculator
//    Rolls credit card / LOC / car loan debt into the mortgage at refi.
//    Enforces 80% LTV cap. Compares monthly cashflow pre vs post and
//    lifetime interest change (debts amortized 20yr vs. their own terms).
// ============================================================================
type DebtType = 'credit-card' | 'loc' | 'car-loan' | 'other';
interface Debt {
  id: number;
  type: DebtType;
  balance: number;
  rate: number;
  minPayment: number;
}

export function RefinanceDebtConsolidation() {
  const [homeValue, setHomeValue] = useState(800000);
  const [mortgageBalance, setMortgageBalance] = useState(420000);
  const [mortgageRate, setMortgageRate] = useState(4.89);
  const [newMortgageRate, setNewMortgageRate] = useState(4.39);
  const [amortYears, setAmortYears] = useState(25);
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, type: 'credit-card', balance: 18000, rate: 21.99, minPayment: 540 },
    { id: 2, type: 'loc', balance: 22000, rate: 9.95, minPayment: 220 },
    { id: 3, type: 'car-loan', balance: 24000, rate: 7.49, minPayment: 485 },
  ]);
  const [nextId, setNextId] = useState(4);

  function addDebt() {
    setDebts([...debts, { id: nextId, type: 'other', balance: 10000, rate: 10, minPayment: 200 }]);
    setNextId(nextId + 1);
  }

  function removeDebt(id: number) {
    setDebts(debts.filter(d => d.id !== id));
  }

  function updateDebt(id: number, field: keyof Debt, value: number | string) {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d));
  }

  const totalDebts = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);

  const maxRefi = homeValue * 0.80; // 80% LTV cap for conventional refi
  const requestedRefi = mortgageBalance + totalDebts;
  const refiCap = Math.min(requestedRefi, maxRefi);
  const consolidated = Math.max(0, refiCap - mortgageBalance);
  const shortfall = Math.max(0, totalDebts - consolidated);
  const newMortgageBalance = mortgageBalance + consolidated;

  const months = amortYears * 12;
  const currentMortgagePmt = monthlyPayment(mortgageBalance, mortgageRate, months);
  const newMortgagePmt = monthlyPayment(newMortgageBalance, newMortgageRate, months);

  const preCashflow = currentMortgagePmt + totalMinPayments;
  const postCashflow = newMortgagePmt;
  const freed = preCashflow - postCashflow;

  // Lifetime interest comparison
  const currentMortgageInterest = currentMortgagePmt * months - mortgageBalance;
  const debtInterestOriginal = debts.reduce((sum, d) => {
    // assume current min payment pays off over effective term
    const r = d.rate / 100 / 12;
    if (d.minPayment <= d.balance * r) return sum + d.balance * 2; // revolver approximation
    const n = Math.log(d.minPayment / (d.minPayment - d.balance * r)) / Math.log(1 + r);
    return sum + (d.minPayment * n - d.balance);
  }, 0);
  const currentLifetime = currentMortgageInterest + debtInterestOriginal;
  const newLifetime = newMortgagePmt * months - newMortgageBalance;
  const lifetimeDiff = newLifetime - currentLifetime;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Refinance Debt Consolidation Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">Roll credit card, LOC, and car-loan debt into your mortgage at refi.</p>
      <div className="rounded-lg bg-warning-0 border border-warning-50 px-4 py-3 text-body-xs text-warning-200 mb-6">
        ⚠️ Canadian conventional refinances are capped at 80% LTV (loan-to-value). You cannot pull out more than 80% of your home's appraised value — no exceptions for federally regulated lenders.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Home Value (appraised)</Label>
          <Input value={homeValue} onChange={setHomeValue} min={100000} max={10000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Current Mortgage Balance</Label>
          <Input value={mortgageBalance} onChange={setMortgageBalance} min={0} max={10000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Current Mortgage Rate</Label>
          <Input value={mortgageRate} onChange={setMortgageRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>New Refinance Rate</Label>
          <Input value={newMortgageRate} onChange={setNewMortgageRate} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>New Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={5} max={30} step={1} suffix="yrs" />
        </div>
        <div className="flex flex-col justify-end">
          <div className="text-body-xs text-muted-foreground">Max refi @ 80% LTV</div>
          <div className="text-body-md font-bold">{fmt(maxRefi)}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <Label>Other Debts to Consolidate</Label>
          <button
            onClick={addDebt}
            className="text-body-sm text-secondary-200 hover:underline"
          >
            + Add debt
          </button>
        </div>
        <div className="space-y-2">
          {debts.map(d => (
            <div key={d.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end bg-gray-25 border border-gray-100 p-3 rounded-lg">
              <div>
                <div className="text-body-xs text-muted-foreground mb-1">Type</div>
                <select
                  value={d.type}
                  onChange={e => updateDebt(d.id, 'type', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-background py-2 px-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-100"
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="loc">Line of Credit</option>
                  <option value="car-loan">Car Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <div className="text-body-xs text-muted-foreground mb-1">Balance</div>
                <Input value={d.balance} onChange={v => updateDebt(d.id, 'balance', v)} min={0} max={500000} step={500} prefix="$" />
              </div>
              <div>
                <div className="text-body-xs text-muted-foreground mb-1">Rate</div>
                <Input value={d.rate} onChange={v => updateDebt(d.id, 'rate', v)} min={0} max={35} step={0.1} suffix="%" />
              </div>
              <div>
                <div className="text-body-xs text-muted-foreground mb-1">Min Payment</div>
                <Input value={d.minPayment} onChange={v => updateDebt(d.id, 'minPayment', v)} min={0} max={10000} step={10} prefix="$" />
              </div>
              <button
                onClick={() => removeDebt(d.id)}
                className="rounded-lg border border-gray-200 py-2 px-3 text-body-sm hover:bg-warning-0 hover:text-warning-200 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {shortfall > 0 && (
        <div className="rounded-lg bg-warning-0 border border-warning-50 px-4 py-3 text-body-sm text-warning-200 mb-4">
          ⚠️ Your 80% LTV cap limits refi to {fmt(maxRefi)}. Only {fmt(consolidated)} of your {fmt(totalDebts)} in debts can be rolled in — {fmt(shortfall)} would remain as separate debt.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Pre-Consolidation Monthly" value={fmt(preCashflow)} sublabel="Mortgage + min debts" />
        <ResultCard label="Post-Consolidation Monthly" value={fmt(postCashflow)} highlight sublabel="Single new mortgage" />
        <ResultCard label="Monthly Cashflow Freed" value={fmt(freed)} highlight />
        <ResultCard label="Lifetime Interest Change" value={fmt(lifetimeDiff)} sublabel={lifetimeDiff > 0 ? 'More interest (amortized longer)' : 'Less interest'} />
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground mb-6">
        <strong className="text-foreground">The trade-off:</strong> Consolidating 21.99% credit card debt into a 4.39% mortgage slashes your monthly payment and lowers the rate dramatically — but amortizing over 25 years means you pay interest for longer. Use the freed cashflow to make prepayments against your mortgage, or you'll pay more over time than the original debt would have cost.
      </div>

      <BrokerCTA message={freed > 0
        ? `You'd free ${fmt(freed)} per month by consolidating. A broker will structure this without triggering the stress test where possible.`
        : `Your current setup may already be optimal. A broker will verify with a full refi analysis.`} />
    </div>
  );
}
