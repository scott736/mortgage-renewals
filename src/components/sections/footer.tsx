import { BUSINESS, PROVINCE_PAGES } from "@/consts";

export default function Footer() {
  const year = new Date().getFullYear();

  const nav = [
    {
      title: "Guides",
      links: [
        { name: "Mortgage Renewal Guide", href: "/mortgage-renewal-guide/" },
        { name: "What Is a Renewal?", href: "/what-is-a-mortgage-renewal/" },
        { name: "Switching Lenders", href: "/switching-lenders-at-renewal/" },
        { name: "Fixed vs. Variable", href: "/fixed-vs-variable-mortgage-renewal/" },
        { name: "Renewal vs. Refinancing", href: "/renewal-vs-refinancing/" },
      ],
    },
    {
      title: "Tools & Rates",
      links: [
        { name: "Mortgage Calculators", href: "/mortgage-renewal-calculator/" },
        { name: "Best Renewal Rates", href: "/best-mortgage-renewal-rates/" },
        { name: "Lower Your Payments", href: "/lower-mortgage-payments-at-renewal/" },
        { name: "Renewal Checklist", href: "/mortgage-renewal-checklist/" },
        { name: "Renewal FAQ", href: "/mortgage-renewal-faq/" },
      ],
    },
    {
      title: "Provinces",
      links: PROVINCE_PAGES,
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about/" },
        { name: "Book a Free Call", href: "/book-a-call/" },
        { name: "Privacy Policy", href: "/privacy/" },
        { name: "Terms of Service", href: "/terms/" },
        { name: "Cookie Policy", href: "/cookie-policy/" },
        { name: "Accessibility", href: "/accessibility/" },
      ],
    },
  ];

  return (
    <footer className="bg-[oklch(28%_0.075_235)] border-t border-white/10 text-white">
      <div className="container px-6 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Brand */}
          <div className="flex flex-col justify-between gap-8">
            <div>
              <a href="/" className="inline-flex items-center">
                <span className="text-2xl font-bold tracking-tight text-white">
                  MortgageRenewal<span className="text-[oklch(63%_0.130_185)]">Hub</span>.ca
                </span>
              </a>
              <p className="mt-3 max-w-xs text-sm text-white/70 leading-relaxed">
                Canada's most comprehensive mortgage renewal resource. Compare rates, use free calculators, and get expert guidance.
              </p>
              <p className="mt-3 max-w-xs text-sm text-white/70 leading-relaxed">
                Powered by{" "}
                <a
                  href="https://lendcity.ca"
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-white underline-offset-2 hover:underline"
                >
                  LendCity Mortgages
                </a>
                {" "}— a licensed Canadian mortgage brokerage.
              </p>
              <div className="mt-4 inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/60">
                🇨🇦 Proudly serving Canadians coast to coast
              </div>
            </div>

            <div>
              <a
                href="/book-a-call/"
                className="inline-flex rounded-lg bg-[oklch(63%_0.130_185)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Book Free Strategy Call →
              </a>
              <p className="mt-2 text-xs text-white/50">Free · No obligation · Licensed professionals</p>
            </div>
          </div>

          {/* Nav grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {nav.map((section) => (
              <div key={section.title}>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-white/80 transition hover:text-white"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/60 sm:justify-start">
            <span>© {year} MortgageRenewalHub.ca</span>
            <span aria-hidden="true" className="text-white/30">—</span>
            <span>
              A{" "}
              <a
                href="https://lendcity.ca"
                target="_blank"
                rel="noopener"
                className="font-semibold text-white underline-offset-2 hover:underline"
              >
                LendCity
              </a>
              {" "}Resource
            </span>
            <a
              href={BUSINESS.phone.tel}
              className="text-white/70 hover:text-white"
            >
              📞 {BUSINESS.phone.displayDashed}
            </a>
            <span className="text-white/70">
              📍 {BUSINESS.address.oneLine}
            </span>
          </p>
          <p className="text-xs text-white/40 max-w-xl">
            For educational purposes only. Not financial advice. Always consult a licensed mortgage professional for advice specific to your situation.
          </p>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6 text-center">
          <p className="text-[11px] text-white/50 leading-relaxed">
            {BUSINESS.licensing.brokerageName}{" "}
            <span aria-hidden="true" className="text-white/30">·</span>{" "}
            {BUSINESS.licensing.regulator} brokerage #{BUSINESS.licensing.brokerageLicence}{" "}
            <span aria-hidden="true" className="text-white/30">·</span>{" "}
            Principal broker {BUSINESS.licensing.principalBrokerName}, {BUSINESS.licensing.regulator} agent #{BUSINESS.licensing.principalBrokerLicence}
          </p>
        </div>
      </div>
    </footer>
  );
}
