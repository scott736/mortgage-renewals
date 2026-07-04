"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { trackCtaClick, trackLeadEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type RenewalDateCtaProps = {
  className?: string;
  /** Light text styling for dark hero backgrounds */
  variant?: "light" | "default";
};

function monthOptions(): { value: string; label: string }[] {
  const now = new Date();
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < 36; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-CA", { month: "long", year: "numeric" });
    options.push({ value, label });
  }
  return options;
}

export default function RenewalDateCta({ className, variant = "default" }: RenewalDateCtaProps) {
  const [renewalDate, setRenewalDate] = React.useState("");
  const options = React.useMemo(() => monthOptions(), []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!renewalDate) return;

    trackLeadEvent("renewal_date_cta", { renewalDate });
    trackCtaClick("renewal_date_cta", `/contact/?renewalDate=${renewalDate}`);

    window.location.href = `/contact/?renewalDate=${encodeURIComponent(renewalDate)}`;
  }

  const isLight = variant === "light";
  const selectCls = cn(
    "h-11 w-full rounded-[12px] border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30",
    isLight
      ? "border-white/20 bg-white/10 text-white focus:border-white/40"
      : "border-gray-100 bg-gray-0 text-gray-700 focus:border-gray-200",
  );
  const labelCls = cn(
    "text-body-sm-medium mb-1 block",
    isLight ? "text-white/90" : "text-gray-700",
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "mt-6 max-w-md rounded-xl border p-4 sm:flex sm:items-end sm:gap-3 sm:p-4",
        isLight ? "border-white/15 bg-white/5" : "border-gray-100 bg-gray-25",
        className,
      )}
    >
      <div className="flex-1 sm:min-w-0">
        <label htmlFor="renewal-date-cta" className={labelCls}>
          When does your mortgage renew?
        </label>
        <select
          id="renewal-date-cta"
          aria-label="Mortgage renewal month and year"
          value={renewalDate}
          onChange={(e) => setRenewalDate(e.target.value)}
          required
          className={selectCls}
        >
          <option value="" disabled>
            Select month & year
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        className={cn("mt-3 w-full sm:mt-0 sm:w-auto sm:shrink-0", isLight && "bg-white text-primary-100 hover:bg-white/90")}
        disabled={!renewalDate}
      >
        Get renewal help
      </Button>
    </form>
  );
}
