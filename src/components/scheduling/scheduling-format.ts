const SCHEDULING_LOCALE = 'en-CA';

export function formatDateInTimezone(date: Date, timezone: string): string {
  return date.toLocaleDateString(SCHEDULING_LOCALE, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });
}

export function formatIsoDateInTimezone(isoString: string, timezone: string): string {
  return formatDateInTimezone(new Date(isoString), timezone);
}

export function formatTimeFromDate(date: Date, timezone: string): string {
  return date
    .toLocaleTimeString(SCHEDULING_LOCALE, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    })
    .toLowerCase();
}

export function formatTimeFromIso(isoString: string, timezone: string): string {
  return formatTimeFromDate(new Date(isoString), timezone);
}

export function formatDateTimeInTimezone(date: Date, timezone: string): string {
  return date.toLocaleString(SCHEDULING_LOCALE, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
}

export function formatCalendarDate(date: Date, timezone: string): string {
  return date.toLocaleDateString(SCHEDULING_LOCALE, { timeZone: timezone });
}

export function formatSelectedDate(dateString: string, timezone?: string): string {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(SCHEDULING_LOCALE, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...(timezone ? { timeZone: timezone } : {}),
  });
}

export function formatShortDate(dateString: string, timezone?: string): string {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(SCHEDULING_LOCALE, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(timezone ? { timeZone: timezone } : {}),
  });
}
