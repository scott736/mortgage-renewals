"use client";

import { X } from "lucide-react";
import { useState,useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/consts";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const SESSION_KEY = "banner-dismissed-session";

const Banner = ({ url = "/book-a-call/" }: { url?: string }) => {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const dismissed = useSyncExternalStore(
    () => () => {},
    () => sessionStorage.getItem(SESSION_KEY) === "true",
    () => false,
  );
  const [isVisible, setIsVisible] = useState(() => !dismissed);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  };

  if (!isClient || !isVisible) {
    return null;
  }

  return (
    <div className="bg-primary-300 relative">
      <div className="container flex flex-col items-center justify-between gap-3 py-3 pr-12 sm:flex-row">
        <div className="flex flex-1 flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-4">
          <span className="text-sm font-medium text-white">
            🇨🇦 Roughly 1M Canadian households renewing in 2026: are you getting the best rate?
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button size="sm" variant="translucent" asChild>
              <a
                href={url}
                onClick={() => trackCtaClick("banner_book", url)}
              >
                Book Free Strategy Call
              </a>
            </Button>
            <a
              href={BUSINESS.phone.tel}
              onClick={() => trackCtaClick("banner_phone", BUSINESS.phone.tel)}
              className="text-xs font-semibold text-white/90 underline hover:text-white"
            >
              Or call {BUSINESS.phone.display}
            </a>
          </div>
        </div>
        <button type="button"
          onClick={handleDismiss}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 rounded-sm p-1.5",
            "text-primary-foreground/70 hover:text-primary-foreground",
            "hover:bg-gray-0/10 transition-all duration-200 hover:scale-110",
            "focus:outline-none focus:ring-2 focus:ring-white/30",
          )}
          aria-label="Close banner for this visit"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
