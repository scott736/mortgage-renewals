"use client";

import React, { useMemo, useState } from "react";

function addMonths(dateStr: string, months: number): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() - months);
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const URGENCY_ACTIONS: Record<string, { title: string; items: string[] }> = {
  "30": {
    title: "30 days or less, act now",
    items: [
      "Request your written renewal offer today and decode the letter",
      "Book a broker call this week, rate holds may still be possible",
      "Run switch-vs-stay math including real switching costs",
      "Gather NOA/T4, mortgage statement, and void cheque",
      "Confirm charge type (standard vs. collateral) on your statement",
    ],
  },
  "60": {
    title: "31–60 days, finalize your decision",
    items: [
      "Lock a rate hold if switching (up to 120 days before maturity)",
      "Submit application to new lender if switching",
      "Use negotiation scripts with your current lender",
      "Sign commitment and arrange legal/notary work",
      "Set up new payment instructions before maturity",
    ],
  },
  "120": {
    title: "61–120 days, shopping window",
    items: [
      "Contact a broker for quotes from 30+ lenders",
      "Compare fixed vs. variable and term length",
      "Run calculators: switch-vs-stay, rate comparison, penalties",
      "Improve credit if needed (pay down revolving balances)",
      "Request informal renewal quote from current lender",
    ],
  },
  later: {
    title: "More than 120 days, build your plan",
    items: [
      "Bookmark this page and return at 6 months out",
      "Read the complete renewal guide and checklist",
      "Use My Renewal Plan wizard for a personalized checklist",
      "Monitor rates weekly, no need to lock yet",
      "File taxes on time if self-employed",
    ],
  },
};

