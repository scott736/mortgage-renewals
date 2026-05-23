"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { BUSINESS } from "@/consts";
import { trackCtaClick } from "@/lib/analytics";
import { businessHoursLabel, isBusinessHours } from "@/lib/business-hours";
import { cn } from "@/lib/utils";

export default function ClickToCallBar() {
  const [open, setOpen] = useState(false);
  const [duringHours, setDuringHours] = useState(false);

  useEffect(() => {
    setDuringHours(isBusinessHours());
    const id = window.setInterval(() => setDuringHours(isBusinessHours()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!duringHours) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-secondary-100 text-white shadow-lg transition hover:opacity-90 lg:bottom-6",
        )}
        aria-label="Call us during business hours"
        aria-expanded={open}
      >
        <Phone className="size-6" />
      </button>

      {open && (
        <div
          className={cn(
            "fixed bottom-36 right-4 z-50 w-[min(calc(100vw-2rem),280px)] rounded-xl border bg-background p-4 shadow-xl",
            "lg:bottom-24",
          )}
          role="dialog"
          aria-label="Call options"
        >
          <p className="text-body-sm font-semibold mb-1">Prefer to talk now?</p>
          <p className="text-body-xs text-muted-foreground mb-3">
            Licensed brokers available {businessHoursLabel()}.
          </p>
          <a
            href={BUSINESS.phone.tel}
            onClick={() => trackCtaClick("click_to_call_fab", BUSINESS.phone.tel)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Phone className="size-4" />
            {BUSINESS.phone.display}
          </a>
          <a
            href="/book-a-call/"
            onClick={() => trackCtaClick("click_to_call_fab_book", "/book-a-call/")}
            className="mt-2 block text-center text-body-xs font-medium text-secondary-100 hover:underline"
          >
            Or book a callback →
          </a>
        </div>
      )}
    </>
  );
}
