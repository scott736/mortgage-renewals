"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { trackLeadEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export type ZippayContactFormProps = {
  tagline?: string;
  title?: string;
  description?: string;
  className?: string;
};

type Step1Data = {
  firstName: string;
  lastName: string;
  email: string;
  renewalDate: string;
};

function readRenewalDateParam(): string {
  if (typeof window === "undefined") return "";
  const raw = new URLSearchParams(window.location.search).get("renewalDate")?.trim() ?? "";
  if (/^\d{4}-\d{2}$/.test(raw)) return raw;
  return "";
}

async function submitContact(payload: Record<string, unknown>) {
  const res = await fetch("/api/contact/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    error?: string;
  };
  if (!res.ok || !body.success) {
    throw new Error(body.error || "Something went wrong. Please try again or call us at (226) 212-7200.");
  }
}

export default function ZippayContactForm({
  tagline = "Contact a Renewal Specialist",
  title = "Questions About Your Mortgage Renewal?",
  description = "Tell us about your renewal, maturity date, current lender, and what you need. A licensed broker will reply within one business day.",
  className,
}: ZippayContactFormProps) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [step1Data, setStep1Data] = React.useState<Step1Data | null>(null);
  const [renewalDatePrefill, setRenewalDatePrefill] = React.useState("");

  React.useEffect(() => {
    setRenewalDatePrefill(readRenewalDateParam());
  }, []);

  async function handleStep1Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      email: String(fd.get("email") || ""),
      renewalDate: String(fd.get("renewalDate") || ""),
      confirm: fd.get("confirm") === "on",
      website: String(fd.get("website") || ""),
      source: "contact_form",
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    };

    if (!payload.confirm) {
      setErrorMsg("Please confirm you agree to be contacted.");
      return;
    }

    setStatus("submitting");
    try {
      await submitContact(payload);
      setStep1Data({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        renewalDate: payload.renewalDate,
      });
      setStep(2);
      setStatus("idle");
      trackLeadEvent("contact_form_submit", { source: "contact_form", step: 1 });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not reach our servers. Please try again or call us at (226) 212-7200.");
    }
  }

  async function handleStep2Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!step1Data) return;
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const currentLender = String(fd.get("currentLender") || "").trim();
    const balance = String(fd.get("balance") || "").trim();
    const province = String(fd.get("province") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const hasSupplemental = Boolean(currentLender || balance || province || message);
    if (!hasSupplemental) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      await submitContact({
        ...step1Data,
        currentLender,
        balance,
        province,
        message: message || "Additional mortgage renewal details provided after initial inquiry.",
        confirm: true,
        source: "contact_form",
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        meta: { supplemental: true },
      });
      setStatus("success");
      trackLeadEvent("contact_form_submit", { source: "contact_form", step: 2 });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not send supplemental details. Please call us at (226) 212-7200.");
    }
  }

  function skipStep2() {
    setStatus("success");
  }

  const inputCls =
    "h-11 w-full rounded-[12px] border border-gray-100 bg-gray-0 px-3 text-sm text-gray-700 outline-none focus:border-gray-200 focus:ring-2 focus:ring-primary/30";
  const labelCls = "text-body-sm-medium text-gray-700";

  return (
    <section
      className={cn(
        "bg-gray-25 px-6 py-10 lg:py-24 dark:bg-gray-200",
        className,
      )}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-body-sm-medium text-primary-200">
            {tagline}
          </span>
          <h2 className="text-heading-1 text-foreground mt-4 tracking-tight lg:text-[52px]">
            {title}
          </h2>
          <p className="text-body-md sm:text-body-lg mt-4 text-gray-500">
            {description}
          </p>
        </div>

        <div className="bg-gray-0 mx-auto mt-8 max-w-4xl rounded-2xl border border-gray-50 p-5 shadow-[0_4px_11px_-1px_rgba(10,10,10,0.04)] sm:p-6 lg:mt-10 lg:p-8">
          {status === "success" ? (
            <div className="text-center py-4" aria-live="polite">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl">
                ✓
              </div>
              <h3 className="text-heading-4 font-bold mb-2">Message sent</h3>
              <p className="text-body-md text-gray-600 max-w-md mx-auto">
                Thanks, a licensed broker will reply by email within one business day. For urgent questions call{" "}
                <a href="tel:+12262127200" className="font-semibold underline">
                  (226) 212-7200
                </a>
                {" "}or{" "}
                <a href="/book-a-call/" className="font-semibold underline">
                  book a free call
                </a>
                .
              </p>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-5" noValidate>
              <p className="text-body-sm text-gray-500 text-center">
                Step 1 of 2 — just the basics. A broker will reach out within one business day.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelCls}>
                    First name
                  </label>
                  <input
                    id="firstName"
                    aria-label="First name"
                    name="firstName"
                    required
                    placeholder="John"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelCls}>
                    Last name
                  </label>
                  <input
                    id="lastName"
                    aria-label="Last name"
                    name="lastName"
                    required
                    placeholder="Doe"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelCls}>
                  Email
                </label>
                <input
                  id="email"
                  aria-label="Email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="renewalDate" className={labelCls}>
                  Renewal date <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="renewalDate"
                  aria-label="Renewal date"
                  name="renewalDate"
                  type="month"
                  defaultValue={renewalDatePrefill}
                  key={renewalDatePrefill || "empty"}
                  className={inputCls}
                />
              </div>

              <label htmlFor="contact-confirm" className="flex items-center gap-2">
                <input
                  id="contact-confirm"
                  type="checkbox"
                  name="confirm"
                  required
                  aria-label="I agree to be contacted about my mortgage renewal inquiry"
                  className="text-primary focus:ring-primary/30 size-4 rounded border-gray-300 outline-none focus:ring-2"
                />
                <span className="text-body-sm text-gray-600">
                  I agree to be contacted about my mortgage renewal inquiry
                </span>
              </label>

              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              {errorMsg && (
                <p className="text-body-sm text-destructive" role="alert">
                  {errorMsg}
                </p>
              )}

              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Sending\u2026" : "Send Message"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-5" noValidate>
              <div className="rounded-xl border border-secondary-50 bg-secondary-25 p-4 text-center">
                <p className="text-body-sm-medium text-secondary-200 mb-1">You&apos;re all set for now</p>
                <p className="text-body-sm text-muted-foreground">
                  A broker will email you within one business day. Want to add details now? Optional fields below help us prepare.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="currentLender" className={labelCls}>
                    Current lender <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="currentLender"
                    aria-label="Current lender"
                    name="currentLender"
                    placeholder="e.g. TD, RBC"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="balance" className={labelCls}>
                    Mortgage balance <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="balance"
                    aria-label="Mortgage balance"
                    name="balance"
                    placeholder="e.g. $450,000"
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="province" className={labelCls}>
                    Province <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <select id="province" aria-label="Province" name="province" className={inputCls} defaultValue="">
                    <option value="">Select province</option>
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
              </div>

              <div>
                <label htmlFor="message" className={labelCls}>
                  How can we help? <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="message"
                  aria-label="How can we help?"
                  name="message"
                  placeholder="e.g. I received my renewal letter and want to know if I should switch lenders..."
                  className={cn(
                    inputCls,
                    "min-h-[140px] resize-y py-3 leading-6",
                  )}
                />
              </div>

              {errorMsg && (
                <p className="text-body-sm text-destructive" role="alert">
                  {errorMsg}
                </p>
              )}

              <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Sending\u2026" : "Add details & send"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={skipStep2}
                >
                  Skip for now
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
