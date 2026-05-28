import type { DayAvailability } from '@/lib/nylas/types';

export interface AvailabilityFetchParams {
  serviceId: string;
  teamMemberId?: string;
  startDate: string;
  endDate: string;
  timezone: string;
  duration: number;
  retryKey: number;
}

export type AvailabilityLoadResult =
  | { ok: true; days: DayAvailability[] }
  | { ok: false; error: string };

type AvailabilityApiResponse = {
  success: boolean;
  error?: string;
  data?: { days: DayAvailability[] };
};

declare global {
  interface Window {
    __availabilityPrefetch?: Promise<AvailabilityApiResponse>;
  }
}

const cache = new Map<string, Promise<AvailabilityLoadResult>>();

function getCacheKey(params: AvailabilityFetchParams): string {
  const { retryKey, ...rest } = params;
  return `${retryKey}:${JSON.stringify(rest)}`;
}

async function loadAvailability(params: AvailabilityFetchParams): Promise<AvailabilityLoadResult> {
  try {
    let data: AvailabilityApiResponse | undefined;

    if (typeof window !== 'undefined') {
      const prefetch = window.__availabilityPrefetch;
      if (prefetch) {
        data = await prefetch;
        delete window.__availabilityPrefetch;
      }
    }

    if (!data) {
      const response = await fetch('/api/nylas/availability/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: params.serviceId,
          teamMemberId: params.teamMemberId,
          startDate: params.startDate,
          endDate: params.endDate,
          timezone: params.timezone,
          duration: params.duration,
        }),
      });
      data = await response.json();

      if (response.status === 429) {
        return { ok: false, error: 'Please wait a moment before refreshing the calendar.' };
      }
    }

    if (!data.success) {
      return { ok: false, error: data.error || 'Failed to load availability' };
    }

    return { ok: true, days: data.data?.days ?? [] };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to load availability',
    };
  }
}

export function getAvailabilityPromise(params: AvailabilityFetchParams): Promise<AvailabilityLoadResult> {
  const key = getCacheKey(params);
  const existing = cache.get(key);
  if (existing) {
    return existing;
  }

  const promise = loadAvailability(params);
  cache.set(key, promise);
  return promise;
}

export function daysToRecord(days: DayAvailability[]): Record<string, DayAvailability> {
  const record: Record<string, DayAvailability> = {};
  for (const day of days) {
    record[day.date] = day;
  }
  return record;
}
