"use client";

import React, { useState } from "react";

type ProfileFilter = "insured" | "uninsured" | "rental" | "credit";
type Locale = "en" | "fr";

// Rates updated manually — user will refresh this weekly.
const RATES_UPDATED = "July 5, 2026";
const RATES_UPDATED_FR = "5 juillet 2026";

type Row = {
  term: string;
  termFr: string;
  insured: string;
  uninsured: string;
  rental: string;
  creditBand: string;
  variable: string;
  big5: string;
  note?: string;
  noteFr?: string;
};

const rows: Row[] = [
  {
    term: "1-Year Fixed",
    termFr: "Fixe 1 an",
    insured: "4.74%",
    uninsured: "4.99%",
    rental: "5.09%",
    creditBand: "5.24%",
    variable: "—",
    big5: "5.04%",
    note: "Short commitment",
    noteFr: "Court engagement",
  },
  {
    term: "2-Year Fixed",
    termFr: "Fixe 2 ans",
    insured: "4.14%",
    uninsured: "4.29%",
    rental: "4.39%",
    creditBand: "4.54%",
    variable: "—",
    big5: "4.79%",
  },
  {
    term: "3-Year Fixed",
    termFr: "Fixe 3 ans",
    insured: "4.09%",
    uninsured: "4.19%",
    rental: "4.29%",
    creditBand: "4.44%",
    variable: "—",
    big5: "4.64%",
    note: "Popular balance",
    noteFr: "Équilibre populaire",
  },
  {
    term: "4-Year Fixed",
    termFr: "Fixe 4 ans",
    insured: "4.29%",
    uninsured: "4.44%",
    rental: "4.54%",
    creditBand: "4.69%",
    variable: "—",
    big5: "4.69%",
  },
  {
    term: "5-Year Fixed",
    termFr: "Fixe 5 ans",
    insured: "4.04%",
    uninsured: "4.24%",
    rental: "4.34%",
    creditBand: "4.49%",
    variable: "—",
    big5: "4.52%",
    note: "Most common term",
    noteFr: "Terme le plus courant",
  },
  {
    term: "5-Year Variable",
    termFr: "Variable 5 ans",
    insured: "—",
    uninsured: "—",
    rental: "—",
    creditBand: "—",
    variable: "3.35% (P − 1.10%)",
    big5: "4.04%",
    note: "Prime = 4.45%",
    noteFr: "Taux préférentiel = 4,45 %",
  },
];

const big5Detail = [
  { bank: "RBC", fixed5: "4.29%", var5: "3.65%" },
  { bank: "TD", fixed5: "4.59%", var5: "4.09%" },
  { bank: "Scotiabank", fixed5: "4.94%", var5: "4.00%" },
  { bank: "BMO", fixed5: "4.51%", var5: "4.53%" },
  { bank: "CIBC", fixed5: "4.29%", var5: "3.95%" },
];

const PROFILE_EXPLAINERS: Record<Locale, Record<ProfileFilter, string>> = {
  en: {
    insured:
      "Insured (high-ratio) mortgages — typically best rates when CMHC/Sagen/CG insurance applies and amortization is ≤25 years.",
    uninsured:
      "Uninsured conventional — 20%+ equity at origination. Slightly higher rates than insured; switching at renewal has no stress test on straight transfers since Nov 2024.",
    rental:
      "Rental / investment properties — often +10–30 bps vs owner-occupied. Lenders may require rental income worksheets; see our rental qualifying calculator.",
    credit:
      "Credit band 600–679 — typically +10–25 bps vs best-available. Below 600 often requires B-lender channel. Best rates need 680+.",
  },
  fr: {
    insured:
      "Hypothèques assurées (ratio élevé) — généralement les meilleurs taux lorsque l'assurance CMHC/Sagen/CG s'applique et que l'amortissement est ≤25 ans.",
    uninsured:
      "Conventionnelles non assurées — 20 %+ d'équité à l'origine. Taux un peu plus élevés; depuis nov. 2024, un transfert simple au renouvellement n'exige plus le test de stress.",
    rental:
      "Propriétés locatives — souvent +10–30 pdb vs propriétaire-occupant. Les prêteurs peuvent exiger une feuille de revenus locatifs.",
    credit:
      "Cote de crédit 600–679 — typiquement +10–25 pdb vs les meilleurs taux. Sous 600, canal B souvent requis. Meilleurs taux : 680+.",
  },
};

