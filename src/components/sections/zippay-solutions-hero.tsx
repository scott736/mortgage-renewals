"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MiniImage = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export type ZippaySolutionsHeroProps = {
  tagline?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  center?: MiniImage;
  left?: MiniImage;
  right?: MiniImage;
};

export default function ZippaySolutionsHero({
  tagline = "Startups",
  title = "Spend Management for Your Startup",
  description = "Scale and run your business and let Zippay help optimize your spending with a single finance operations platform",
  primaryLabel = "Get Started",
  primaryHref = "/get-started",
  secondaryLabel = "Why Zippay",
  secondaryHref = "/faq",
  center = {
    src: "/images/solutions/mid.webp",
    alt: "Phone analytics",
    width: 498,
    height: 900,
  },
  left = {
    src: "/images/solutions/left.webp",
    alt: "Spending summary widget",
    width: 360,
    height: 360,
  },
  right = {
    src: "/images/solutions/right.webp",
    alt: "Recent activity widget",
    width: 360,
    height: 360,
  },
}: ZippaySolutionsHeroProps) {
  return (
    <section className="bg-primary-300 relative overflow-x-hidden px-6 pt-16 text-white lg:pt-24">
      <div className="container">
        <div className="flex flex-col items-center justify-center">
          <span className="text-body-xs-medium bg-gray-0/10 inline-flex h-7 items-center rounded-[10px] border border-white/15 px-3 text-center text-white/90 shadow-[0_1px_2px_0_rgba(13,13,18,0.06)] backdrop-blur-[2px]">
            {tagline}
          </span>

          <h1 className="text-heading-1 mt-4 max-w-[792px] text-center tracking-tight lg:text-[64px]">
            {title}
          </h1>
          <p className="text-body-md sm:text-body-lg mt-4 max-w-[538px] text-center text-white/80">
            {description}
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="w-full text-gray-900 sm:w-auto"
              variant="default"
            >
              <a href={primaryHref}>{primaryLabel}</a>
            </Button>
            <Button asChild variant="translucent" className="w-full sm:w-auto">
              <a href={secondaryHref}>{secondaryLabel}</a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-[360px] sm:max-w-[480px] md:max-w-[720px] lg:max-w-[1200px]">
          <div className="relative z-20 flex justify-center">
            <img
              src={center.src}
              alt={center.alt ?? "Preview"}
              width={center.width ?? 450}
              height={center.height ?? 414}
              className="z-10 mx-auto block h-auto w-[203px] object-contain sm:w-[280px] md:w-[360px] lg:w-[450px]"
            />
          </div>
          <div
            className={cn(
              "pointer-events-none absolute z-0 flex shrink-0 items-center justify-center p-2 lg:p-4",
              "bg-gray-0/5 rounded-[8px] border border-white/10 backdrop-blur-[20px] lg:rounded-2xl",
              "bottom-[36px] left-[-105px]",
              "md:bottom-[232px] md:left-[0px]",
            )}
          >
            <img
              src={left.src}
              alt={left.alt ?? "Widget"}
              width={left.width ?? 235}
              height={left.height ?? 255}
              className="h-auto w-[134px] select-none object-contain lg:w-[235px]"
            />
          </div>
          <div
            className={cn(
              "pointer-events-none absolute z-0 flex shrink-0 items-center justify-center p-2 lg:p-4",
              "bg-gray-0/5 rounded-[8px] border border-white/10 backdrop-blur-[20px] lg:rounded-2xl",
              "bottom-[17px] right-[-95px]",
              "md:bottom-[161px] md:right-[0px]",
            )}
          >
            <img
              src={right.src}
              alt={right.alt ?? "Widget"}
              width={right.width ?? 267}
              height={right.height ?? 250}
              className="h-auto w-[143px] select-none object-contain lg:w-[267px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
