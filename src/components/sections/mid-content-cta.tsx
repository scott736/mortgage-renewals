"use client";

import { Button } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics";

export type MidContentCtaProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
};

export default function MidContentCta({
  title = "Don't auto-renew without a second look",
  description = "Book a free renewal call — a licensed broker will compare rates from 30+ lenders against your bank's letter.",
  primaryLabel = "Book Free Renewal Call",
  primaryHref = "/book-a-call/",
}: MidContentCtaProps) {
  return (
    <div className="my-10 rounded-xl border border-primary-25 bg-primary-0 p-6 sm:p-8">
      <h3 className="text-heading-5 text-primary-200 mb-2">{title}</h3>
      <p className="text-body-sm text-muted-foreground mb-4 max-w-2xl">{description}</p>
      <Button asChild>
        <a
          href={primaryHref}
          onClick={() => trackCtaClick("mid_content_cta", primaryHref)}
        >
          {primaryLabel}
        </a>
      </Button>
    </div>
  );
}
