"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { trackCtaClick, trackLeadEvent } from "@/lib/analytics";

type ExitIntentModalProps = {
  /** sessionStorage key — one show per browser session per page */
  storageKey: string;
  title?: string;
  description?: string;
};

export default function ExitIntentModal({
  storageKey,
  title = "Before you go — get a free rate review",
  description = "A licensed broker can compare real renewal rates from 30+ lenders for your file. Free, no obligation.",
}: ExitIntentModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(storageKey) === "1") return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        sessionStorage.setItem(storageKey, "1");
        setVisible(true);
        document.removeEventListener("mouseout", onLeave);
      }
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("mouseout", onLeave);
    }, 8_000);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [storageKey]);

  if (!visible) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-[100] m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/50 p-4 backdrop:bg-black/50"
      aria-labelledby="exit-intent-title"
    >
      <div className="max-w-md w-full rounded-2xl bg-background p-6 shadow-xl border">
        <h2 id="exit-intent-title" className="text-heading-4 font-bold mb-2">
          {title}
        </h2>
        <p className="text-body-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <a
              href="/book-a-call/"
              onClick={() => {
                trackLeadEvent("exit_intent_cta", { page: storageKey });
                trackCtaClick("exit_intent", "/book-a-call/");
              }}
            >
              Book Free Call
            </a>
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setVisible(false)}>
            Continue browsing
          </Button>
        </div>
      </div>
    </dialog>
  );
}
