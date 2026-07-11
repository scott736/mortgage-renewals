"use client";

import ReviewsSection from "@/components/sections/reviews-section";
import { Button } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export type ZippayCtaCardProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  softBg?: boolean;
};

export default function ZippayCtaCard({
  title = "Don't Auto-Renew Blind",
  description = "Book a free renewal call with a licensed Canadian broker. Compare offers from 30+ lenders before your maturity date.",
  primaryLabel = "Book Free Renewal Call",
  primaryHref = "/book-a-call/",
  secondaryLabel = "Read the Renewal Guide",
  secondaryHref = "/mortgage-renewal-guide/",
  softBg,
}: ZippayCtaCardProps) {
  return (
    <section
      className={cn(
        "px-6 py-10 lg:py-24",
        softBg && "bg-gray-25 dark:bg-gray-200",
      )}
    >
      <div className="container">
        <div className="bg-primary-300 rounded-[24px] px-6 py-12 text-white shadow-[0_4px_11px_-1px_rgba(10,10,10,0.04)] lg:rounded-[28px] lg:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
            <h2 className="text-heading-1 max-w-[637px] tracking-tight">
              {title}
            </h2>
            <p className="text-body-md sm:text-body-lg mx-auto mt-4 max-w-3xl text-white/80">
              {description}
            </p>
            <ReviewsSection variant="compact" className="mt-5" />
            <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="w-full text-gray-900 sm:w-auto"
                variant="default"
              >
                <a
                  href={primaryHref}
                  onClick={() => trackCtaClick("zippay_cta_primary", primaryHref)}
                >
                  {primaryLabel}
                </a>
              </Button>
              <Button
                asChild
                variant="translucent"
                className="w-full sm:w-auto"
              >
                <a
                  href={secondaryHref}
                  onClick={() => trackCtaClick("zippay_cta_secondary", secondaryHref)}
                >
                  {secondaryLabel}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
