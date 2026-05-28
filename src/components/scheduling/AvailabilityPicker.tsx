'use client';

import { Suspense, use, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useFormState } from '@/hooks/use-form-state';
import type { Service, TeamMember, TimeSlot } from '@/lib/nylas/types';
import { cn } from '@/lib/utils';

import {
  type AvailabilityFetchParams,
  daysToRecord,
  getAvailabilityPromise,
} from './availability-cache';
import {
  AvailabilityPickerShell,
  type AvailabilityPickerShellProps,
} from './availability-picker-shell';
import {
  getAutoSelectedDate,
  getCalendarDays,
  getInitialMonth,
} from './availability-picker-utils';

interface AvailabilityPickerProps {
  service: Service;
  teamMember?: TeamMember;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  timezone: string;
  className?: string;
}

function AvailabilityPickerLoaded({
  fetchParams,
  onRetry,
  ...shellProps
}: AvailabilityPickerShellProps & {
  fetchParams: AvailabilityFetchParams;
  onRetry: () => void;
}) {
  const result = use(getAvailabilityPromise(fetchParams));
  const availabilityMap = useMemo(
    () => (result.ok ? daysToRecord(result.days) : {}),
    [result],
  );

  if (!result.ok) {
    return (
      <div className={cn('rounded-2xl border bg-card p-10 text-center shadow-sm', shellProps.className)}>
        <p className="mb-4 text-destructive">{result.error}</p>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const activeDate = shellProps.state.selectedDate ?? getAutoSelectedDate(availabilityMap, shellProps.today);
  const selectedDayData = activeDate ? availabilityMap[activeDate] : null;

  return (
    <AvailabilityPickerShell
      {...shellProps}
      isLoading={false}
      availabilityMap={availabilityMap}
      activeDate={activeDate}
      selectedDaySlots={selectedDayData?.slots ?? []}
    />
  );
}

export function AvailabilityPicker(props: AvailabilityPickerProps) {
  const [state, setState] = useFormState({
    selectedDate: null as string | null,
    currentMonth: getInitialMonth(),
  });
  const [retryNonce, setRetryNonce] = useState(0);

  const calendarDays = useMemo(() => getCalendarDays(state.currentMonth), [state.currentMonth]);
  const calendarStart = calendarDays[0]?.toISOString().split('T')[0] ?? '';
  const calendarEnd = calendarDays[calendarDays.length - 1]?.toISOString().split('T')[0] ?? '';
  const today = new Date().toLocaleDateString('en-CA', { timeZone: props.timezone });

  const fetchParams = useMemo<AvailabilityFetchParams>(
    () => ({
      serviceId: props.service.id,
      teamMemberId: props.teamMember?.id,
      startDate: calendarStart,
      endDate: calendarEnd,
      timezone: props.timezone,
      duration: props.service.duration,
      retryKey: retryNonce,
    }),
    [
      props.service.id,
      props.service.duration,
      props.teamMember?.id,
      props.timezone,
      calendarStart,
      calendarEnd,
      retryNonce,
    ],
  );

  const shellProps: AvailabilityPickerShellProps = {
    ...props,
    state,
    setState,
    calendarDays,
    today,
    isLoading: true,
    availabilityMap: {},
    activeDate: null,
    selectedDaySlots: [],
  };

  return (
    <Suspense fallback={<AvailabilityPickerShell {...shellProps} />}>
      <AvailabilityPickerLoaded
        {...shellProps}
        fetchParams={fetchParams}
        onRetry={() => setRetryNonce((nonce) => nonce + 1)}
      />
    </Suspense>
  );
}
