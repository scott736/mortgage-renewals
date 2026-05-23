"use client";

import { trackCtaClick } from "@/lib/analytics";
import { saveCalculatorContext } from "@/lib/calculator-context";

type TrackedBrokerLinkProps = {
  href?: string;
  location: string;
  className?: string;
  children: React.ReactNode;
  calculatorContext?: {
    tool: string;
    summary: string;
    data?: Record<string, string | number | boolean>;
  };
};

export default function TrackedBrokerLink({
  href = "/book-a-call/",
  location,
  className,
  children,
  calculatorContext,
}: TrackedBrokerLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        if (calculatorContext) {
          saveCalculatorContext({
            ...calculatorContext,
            page: typeof window !== "undefined" ? window.location.pathname : undefined,
          });
        }
        trackCtaClick(location, href);
      }}
    >
      {children}
    </a>
  );
}
