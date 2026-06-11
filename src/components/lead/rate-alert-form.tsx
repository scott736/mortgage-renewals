"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatchState } from "@/hooks/use-patch-state";
import { trackLeadEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const PROVINCES = [
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

type RateAlertFormProps = {
  className?: string;
};

export default function RateAlertForm({ className }: RateAlertFormProps) {
  const [state, setState] = usePatchState({
    email: "",
    targetRate: "",
    term: "5-year fixed",
    province: "",
    status: "idle" as "idle" | "submitting" | "success" | "error",
    errorMsg: "",
  });
  const { email, targetRate, term, province, status, errorMsg } = state;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ errorMsg: "" });

    setState({ status: "submitting" });
    try {
      const message = [
        "Rate alert signup, please notify when a broker-negotiated rate hits my target.",
        targetRate ? `Target rate: ${targetRate}%` : null,
        `Preferred term: ${term}`,
        province ? `Province: ${province}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Rate",
          lastName: "Alert",
          email: email.trim(),
          message,
          confirm: true,
          source: "rate_alert",
          province: province || undefined,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
          meta: { targetRate, term },
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!res.ok || !body.success) {
        setState({ status: "error", errorMsg: body.error || "Could not sign up. Try booking a free call." });
        return;
      }
      setState({ status: "success" });
      trackLeadEvent("rate_alert_submit", { term });
    } catch {
      setState({ status: "error", errorMsg: "Network error. Please try again." });
    }
  }

  if (status === "success") {
    return (
      <div className={cn("rounded-2xl border border-secondary-50 bg-secondary-25 p-6", className)}>
        <p className="text-body-md-medium text-secondary-200 mb-2">You&apos;re on the list</p>
        <p className="text-body-sm text-muted-foreground mb-4">
          A licensed broker will reach out when broker-channel rates match your target, or book a call now to lock a rate hold.
        </p>
        <Button asChild className="w-full">
          <a href="/book-a-call/">Book Free Rate Strategy Call</a>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-4", className)}
    >
      <div>
        <h2 className="text-heading-4 font-bold mb-1">Get a broker rate alert</h2>
        <p className="text-body-sm text-muted-foreground">
          Tell us your target once. Our team will follow up when broker-channel rates match your target (not posted bank rates).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ra-email">Email</Label>
        <Input
          id="ra-email"
          type="email"
          required
          value={email}
          onChange={(e) => setState({ email: e.target.value })}
          placeholder="you@email.com"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ra-target">Target rate (optional)</Label>
          <Input
            id="ra-target"
            type="text"
            inputMode="decimal"
            value={targetRate}
            onChange={(e) => setState({ targetRate: e.target.value })}
            placeholder="e.g. 4.25"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ra-term">Term</Label>
          <Select value={term} onValueChange={(v) => setState({ term: v })}>
            <SelectTrigger id="ra-term">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-year fixed">1-year fixed</SelectItem>
              <SelectItem value="2-year fixed">2-year fixed</SelectItem>
              <SelectItem value="3-year fixed">3-year fixed</SelectItem>
              <SelectItem value="5-year fixed">5-year fixed</SelectItem>
              <SelectItem value="5-year variable">5-year variable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ra-province">Province (optional)</Label>
        <Select value={province || undefined} onValueChange={(v) => setState({ province: v })}>
          <SelectTrigger id="ra-province">
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {errorMsg && (
        <p className="text-body-sm text-destructive" role="alert">
          {errorMsg}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing up…" : "Submit rate alert request"}
      </Button>

      <p className="text-body-xs text-muted-foreground text-center">
        Prefer a live quote now?{" "}
        <a href="/book-a-call/" className="text-secondary-100 underline">
          Book a free call
        </a>
      </p>
    </form>
  );
}
