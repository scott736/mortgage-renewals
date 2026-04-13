"use client";

import React, { useMemo,useState } from "react";

type LenderType = "big6" | "monoline" | "credit_union" | "blender";
type CreditBand = "680plus" | "600_679" | "sub600";
type RateDiff = "low" | "mid" | "high";
type Timeline = "0_3" | "4_6" | "7plus";

type Answers = {
  lender?: LenderType;
  credit?: CreditBand;
  rateDiff?: RateDiff;
  timeline?: Timeline;
  province?: string;
};

const provinces = [
  "Ontario",
  "Quebec",
  "British Columbia",
  "Alberta",
  "Manitoba",
  "Saskatchewan",
  "Nova Scotia",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Prince Edward Island",
  "Yukon",
  "Northwest Territories",
  "Nunavut",
];

type Outcome = {
  label: "Strong Switch Case" | "Consider Switching" | "Negotiate With Current Lender" | "Stay + Re-evaluate Later";
  color: string;
  summary: string;
  actions: string[];
};

function scoreAnswers(a: Answers): Outcome {
  let score = 0;

  // Lender type
  if (a.lender === "big6") score += 3;
  else if (a.lender === "monoline") score += 1;
  else if (a.lender === "credit_union") score += 2;

  // Credit
  if (a.credit === "680plus") score += 2;
  else if (a.credit === "600_679") score += 1;
  else score += 0;

  // Rate diff
  if (a.rateDiff === "high") score += 3;
  else if (a.rateDiff === "mid") score += 2;
  else score += 0;

  // Timeline
  if (a.timeline === "4_6") score += 2;
  else if (a.timeline === "0_3") score += 1;
  else score += 0;

  // Credit under 600 overrides toward staying
  if (a.credit === "sub600") {
    return {
      label: "Negotiate With Current Lender",
      color: "bg-warning-25 border-warning-50 text-warning-200",
      summary:
        "With a credit score under 600, switching to an A-lender is difficult right now. Your current lender is required to renew you without re-qualifying — use that leverage to negotiate, and work on credit rebuilding for the next term.",
      actions: [
        "Ask your current lender for their best renewal rate in writing",
        "Pay all bills on time for 6 months before renewal",
        "Pay down credit card balances below 30% utilization",
        "A broker can review B-lender options if the rate gap is huge",
      ],
    };
  }

  if (score >= 8) {
    return {
      label: "Strong Switch Case",
      color: "bg-success-25 border-success-50 text-success-200",
      summary:
        "You have the profile, the timeline, and the rate gap that make switching clearly worthwhile. A straight switch avoids the stress test and most lenders cover legal fees.",
      actions: [
        "Get a broker rate hold locked in now (valid 120 days)",
        "Confirm you have a standard charge (not collateral) for lowest cost",
        "Use the competing offer as final leverage with your current lender",
        "Switch if your current lender can't come within 0.10% of the new quote",
      ],
    };
  }

  if (score >= 5) {
    return {
      label: "Consider Switching",
      color: "bg-secondary-25 border-secondary-50 text-secondary-200",
      summary:
        "The savings look meaningful but aren't overwhelming. Run the numbers carefully — switching costs ($700–$1,800) need to be comfortably beaten by 5-year interest savings.",
      actions: [
        "Calculate 5-year interest savings on the actual rate gap",
        "Ask the new lender whether they cover legal + discharge fees",
        "Present the quote to your current lender for a match",
        "If your charge is collateral (TD / National Bank), factor in higher legal costs",
      ],
    };
  }

  if (score >= 3) {
    return {
      label: "Negotiate With Current Lender",
      color: "bg-warning-25 border-warning-50 text-warning-200",
      summary:
        "Switching likely won't pay off after costs, but your current lender is definitely overcharging. Treat this as a negotiation — don't simply accept the posted rate in your renewal letter.",
      actions: [
        "Get a broker quote in writing (free) to use as leverage",
        "Call your current lender's retention team — not the branch",
        "Ask for them to match the broker rate or offer a loyalty discount",
        "If they refuse, walk through switch math with a broker one more time",
      ],
    };
  }

  return {
    label: "Stay + Re-evaluate Later",
    color: "bg-gray-25 border-gray-100 text-foreground",
    summary:
      "At your current rate gap and timeline, switching doesn't pencil out right now. Stay put, but shop again in 6 months — rates and your situation both move.",
    actions: [
      "Accept renewal for a shorter term (1–3 years) to re-shop sooner",
      "Set a reminder to shop 120 days before your next maturity",
      "Monitor Bank of Canada decisions — next one is April 29, 2026",
      "Pay down principal aggressively during the current term",
    ],
  };
}

