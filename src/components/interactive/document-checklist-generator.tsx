"use client";

import React, { useMemo, useState } from "react";

type IncomeType = "salaried" | "self_employed" | "rental";
type LenderPath = "same" | "switch";
type YesNo = "yes" | "no";

type Answers = {
  incomeType?: IncomeType;
  lenderPath?: LenderPath;
  coSigner?: YesNo;
  investmentProperty?: YesNo;
  helocOrSecond?: YesNo;
};

type Category =
  | "Identification"
  | "Income Verification"
  | "Property & Title"
  | "Liabilities & Credit"
  | "Insurance"
  | "Lender-Specific";

type ChecklistItem = {
  category: Category;
  text: string;
  note?: string;
};

function buildChecklist(a: Answers): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // Identification — always required
  items.push({
    category: "Identification",
    text: "Government-issued photo ID (driver's licence or passport) for every borrower on title",
  });
  items.push({
    category: "Identification",
    text: "Secondary ID (credit card, health card with photo, or utility bill) — FINTRAC dual-ID rule",
  });
  items.push({
    category: "Identification",
    text: "Social Insurance Number (SIN) — required for credit bureau pull",
  });

  // Income — depends on income type
  if (a.incomeType === "salaried") {
    items.push({
      category: "Income Verification",
      text: "Two most recent pay stubs (must be dated within last 30 days)",
      note: "Pay stubs older than 30 days will be rejected and need to be refreshed.",
    });
    items.push({
      category: "Income Verification",
      text: "Employment letter on company letterhead — stating position, start date, salary/hourly rate, and employment status (permanent full-time)",
      note: "Dated within last 30 days. Must include HR or direct supervisor signature and phone number for verification.",
    });
    items.push({
      category: "Income Verification",
      text: "Most recent Notice of Assessment (NOA) from CRA — current tax year",
    });
    items.push({
      category: "Income Verification",
      text: "T4 slip (most recent year)",
    });
  } else if (a.incomeType === "self_employed") {
    items.push({
      category: "Income Verification",
      text: "Two most recent years of personal T1 General tax returns (all pages, all schedules)",
      note: "OSFI B-20 requires 2-year minimum income history for self-employed borrowers.",
    });
    items.push({
      category: "Income Verification",
      text: "Two most recent years of CRA Notices of Assessment (NOAs) — showing no balance owing",
      note: "If you owe CRA, have proof of payment plan or full payment before submitting.",
    });
    items.push({
      category: "Income Verification",
      text: "T2125 (Statement of Business or Professional Activities) — two years, if sole proprietor",
    });
    items.push({
      category: "Income Verification",
      text: "Business financial statements — two years (prepared by accountant if incorporated)",
    });
    items.push({
      category: "Income Verification",
      text: "Articles of incorporation / GST registration / business licence — proof business has been active 2+ years",
    });
    items.push({
      category: "Income Verification",
      text: "Last 6 months business bank statements",
    });
  } else if (a.incomeType === "rental") {
    items.push({
      category: "Income Verification",
      text: "Two most recent years of T1 General tax returns with T776 (Statement of Real Estate Rentals)",
    });
    items.push({
      category: "Income Verification",
      text: "Two most recent CRA Notices of Assessment",
    });
    items.push({
      category: "Income Verification",
      text: "Current signed lease agreement(s) for each rental unit",
      note: "Month-to-month arrangements typically require a tenant affidavit instead.",
    });
    items.push({
      category: "Income Verification",
      text: "Last 3 months of rent receipts or bank deposit records showing rent collection",
    });
    items.push({
      category: "Income Verification",
      text: "Primary employment income documents (pay stubs + employment letter + NOA) if you also have W-2 income",
    });
  }

  // Property & title — always
  items.push({
    category: "Property & Title",
    text: "Most recent property tax bill — showing current-year assessment and payment status",
  });
  items.push({
    category: "Property & Title",
    text: "Most recent mortgage statement from current lender (shows balance, rate, maturity date, and payment)",
  });
  items.push({
    category: "Property & Title",
    text: "Property insurance policy — declarations page showing coverage, lender as loss payee",
  });
  if (a.lenderPath === "switch") {
    items.push({
      category: "Property & Title",
      text: "Current lender's payout / discharge statement (broker or lawyer will request)",
      note: "Required to register the new mortgage — triggered 30–45 days before close.",
    });
    items.push({
      category: "Property & Title",
      text: "Appraisal — new lender may waive for insured switches but typically orders one for conventional",
    });
  }
  if (a.investmentProperty === "yes") {
    items.push({
      category: "Property & Title",
      text: "Purchase agreement or original MLS listing (proves purchase price)",
    });
    items.push({
      category: "Property & Title",
      text: "Most recent appraisal, if completed within last 12 months",
    });
  }

  // Liabilities & credit
  items.push({
    category: "Liabilities & Credit",
    text: "List of all liabilities: credit card limits + balances, lines of credit, car loans, student loans, child support / alimony",
  });
  items.push({
    category: "Liabilities & Credit",
    text: "Most recent statements for any loan with a balance (proves monthly payment)",
  });
  if (a.helocOrSecond === "yes") {
    items.push({
      category: "Liabilities & Credit",
      text: "HELOC or second mortgage statement — current balance, limit, interest rate, and payment",
      note: "Critical for TDS ratio calculation. HELOC is stress-tested at contract rate + 2% even if balance is zero.",
    });
    items.push({
      category: "Liabilities & Credit",
      text: "Second-mortgage discharge statement if you plan to consolidate into the new renewal",
    });
  }
  if (a.coSigner === "yes") {
    items.push({
      category: "Liabilities & Credit",
      text: "Co-signer / guarantor: full ID, income, and credit documentation (same list as primary borrower)",
      note: "Some lenders require co-signers to attend signing in person.",
    });
    items.push({
      category: "Liabilities & Credit",
      text: "Co-signer: statement of assets and liabilities",
    });
  }

  // Insurance
  items.push({
    category: "Insurance",
    text: "Home insurance binder or renewal — valid through the closing date with new lender listed as loss payee",
  });
  if (a.investmentProperty === "yes") {
    items.push({
      category: "Insurance",
      text: "Landlord / rented-dwelling insurance policy (not homeowner policy)",
    });
  }

  // Lender-specific
  if (a.lenderPath === "same") {
    items.push({
      category: "Lender-Specific",
      text: "Renewal letter from your current lender (has the offered rate and term)",
    });
    items.push({
      category: "Lender-Specific",
      text: "Competing quote or broker quote (for negotiation leverage)",
    });
  } else {
    items.push({
      category: "Lender-Specific",
      text: "Void cheque or pre-authorized debit (PAD) form — for payment setup at new lender",
    });
    items.push({
      category: "Lender-Specific",
      text: "Lawyer / notary contact details (for funds disbursement)",
    });
  }

  return items;
}

