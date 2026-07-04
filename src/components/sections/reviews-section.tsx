"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useState } from "react";

import {
  GOOGLE_BUSINESS_PROFILE_URL,
  GOOGLE_REVIEWS,
  type GoogleReview,
} from "@/consts";
import { cn } from "@/lib/utils";

export type ReviewsSectionProps = {
  variant?: "default" | "strip" | "compact";
  className?: string;
  title?: string;
  subtitle?: string;
};

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-4 fill-warning-100 text-warning-100"
        />
      ))}
    </div>
  );
}

function GoogleAttribution({ className }: { className?: string }) {
  return (
    <p className={cn("text-body-xs text-muted-foreground", className)}>
      via{" "}
      <a
        href={GOOGLE_BUSINESS_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-secondary-100 hover:underline"
      >
        Google Reviews
      </a>{" "}
      · LendCity Mortgages
    </p>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <StarRating />
      <blockquote className="mt-4 flex-1 text-body-sm leading-relaxed text-foreground">
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <footer className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-body-sm-medium text-foreground">
          {review.firstName}
        </p>
        <p className="text-body-xs text-muted-foreground">
          {review.location} · {review.date}
        </p>
      </footer>
    </article>
  );
}

function StripReviewCard({ review }: { review: GoogleReview }) {
  return (
    <article className="min-w-[280px] max-w-[320px] shrink-0 snap-start rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <StarRating />
      <blockquote className="mt-3 text-body-sm leading-relaxed text-foreground line-clamp-4">
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <footer className="mt-3">
        <p className="text-body-xs-medium text-foreground">
          {review.firstName} · {review.location}
        </p>
        <p className="text-body-xs text-muted-foreground">{review.date}</p>
      </footer>
    </article>
  );
}

export default function ReviewsSection({
  variant = "default",
  className,
  title = "What Canadian Homeowners Say",
  subtitle = "Real feedback from homeowners who renewed with LendCity broker support.",
}: ReviewsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviews = GOOGLE_REVIEWS;

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? reviews.length - 1 : i - 1));
  }, [reviews.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === reviews.length - 1 ? 0 : i + 1));
  }, [reviews.length]);

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2 text-body-sm text-white/80",
          className,
        )}
      >
        <StarRating />
        <span>
          Trusted by Canadian homeowners — see{" "}
          <a
            href={GOOGLE_BUSINESS_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white underline underline-offset-2 hover:text-white/90"
          >
            Google Reviews
          </a>
        </span>
      </div>
    );
  }

  if (variant === "strip") {
    return (
      <section className={cn("mb-8", className)} aria-label="Google reviews">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-body-sm-medium text-secondary-100 uppercase tracking-wide mb-1">
              Client Feedback
            </p>
            <h2 className="text-heading-4">{title}</h2>
          </div>
          <GoogleAttribution />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
          {reviews.map((review) => (
            <StripReviewCard key={`${review.firstName}-${review.date}`} review={review} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn("py-16 lg:py-20", className)}
      aria-label="Google reviews"
    >
      <div className="container max-w-screen-xl px-6">
        <div className="text-center mb-10">
          <p className="text-body-sm-medium text-secondary-100 uppercase tracking-wide mb-3">
            Client Feedback
          </p>
          <h2 className="text-heading-2 mb-3">{title}</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard key={`${review.firstName}-${review.date}`} review={review} />
          ))}
        </div>
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
          {reviews.slice(3).map((review) => (
            <ReviewCard key={`${review.firstName}-${review.date}`} review={review} />
          ))}
        </div>

        {/* Mobile / tablet carousel */}
        <div className="lg:hidden">
          <div className="relative mx-auto max-w-md">
            <ReviewCard review={reviews[activeIndex]} />
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-foreground hover:bg-gray-25 transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="size-5" />
              </button>
              <div className="flex gap-2" role="tablist" aria-label="Review pagination">
                {reviews.map((review, i) => (
                  <button
                    key={`${review.firstName}-dot-${review.date}`}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Review ${i + 1} of ${reviews.length}`}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "size-2 rounded-full transition-colors",
                      i === activeIndex ? "bg-primary-100" : "bg-gray-200",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-foreground hover:bg-gray-25 transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <GoogleAttribution />
        </div>
      </div>
    </section>
  );
}