export default function SwitchQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const outcome = useMemo(() => scoreAnswers(answers), [answers]);

  function next<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  const progress = Math.min((step / 5) * 100, 100);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between text-body-xs text-muted-foreground mb-2">
          <span>{step < 5 ? `Question ${step + 1} of 5` : "Your Result"}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 w-full bg-gray-25 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary-100 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <Question title="Is your current mortgage with a Big 6 bank, monoline, credit union, or B-lender?">
          <Option onClick={() => next("lender", "big6")} label="Big 6 bank" detail="RBC, TD, BMO, Scotia, CIBC, National" />
          <Option onClick={() => next("lender", "monoline")} label="Monoline" detail="First National, MCAP, RMG, Merix" />
          <Option onClick={() => next("lender", "credit_union")} label="Credit Union" detail="Meridian, Vancity, Desjardins, etc." />
          <Option onClick={() => next("lender", "blender")} label="B-lender or private" detail="Equitable Bank, Home Trust, private lender" />
        </Question>
      )}

      {step === 1 && (
        <Question title="What's your approximate credit score?">
          <Option onClick={() => next("credit", "680plus")} label="680 or higher" detail="A-lender qualified" />
          <Option onClick={() => next("credit", "600_679")} label="600 – 679" detail="Most A-lenders, some may decline" />
          <Option onClick={() => next("credit", "sub600")} label="Under 600" detail="B-lender territory" />
        </Question>
      )}

      {step === 2 && (
        <Question title="How much lower is the best available rate vs. your current rate?">
          <Option onClick={() => next("rateDiff", "low")} label="0 – 0.25%" detail="Marginal savings" />
          <Option onClick={() => next("rateDiff", "mid")} label="0.26% – 0.50%" detail="Meaningful savings over 5 years" />
          <Option onClick={() => next("rateDiff", "high")} label="0.50% or more" detail="Major savings — likely worth switching" />
        </Question>
      )}

      {step === 3 && (
        <Question title="How many months until your renewal date?">
          <Option onClick={() => next("timeline", "0_3")} label="0 – 3 months" detail="Renewal is very soon" />
          <Option onClick={() => next("timeline", "4_6")} label="4 – 6 months" detail="Ideal shopping window" />
          <Option onClick={() => next("timeline", "7plus")} label="7+ months" detail="Too early for a rate hold" />
        </Question>
      )}

      {step === 4 && (
        <Question title="Which province are you in?">
          <select
            className="w-full rounded-lg border border-gray-200 bg-background p-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) next("province", e.target.value);
            }}
          >
            <option value="" disabled>
              Select your province…
            </option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Question>
      )}

      {step >= 5 && (
        <div>
          <div className={`rounded-xl border p-6 mb-5 ${outcome.color}`}>
            <div className="text-body-xs-medium uppercase tracking-wide mb-2 opacity-80">
              Your recommendation
            </div>
            <h3 className="text-heading-4 font-bold mb-3">{outcome.label}</h3>
            <p className="text-body-md leading-relaxed">{outcome.summary}</p>
          </div>

          <div className="rounded-xl bg-gray-25 border border-gray-100 p-5 mb-5">
            <h4 className="font-semibold mb-3">What to do next</h4>
            <ul className="space-y-2">
              {outcome.actions.map((a) => (
                <li key={a} className="flex gap-2 text-body-sm">
                  <span className="text-secondary-100 flex-shrink-0">→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/book-a-call/"
              className="flex-1 rounded-lg bg-primary-100 text-white font-semibold px-5 py-3 text-center hover:opacity-90 transition-opacity"
            >
              Book a Free Broker Call
            </a>
            <button
              onClick={reset}
              className="flex-1 rounded-lg border border-gray-200 bg-white font-medium px-5 py-3 hover:bg-gray-25 transition-colors"
            >
              Retake Quiz
            </button>
          </div>

          <p className="mt-4 text-body-xs text-muted-foreground text-center">
            This quiz is educational only and not a mortgage approval or financial advice.
          </p>
        </div>
      )}
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-heading-4 font-bold mb-5">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Option({
  onClick,
  label,
  detail,
}: {
  onClick: () => void;
  label: string;
  detail: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-secondary-100 hover:bg-secondary-25 transition-colors"
    >
      <div className="font-semibold text-foreground">{label}</div>
      <div className="text-body-sm text-muted-foreground mt-0.5">{detail}</div>
    </button>
  );
}
