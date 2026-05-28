import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { DayAvailability } from '@/lib/nylas/types';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LOCALE = 'en-CA';

interface AvailabilityPickerCalendarProps {
  currentMonth: Date;
  calendarDays: Date[];
  availabilityMap: Record<string, DayAvailability>;
  activeDate: string | null;
  today: string;
  timezone: string;
  isLoading: boolean;
  isPreviousMonthDisabled: boolean;
  onSelectDate: (date: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function AvailabilityPickerCalendar({
  currentMonth,
  calendarDays,
  availabilityMap,
  activeDate,
  today,
  timezone,
  isLoading,
  isPreviousMonthDisabled,
  onSelectDate,
  onPreviousMonth,
  onNextMonth,
}: AvailabilityPickerCalendarProps) {
  const availabilityCount = Object.keys(availabilityMap).length;

  return (
    <div className="min-w-0 p-5 lg:min-w-[380px] lg:flex-1 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h4 className="text-xl font-bold">
          {currentMonth.toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' })}
        </h4>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={onPreviousMonth}
            disabled={isPreviousMonthDisabled || isLoading}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={onNextMonth}
            disabled={isLoading}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-3 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dateStr = day.toLocaleDateString('en-CA', { timeZone: timezone });
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = dateStr === today;
          const isPast = dateStr < today;
          const isSelected = activeDate === dateStr;
          const dayData = availabilityMap[dateStr];

          const hasAvailability =
            isLoading && availabilityCount === 0
              ? isCurrentMonth && !isPast
              : Boolean(dayData?.hasAvailability && !isPast);

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => hasAvailability && !isLoading && onSelectDate(dateStr)}
              disabled={!hasAvailability || isLoading}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-md text-sm font-medium',
                !isCurrentMonth && 'text-muted-foreground/25',
                isLoading && availabilityCount === 0 && isCurrentMonth && !isPast && 'text-foreground',
                !isLoading && isCurrentMonth && !hasAvailability && 'text-muted-foreground/40',
                !isLoading &&
                  hasAvailability &&
                  !isSelected &&
                  'text-foreground hover:bg-secondary/15 hover:text-secondary',
                isSelected && 'scale-105 bg-secondary text-white shadow-md',
                !hasAvailability && 'cursor-default',
                isToday && !isSelected && 'font-bold ring-2 ring-secondary/30',
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
