import type { DayAvailability } from '@/lib/nylas/types';

import { formatTimeFromIso } from './scheduling-format';

export { formatSelectedDate, formatShortDate } from './scheduling-format';

export function getInitialMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function getCalendarDays(currentMonth: Date): Date[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(lastDay);
  if (endDate.getDay() !== 6) {
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  }

  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function formatTime(isoString: string, timezone: string): string {
  return formatTimeFromIso(isoString, timezone);
}

export function getAutoSelectedDate(
  availabilityMap: Record<string, DayAvailability>,
  today: string,
): string | null {
  const days = Object.values(availabilityMap);
  const firstAvailable = days.find((day) => day.hasAvailability && day.date >= today);
  return firstAvailable?.date ?? null;
}
