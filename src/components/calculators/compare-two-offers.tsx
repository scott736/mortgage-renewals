import React, { useState } from "react";

function effectiveMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = effectiveMonthlyRate(annualRate);
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function fmt(n: number): string {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-body-sm-medium text-foreground mb-1">{children}</label>;
}

function Input({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
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
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full rounded-lg border border-gray-200 bg-background py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100 ${prefix ? "pl-8" : "pl-3"} ${suffix ? "pr-8" : "pr-3"}`}
      />
      {suffix && <span className="absolute right-3 text-muted-foreground text-body-sm">{suffix}</span>}
    </div>
  );
}

/** Compare two renewal offers: 5-year interest savings vs one-time switch costs */
export function CompareTwoOffers() {
  const [balance, setBalance] = useState(500000);
  const [amortYears, setAmortYears] = useState(22);
  const [rateA, setRateA] = useState(4.89);
  const [rateB, setRateB] = useState(4.19);
  const [switchCosts, setSwitchCosts] = useState(750);

  const termMonths = 60;
  const amortMonths = amortYears * 12;
  const pmtA = monthlyPayment(balance, rateA, amortMonths);
  const pmtB = monthlyPayment(balance, rateB, amortMonths);
  const monthlySaving = pmtA - pmtB;
  const fiveYearGross = monthlySaving * termMonths;
  const fiveYearNet = fiveYearGross - switchCosts;
  const breakEvenMonths =
    monthlySaving > 0 ? Math.ceil(switchCosts / monthlySaving) : Infinity;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Compare Two Renewal Offers</h3>
      <p className="text-body-sm text-muted-foreground mb-6">
        Enter your balance, two rates, and switching costs to see 5-year savings and break-even on fees.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Label>Mortgage Balance</Label>
          <Input value={balance} onChange={setBalance} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label>Amortization (years)</Label>
          <Input value={amortYears} onChange={setAmortYears} min={1} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label>Offer A — rate (e.g. bank renewal)</Label>
          <Input value={rateA} onChange={setRateA} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label>Offer B — rate (e.g. broker quote)</Label>
          <Input value={rateB} onChange={setRateB} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
      </div>

      <div className="mb-6 max-w-xs">
        <Label>One-time switch costs (legal, discharge, title)</Label>
        <Input value={switchCosts} onChange={setSwitchCosts} min={0} max={5000} step={50} prefix="$" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 border bg-gray-25 border-gray-100">
          <div className="text-body-xs text-muted-foreground mb-1">Monthly payment difference</div>
          <div className="text-2xl font-bold text-foreground">{fmt(monthlySaving)}/mo</div>
        </div>
        <div className="rounded-xl p-4 border bg-secondary-25 border-secondary-50">
          <div className="text-body-xs text-muted-foreground mb-1">5-year gross savings</div>
          <div className="text-2xl font-bold text-secondary-200">{fmt(fiveYearGross)}</div>
        </div>
        <div className="rounded-xl p-4 border bg-secondary-25 border-secondary-50">
          <div className="text-body-xs text-muted-foreground mb-1">5-year net (after switch costs)</div>
          <div className="text-2xl font-bold text-secondary-200">{fmt(fiveYearNet)}</div>
        </div>
        <div className="rounded-xl p-4 border bg-gray-25 border-gray-100">
          <div className="text-body-xs text-muted-foreground mb-1">Break-even on switch costs</div>
          <div className="text-2xl font-bold text-foreground">
            {breakEvenMonths === Infinity ? "—" : `${breakEvenMonths} mo`}
          </div>
        </div>
      </div>

      <p className="mt-4 text-body-xs text-muted-foreground">
        Assumes 5-year term, level payments, Canadian semi-annual compounding. Offer B wins on net savings when the net figure is positive.
      </p>
    </div>
  );
}
