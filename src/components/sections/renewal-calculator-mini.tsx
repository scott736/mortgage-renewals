"use client";

import { useState } from "react";

function calcMonthlyPayment(
  balance: number,
  annualRate: number,
  amortYears: number,
): number {
  if (balance <= 0 || annualRate <= 0 || amortYears <= 0) return 0;
  // Canadian mortgage: semi-annual compounding
  const r = Math.pow(1 + annualRate / 200, 1 / 6) - 1;
  const n = amortYears * 12;
  return (balance * r) / (1 - Math.pow(1 + r, -n));
}

function fmt(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

export default function RenewalCalculatorMini() {
  const [balance, setBalance] = useState(450000);
  const [rate, setRate] = useState(5.5);
  const [amort, setAmort] = useState(20);

  const monthly = calcMonthlyPayment(balance, rate, amort);
  const annual = monthly * 12;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Remaining Balance
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={balance}
              min={50000}
              max={2000000}
              step={5000}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-3 text-sm focus:border-[oklch(63%_0.130_185)] focus:outline-none focus:ring-1 focus:ring-[oklch(63%_0.130_185)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            New Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              value={rate}
              min={0.5}
              max={15}
              step={0.05}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-3 pr-7 text-sm focus:border-[oklch(63%_0.130_185)] focus:outline-none focus:ring-1 focus:ring-[oklch(63%_0.130_185)]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Amortization (years)
          </label>
          <select
            value={amort}
            onChange={(e) => setAmort(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:border-[oklch(63%_0.130_185)] focus:outline-none focus:ring-1 focus:ring-[oklch(63%_0.130_185)]"
          >
            {[5, 10, 15, 20, 25, 30].map((y) => (
              <option key={y} value={y}>{y} years</option>
            ))}
          </select>
        </div>
      </div>

      {monthly > 0 && (
        <div className="mt-6 flex flex-col items-center rounded-xl bg-[oklch(28%_0.075_235)] p-6 sm:flex-row sm:justify-around">
          <div className="text-center">
            <p className="text-sm text-white/70">Est. Monthly Payment</p>
            <p className="mt-1 text-3xl font-bold text-white">{fmt(monthly)}</p>
          </div>
          <div className="my-4 hidden h-12 w-px bg-white/20 sm:block" />
          <div className="text-center">
            <p className="text-sm text-white/70">Annual Total</p>
            <p className="mt-1 text-2xl font-bold text-white/90">{fmt(annual)}</p>
          </div>
          <div className="my-4 hidden h-12 w-px bg-white/20 sm:block" />
          <div className="text-center">
            <a
              href="/book-a-call"
              className="inline-block rounded-lg bg-[oklch(70%_0.18_85)] px-5 py-3 text-sm font-semibold text-gray-900 transition hover:opacity-90"
            >
              Get a Better Rate →
            </a>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-gray-400">
        Canadian semi-annual compounding. For educational use only — speak with a licensed broker for your exact numbers.
      </p>
    </div>
  );
}
