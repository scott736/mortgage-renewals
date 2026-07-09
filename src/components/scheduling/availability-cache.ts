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

type AvailabilityPrefetch = {
  params: Omit<AvailabilityFetchParams, 'retryKey'>;
  promise: Promise<AvailabilityApiResponse>;
};

declare global {
  interface Window {
    __availabilityPrefetch?: AvailabilityPrefetch;
  }
}

const MAX_CACHE_ENTRIES = 20;
const cache = new Map<string, Promise<AvailabilityLoadResult>>();

function getStableCacheKey(params: AvailabilityFetchParams): string {
  const { retryKey: _retryKey, ...rest } = params;
  return JSON.stringify(rest);
}

function trimCache(): void {
  while (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

function prefetchMatchesParams(
  prefetch: AvailabilityPrefetch,
  params: AvailabilityFetchParams,
): boolean {
  const { retryKey: _retryKey, ...rest } = params;
  return JSON.stringify(prefetch.params) === JSON.stringify(rest);
}

async function loadAvailability(params: AvailabilityFetchParams): Promise<AvailabilityLoadResult> {
  try {
    // Relative /api fetch has no origin during SSR — keep Suspense on the loading
    // fallback until the client re-runs this promise in the browser.
    if (typeof window === 'undefined') {
      await new Promise<void>(() => {});
    }

    let data: AvailabilityApiResponse | undefined;

    const prefetch = window.__availabilityPrefetch;
    if (prefetch && prefetchMatchesParams(prefetch, params)) {
      data = await prefetch.promise;
      delete window.__availabilityPrefetch;
    } else if (prefetch) {
      delete window.__availabilityPrefetch;
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
  const key = getStableCacheKey(params);

  if (params.retryKey > 0) {
    cache.delete(key);
  }

  const existing = cache.get(key);
  if (existing) {
    return existing;
  }

  const promise = loadAvailability(params);
  cache.set(key, promise);
  trimCache();
  return promise;
}

export function daysToRecord(days: DayAvailability[]): Record<string, DayAvailability> {
  const record: Record<string, DayAvailability> = {};
  for (const day of days) {
    record[day.date] = day;
  }
  return record;
}
