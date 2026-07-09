"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackLeadEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const PDF_URL = "/downloads/renewal-checklist-2026.pdf";

type ChecklistDownloadGateProps = {
  className?: string;
};

export default function ChecklistDownloadGate({ className }: ChecklistDownloadGateProps) {
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "submitting" | "unlocked" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim()) {
      setErrorMsg("Please enter your email to download.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Checklist",
          lastName: "Download",
          email: email.trim(),
          message: "Requested the 2026 Canadian Mortgage Renewal Checklist PDF download.",
          confirm: true,
          website,
          source: "checklist_download",
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!res.ok || !body.success) {
        setStatus("error");
        setErrorMsg(body.error || "Could not unlock download. Try again.");
        return;
      }
      setStatus("unlocked");
      trackLeadEvent("checklist_download", { email: "provided" });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "unlocked") {
    return (
      <div className={cn("space-y-3", className)}>
        <a
          href={PDF_URL}
          download
          className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg bg-primary-100 text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Download the Free PDF ↓
        </a>
        <p className="text-body-xs text-muted-foreground">
          Your download is ready below. Our team will also follow up about your renewal timing.{" "}
          <a href="/book-a-call/" className="text-secondary-100 underline">
            Book a free walk-through
          </a>{" "}
          with a broker anytime.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-5 shadow-sm", className)}>
      <p className="text-body-sm-medium mb-1">Enter your email to download</p>
      <p className="text-body-xs text-muted-foreground mb-3">
        Free PDF · 2 pages · Our team may follow up about your renewal timing.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          aria-label="Email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
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
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Unlocking…" : "Get the PDF"}
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
