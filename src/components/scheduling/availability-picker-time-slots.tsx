import { CalendarDays, Clock } from 'lucide-react';

import type { TimeSlot } from '@/lib/nylas/types';
import { cn } from '@/lib/utils';

interface AvailabilityPickerTimeSlotsProps {
  activeDate: string | null;
  selectedDaySlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  isLoading: boolean;
  availabilityCount: number;
  formatShortDate: (dateString: string) => string;
  formatTime: (isoString: string) => string;
  onSelectSlot: (slot: TimeSlot) => void;
}

export function AvailabilityPickerTimeSlots({
  activeDate,
  selectedDaySlots,
  selectedSlot,
  isLoading,
  availabilityCount,
  formatShortDate,
  formatTime,
  onSelectSlot,
}: AvailabilityPickerTimeSlotsProps) {
  return (
    <div className="p-5 lg:w-[280px] lg:shrink-0 lg:p-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <CalendarDays className="size-5 text-secondary" />
          <h4 className="text-lg font-bold">
            {activeDate ? formatShortDate(activeDate) : 'Available Times'}
          </h4>
        </div>
        {isLoading && availabilityCount === 0 ? (
          <p className="text-sm text-muted-foreground">Loading availability…</p>
        ) : activeDate ? (
          <p className="text-sm text-muted-foreground">
            {selectedDaySlots.length} time(s) available
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Select a date</p>
        )}
      </div>

      <div className="-mr-1 max-h-[300px] space-y-2 overflow-y-auto pr-1">
        {isLoading && availabilityCount === 0 ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="w-full animate-pulse rounded-md border-2 border-border bg-muted/30 px-4 py-3.5"
              >
                <div className="h-4 w-16 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : !activeDate ? (
          <div className="py-12 text-center">
            <CalendarDays className="mx-auto mb-4 size-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Choose a date to see available times</p>
          </div>
        ) : selectedDaySlots.length === 0 ? (
          <div className="py-12 text-center">
            <Clock className="mx-auto mb-4 size-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No times available on this date</p>
          </div>
        ) : (
          selectedDaySlots.map((slot, index) => {
            const isSelected =
              selectedSlot?.startTime === slot.startTime &&
              selectedSlot?.teamMemberId === slot.teamMemberId;

            return (
              <button
                key={`${slot.startTime}-${slot.teamMemberId}-${index}`}
                type="button"
                onClick={() => onSelectSlot(slot)}
                className={cn(
                  'w-full rounded-md border-2 px-4 py-3.5 text-sm font-semibold',
                  isSelected
                    ? 'border-secondary bg-secondary text-white shadow-md hover:bg-secondary/90'
                    : 'border-border bg-background hover:border-secondary hover:bg-secondary/10 dark:border-white/15',
                )}
              >
                {formatTime(slot.startTime)}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
