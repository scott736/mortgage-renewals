import { Clock } from 'lucide-react';

import type { DayAvailability, Service, TeamMember, TimeSlot } from '@/lib/nylas/types';
import { cn } from '@/lib/utils';

import { AvailabilityPickerCalendar } from './availability-picker-calendar';
import { AvailabilityPickerMeetingPanel } from './availability-picker-meeting-panel';
import { AvailabilityPickerTimeSlots } from './availability-picker-time-slots';
import { formatSelectedDate, formatShortDate, formatTime } from './availability-picker-utils';

export interface AvailabilityPickerShellProps {
  service: Service;
  teamMember?: TeamMember;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  timezone: string;
  className?: string;
  state: { selectedDate: string | null; currentMonth: Date };
  setState: (patch: Partial<{ selectedDate: string | null; currentMonth: Date }>) => void;
  calendarDays: Date[];
  today: string;
  isLoading: boolean;
  availabilityMap: Record<string, DayAvailability>;
  activeDate: string | null;
  selectedDaySlots: TimeSlot[];
}

export function AvailabilityPickerShell({
  service,
  teamMember,
  selectedSlot,
  onSelectSlot,
  timezone,
  className,
  state,
  setState,
  calendarDays,
  today,
  isLoading,
  availabilityMap,
  activeDate,
  selectedDaySlots,
}: AvailabilityPickerShellProps) {
  const isPreviousMonthDisabled =
    state.currentMonth <= new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const availabilityCount = Object.keys(availabilityMap).length;

  return (
    <div
      className={cn(
        'mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-sm dark:border-white/15',
        className,
      )}
    >
      <div className="flex flex-col divide-y lg:flex-row lg:divide-x lg:divide-y-0 dark:divide-white/15 dark:lg:divide-white/15">
        <AvailabilityPickerMeetingPanel
          service={service}
          teamMember={teamMember}
          timezone={timezone}
        />
        <AvailabilityPickerCalendar
          currentMonth={state.currentMonth}
          calendarDays={calendarDays}
          availabilityMap={availabilityMap}
          activeDate={activeDate}
          today={today}
          timezone={timezone}
          isLoading={isLoading}
          isPreviousMonthDisabled={isPreviousMonthDisabled}
          onSelectDate={(date) => setState({ selectedDate: date })}
          onPreviousMonth={() =>
            setState({
              currentMonth: new Date(
                state.currentMonth.getFullYear(),
                state.currentMonth.getMonth() - 1,
                1,
              ),
            })
          }
          onNextMonth={() =>
            setState({
              currentMonth: new Date(
                state.currentMonth.getFullYear(),
                state.currentMonth.getMonth() + 1,
                1,
              ),
            })
          }
        />
        <AvailabilityPickerTimeSlots
          activeDate={activeDate}
          selectedDaySlots={selectedDaySlots}
          selectedSlot={selectedSlot}
          isLoading={isLoading}
          availabilityCount={availabilityCount}
          formatShortDate={formatShortDate}
          formatTime={(iso) => formatTime(iso, timezone)}
          onSelectSlot={onSelectSlot}
        />
      </div>

      {selectedSlot && (
        <div className="border-t bg-gradient-to-r from-secondary/5 to-muted/30 px-5 py-4 lg:px-8 lg:py-6 dark:border-white/15">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex min-w-0 items-center gap-3 lg:gap-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 ring-4 ring-secondary/10 lg:size-14">
                <Clock className="size-5 text-secondary lg:size-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-bold lg:text-lg">
                  {formatSelectedDate(selectedSlot.startTime.split('T')[0])}
                </p>
                <p className="text-muted-foreground">
                  {formatTime(selectedSlot.startTime, timezone)} · {service.duration} minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
