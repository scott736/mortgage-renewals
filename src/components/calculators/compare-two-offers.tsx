import React from "react";

import { Input, Label } from '@/components/calculators/calculator-ui';
import { usePatchState } from '@/hooks/use-patch-state';
import { fmt, monthlyPayment } from '@/lib/mortgage-math';

/** Compare two renewal offers: 5-year interest savings vs one-time switch costs */
export function CompareTwoOffers() {
  const [state, setState] = usePatchState({
    balance: 500000,
    amortYears: 22,
    rateA: 4.89,
    rateB: 4.19,
    switchCosts: 750,
  });
  const { balance, amortYears, rateA, rateB, switchCosts } = state;

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
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="amortization-years">Amortization (years)</Label>
          <Input id="amortization-years" aria-label="Amortization (years)" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label htmlFor="offer-a-rate-e-g-bank-renewal">Offer A, rate (e.g. bank renewal)</Label>
          <Input id="offer-a-rate-e-g-bank-renewal" aria-label="Offer A, rate (e.g. bank renewal)" value={rateA} onChange={(v) => setState({ rateA: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="offer-b-rate-e-g-broker-quote">Offer B, rate (e.g. broker quote)</Label>
          <Input id="offer-b-rate-e-g-broker-quote" aria-label="Offer B, rate (e.g. broker quote)" value={rateB} onChange={(v) => setState({ rateB: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
      </div>

      <div className="mb-6 max-w-xs">
        <Label htmlFor="one-time-switch-costs-legal-discharge-title">One-time switch costs (legal, discharge, title)</Label>
        <Input id="one-time-switch-costs-legal-discharge-title" aria-label="One-time switch costs (legal, discharge, title)" value={switchCosts} onChange={(v) => setState({ switchCosts: v })} min={0} max={5000} step={50} prefix="$" />
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
            {breakEvenMonths === Infinity ? "N/A" : `${breakEvenMonths} mo`}
          </div>
        </div>
      </div>

      <p className="mt-4 text-body-xs text-muted-foreground">
        Assumes 5-year term, level payments, Canadian semi-annual compounding. Offer B wins on net savings when the net figure is positive.
      </p>
    </div>
  );
}
