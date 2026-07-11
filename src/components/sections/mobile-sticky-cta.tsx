"use client";

import { BUSINESS } from "@/consts";
import { trackCtaClick } from "@/lib/analytics";

export default function MobileStickyCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background p-4 shadow-lg lg:hidden">
      <a
        href="/book-a-call/"
        onClick={() => trackCtaClick("mobile_sticky", "/book-a-call/")}
        className="block w-full rounded-lg bg-primary-100 text-white text-center py-3.5 font-semibold text-body-md-bold"
      >
        Book Free Renewal Call
      </a>
      <p className="mt-2 text-center text-body-xs text-muted-foreground">
        Or call{" "}
        <a
          href={BUSINESS.phone.tel}
          onClick={() => trackCtaClick("mobile_sticky_phone", BUSINESS.phone.tel)}
          className="font-semibold text-primary-100 underline"
        >
          {BUSINESS.phone.display}
        </a>
      </p>
    </div>
  );
}
