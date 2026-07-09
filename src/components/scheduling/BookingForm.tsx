'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { buildBookingNotes } from '@/lib/booking-notes';
import type { GuestInfo, MeetingType, Service, TeamMember, TimeSlot } from '@/lib/nylas/types';
import { cn } from '@/lib/utils';

import { BookingFormFields } from './booking-form-fields';
import { BookingFormSummary } from './booking-form-summary';

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

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  notes: z
    .string()
    .trim()
    .min(1, 'Please tell us what you would like to discuss')
    .max(1000, 'Notes must be less than 1000 characters'),
  maturityDate: z.string().optional(),
  currentLender: z.string().max(100).optional(),
  balance: z.string().max(50).optional(),
  province: z.string().max(50).optional(),
  website: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function getBookingPrefill(): Partial<FormData> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const prefill: Partial<FormData> = {};

  const renewalDate = params.get('renewal_date');
  if (renewalDate && /^\d{4}-\d{2}-\d{2}$/.test(renewalDate)) {
    prefill.maturityDate = renewalDate;
  }

  const province = params.get('province');
  if (province && PROVINCES.includes(province)) {
    prefill.province = province;
  }

  return prefill;
}

interface BookingFormProps {
  service: Service;
  teamMember: TeamMember;
  selectedSlot: TimeSlot;
  timezone: string;
  onSubmit: (guestInfo: GuestInfo) => Promise<void>;
  onBack: () => void;
  className?: string;
  selectedMeetingType?: MeetingType;
  onMeetingTypeChange?: (type: MeetingType) => void;
}

export function BookingForm({
  service,
  teamMember,
  selectedSlot,
  timezone,
  onSubmit,
  onBack: _onBack,
  className,
  selectedMeetingType,
  onMeetingTypeChange,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const prefill = useMemo(() => getBookingPrefill(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: prefill,
  });

  const handleFormSubmit = async (data: FormData) => {
    if (data.website) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const combinedNotes = buildBookingNotes(data.notes, {
        maturityDate: data.maturityDate,
        currentLender: data.currentLender,
        balance: data.balance,
        province: data.province,
      });

      await onSubmit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: combinedNotes,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-sm', className)}>
      <div className="flex flex-col lg:flex-row lg:divide-x lg:divide-y-0 divide-y">
        <BookingFormSummary
          service={service}
          teamMember={teamMember}
          selectedSlot={selectedSlot}
          timezone={timezone}
          selectedMeetingType={selectedMeetingType}
          onMeetingTypeChange={onMeetingTypeChange}
        />
        <BookingFormFields
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleSubmit(handleFormSubmit)}
        />
      </div>
    </div>
  );
}
