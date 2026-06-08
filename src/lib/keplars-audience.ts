const KEPLARS_API = 'https://api.keplars.com/api/v1';
const audienceCache = new Map<string, string>();

function adminKey(): string | undefined {
  return (
    import.meta.env.KEPLARS_ADMIN_API_KEY ||
    (typeof process !== 'undefined' ? process.env.KEPLARS_ADMIN_API_KEY : undefined)
  );
}

async function audienceIdForName(name: string): Promise<string> {
  const cached = audienceCache.get(name);
  if (cached) return cached;

  const key = adminKey();
  if (!key) throw new Error('KEPLARS_ADMIN_API_KEY not set');

  const res = await fetch(`${KEPLARS_API}/public/audiences/get-audiences?limit=100`, {
    headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Keplars audiences: ${res.status}`);

  for (const a of json?.data?.audiences ?? json?.data ?? []) {
    audienceCache.set(a.name, a.id);
  }
  const id = audienceCache.get(name);
  if (!id) throw new Error(`Audience not found: ${name}`);
  return id;
}

export async function enrollLeadSequence(options: {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}): Promise<void> {
  try {
    const key = adminKey();
    if (!key) {
      console.warn('KEPLARS_ADMIN_API_KEY missing — lead sequence not started');
      return;
    }

    const audienceId = await audienceIdForName('Leads-Active-Generic');

    const res = await fetch(`${KEPLARS_API}/public/contacts/add-contact`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: options.email,
        audience_id: audienceId,
        ...(options.firstName && { first_name: options.firstName }),
        ...(options.lastName && { last_name: options.lastName }),
        custom_attributes: {
          ...(options.source && { lead_source: options.source.slice(0, 120) }),
          lead_site: 'mortgagerenewalhub.ca',
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text.slice(0, 200));
    }
  } catch (err) {
    console.error('Keplars lead sequence enroll failed:', err);
  }
}