function buildIcs(maturityDate: string, email?: string): string {
  const start = new Date(maturityDate);
  const sixMo = new Date(start);
  sixMo.setMonth(sixMo.getMonth() - 6);
  const fourMo = new Date(start);
  fourMo.setMonth(fourMo.getMonth() - 4);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `renewal-${maturityDate}@mortgagerenewalhub.ca`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MortgageRenewalHub//Renewal Reminder//EN",
    "BEGIN:VEVENT",
    `UID:${uid}-6mo`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(sixMo)}`,
    `SUMMARY:Start mortgage renewal shopping (6 months out)`,
    `DESCRIPTION:Review checklist at https://mortgagerenewalhub.ca/mortgage-renewal-checklist/`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    `UID:${uid}-4mo`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(fourMo)}`,
    `SUMMARY:Lock mortgage rate hold (4 months out)`,
    `DESCRIPTION:Book broker at https://mortgagerenewalhub.ca/book-a-call/`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    `UID:${uid}-maturity`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `SUMMARY:Mortgage renewal maturity date`,
    email ? `ORGANIZER:mailto:${email}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export default function RenewalReminderForm() {
  const [renewalDate, setRenewalDate] = useState("");
  const [province, setProvince] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const sixMonthDate = useMemo(() => addMonths(renewalDate, 6), [renewalDate]);
  const fourMonthDate = useMemo(() => addMonths(renewalDate, 4), [renewalDate]);
  const daysLeft = useMemo(() => daysUntil(renewalDate), [renewalDate]);

  const urgencyKey = useMemo(() => {
    if (daysLeft == null) return null;
    if (daysLeft <= 30) return "30";
    if (daysLeft <= 60) return "60";
    if (daysLeft <= 120) return "120";
    return "later";
  }, [daysLeft]);

  const urgencyPlan = urgencyKey ? URGENCY_ACTIONS[urgencyKey] : null;


  const bookingHref = renewalDate
    ? `/book-a-call/?renewal_date=${encodeURIComponent(renewalDate)}${province ? `&province=${encodeURIComponent(province)}` : ""}`
    : "/book-a-call/";

  function downloadIcal() {
    if (!renewalDate) return;
    const blob = new Blob([buildIcs(renewalDate, email || undefined)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mortgage-renewal-${renewalDate}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function submitEmailReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !renewalDate) return;
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Renewal",
          lastName: "Reminder",
          email,
          message: `Renewal reminder request. Maturity: ${renewalDate}. Province: ${province || "n/a"}. Days left: ${daysLeft ?? "n/a"}. Urgency: ${urgencyKey ?? "n/a"}.`,
          confirm: true,
          website,
          source: "renewal_reminder",
          renewalDate,
          province: province || undefined,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const body = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (body && body.success === false) throw new Error("failed");
      setEmailStatus("done");
    } catch {
      setEmailStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="text-heading-4 font-bold mb-2">Plan your renewal timing</h2>
      <p className="text-body-sm text-muted-foreground mb-5">
        Enter your maturity date for 30 / 60 / 120-day action lists, calendar download, or optional email to our team.
      </p>

      <div className="grid gap-5">
        <div>
          <label htmlFor="rr-date" className="block text-body-sm-medium mb-1.5">
            Your mortgage renewal (maturity) date
          </label>
          <input
            id="rr-date"
            aria-label="Your mortgage renewal (maturity) date"
            name="renewal_date"
            type="date"
            required
            value={renewalDate}
            onChange={(e) => setRenewalDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          />
        </div>

        <div>
          <label htmlFor="rr-province" className="block text-body-sm-medium mb-1.5">
            Province (optional)
          </label>
          <select
            id="rr-province"
            aria-label="Province (optional)"
            name="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value="">(Select)</option>
            <option>Ontario</option>
            <option>Quebec</option>
            <option>British Columbia</option>
            <option>Alberta</option>
            <option>Manitoba</option>
            <option>Saskatchewan</option>
            <option>Nova Scotia</option>
            <option>New Brunswick</option>
            <option>Newfoundland and Labrador</option>
            <option>Prince Edward Island</option>
            <option>Yukon</option>
            <option>Northwest Territories</option>
            <option>Nunavut</option>
          </select>
        </div>

        {renewalDate && (
          <>
            <div className="rounded-lg bg-secondary-25 border border-secondary-50 p-4 text-body-sm">
              <div className="font-semibold mb-1.5">Key dates:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  • <strong className="text-foreground">6 months out:</strong> {sixMonthDate}, start shopping
                </li>
                <li>
                  • <strong className="text-foreground">4 months out:</strong> {fourMonthDate}, lock rate hold
                </li>
                <li>
                  • <strong className="text-foreground">Maturity:</strong>{" "}
                  {new Date(renewalDate + "T12:00:00").toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {daysLeft != null && ` (${daysLeft} days)`}
                </li>
              </ul>
            </div>

            {urgencyPlan && (
              <div className="rounded-lg border border-gray-100 bg-gray-25 p-4">
                <h3 className="text-body-sm-medium mb-2">{urgencyPlan.title}</h3>
                <ul className="space-y-1.5 text-body-sm text-muted-foreground">
                  {urgencyPlan.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <a
                  href="/my-renewal-plan/"
                  className="inline-block mt-3 text-body-sm text-secondary-100 hover:underline"
                >
                  Full personalized plan →
                </a>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={downloadIcal}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-body-sm-medium hover:bg-gray-25"
              >
                Download calendar (.ics)
              </button>
              <a
                href={bookingHref}
                className="flex-1 rounded-lg bg-primary-100 text-white py-2.5 text-center text-body-sm-medium hover:opacity-90"
              >
                Book free strategy call
              </a>
            </div>
          </>
        )}

        <form onSubmit={submitEmailReminder} className="border-t border-gray-100 pt-5 space-y-3">
          <p className="text-body-xs text-muted-foreground">
            Optional: send your maturity date to our team (privacy policy applies). We do not sell your email. For
            automated reminders, use the calendar download above.
          </p>
          <div>
            <label htmlFor="rr-email" className="block text-body-sm-medium mb-1.5">
              Email (optional)
            </label>
            <input
              id="rr-email"
              aria-label="Email (optional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-body-md"
            />
          </div>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <button
            type="submit"
            disabled={!email || !renewalDate || emailStatus === "sending"}
            className="w-full rounded-lg border border-secondary-100 text-secondary-200 py-2.5 text-body-sm-medium disabled:opacity-50"
          >
            {emailStatus === "sending"
              ? "Sending…"
              : emailStatus === "done"
                ? "Request received, thank you"
                : "Email my renewal date to the team"}
          </button>
          {emailStatus === "error" && (
            <p className="text-body-xs text-red-600" role="alert">Could not send, try again or book a call directly.</p>
          )}
        </form>
      </div>
    </div>
  );
}
