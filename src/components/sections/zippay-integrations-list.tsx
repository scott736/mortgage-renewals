import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type IntegrationCard = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  icon?: string;
  badges?: string[];
};

export type ZippayIntegrationsListProps = {
  items: IntegrationCard[];
  perPage?: number;
};

const PER_PAGE_DEFAULT = 6;

export default function ZippayIntegrationsList({
  items,
  perPage = PER_PAGE_DEFAULT,
}: ZippayIntegrationsListProps) {
  const categories = React.useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => s.add(i.category));
    return ["All Categories", ...Array.from(s).sort()];
  }, [items]);

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All Categories");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => setPage(1), [query, category]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const inCat = category === "All Categories" || i.category === category;
      if (!inCat) return false;
      if (!q) return true;
      return `${i.name} ${i.summary} ${i.category}`.toLowerCase().includes(q);
    });
  }, [items, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  return (
    <section className="px-6 py-10 lg:py-24">
      <div className="container grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar categories (desktop) */}
        <aside className="hidden lg:block">
          <p className="text-body-sm-medium text-gray-900">Categories</p>
          <ul className="mt-3 space-y-1">
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() => setCategory(c)}
                  className={cn(
                    "w-full rounded-[10px] px-3 py-2 text-left text-sm transition",
                    category === c
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <div>
          {/* Filters (mobile select + search) */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-1">
            <div className="lg:hidden">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-0 h-11 w-full rounded-[12px] border border-gray-100 pl-3 pr-10 text-sm text-gray-700 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <div className="relative w-full">
                <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
                  <img
                    src="/images/faq/search.svg"
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    className="h-5 w-5 opacity-80 invert dark:invert-0"
                    loading="lazy"
                  />
                </span>

                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find an app…"
                  className="bg-gray-0 block h-11 w-full rounded-[12px] border border-gray-200 pl-10 pr-4 text-sm text-gray-700 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {pageItems.map((i) => (
              <article
                key={i.slug}
                className="bg-gray-25 rounded-2xl border border-gray-50 p-5 shadow-[0_4px_11px_-1px_rgba(10,10,10,0.04)]"
              >
                <div className="flex items-start gap-3">
                  {!!i.icon && (
                    <div className="bg-gray-0 relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] border border-gray-50">
                      <img
                        src={i.icon}
                        alt=""
                        className="h-full w-full object-contain p-1"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-body-lg-medium text-foreground">
                      {i.name}
                    </p>
                    <p className="text-body-sm text-gray-500">{i.category}</p>
                  </div>
                </div>

                <p className="text-body-sm mt-3 text-gray-600">{i.summary}</p>

                <Button asChild className="mt-4 w-full" variant="secondary">
                  <a href={`/integrations/${i.slug}`}>
                    Learn More
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      className="ml-2 size-5"
                    >
                      <path
                        d="M7 5l6 5-6 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </Button>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-body-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
