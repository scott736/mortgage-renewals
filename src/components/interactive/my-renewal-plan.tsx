"use client";

import React, { useMemo } from "react";

import { usePatchState } from "@/hooks/use-patch-state";

const LENDERS = [
  { id: "", label: "— Select lender —" },
  { id: "rbc", label: "RBC" },
  { id: "td", label: "TD (collateral charge)" },
  { id: "scotiabank", label: "Scotiabank" },
  { id: "bmo", label: "BMO" },
  { id: "cibc", label: "CIBC" },
  { id: "national-bank", label: "National Bank (collateral charge)" },
  { id: "desjardins", label: "Desjardins" },
  { id: "first-national", label: "First National" },
  { id: "mcap", label: "MCAP" },
  { id: "other", label: "Other / not sure" },
];

const PROVINCES = [
  "",
  "Ontario",
  "Quebec",
  "British Columbia",
  "Alberta",
  "Manitoba",
  "Saskatchewan",
  "Atlantic",
  "Territories",
];

type ChecklistItem = { text: string; href?: string };

export default function MyRenewalPlan() {
  const [state, setState] = usePatchState({
    step: 0,
    maturityDate: "",
    lender: "",
    balance: 450000,
    province: "",
  });
  const { step, maturityDate, lender, balance, province } = state;

  const daysLeft = useMemo(() => {
    if (!maturityDate) return null;
    const t = new Date(maturityDate);
    if (Number.isNaN(t.getTime())) return null;
    return Math.round((t.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }, [maturityDate]);

  const urgency = useMemo(() => {
    if (daysLeft == null) return "unknown";
    if (daysLeft < 0) return "past";
    if (daysLeft <= 30) return "30";
    if (daysLeft <= 60) return "60";
    if (daysLeft <= 120) return "120";
    return "later";
  }, [daysLeft]);

  const collateral = lender === "td" || lender === "national-bank";

  const checklist: ChecklistItem[] = useMemo(() => {
    const base: ChecklistItem[] = [
      { text: "Confirm maturity date and charge type on your mortgage statement", href: "/what-is-a-mortgage-renewal/" },
      { text: "Pull your credit report (Equifax / TransUnion)", href: "/mortgage-renewal-checklist/" },
      { text: "Book a free broker strategy call", href: "/book-a-call/" },
    ];
    if (urgency === "30" || urgency === "past") {
      base.unshift(
        { text: "Request written renewal offer from current lender TODAY", href: "/renewal-letter-decoder/" },
        { text: "Lock a rate hold if switching — you may be inside 120 days", href: "/switch-vs-stay-calculator/" },
      );
    } else if (urgency === "60" || urgency === "120") {
      base.unshift(
        { text: "Compare switch vs. stay with real switching costs", href: "/switch-vs-stay-calculator/" },
        { text: "Generate your document checklist", href: "/renewal-document-checklist-generator/" },
      );
    } else {
      base.unshift(
        { text: "Set renewal reminder windows (6 & 4 months out)", href: "/renewal-reminder/" },
        { text: "Read the complete renewal guide", href: "/mortgage-renewal-guide/" },
      );
    }
    if (collateral) {
      base.push({
        text: "Budget $700–$1,200 legal/discharge for collateral charge switch (TD / National Bank)",
        href: "/collateral-vs-standard-charge-mortgage/",
      });
    }
    if (province === "Quebec") {
      base.push({
        text: "Plan for Quebec notary fees ($800–$1,500) on any lender switch",
        href: "/quebec-mortgage-renewal/",
      });
    }
    base.push(
      { text: "Review negotiation scripts before calling your lender", href: "/mortgage-negotiation-scripts/" },
      { text: "Compare today's market rates", href: "/best-mortgage-renewal-rates/" },
    );
    return base;
  }, [urgency, collateral, province]);

  const bookingHref = maturityDate
    ? `/book-a-call/?renewal_date=${encodeURIComponent(maturityDate)}${province ? `&province=${encodeURIComponent(province)}` : ""}`
    : "/book-a-call/";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        {(['progress-0', 'progress-1', 'progress-2'] as const).map((id, i) => (
          <div
            key={id}
            className={`h-2 flex-1 rounded-full ${i <= step ? "bg-secondary-100" : "bg-gray-100"}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <h2 className="text-heading-4">When does your mortgage mature?</h2>
          <input
            id="renewal-plan-maturity-date"
            aria-label="Mortgage maturity date"
            type="date"
            value={maturityDate}
            onChange={(e) => setState({ maturityDate: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
          />
          {daysLeft != null && (
            <p className="text-body-sm text-muted-foreground">
              {daysLeft < 0
                ? "Your maturity date is in the past — prioritize broker contact this week."
                : `${daysLeft} days until renewal`}
            </p>
          )}
          <button
            type="button"
            onClick={() => setState({ step: 1 })}
            disabled={!maturityDate}
            className="w-full rounded-lg bg-primary-100 text-white py-3 font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-heading-4">Current lender & balance</h2>
          <div>
            <label htmlFor="renewal-plan-lender" className="block text-body-sm-medium mb-1.5">Lender</label>
            <select
              id="renewal-plan-lender"
              aria-label="Lender"
              value={lender}
              onChange={(e) => setState({ lender: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
            >
              {LENDERS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="renewal-plan-balance" className="block text-body-sm-medium mb-1.5">Approximate balance ($)</label>
            <input
              id="renewal-plan-balance"
              aria-label="Approximate balance ($)"
              type="number"
              value={balance}
              min={50000}
              step={5000}
              onChange={(e) => setState({ balance: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
            />
          </div>
          <div>
            <label htmlFor="renewal-plan-province" className="block text-body-sm-medium mb-1.5">Province</label>
            <select
              id="renewal-plan-province"
              aria-label="Province"
              value={province}
              onChange={(e) => setState({ province: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p || "— Select —"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setState({ step: 0 })} className="flex-1 rounded-lg border py-3 font-semibold">
              Back
            </button>
            <button
              type="button"
              onClick={() => setState({ step: 2 })}
              disabled={!lender}
              className="flex-1 rounded-lg bg-primary-100 text-white py-3 font-semibold disabled:opacity-50"
            >
              See my plan
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-heading-4">Your renewal plan</h2>
          <p className="text-body-sm text-muted-foreground">
            Personalized checklist for a ${balance.toLocaleString("en-CA")} mortgage
            {lender ? ` with ${LENDERS.find((l) => l.id === lender)?.label}` : ""}.
          </p>
          <ul className="space-y-2 text-body-sm">
            {checklist.map((item) => (
              <li key={item.text} className="flex gap-2">
                <span className="text-secondary-100">•</span>
                {item.href ? (
                  <a href={item.href} className="text-secondary-100 hover:underline">
                    {item.text}
                  </a>
                ) : (
                  <span>{item.text}</span>
                )}
              </li>
            ))}
          </ul>
          <a
            href={bookingHref}
            className="block rounded-lg bg-primary-100 text-white py-3 text-center font-semibold hover:opacity-90"
          >
            Book free strategy call
          </a>
          <button type="button" onClick={() => setState({ step: 0 })} className="w-full text-body-sm text-muted-foreground">
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
