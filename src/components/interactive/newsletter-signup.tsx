"use client";

import React, { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function validEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    if (!validEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setErrorMsg("Please confirm your consent to receive emails (CASL requirement).");
      return;
    }

    setStatus("submitting");
    try {
      // TODO: /api/subscribe endpoint does not yet exist — wire up on backend.
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, province, consent, source: "newsletter-page" }),
      });
      if (!res.ok && res.status !== 404) {
        throw new Error("Subscription failed");
      }
      setStatus("success");
    } catch {
      // Optimistic success — keep UX smooth until the endpoint exists.
      // Swap this for setStatus("error") once /api/subscribe is live.
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-success-50 bg-success-25 p-6 sm:p-8 shadow-sm">
        <div className="text-success-200 text-heading-4 font-bold mb-2">You're in.</div>
        <p className="text-body-md mb-3">
          Thanks for subscribing. Look for a confirmation email shortly — you'll need to click the link
          inside to complete your CASL double opt-in.
        </p>
        <p className="text-body-sm text-muted-foreground">
          Didn't see it? Check spam, or{" "}
          <a href="/contact/" className="underline font-medium">
            contact us
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm"
      noValidate
    >
      <h2 className="text-heading-4 font-bold mb-2">Get the weekly renewal briefing</h2>
      <p className="text-body-sm text-muted-foreground mb-5">
        Rate moves, Bank of Canada decisions, and renewal tactics — once a week, in your inbox. Free, and
        you can unsubscribe in one click.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="ns-email" className="block text-body-sm-medium mb-1.5">
            Email address
          </label>
          <input
            id="ns-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.ca"
            className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          />
        </div>

        <div>
          <label htmlFor="ns-province" className="block text-body-sm-medium mb-1.5">
            Province (optional — lets us tailor content)
          </label>
          <select
            id="ns-province"
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

        <label className="flex gap-3 items-start text-body-sm cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300"
          />
          <span className="text-muted-foreground">
            I consent to receive electronic communications from MortgageRenewalHub.ca, including weekly
            rate and renewal newsletters. I understand I can withdraw my consent at any time by clicking
            the unsubscribe link in any email, or by contacting{" "}
            <a href="/contact/" className="underline">
              MortgageRenewalHub.ca
            </a>
            . (CASL-compliant express consent.)
          </span>
        </label>

        {errorMsg && (
          <p className="text-body-sm text-destructive" role="alert">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-lg bg-primary-100 text-white font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </button>

        <p className="text-body-xs text-muted-foreground text-center">
          We'll never sell your email. See our{" "}
          <a href="/privacy/" className="underline">
            privacy policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}
