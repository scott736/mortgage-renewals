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

export default function RenewalReminderForm() {
  const [renewalDate, setRenewalDate] = useState("");
  const [province, setProvince] = useState("");

  const sixMonthDate = useMemo(() => addMonths(renewalDate, 6), [renewalDate]);
  const fourMonthDate = useMemo(() => addMonths(renewalDate, 4), [renewalDate]);
  const daysLeft = useMemo(() => daysUntil(renewalDate), [renewalDate]);

  const minDate = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const bookingHref = renewalDate
    ? `/book-a-call/?renewal_date=${encodeURIComponent(renewalDate)}${province ? `&province=${encodeURIComponent(province)}` : ""}`
    : "/book-a-call/";

  const windowLabel = (() => {
    if (daysLeft == null) return null;
    if (daysLeft < 0) return "Your renewal date is in the past — act now.";
    if (daysLeft <= 120) return "You're inside the 120-day rate-hold window — a broker can lock a rate today.";
    if (daysLeft <= 180) return "You're at the ideal 6-month window to start shopping.";
    if (daysLeft <= 365) return "You're more than 6 months out — bookmark this page and return closer to your renewal.";
    return "Your renewal is more than a year away — worth planning, but most lenders won't quote this far out.";
  })();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="text-heading-4 font-bold mb-2">Plan your renewal timing</h2>
      <p className="text-body-sm text-muted-foreground mb-5">
        Enter your maturity date to see your two key action windows.
      </p>

      <div className="grid gap-5">
        <div>
          <label htmlFor="rr-date" className="block text-body-sm-medium mb-1.5">
            Your mortgage renewal (maturity) date
          </label>
          <input
            id="rr-date"
            name="renewal_date"
            type="date"
            required
            min={minDate}
            value={renewalDate}
            onChange={(e) => setRenewalDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          />
          <p className="text-body-xs text-muted-foreground mt-1">
            Check your most recent mortgage statement if you're not sure.
          </p>
        </div>

        <div>
          <label htmlFor="rr-province" className="block text-body-sm-medium mb-1.5">
            Province (optional)
          </label>
          <select
            id="rr-province"
            name="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value="">— Select —</option>
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
          <div className="rounded-lg bg-secondary-25 border border-secondary-50 p-4 text-body-sm">
            <div className="font-semibold mb-1.5">Your two key action windows:</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <strong className="text-foreground">6 months out:</strong> {sixMonthDate} — start shopping</li>
              <li>• <strong className="text-foreground">4 months out:</strong> {fourMonthDate} — lock a rate hold</li>
            </ul>
            {windowLabel && (
              <p className="mt-3 pt-3 border-t border-secondary-50 text-body-xs-medium text-secondary-200">
                {windowLabel}
              </p>
            )}
          </div>
        )}

        <a
          href={bookingHref}
          className="rounded-lg bg-primary-100 text-white font-semibold py-3 text-center hover:opacity-90 transition-opacity"
        >
          Book a Free Renewal Strategy Call
        </a>

        <p className="text-body-xs text-muted-foreground text-center">
          A licensed broker will build a timeline tailored to your renewal date — free, no obligation.
        </p>
      </div>
    </div>
  );
}