function profileRate(row: Row, profile: ProfileFilter): string {
  if (row.term.includes("Variable")) return row.variable;
  switch (profile) {
    case "insured":
      return row.insured;
    case "uninsured":
      return row.uninsured;
    case "rental":
      return row.rental;
    case "credit":
      return row.creditBand;
  }
}

type LiveRatesTableProps = {
  locale?: Locale;
};

export default function LiveRatesTable({ locale = "en" }: LiveRatesTableProps) {
  const [profile, setProfile] = useState<ProfileFilter>("uninsured");
  const fr = locale === "fr";

  const labels = fr
    ? {
        eyebrow: "Taux hypothécaires canadiens",
        title: "Meilleurs taux de renouvellement aujourd'hui",
        subtitle: "Taux négociés par courtier pour emprunteurs qualifiés.",
        updated: `Mis à jour : ${RATES_UPDATED_FR}`,
        refreshed: "Actualisé chaque semaine",
        profiles: [
          ["insured", "Assuré"],
          ["uninsured", "Non assuré"],
          ["rental", "Locatif"],
          ["credit", "Cote de crédit"],
        ] as const,
        term: "Terme",
        bestForProfile: "Meilleur taux (profil)",
        variable: "Meilleur variable",
        big5: "Moy. Big 5",
        methodologyTitle: "Méthodologie :",
        methodology:
          "Taux négociés par courtier pour emprunteurs qualifiés, actualisés manuellement chaque semaine. Les lettres de renouvellement des banques sont typiquement 0,5 %–1,0 % plus élevées. Votre taux dépend du profil, du ratio prêt-valeur et du revenu.",
        planLink: "Élaborez votre plan de renouvellement",
        pricingLink: "comment fonctionne la tarification du courtier",
        big5Summary: "Taux Big 5 — 5 ans (mai 2026)",
        bank: "Banque",
        fixed5: "Fixe 5 ans",
        var5: "Variable 5 ans",
        big5Note: "Taux spéciaux/escomptés Big 5 au 13 mai 2026. Les taux affichés sont plus élevés.",
        ctaTitle: "Obtenez votre taux personnalisé auprès de plus de 30 prêteurs canadiens.",
        boc: "Taux overnight de la Banque du Canada : 2,25 % · Préférentiel : 4,45 % · Prochaine décision : 15 juillet 2026",
        ctaButton: "Réserver une revue de taux gratuite",
        planHref: "/my-renewal-plan/",
        pricingHref: "/pricing/",
        bookHref: "/book-a-call/",
      }
    : {
        eyebrow: "Live Canadian Mortgage Rates",
        title: "Best Renewal Rates Today",
        subtitle: "Broker-negotiated rates for qualified Canadian borrowers.",
        updated: `Updated: ${RATES_UPDATED}`,
        refreshed: "Refreshed weekly",
        profiles: [
          ["insured", "Insured"],
          ["uninsured", "Uninsured"],
          ["rental", "Rental"],
          ["credit", "Credit band"],
        ] as const,
        term: "Term",
        bestForProfile: "Best for profile",
        variable: "Best Variable",
        big5: "Big 5 Avg",
        methodologyTitle: "Methodology:",
        methodology:
          "Broker-negotiated rates for qualified borrowers, refreshed manually weekly. Posted bank renewal letters are typically 0.5%–1.0% higher. Your rate depends on profile, LTV, and income.",
        planLink: "Build your renewal plan",
        pricingLink: "how broker pricing works",
        big5Summary: "Big 5 Bank 5-Year Rates (May 2026)",
        bank: "Bank",
        fixed5: "5-Yr Fixed",
        var5: "5-Yr Variable",
        big5Note: "Big 5 special/discounted 5-year rates as of May 13, 2026. Posted rates are higher.",
        ctaTitle: "Get your personalized rate from 30+ Canadian lenders.",
        boc: "Bank of Canada overnight rate: 2.25% · Prime: 4.45% · Next BoC decision: July 15, 2026",
        ctaButton: "Book Free Rate Review",
        planHref: "/my-renewal-plan/",
        pricingHref: "/pricing/",
        bookHref: "/book-a-call/",
      };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm" lang={fr ? "fr-CA" : "en-CA"}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <div className="text-body-xs-medium text-secondary-100 uppercase tracking-wide mb-1">
            {labels.eyebrow}
          </div>
          <h2 className="text-heading-3 mb-1">{labels.title}</h2>
          <p className="text-body-sm text-muted-foreground">{labels.subtitle}</p>
        </div>
        <div className="text-body-xs text-muted-foreground flex-shrink-0">
          <div className="font-semibold text-foreground">{labels.updated}</div>
          <div>{labels.refreshed}</div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {labels.profiles.map(([id, label]) => (
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
        {PROFILE_EXPLAINERS[locale][profile]}
      </p>

      <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
        <table className="w-full border-collapse text-body-sm min-w-[560px]">
          <thead>
            <tr className="bg-primary-100 text-white">
              <th className="text-left p-3 rounded-tl-lg">{labels.term}</th>
              <th className="text-left p-3">{labels.bestForProfile}</th>
              <th className="text-left p-3">{labels.variable}</th>
              <th className="text-left p-3 rounded-tr-lg">{labels.big5}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.term} className={i % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                <td className="p-3 font-semibold">
                  {fr ? r.termFr : r.term}
                  {(fr ? r.noteFr : r.note) && (
                    <div className="text-body-xs text-muted-foreground font-normal mt-0.5">
                      {fr ? r.noteFr : r.note}
                    </div>
                  )}
                </td>
                <td className="p-3 text-secondary-200 font-semibold">{profileRate(r, profile)}</td>
                <td className="p-3 text-secondary-200 font-semibold">{r.variable}</td>
                <td className="p-3 text-muted-foreground">{r.big5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-lg bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground">
        <strong className="text-foreground">{labels.methodologyTitle}</strong> {labels.methodology}{" "}
        <a href={labels.planHref} className="text-secondary-100 hover:underline">
          {labels.planLink}
        </a>{" "}
        {fr ? "ou voir" : "or see"}{" "}
        <a href={labels.pricingHref} className="text-secondary-100 hover:underline">
          {labels.pricingLink}
        </a>
        .
      </div>

      <details className="mt-4 rounded-lg border border-gray-100 p-4 text-body-sm">
        <summary className="cursor-pointer font-semibold">{labels.big5Summary}</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-gray-100">
                <th className="py-2">{labels.bank}</th>
                <th className="py-2">{labels.fixed5}</th>
                <th className="py-2">{labels.var5}</th>
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
          <p className="mt-3 text-body-xs text-muted-foreground">{labels.big5Note}</p>
        </div>
      </details>

      <div className="mt-5 rounded-xl bg-primary-0 border border-primary-25 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-body-sm-medium text-primary-200">{labels.ctaTitle}</p>
          <p className="text-body-xs text-muted-foreground mt-1">{labels.boc}</p>
        </div>
        <a
          href={labels.bookHref}
          className="flex-shrink-0 rounded-lg bg-primary-100 text-white px-5 py-2.5 text-body-sm-medium hover:opacity-90 transition-opacity"
        >
          {labels.ctaButton}
        </a>
      </div>
    </div>
  );
}
