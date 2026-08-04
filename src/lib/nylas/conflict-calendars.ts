/**
 * Resolve which calendars should block booking availability.
 *
 * Nylas Availability defaults to the primary calendar only. Vacation / OOO
 * blocks on secondary owned calendars were invisible to booking unless we
 * explicitly pass those calendar IDs.
 */

import type { TeamMember } from './types';

export interface ConflictCalendarLike {
  id: string;
  readOnly?: boolean;
  isOwnedByUser?: boolean;
  isPrimary?: boolean;
  name?: string;
}

/** Nylas open-hours prefer "9:00" over "09:00". */
export function normalizeOpenHourTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return time;
  return `${Number(match[1])}:${match[2]}`;
}

/** Static IDs from team-member config (always included). */
export function buildStaticConflictCalendarIds(member: TeamMember): string[] {
  const ids = new Set<string>(['primary']);
  if (member.calendars.primary) {
    ids.add(member.calendars.primary);
  }
  for (const id of member.calendars.additional ?? []) {
    if (id) ids.add(id);
  }
  return [...ids];
}

/**
 * Whether a calendar should block booking when busy.
 * Include primary + owned writable calendars; skip read-only subscriptions
 * (holidays, sports, etc.) that would create false conflicts.
 */
export function isConflictCalendar(calendar: ConflictCalendarLike): boolean {
  if (!calendar.id) return false;
  if (calendar.isPrimary) return true;
  if (calendar.readOnly) return false;
  return Boolean(calendar.isOwnedByUser);
}

/** Merge static config IDs with discovered calendars from a Nylas grant. */
export function mergeConflictCalendarIds(
  member: TeamMember,
  calendars: ConflictCalendarLike[],
): string[] {
  const ids = new Set(buildStaticConflictCalendarIds(member));
  for (const calendar of calendars) {
    if (isConflictCalendar(calendar)) {
      ids.add(calendar.id);
    }
  }
  return [...ids];
}
