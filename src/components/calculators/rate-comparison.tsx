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
// Rate Comparison Calculator (up to 4 scenarios)
//    Calculates monthly payment, interest paid over term, end-of-term balance,
//    total cost over term (payments + upfront costs), ranks cheapest.
// ============================================================================
interface Scenario {
  id: number;
  name: string;
  rate: number;
  termYears: number;
  upfrontCosts: number;
}

export function RateComparison() {
  const [balance, setBalance] = useState(500000);
  const [amortYears, setAmortYears] = useState(25);
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 1, name: 'Scenario A — Bank renewal offer', rate: 4.89, termYears: 5, upfrontCosts: 0 },
    { id: 2, name: 'Scenario B — Broker switch', rate: 4.19, termYears: 5, upfrontCosts: 550 },
    { id: 3, name: 'Scenario C — 3-yr fixed', rate: 3.99, termYears: 3, upfrontCosts: 550 },
    { id: 4, name: 'Scenario D — Variable', rate: 4.59, termYears: 5, upfrontCosts: 550 },
  ]);

  function updateScenario(id: number, field: keyof Scenario, value: number | string) {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  const amortMonths = amortYears * 12;

  const results = scenarios.map(s => {
    const termMonths = s.termYears * 12;
    const pmt = monthlyPayment(balance, s.rate, amortMonths);

    // End-of-term balance: amortize balance at rate for termMonths
    const rMonthly = effectiveMonthlyRate(s.rate);
    let bal = balance;
    for (let i = 0; i < termMonths; i++) {
      bal = bal * (1 + rMonthly) - pmt;
    }
    const endBalance = Math.max(0, bal);
    const interestPaid = pmt * termMonths - (balance - endBalance);
    const totalCost = pmt * termMonths + s.upfrontCosts;

    return {
      ...s,
      monthlyPmt: pmt,
      endBalance,
      interestPaid,
      totalCost,
      totalCostNetOfBalance: totalCost - (balance - endBalance), // true "cost" = interest + upfront
    };
  });

  // Rank by total cost net of equity build
  const ranked = [...results].sort((a, b) => a.totalCostNetOfBalance - b.totalCostNetOfBalance);
  const winner = ranked[0];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Mortgage Rate Comparison Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-6">Compare up to 4 scenarios side by side with upfront costs factored in.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Amortization</Label>
          <Input value={amortYears} onChange={setAmortYears} min={5} max={30} step={1} suffix="yrs" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {scenarios.map(s => (
          <div key={s.id} className="border border-gray-100 rounded-lg p-4 bg-gray-25">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <div className="text-body-xs text-muted-foreground mb-1">Name / Lender</div>
                <input
                  type="text"
                  value={s.name}
                  onChange={e => updateScenario(s.id, 'name', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-background py-2 px-3 text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-100"
                />
              </div>
              <div>
                <div className="text-body-xs text-muted-foreground mb-1">Rate</div>
                <Input value={s.rate} onChange={v => updateScenario(s.id, 'rate', v)} min={0.5} max={15} step={0.05} suffix="%" />
              </div>
              <div>
                <div className="text-body-xs text-muted-foreground mb-1">Term</div>
                <Input value={s.termYears} onChange={v => updateScenario(s.id, 'termYears', v)} min={1} max={10} step={1} suffix="yrs" />
              </div>
              <div>
                <div className="text-body-xs text-muted-foreground mb-1">Upfront Costs</div>
                <Input value={s.upfrontCosts} onChange={v => updateScenario(s.id, 'upfrontCosts', v)} min={0} max={50000} step={50} prefix="$" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-body-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Rank</th>
              <th className="p-3">Scenario</th>
              <th className="p-3">Monthly</th>
              <th className="p-3">End-of-Term Balance</th>
              <th className="p-3">Interest + Upfront</th>
              <th className="p-3">vs. Winner</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => {
              const diff = r.totalCostNetOfBalance - winner.totalCostNetOfBalance;
              return (
                <tr key={r.id} className={`border-b border-gray-100 ${i === 0 ? 'bg-secondary-25' : i % 2 === 0 ? 'bg-gray-25' : ''}`}>
                  <td className="p-3 font-bold">{i + 1}{i === 0 ? ' ⭐' : ''}</td>
                  <td className="p-3">{r.name} <span className="text-body-xs text-muted-foreground">({fmtPct(r.rate)}, {r.termYears}yr)</span></td>
                  <td className="p-3">{fmt(r.monthlyPmt)}</td>
                  <td className="p-3">{fmt(r.endBalance)}</td>
                  <td className="p-3 font-medium">{fmt(r.interestPaid + r.upfrontCosts)}</td>
                  <td className="p-3">{i === 0 ? <span className="text-secondary-200 font-medium">winner</span> : <span className="text-warning-200">+{fmt(diff)}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <ResultCard label="Cheapest Option" value={winner.name.length > 20 ? winner.name.substring(0, 20) + '…' : winner.name} highlight sublabel={`${fmtPct(winner.rate)} · ${winner.termYears}yr`} />
        <ResultCard label="Total Cost Over Term" value={fmt(winner.totalCost)} highlight sublabel="Payments + upfront" />
        <ResultCard label="Interest + Upfront" value={fmt(winner.interestPaid + winner.upfrontCosts)} sublabel="True borrowing cost" />
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground mb-6">
        <strong className="text-foreground">Why terms matter:</strong> A 3-year fixed at 3.99% looks cheaper than a 5-year at 4.19%, but you face renewal risk in 3 years. If rates jump to 6% by then, your 5-year scenario wins overall. This calculator only compares the term you enter — it doesn't forecast renewal rates. Talk to a broker for a full rate-cycle strategy.
      </div>

      <BrokerCTA message={`${winner.name} is your cheapest option at ${fmt(winner.interestPaid + winner.upfrontCosts)} over the term. A broker can verify the offer and negotiate lower upfront costs.`} />
    </div>
  );
}
