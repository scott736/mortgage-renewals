'use client';

import { Loader2, Phone, User } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const PROVINCES = [
  'Ontario',
  'Quebec',
  'British Columbia',
  'Alberta',
  'Manitoba',
  'Saskatchewan',
  'Nova Scotia',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Prince Edward Island',
  'Yukon',
  'Northwest Territories',
  'Nunavut',
];

export type BookingFormFieldsData = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  maturityDate?: string;
  currentLender?: string;
  balance?: string;
  province?: string;
  website?: string;
};

interface BookingFormFieldsProps {
  register: UseFormRegister<BookingFormFieldsData>;
  errors: FieldErrors<BookingFormFieldsData>;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function BookingFormFields({
  register,
  errors,
  isSubmitting,
  submitError,
  onSubmit,
}: BookingFormFieldsProps) {
  return (
    <div className="flex-1 p-5 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Your Information</h2>
        <p className="mt-1 text-muted-foreground">Fill in your details to complete the booking.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <input
          type="text"
          {...register('website' as never)}
          className="absolute left-[-9999px]"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              placeholder="John Doe"
              className="pl-10"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="pl-10"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              className="pl-10"
              {...register('phone')}
              aria-invalid={!!errors.phone}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message as string}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maturityDate" className="text-sm font-medium">
              Renewal / maturity date{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input id="maturityDate" type="date" {...register('maturityDate')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentLender" className="text-sm font-medium">
              Current lender{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input id="currentLender" placeholder="e.g. TD, RBC, First National" {...register('currentLender')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance" className="text-sm font-medium">
              Mortgage balance{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input id="balance" placeholder="e.g. $450,000" {...register('balance')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province" className="text-sm font-medium">
              Province <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <select
              id="province"
              {...register('province')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            What would you like to discuss? <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="notes"
            placeholder="e.g. My renewal is in August; I'd like to compare my bank's offer with broker rates..."
            rows={3}
            className="resize-none"
            {...register('notes')}
            aria-invalid={!!errors.notes}
          />
          {errors.notes && (
            <p className="text-sm text-destructive">{errors.notes.message as string}</p>
          )}
        </div>

        {submitError && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {submitError}
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Booking…
              </>
            ) : (
              'Confirm & Book'
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            You will receive a confirmation email shortly.
          </p>
        </div>
      </form>
    </div>
  );
}
