'use client';

import { Mail, Clock, Calendar, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/nylas/types';

interface PendingConfirmationProps {
  email: string;
  serviceName: string;
  teamMember: TeamMember;
  startTime: Date;
  duration: number;
  expiresAt: Date;
  timezone: string;
  onBookAnother?: () => void;
  className?: string;
}

export function PendingConfirmation({
  email,
  serviceName,
  teamMember,
  startTime,
  duration,
  expiresAt,
  timezone,
  onBookAnother,
  className,
}: PendingConfirmationProps) {
  const locale = 'en-CA';

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: timezone,
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    });
  };

  const formatExpiry = (date: Date): string => {
    return date.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    });
  };

  return (
    <div className={cn('rounded-2xl border bg-card overflow-hidden shadow-sm max-w-5xl mx-auto', className)}>
      <div className="flex flex-col lg:flex-row lg:divide-x divide-y lg:divide-y-0">
        {/* Left Panel - Booking Summary */}
        <div className="p-5 lg:p-8 lg:w-[320px] lg:shrink-0 bg-gradient-to-b from-muted/30 to-transparent flex flex-col">
          {/* Team Member */}
          <div className="flex items-center gap-4">
            {teamMember.photo && (
              <img
                src={teamMember.photo}
                alt={teamMember.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-background shadow-md"
                loading="lazy"
                decoding="async"
              />
            )}
            <div>
              <p className="font-semibold text-lg">{teamMember.name}</p>
              <p className="text-sm text-muted-foreground">{teamMember.title}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="flex-1 flex flex-col justify-center py-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{formatDate(startTime)}</p>
                  <p className="text-xs text-muted-foreground">Date</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{formatTime(startTime)} · {duration} min</p>
                  <p className="text-xs text-muted-foreground">Time & Duration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Name */}
          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground">Service</p>
            <p className="font-medium">{serviceName}</p>
          </div>
        </div>

        {/* Right Panel - Email Confirmation */}
        <div className="p-5 lg:p-8 lg:flex-1 flex flex-col">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Check Your Email</h2>
            <p className="mt-2 text-muted-foreground">
              We sent a confirmation link to <strong className="text-foreground">{email}</strong>
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-4 p-4 rounded-xl bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-semibold">Check your inbox</p>
                <p className="text-sm text-muted-foreground">
                  Look for an email from LendCity with the subject "Confirm Your {serviceName}"
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-semibold">Click the confirmation link</p>
                <p className="text-sm text-muted-foreground">
                  This confirms your booking and adds it to the calendar
                </p>
              </div>
            </div>
          </div>

          {/* Expiry Warning */}
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 mb-8">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> Your confirmation link expires on {formatExpiry(expiresAt)}.{' '}
              If you don't confirm by then, you'll need to book again.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-auto space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Didn't receive the email? Check your spam folder
                {onBookAnother && (
                  <>
                    {' '}or{' '}
                    <button
                      onClick={onBookAnother}
                      className="text-primary hover:underline font-medium"
                    >
                      try booking again
                    </button>
                  </>
                )}
              </p>
            </div>

            <div className="flex justify-center">
              <Button asChild variant="outline" size="lg">
                <a href="/">Return to Homepage</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