const CATEGORY_ORDER: Category[] = [
  "Identification",
  "Income Verification",
  "Property & Title",
  "Liabilities & Credit",
  "Insurance",
  "Lender-Specific",
];

export default function DocumentChecklistGenerator() {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");

  const checklist = useMemo(() => buildChecklist(answers), [answers]);

  const grouped = useMemo(() => {
    const map = new Map<Category, ChecklistItem[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const item of checklist) {
      map.get(item.category)?.push(item);
    }
    return map;
  }, [checklist]);

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function canGenerate(): boolean {
    return !!(
      answers.incomeType &&
      answers.lenderPath &&
      answers.coSigner &&
      answers.investmentProperty &&
      answers.helocOrSecond
    );
  }

  function handleGenerate() {
    if (canGenerate()) setSubmitted(true);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setCopyMsg("");
  }

  function handlePrint() {
    if (typeof window !== "undefined") window.print();
  }

  async function handleCopy() {
    const text = CATEGORY_ORDER.flatMap((cat) => {
      const items = grouped.get(cat) || [];
      if (items.length === 0) return [];
      return [
        "",
        cat.toUpperCase(),
        "".padEnd(cat.length, "-"),
        ...items.map((i) => `[ ] ${i.text}${i.note ? `\n    Note: ${i.note}` : ""}`),
      ];
    }).join("\n");
    const header = `MortgageRenewalHub.ca — Personalised Renewal Document Checklist\nGenerated: ${new Date().toLocaleDateString("en-CA")}\n`;
    try {
      await navigator.clipboard.writeText(header + text);
      setCopyMsg("Copied to clipboard.");
      setTimeout(() => setCopyMsg(""), 2500);
    } catch {
      setCopyMsg("Copy failed — please select and copy manually.");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm print:border-0 print:shadow-none">
      {!submitted && (
        <>
          <h2 className="text-heading-4 font-bold mb-2">Generate your personalised checklist</h2>
          <p className="text-body-sm text-muted-foreground mb-6">
            Answer five short questions. We'll produce a tailored document list you can print or copy.
          </p>

          <div className="space-y-6">
            <Field label="1. Are you salaried, self-employed, or a rental-income earner?">
              <div className="grid sm:grid-cols-3 gap-2">
                <Choice active={answers.incomeType === "salaried"} onClick={() => update("incomeType", "salaried")}>Salaried (T4)</Choice>
                <Choice active={answers.incomeType === "self_employed"} onClick={() => update("incomeType", "self_employed")}>Self-employed</Choice>
                <Choice active={answers.incomeType === "rental"} onClick={() => update("incomeType", "rental")}>Rental income</Choice>
              </div>
            </Field>

            <Field label="2. Are you renewing with your same lender, or switching?">
              <div className="grid sm:grid-cols-2 gap-2">
                <Choice active={answers.lenderPath === "same"} onClick={() => update("lenderPath", "same")}>Same lender</Choice>
                <Choice active={answers.lenderPath === "switch"} onClick={() => update("lenderPath", "switch")}>Switching to a new lender</Choice>
              </div>
            </Field>

            <Field label="3. Do you have a co-signer or guarantor on the mortgage?">
              <div className="grid sm:grid-cols-2 gap-2">
                <Choice active={answers.coSigner === "yes"} onClick={() => update("coSigner", "yes")}>Yes</Choice>
                <Choice active={answers.coSigner === "no"} onClick={() => update("coSigner", "no")}>No</Choice>
              </div>
            </Field>

            <Field label="4. Is this an investment / rental property (not your principal residence)?">
              <div className="grid sm:grid-cols-2 gap-2">
                <Choice active={answers.investmentProperty === "yes"} onClick={() => update("investmentProperty", "yes")}>Yes</Choice>
                <Choice active={answers.investmentProperty === "no"} onClick={() => update("investmentProperty", "no")}>No</Choice>
              </div>
            </Field>

            <Field label="5. Do you have an existing HELOC or second mortgage on the property?">
              <div className="grid sm:grid-cols-2 gap-2">
                <Choice active={answers.helocOrSecond === "yes"} onClick={() => update("helocOrSecond", "yes")}>Yes</Choice>
                <Choice active={answers.helocOrSecond === "no"} onClick={() => update("helocOrSecond", "no")}>No</Choice>
              </div>
            </Field>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate()}
              className="w-full rounded-lg bg-primary-100 text-white font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate My Checklist
            </button>
            {!canGenerate() && (
              <p className="text-body-xs text-muted-foreground text-center">
                Answer all five questions to generate your list.
              </p>
            )}
          </div>
        </>
      )}

      {submitted && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
            <h2 className="text-heading-4 font-bold">Your Personalised Checklist</h2>
            <div className="flex gap-2 text-body-sm">
              <button
                onClick={handlePrint}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium hover:bg-gray-25 transition-colors"
              >
                Print
              </button>
              <button
                onClick={handleCopy}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium hover:bg-gray-25 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium hover:bg-gray-25 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          {copyMsg && (
            <p className="text-body-xs text-secondary-200 mb-3 print:hidden">{copyMsg}</p>
          )}

          <p className="text-body-xs text-muted-foreground mb-4 print:text-body-sm">
            Generated {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })} ·
            MortgageRenewalHub.ca
          </p>

          <div className="space-y-6">
            {CATEGORY_ORDER.map((cat) => {
              const items = grouped.get(cat) || [];
              if (items.length === 0) return null;
              return (
                <div key={cat} className="rounded-xl border border-gray-100 p-5 print:border-gray-300 print:break-inside-avoid">
                  <h3 className="font-semibold mb-3 text-secondary-200">{cat}</h3>
                  <ul className="space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-body-sm">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300"
                          aria-label={item.text}
                        />
                        <div>
                          <div>{item.text}</div>
                          {item.note && (
                            <div className="text-body-xs text-muted-foreground mt-1">
                              <strong>Note:</strong> {item.note}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg bg-secondary-25 border border-secondary-50 p-4 print:hidden">
            <p className="text-body-sm">
              <strong>Need help gathering these?</strong> A licensed mortgage broker will provide a secure
              upload portal and walk you through each document.{" "}
              <a href="/book-a-call/" className="text-secondary-200 underline font-medium">
                Book a free call
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-body-sm-medium mb-2">{label}</label>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border px-4 py-3 text-body-sm-medium transition-colors text-left ${
        active
          ? "border-secondary-100 bg-secondary-25 text-secondary-200"
          : "border-gray-200 bg-white hover:border-secondary-50 hover:bg-gray-25"
      }`}
    >
      {children}
    </button>
  );
}
