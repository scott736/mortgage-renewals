"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export type ZippayContactFormProps = {
  tagline?: string;
  title?: string;
  description?: string;
  className?: string;
};

export default function ZippayContactForm({
  tagline = "Contact Us",
  title = "We\u2019d Love to Hear From You",
  description = `Share your thoughts, suggestions, or any questions you may have with us.
Your input helps us improve and enhance our services to better meet your needs.`,
  className,
}: ZippayContactFormProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
      confirm: fd.get("confirm") === "on",
      website: String(fd.get("website") || ""),
    };

    if (!payload.confirm) {
      setErrorMsg("Please confirm you agree to be contacted.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || !body.success) {
        setStatus("error");
        setErrorMsg(body.error || "Something went wrong. Please try again or call us at (519) 960-0370.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Could not reach our servers. Please try again or call us at (519) 960-0370.");
    }
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
            <div className="text-center py-4" role="status" aria-live="polite">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl">
                ✓
              </div>
              <h3 className="text-heading-4 font-bold mb-2">Message sent</h3>
              <p className="text-body-md text-gray-600 max-w-md mx-auto">
                Thanks — we've received your note and will reply by email within one business day. For urgent questions call{" "}
                <a href="tel:+15199600370" className="font-semibold underline">
                  (519) 960-0370
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelCls}>
                    First name
                  </label>
                  <input
                    id="firstName"
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
                  name="email"
                  type="email"
                  required
                  placeholder="johndoe@mail.com"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelCls}>
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Message"
                  className={cn(
                    inputCls,
                    "min-h-[180px] resize-y py-3 leading-6",
                  )}
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="confirm"
                  required
                  className="text-primary focus:ring-primary/30 h-4 w-4 rounded border-gray-300 outline-none focus:ring-2"
                />
                <span className="text-body-sm text-gray-600">
                  I agree to be contacted about my inquiry
                </span>
              </label>

              {/* Honeypot */}
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
          )}
        </div>
      </div>
    </section>
  );
}
