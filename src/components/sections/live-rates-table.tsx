"use client";

import React, { useState } from "react";

type ProfileFilter = "insured" | "uninsured" | "rental" | "credit";

// Rates updated manually — user will refresh this weekly.
// Source: Broker-negotiated rates aggregated June 1, 2026.
const RATES_UPDATED = "June 1, 2026";

type Row = {
  term: string;
  insured: string;
  uninsured: string;
  variable: string;
  big5: string;
  note?: string;
};

const rows: Row[] = [
  {
    term: "1-Year Fixed",
    insured: "4.74%",
    uninsured: "4.99%",
    variable: "—",
    big5: "5.04%",
    note: "Short commitment",
  },
  {
    term: "2-Year Fixed",
    insured: "4.14%",
    uninsured: "4.29%",
    variable: "—",
    big5: "4.79%",
  },
  {
    term: "3-Year Fixed",
    insured: "4.09%",
    uninsured: "4.19%",
    variable: "—",
    big5: "4.64%",
    note: "Popular balance",
  },
  {
    term: "4-Year Fixed",
    insured: "4.29%",
    uninsured: "4.44%",
    variable: "—",
    big5: "4.69%",
  },
  {
    term: "5-Year Fixed",
    insured: "4.09%",
    uninsured: "4.29%",
    variable: "—",
    big5: "4.52%",
    note: "Most common term",
  },
  {
    term: "5-Year Variable",
    insured: "—",
    uninsured: "—",
    variable: "3.35% (P − 1.10%)",
    big5: "4.04%",
    note: "Prime = 4.45%",
  },
];

const big5Detail = [
  { bank: "RBC", fixed5: "4.29%", var5: "3.65%" },
  { bank: "TD", fixed5: "4.59%", var5: "4.09%" },
  { bank: "Scotiabank", fixed5: "4.94%", var5: "4.00%" },
  { bank: "BMO", fixed5: "4.51%", var5: "4.53%" },
  { bank: "CIBC", fixed5: "4.29%", var5: "3.95%" },
];

const PROFILE_EXPLAINERS: Record<ProfileFilter, string> = {
  insured:
    "Insured (high-ratio) mortgages — typically best rates when CMHC/Sagen/CG insurance applies and amortization is ≤25 years.",
  uninsured:
    "Uninsured conventional — 20%+ equity at origination. Slightly higher rates than insured; switching at renewal has no stress test on straight transfers since Nov 2024.",
  rental:
    "Rental / investment properties — often +10–30 bps vs owner-occupied. Lenders may require rental income worksheets; see our rental qualifying calculator.",
  credit:
    "Credit band — best rates need 680+; 600–679 may see +10–25 bps; below 600 often requires B-lender channel. Rates shown assume strong credit unless noted.",
};

export default function LiveRatesTable() {
  const [profile, setProfile] = useState<ProfileFilter>("uninsured");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <div className="text-body-xs-medium text-secondary-100 uppercase tracking-wide mb-1">
            Live Canadian Mortgage Rates
          </div>
          <h2 className="text-heading-3 mb-1">Best Renewal Rates Today</h2>
          <p className="text-body-sm text-muted-foreground">
            Broker-negotiated rates for qualified Canadian borrowers.
          </p>
        </div>
        <div className="text-body-xs text-muted-foreground flex-shrink-0">
          <div className="font-semibold text-foreground">Updated: {RATES_UPDATED}</div>
          <div>Refreshed weekly</div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["insured", "Insured"],
            ["uninsured", "Uninsured"],
            ["rental", "Rental"],
            ["credit", "Credit band"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setProfile(id)}
            className={`rounded-full px-3 py-1.5 text-body-xs font-medium transition-colors ${
              profile === id
                ? "bg-secondary-100 text-white"
                : "bg-gray-25 border border-gray-100 text-muted-foreground hover:border-secondary-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-body-sm text-muted-foreground mb-4 rounded-lg bg-gray-25 border border-gray-100 p-3">
        {PROFILE_EXPLAINERS[profile]}
      </p>

      <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
        <table className="w-full border-collapse text-body-sm min-w-[640px]">
          <thead>
            <tr className="bg-primary-100 text-white">
              <th className="text-left p-3 rounded-tl-lg">Term</th>
              <th className="text-left p-3">Best Insured</th>
              <th className="text-left p-3">Best Uninsured</th>
              <th className="text-left p-3">Best Variable</th>
              <th className="text-left p-3 rounded-tr-lg">Big 5 Avg</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.term} className={i % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                <td className="p-3 font-semibold">
                  {r.term}
                  {r.note && (
                    <div className="text-body-xs text-muted-foreground font-normal mt-0.5">
                      {r.note}
                    </div>
                  )}
                </td>
                <td className="p-3 text-secondary-200 font-semibold">{r.insured}</td>
                <td className="p-3 text-secondary-200 font-semibold">{r.uninsured}</td>
                <td className="p-3 text-secondary-200 font-semibold">{r.variable}</td>
                <td className="p-3 text-muted-foreground">{r.big5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-lg bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground">
        <strong className="text-foreground">Methodology:</strong> Broker-negotiated rates for qualified
        borrowers, refreshed manually weekly. Posted bank renewal letters are typically{" "}
        <strong>0.5%–1.0% higher</strong>. Your rate depends on profile ({profile}), LTV, and income.{" "}
        <a href="/my-renewal-plan/" className="text-secondary-100 hover:underline">
          Build your renewal plan
        </a>{" "}
        or see{" "}
        <a href="/pricing/" className="text-secondary-100 hover:underline">
          how broker pricing works
        </a>
        .
      </div>

      <details className="mt-4 rounded-lg border border-gray-100 p-4 text-body-sm">
        <summary className="cursor-pointer font-semibold">Big 5 Bank 5-Year Rates (June 2026)</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-gray-100">
                <th className="py-2">Bank</th>
                <th className="py-2">5-Yr Fixed</th>
                <th className="py-2">5-Yr Variable</th>
              </tr>
            </thead>
            <tbody>
              {big5Detail.map((b) => (
                <tr key={b.bank} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 font-medium">{b.bank}</td>
                  <td className="py-2">{b.fixed5}</td>
                  <td className="py-2">{b.var5}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-body-xs text-muted-foreground">
            Big 5 special/discounted 5-year rates as of late May 2026. Posted rates are higher.
          </p>
        </div>
      </details>

      <div className="mt-5 rounded-xl bg-primary-0 border border-primary-25 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-body-sm-medium text-primary-200">
            Get your personalized rate from 30+ Canadian lenders.
          </p>
          <p className="text-body-xs text-muted-foreground mt-1">
            Bank of Canada overnight rate: 2.25% · Prime: 4.45% · Next BoC decision: June 10, 2026
          </p>
        </div>
        <a
          href="/book-a-call/"
          className="flex-shrink-0 rounded-lg bg-primary-100 text-white px-5 py-2.5 text-body-sm-medium hover:opacity-90 transition-opacity"
        >
          Book Free Rate Review
        </a>
      </div>
    </div>
  );
}
