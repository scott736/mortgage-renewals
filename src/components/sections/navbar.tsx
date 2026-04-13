import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type MegaLink = { label: string; href: string };
type MegaSection = { title: string; links: MegaLink[] };
type MegaItem = {
  key:
    | "calculators"
    | "guides"
    | "rates"
    | "lenders"
    | "situations"
    | "resources";
  label: string;
  href: string;
  featured: { title: string; description: string; href: string; cta: string };
  sections: MegaSection[];
};

const MEGA_NAV: MegaItem[] = [
  {
    key: "calculators",
    label: "Calculators",
    href: "/mortgage-renewal-calculator/",
    featured: {
      title: "Calculate your new payment",
      description:
        "Start with the renewal calculator — see payments at today's rates in under a minute.",
      href: "/mortgage-renewal-calculator/",
      cta: "Run the numbers",
    },
    sections: [
      {
        title: "Payment & Renewal",
        links: [
          { label: "All Renewal Calculators", href: "/mortgage-renewal-calculator/" },
          { label: "Stress Test Calculator", href: "/mortgage-stress-test-calculator/" },
          { label: "Amortization Schedule", href: "/amortization-schedule-calculator/" },
          { label: "Payment Frequency", href: "/mortgage-payment-frequency-canada/" },
          { label: "Accelerated Payment Savings", href: "/accelerated-payment-calculator/" },
          { label: "Prepayment / Lump-Sum", href: "/prepayment-lump-sum-calculator/" },
        ],
      },
      {
        title: "Switch & Savings",
        links: [
          { label: "Switch vs. Stay Break-Even", href: "/switch-vs-stay-calculator/" },
          { label: "Break-Even Switch", href: "/break-even-switch-calculator/" },
          { label: "Should I Switch? (Quiz)", href: "/should-i-switch-quiz/" },
          { label: "Rate Comparison (Scenarios)", href: "/rate-comparison-calculator/" },
          { label: "Blend-and-Extend", href: "/blend-and-extend-calculator/" },
        ],
      },
      {
        title: "Costs & Strategy",
        links: [
          { label: "Mortgage Penalty", href: "/mortgage-penalty-calculator/" },
          { label: "HELOC vs. Refinance", href: "/heloc-vs-refinance-calculator/" },
          { label: "Refinance / Debt Consolidation", href: "/refinance-debt-consolidation-calculator/" },
          { label: "Affordability Requalification", href: "/affordability-requalification-calculator/" },
          { label: "Rental Income Qualifying", href: "/rental-income-qualifying-calculator/" },
        ],
      },
    ],
  },
  {
    key: "guides",
    label: "Guides",
    href: "/mortgage-renewal-guide/",
    featured: {
      title: "The complete renewal guide",
      description:
        "Everything Canadian homeowners need to know before signing their next mortgage term.",
      href: "/mortgage-renewal-guide/",
      cta: "Read the guide",
    },
    sections: [
      {
        title: "Getting Started",
        links: [
          { label: "Complete Renewal Guide", href: "/mortgage-renewal-guide/" },
          { label: "What Is a Mortgage Renewal?", href: "/what-is-a-mortgage-renewal/" },
          { label: "Renewal vs. Refinancing", href: "/renewal-vs-refinancing/" },
          { label: "Early Mortgage Renewal", href: "/early-mortgage-renewal/" },
          { label: "Renewal Mistakes to Avoid", href: "/mortgage-renewal-mistakes/" },
          { label: "Mortgage Glossary", href: "/mortgage-renewal-glossary/" },
        ],
      },
      {
        title: "Switching & Porting",
        links: [
          { label: "Switching Lenders", href: "/switching-lenders-at-renewal/" },
          { label: "Porting a Mortgage", href: "/porting-a-mortgage-canada/" },
          { label: "Inter-Province Portability", href: "/inter-province-mortgage-portability/" },
          { label: "Discharge Fees (Canada)", href: "/mortgage-discharge-fees-canada/" },
          { label: "Title Insurance & Legal Fees", href: "/title-insurance-legal-fees-switching/" },
          { label: "Insurance at Switch", href: "/mortgage-insurance-at-switch/" },
          { label: "Appraisal at Renewal", href: "/mortgage-appraisal-at-renewal/" },
        ],
      },
      {
        title: "Rules, Rates & Options",
        links: [
          { label: "Fixed vs. Variable", href: "/fixed-vs-variable-mortgage-renewal/" },
          { label: "Insured vs. Conventional", href: "/insured-vs-conventional-mortgage-renewal/" },
          { label: "CMHC / Sagen / CG Rules", href: "/cmhc-sagen-canada-guaranty-at-renewal/" },
          { label: "OSFI B-20 Stress Test", href: "/osfi-b20-stress-test-at-renewal/" },
          { label: "Stress Test at Renewal", href: "/stress-test-mortgage-renewal/" },
          { label: "30-Year Amortization Rules", href: "/30-year-amortization-mortgage-renewal/" },
          { label: "Trigger Rate (Variable)", href: "/trigger-rate-variable-mortgage-canada/" },
          { label: "IRD vs. 3-Month Penalty", href: "/ird-vs-three-month-interest-penalty/" },
          { label: "Prepayment Privileges", href: "/mortgage-prepayment-privileges-canada/" },
          { label: "Collateral vs. Standard Charge", href: "/collateral-vs-standard-charge-mortgage/" },
          { label: "Skip-a-Payment", href: "/skip-a-payment-mortgage-canada/" },
          { label: "Renewing with Arrears", href: "/renewing-mortgage-with-arrears/" },
          { label: "Canadian Mortgage Charter", href: "/canadian-mortgage-charter/" },
        ],
      },
    ],
  },
  {
    key: "rates",
    label: "Rates",
    href: "/best-mortgage-renewal-rates/",
    featured: {
      title: "Today's best renewal rates",
      description:
        "Compare current Canadian mortgage rates across banks, monolines, and brokers.",
      href: "/best-mortgage-renewal-rates/",
      cta: "See today's rates",
    },
    sections: [
      {
        title: "Live Rates",
        links: [
          { label: "Best Renewal Rates", href: "/best-mortgage-renewal-rates/" },
          { label: "Current Mortgage Rates", href: "/current-mortgage-rates-canada/" },
          { label: "Rate Forecast", href: "/mortgage-rate-forecast/" },
        ],
      },
      {
        title: "Stay Informed",
        links: [
          { label: "Bank of Canada Decisions", href: "/bank-of-canada-rate-decisions/" },
          { label: "Rate Alert Signup", href: "/rate-alert/" },
        ],
      },
    ],
  },
  {
    key: "lenders",
    label: "Lenders",
    href: "/mortgage-lender-types-canada/",
    featured: {
      title: "Not sure which lender fits?",
      description:
        "A broker shops 50+ lenders for you — no cost, no obligation to switch.",
      href: "/mortgage-broker-renewal/",
      cta: "Talk to a broker",
    },
    sections: [
      {
        title: "Big Banks",
        links: [
          { label: "TD Canada Trust", href: "/td-mortgage-renewal/" },
          { label: "RBC Royal Bank", href: "/rbc-mortgage-renewal/" },
          { label: "BMO Bank of Montreal", href: "/bmo-mortgage-renewal/" },
          { label: "Scotiabank", href: "/scotiabank-mortgage-renewal/" },
          { label: "CIBC", href: "/cibc-mortgage-renewal/" },
          { label: "National Bank", href: "/national-bank-mortgage-renewal/" },
        ],
      },
      {
        title: "Alternatives",
        links: [
          { label: "All Canadian Lender Types", href: "/mortgage-lender-types-canada/" },
          { label: "First National (Monoline)", href: "/first-national-mortgage-renewal/" },
          { label: "MCAP (Monoline)", href: "/mcap-mortgage-renewal/" },
          { label: "Credit Unions", href: "/credit-union-mortgage-renewal-canada/" },
          { label: "B-Lender Renewal", href: "/b-lender-mortgage-renewal/" },
          { label: "Private Mortgage Renewal", href: "/private-mortgage-renewal/" },
          { label: "Lender Cheat Sheet", href: "/canadian-lender-cheat-sheet/" },
        ],
      },
      {
        title: "Products & Options",
        links: [
          { label: "Broker at Renewal", href: "/mortgage-broker-renewal/" },
          { label: "Canadian HELOC Guide", href: "/canadian-heloc-guide/" },
          { label: "Refinance in Canada", href: "/mortgage-refinance-canada/" },
          { label: "Second Mortgage at Renewal", href: "/second-mortgage-at-renewal/" },
          { label: "Readvanceable Mortgages", href: "/readvanceable-mortgage-canada/" },
          { label: "Bridge Financing", href: "/bridge-financing-at-renewal/" },
        ],
      },
    ],
  },
  {
    key: "situations",
    label: "Situations",
    href: "/self-employed-mortgage-renewal/",
    featured: {
      title: "Every renewal is different",
      description:
        "Book a free 30-minute call and we'll walk through options for your situation.",
      href: "/book-a-call/",
      cta: "Book free call",
    },
    sections: [
      {
        title: "Life Events",
        links: [
          { label: "Divorce", href: "/divorce-mortgage-renewal/" },
          { label: "Spousal Buyout", href: "/spousal-buyout-mortgage-renewal/" },
          { label: "Remove a Co-Signer", href: "/remove-co-signer-mortgage-renewal/" },
          { label: "Job Loss at Renewal", href: "/job-loss-mortgage-renewal/" },
          { label: "Estate / Power of Attorney", href: "/estate-mortgage-renewal/" },
          { label: "Common-Law Partners", href: "/common-law-mortgage-renewal/" },
        ],
      },
      {
        title: "Income & Credit",
        links: [
          { label: "Self-Employed", href: "/self-employed-mortgage-renewal/" },
          { label: "Bad Credit", href: "/bad-credit-mortgage-renewal/" },
          { label: "First-Time Renewer", href: "/first-time-mortgage-renewal/" },
          { label: "Rent-to-Own Graduate", href: "/rent-to-own-first-mortgage-renewal/" },
          { label: "Assuming a Mortgage", href: "/assuming-a-mortgage-canada/" },
        ],
      },
      {
        title: "Special Cases",
        links: [
          { label: "Seniors / Retirees", href: "/seniors-mortgage-renewal-canada/" },
          { label: "Reverse Mortgage Option", href: "/reverse-mortgage-at-renewal/" },
          { label: "Investment Property", href: "/investment-property-renewal/" },
          { label: "New to Canada", href: "/new-to-canada-mortgage-renewal/" },
          { label: "Non-Resident Renewal", href: "/non-resident-mortgage-renewal/" },
          { label: "Canadian Expat", href: "/canadian-expat-mortgage-renewal/" },
          { label: "Military Relocation (IRP)", href: "/military-relocation-mortgage-renewal/" },
          { label: "Co-Ownership / TIC", href: "/co-ownership-mortgage-renewal/" },
        ],
      },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    href: "/mortgage-renewal-checklist/",
    featured: {
      title: "The renewal checklist",
      description:
        "A printable step-by-step checklist so nothing slips through the cracks before renewal day.",
      href: "/mortgage-renewal-checklist/",
      cta: "Get the checklist",
    },
    sections: [
      {
        title: "By Province",
        links: [
          { label: "Ontario", href: "/ontario-mortgage-renewal/" },
          { label: "British Columbia", href: "/bc-mortgage-renewal/" },
          { label: "Alberta", href: "/alberta-mortgage-renewal/" },
          { label: "Quebec", href: "/quebec-mortgage-renewal/" },
          { label: "Manitoba", href: "/manitoba-mortgage-renewal/" },
          { label: "Saskatchewan", href: "/saskatchewan-mortgage-renewal/" },
          { label: "Atlantic Canada", href: "/atlantic-canada-mortgage-renewal/" },
          { label: "Territories", href: "/territories-mortgage-renewal/" },
        ],
      },
      {
        title: "Planning Tools",
        links: [
          { label: "Renewal Checklist", href: "/mortgage-renewal-checklist/" },
          { label: "PDF Checklist Download", href: "/mortgage-renewal-checklist-pdf/" },
          { label: "Document Checklist Generator", href: "/renewal-document-checklist-generator/" },
          { label: "Renewal Date Reminder", href: "/renewal-reminder/" },
          { label: "Term Decision Guide", href: "/mortgage-term-decision-guide/" },
          { label: "Negotiation Scripts", href: "/mortgage-negotiation-scripts/" },
          { label: "Flex Features", href: "/mortgage-flex-features-canada/" },
        ],
      },
      {
        title: "More Resources",
        links: [
          { label: "FAQ", href: "/mortgage-renewal-faq/" },
          { label: "News & Updates", href: "/mortgage-renewal-news/" },
          { label: "Case Studies", href: "/case-studies/" },
          { label: "Smith Manoeuvre at Renewal", href: "/smith-manoeuvre-at-renewal/" },
          { label: "Debt Consolidation at Renewal", href: "/mortgage-renewal-debt-consolidation/" },
          { label: "Fund RRSP / Renovations", href: "/renewal-funding-rrsp-renovations/" },
          { label: "FCAC / OBSI Complaints", href: "/fcac-obsi-mortgage-complaints/" },
          { label: "Site Map", href: "/mortgage-renewal-sitemap/" },
        ],
      },
    ],
  },
];

const MegaMenuPanel = ({ item }: { item: MegaItem }) => {
  const colClass =
    item.sections.length === 2 ? "md:grid-cols-3" : "md:grid-cols-4";
  return (
    <div
      className={cn(
        "grid w-[min(calc(100vw-3rem),1100px)] gap-8 p-8",
        colClass,
      )}
    >
      <a
        href={item.featured.href}
        className="group bg-primary text-primary-foreground relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-lg p-6"
      >
        <div>
          <div className="text-primary-foreground/70 mb-3 text-xs font-medium tracking-wider uppercase">
            {item.label}
          </div>
          <h3 className="mb-2 text-base leading-tight font-semibold tracking-tight">
            {item.featured.title}
          </h3>
          <p className="text-primary-foreground/85 text-xs leading-relaxed">
            {item.featured.description}
          </p>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium">
          {item.featured.cta}
          <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </a>

      {item.sections.map((section) => (
        <div key={section.title} className="min-w-0">
          <div className="text-muted-foreground border-border mb-3 border-b pb-2 text-xs font-medium tracking-wider uppercase">
            {section.title}
          </div>
          <ul className="space-y-0.5">
            {section.links.map((link) => (
              <li key={link.href}>
                <NavigationMenuLink asChild>
                  <a
                    href={link.href}
                    className="text-foreground/75 hover:text-foreground hover:bg-muted block rounded-md px-2 py-1.5 text-sm leading-snug transition-colors"
                  >
                    {link.label}
                  </a>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const MobileMegaPanel = ({
  item,
  onClose,
}: {
  item: MegaItem;
  onClose: () => void;
}) => (
  <div className="space-y-8">
    <a
      href={item.featured.href}
      onClick={onClose}
      className="bg-primary text-primary-foreground group block rounded-lg p-5"
    >
      <div className="text-primary-foreground/70 mb-2 text-xs font-medium tracking-wider uppercase">
        {item.label}
      </div>
      <h3 className="mb-2 text-base font-semibold">{item.featured.title}</h3>
      <p className="text-primary-foreground/85 mb-3 text-xs leading-relaxed">
        {item.featured.description}
      </p>
      <div className="flex items-center text-xs font-medium">
        {item.featured.cta}
        <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </a>

    {item.sections.map((section) => (
      <div key={section.title}>
        <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
          {section.title}
        </div>
        <ul className="divide-border border-border divide-y border-t">
          {section.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={onClose}
                className="text-foreground/85 hover:text-foreground flex items-center justify-between py-3 text-sm"
              >
                {link.label}
                <ArrowRight className="size-4 opacity-40" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuKey, setSubmenuKey] = useState<MegaItem["key"] | null>(null);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const closeMobile = () => {
    setIsOpen(false);
    setSubmenuKey(null);
  };

  const activeSubmenu = MEGA_NAV.find((x) => x.key === submenuKey) ?? null;

  return (
    <header className="bg-background border-border relative z-50 border-b">
      <div className="container">
        <NavigationMenu className="w-full max-w-full justify-start">
          <div className="flex h-20 w-full items-center justify-between gap-4 px-3.5 lg:px-6">
            <a href="/" className="flex shrink-0 items-center">
              <span className="text-primary text-xl font-bold tracking-tight">
                MortgageRenewal
                <span className="text-secondary-100">Hub</span>.ca
              </span>
            </a>

            <NavigationMenuList className="hidden xl:flex">
              {MEGA_NAV.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <NavigationMenuTrigger className="text-sm">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <MegaMenuPanel item={item} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>

            <div className="flex items-center gap-2.5">
              <a href="/book-a-call/" className="hidden xl:block">
                <Button size="sm" variant="secondary">
                  Book Free Call
                </Button>
              </a>
              <a href="/mortgage-renewal-calculator/" className="hidden xl:block">
                <Button size="sm">Compare Rates</Button>
              </a>
              <button
                className="text-muted-foreground relative flex size-8 items-center justify-center xl:hidden"
                onClick={() => {
                  if (isOpen) closeMobile();
                  else setIsOpen(true);
                }}
                aria-label="Toggle main menu"
                aria-expanded={isOpen}
              >
                {!isOpen ? (
                  <Menu className="size-5" />
                ) : (
                  <X className="size-5" />
                )}
              </button>
            </div>
          </div>
        </NavigationMenu>
      </div>

      {isOpen && (
        <div
          className="bg-background fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto xl:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div className="container px-6 py-6">
            {activeSubmenu ? (
              <>
                <button
                  type="button"
                  onClick={() => setSubmenuKey(null)}
                  className="text-muted-foreground hover:text-foreground -ml-2 mb-4 flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium"
                >
                  <ArrowLeft className="size-4" />
                  All sections
                </button>
                <h2 className="mb-6 text-xl font-semibold tracking-tight">
                  {activeSubmenu.label}
                </h2>
                <MobileMegaPanel item={activeSubmenu} onClose={closeMobile} />
              </>
            ) : (
              <>
                <ul className="divide-border border-border divide-y border-t">
                  {MEGA_NAV.map((item) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => setSubmenuKey(item.key)}
                        className="flex w-full items-center justify-between py-4 text-left"
                      >
                        <span className="text-base font-medium">
                          {item.label}
                        </span>
                        <ArrowRight className="size-4 opacity-40" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 pb-12">
                  <a href="/book-a-call/" onClick={closeMobile}>
                    <Button variant="secondary" className="w-full" size="lg">
                      Book Free Call
                    </Button>
                  </a>
                  <a
                    href="/mortgage-renewal-calculator/"
                    onClick={closeMobile}
                  >
                    <Button className="w-full" size="lg">
                      Compare Rates
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
