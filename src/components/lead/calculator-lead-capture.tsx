"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackLeadEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type CalculatorLeadCaptureProps = {
  tool: string;
  summary: string;
  data?: Record<string, string | number | boolean>;
  className?: string;
};

export default function CalculatorLeadCapture({
  tool,
  summary,
  data,
  className,
}: CalculatorLeadCaptureProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Calculator",
          lastName: "Lead",
          email: email.trim(),
          message: `Please email my ${tool} results and follow up if a broker rate review makes sense.\n\n${summary}`,
          confirm: true,
          source: "calculator_lead",
          calculator: { tool, summary, data },
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!res.ok || !body.success) {
        setStatus("error");
        setErrorMsg(body.error || "Could not send. Try booking a free call instead.");
        return;
      }
      setStatus("success");
      trackLeadEvent("calculator_lead_submit", { tool });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again or call (226) 212-7200.");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("rounded-xl border border-secondary-50 bg-secondary-25 p-5", className)}>
        <p className="text-body-sm-medium text-secondary-200 mb-1">Results on the way</p>
        <p className="text-body-sm text-muted-foreground">
          We&apos;ll email your {tool} summary shortly. Want to talk sooner?{" "}
          <a href="/book-a-call/" className="font-semibold text-secondary-100 underline">
            Book a free broker call
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-gray-25 p-5", className)}>
      <p className="text-body-sm-medium text-foreground mb-1">Email me these results</p>
      <p className="text-body-xs text-muted-foreground mb-3">
        Get a copy of your comparison plus optional follow-up from a licensed broker — no spam.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={status === "submitting"} className="shrink-0">
          {status === "submitting" ? "Sending…" : "Send results"}
        </Button>
      </form>
      {errorMsg && (
        <p className="text-body-xs text-destructive mt-2" role="alert">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
