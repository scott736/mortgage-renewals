import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { PROVINCE_PAGES } from "@/consts";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    label: "Calculators",
    href: "/mortgage-renewal-calculator/",
    dropdownItems: [
      { title: "All Renewal Calculators", href: "/mortgage-renewal-calculator/" },
      { title: "Stress Test Calculator", href: "/mortgage-stress-test-calculator/" },
      { title: "Blend-and-Extend Calculator", href: "/blend-and-extend-calculator/" },
      { title: "Switch vs. Stay Break-Even", href: "/switch-vs-stay-calculator/" },
      { title: "HELOC vs. Refinance", href: "/heloc-vs-refinance-calculator/" },
      { title: "Payment Frequency Calculator", href: "/mortgage-payment-frequency-canada/" },
      { title: "Mortgage Penalty Calculator", href: "/mortgage-penalty-calculator/" },
      { title: "Prepayment / Lump-Sum", href: "/prepayment-lump-sum-calculator/" },
      { title: "Amortization Schedule", href: "/amortization-schedule-calculator/" },
      { title: "Accelerated Payment Savings", href: "/accelerated-payment-calculator/" },
      { title: "Refinance / Debt Consolidation", href: "/refinance-debt-consolidation-calculator/" },
      { title: "Affordability Requalification", href: "/affordability-requalification-calculator/" },
      { title: "Rate Comparison (Scenarios)", href: "/rate-comparison-calculator/" },
      { title: "Rental Income Qualifying", href: "/rental-income-qualifying-calculator/" },
      { title: "Break-Even Switch", href: "/break-even-switch-calculator/" },
      { title: "Should I Switch? (Quiz)", href: "/should-i-switch-quiz/" },
    ],
  },
  {
    label: "Guides",
    href: "/mortgage-renewal-guide/",
    dropdownItems: [
      { title: "Complete Renewal Guide", href: "/mortgage-renewal-guide/" },
      { title: "What Is a Mortgage Renewal?", href: "/what-is-a-mortgage-renewal/" },
      { title: "Switching Lenders", href: "/switching-lenders-at-renewal/" },
      { title: "Early Mortgage Renewal", href: "/early-mortgage-renewal/" },
      { title: "Renewal vs. Refinancing", href: "/renewal-vs-refinancing/" },
      { title: "Mortgage Appraisal at Renewal", href: "/mortgage-appraisal-at-renewal/" },
      { title: "Discharge Fees (Canada)", href: "/mortgage-discharge-fees-canada/" },
      { title: "Title Insurance & Legal Fees", href: "/title-insurance-legal-fees-switching/" },
      { title: "Skip-a-Payment", href: "/skip-a-payment-mortgage-canada/" },
      { title: "Renewing with Arrears", href: "/renewing-mortgage-with-arrears/" },
      { title: "Porting a Mortgage", href: "/porting-a-mortgage-canada/" },
      { title: "Inter-Province Portability", href: "/inter-province-mortgage-portability/" },
      { title: "Collateral vs. Standard Charge", href: "/collateral-vs-standard-charge-mortgage/" },
      { title: "Prepayment Privileges", href: "/mortgage-prepayment-privileges-canada/" },
      { title: "Fixed vs. Variable", href: "/fixed-vs-variable-mortgage-renewal/" },
      { title: "Insured vs. Conventional", href: "/insured-vs-conventional-mortgage-renewal/" },
      { title: "CMHC / Sagen / CG Rules", href: "/cmhc-sagen-canada-guaranty-at-renewal/" },
      { title: "OSFI B-20 Stress Test", href: "/osfi-b20-stress-test-at-renewal/" },
      { title: "Stress Test at Renewal", href: "/stress-test-mortgage-renewal/" },
      { title: "Insurance at Switch", href: "/mortgage-insurance-at-switch/" },
      { title: "30-Year Amortization Rules", href: "/30-year-amortization-mortgage-renewal/" },
      { title: "Trigger Rate (Variable)", href: "/trigger-rate-variable-mortgage-canada/" },
      { title: "IRD vs. 3-Month Penalty", href: "/ird-vs-three-month-interest-penalty/" },
      { title: "Canadian Mortgage Charter", href: "/canadian-mortgage-charter/" },
      { title: "Renewal Mistakes", href: "/mortgage-renewal-mistakes/" },
      { title: "Mortgage Glossary", href: "/mortgage-renewal-glossary/" },
    ],
  },
  {
    label: "Rates",
    href: "/best-mortgage-renewal-rates/",
    dropdownItems: [
      { title: "Best Renewal Rates", href: "/best-mortgage-renewal-rates/" },
      { title: "Current Mortgage Rates", href: "/current-mortgage-rates-canada/" },
      { title: "Rate Forecast", href: "/mortgage-rate-forecast/" },
      { title: "Bank of Canada Decisions", href: "/bank-of-canada-rate-decisions/" },
      { title: "Rate Alert Signup", href: "/rate-alert/" },
    ],
  },
  {
    label: "Lenders & Products",
    href: "/mortgage-lender-types-canada/",
    dropdownItems: [
      { title: "All Canadian Lender Types", href: "/mortgage-lender-types-canada/" },
      { title: "Mortgage Broker at Renewal", href: "/mortgage-broker-renewal/" },
      { title: "TD Canada Trust", href: "/td-mortgage-renewal/" },
      { title: "RBC Royal Bank", href: "/rbc-mortgage-renewal/" },
      { title: "BMO Bank of Montreal", href: "/bmo-mortgage-renewal/" },
      { title: "Scotiabank", href: "/scotiabank-mortgage-renewal/" },
      { title: "CIBC", href: "/cibc-mortgage-renewal/" },
      { title: "National Bank", href: "/national-bank-mortgage-renewal/" },
      { title: "First National (Monoline)", href: "/first-national-mortgage-renewal/" },
      { title: "MCAP (Monoline)", href: "/mcap-mortgage-renewal/" },
      { title: "Credit Unions", href: "/credit-union-mortgage-renewal-canada/" },
      { title: "B-Lender Renewal", href: "/b-lender-mortgage-renewal/" },
      { title: "Private Mortgage Renewal", href: "/private-mortgage-renewal/" },
      { title: "Canadian HELOC Guide", href: "/canadian-heloc-guide/" },
      { title: "Refinance in Canada", href: "/mortgage-refinance-canada/" },
      { title: "Second Mortgage at Renewal", href: "/second-mortgage-at-renewal/" },
      { title: "Readvanceable Mortgages", href: "/readvanceable-mortgage-canada/" },
      { title: "Bridge Financing", href: "/bridge-financing-at-renewal/" },
      { title: "Lender Cheat Sheet", href: "/canadian-lender-cheat-sheet/" },
    ],
  },
  {
    label: "Situations",
    href: "/self-employed-mortgage-renewal/",
    dropdownItems: [
      { title: "Self-Employed", href: "/self-employed-mortgage-renewal/" },
      { title: "Bad Credit", href: "/bad-credit-mortgage-renewal/" },
      { title: "First-Time Renewer", href: "/first-time-mortgage-renewal/" },
      { title: "Seniors / Retirees", href: "/seniors-mortgage-renewal-canada/" },
      { title: "Reverse Mortgage Option", href: "/reverse-mortgage-at-renewal/" },
      { title: "Job Loss at Renewal", href: "/job-loss-mortgage-renewal/" },
      { title: "Divorce", href: "/divorce-mortgage-renewal/" },
      { title: "Spousal Buyout", href: "/spousal-buyout-mortgage-renewal/" },
      { title: "Remove a Co-Signer", href: "/remove-co-signer-mortgage-renewal/" },
      { title: "Investment Property", href: "/investment-property-renewal/" },
      { title: "New to Canada", href: "/new-to-canada-mortgage-renewal/" },
      { title: "Non-Resident Renewal", href: "/non-resident-mortgage-renewal/" },
      { title: "Canadian Expat", href: "/canadian-expat-mortgage-renewal/" },
      { title: "Common-Law Partners", href: "/common-law-mortgage-renewal/" },
      { title: "Military Relocation (IRP)", href: "/military-relocation-mortgage-renewal/" },
      { title: "Co-Ownership / TIC", href: "/co-ownership-mortgage-renewal/" },
      { title: "Rent-to-Own Graduate", href: "/rent-to-own-first-mortgage-renewal/" },
      { title: "Estate / POA", href: "/estate-mortgage-renewal/" },
      { title: "Assuming a Mortgage", href: "/assuming-a-mortgage-canada/" },
    ],
  },
  {
    label: "Provinces",
    href: "/ontario-mortgage-renewal/",
    dropdownItems: PROVINCE_PAGES.map((p) => ({ title: p.name, href: p.href })),
  },
  {
    label: "Resources",
    href: "/mortgage-renewal-faq/",
    dropdownItems: [
      { title: "FAQ", href: "/mortgage-renewal-faq/" },
      { title: "News & Updates", href: "/mortgage-renewal-news/" },
      { title: "Case Studies", href: "/case-studies/" },
      { title: "Renewal Checklist", href: "/mortgage-renewal-checklist/" },
      { title: "PDF Checklist Download", href: "/mortgage-renewal-checklist-pdf/" },
      { title: "Document Checklist Generator", href: "/renewal-document-checklist-generator/" },
      { title: "Renewal Date Reminder", href: "/renewal-reminder/" },
      { title: "Negotiation Scripts", href: "/mortgage-negotiation-scripts/" },
      { title: "Term Decision Guide", href: "/mortgage-term-decision-guide/" },
      { title: "Flex Features", href: "/mortgage-flex-features-canada/" },
      { title: "Smith Manoeuvre at Renewal", href: "/smith-manoeuvre-at-renewal/" },
      { title: "Debt Consolidation at Renewal", href: "/mortgage-renewal-debt-consolidation/" },
      { title: "Fund RRSP / Renovations", href: "/renewal-funding-rrsp-renovations/" },
      { title: "FCAC / OBSI Complaints", href: "/fcac-obsi-mortgage-complaints/" },
      { title: "Site Map", href: "/mortgage-renewal-sitemap/" },
    ],
  },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "lg:h-22 relative z-50 h-16 border-b border-b-gray-50 px-2.5 lg:px-0",
        "bg-background",
      )}
    >
      <div className="lg:h-22 container flex h-16 items-center">
        <div className="flex w-full items-center justify-between px-3.5 lg:px-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              MortgageRenewal<span className="text-secondary-100">Hub</span>.ca
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="flex items-center justify-center">
            <NavigationMenu className="mr-4 hidden items-center gap-8 lg:flex">
              <NavigationMenuList>
                {ITEMS.map((link) =>
                  link.dropdownItems ? (
                    <NavigationMenuItem
                      key={link.label}
                      className="text-body-sm-medium"
                    >
                      <NavigationMenuTrigger
                        className={cn(
                          "text-foreground text-body-sm-medium bg-transparent",
                          "hover:bg-transparent focus:bg-transparent active:bg-transparent",
                          "hover:text-muted-foreground focus:text-muted-foreground",
                          "data-[state=open]:text-muted-foreground data-[state=open]:bg-transparent",
                          "transition-none",
                        )}
                      >
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent
                        className={cn("bg-gray-0 rounded-2xl")}
                      >
                        <ul className="bg-gray-0 w-[400px] p-3">
                          {link.dropdownItems.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <a
                                  href={item.href}
                                  className="hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-hidden flex select-none items-center rounded-xl p-3 leading-none no-underline transition-colors hover:bg-gray-50"
                                >
                                  <div className="flex gap-2">
                                    <div className="space-y-1.5">
                                      <div className="text-foreground text-body-sm-medium font-medium leading-none">
                                        {item.title}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={link.label}>
                      <a
                        href={link.href}
                        className={cn(
                          "text-foreground hover:text-muted-foreground text-body-sm-medium p-2",
                        )}
                      >
                        {link.label}
                      </a>
                    </NavigationMenuItem>
                  ),
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2.5">
            <a href="/book-a-call/" className="hidden lg:block">
              <Button size="sm" variant="secondary">
                Book Free Call
              </Button>
            </a>
            <a href="/mortgage-renewal-calculator/" className="hidden lg:block">
              <Button size="sm">Compare Rates</Button>
            </a>

            {/* Hamburger (Mobile) */}
            <button
              className="text-muted-foreground relative flex size-8 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <div className="absolute left-1/2 top-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
                <span aria-hidden="true" className={cn("absolute block h-0.5 w-full rounded-full bg-gray-900 transition duration-500 ease-in-out", isMenuOpen ? "rotate-45" : "-translate-y-1.5")} />
                <span aria-hidden="true" className={cn("absolute block h-0.5 w-full rounded-full bg-gray-900 transition duration-500 ease-in-out", isMenuOpen ? "opacity-0" : "")} />
                <span aria-hidden="true" className={cn("absolute block h-0.5 w-full rounded-full bg-gray-900 transition duration-500 ease-in-out", isMenuOpen ? "-rotate-45" : "translate-y-1.5")} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          "container absolute inset-x-0 top-full flex h-[calc(100vh-64px)] flex-col px-2.5 lg:px-0",
          "transition duration-300 ease-in-out lg:hidden",
          isMenuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0",
          "bg-background",
        )}
      >
        <div className="flex h-[calc(100vh-80px)] flex-col px-5">
          <nav className="mt-6 flex flex-1 flex-col gap-6">
            {ITEMS.map((link) =>
              link.dropdownItems ? (
                <div key={link.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                    className="text-foreground text-body-lg-medium flex w-full items-center justify-between tracking-[-0.36px]"
                    aria-label={`${link.label} menu`}
                    aria-expanded={openDropdown === link.label}
                  >
                    {link.label}
                    <ChevronRight className={cn("h-4 w-4 transition-transform", openDropdown === link.label ? "rotate-90" : "")} aria-hidden="true" />
                  </button>
                  <div className={cn("ml-1 space-y-3 overflow-hidden border-b border-b-gray-50 transition-all", openDropdown === link.label ? "mt-3 max-h-[1000px] pb-6 opacity-100" : "max-h-0 opacity-0")}>
                    {link.dropdownItems.map((item) => (
                      <a key={item.title} href={item.href} onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }} className="hover:bg-accent flex items-start gap-3 rounded-xl p-2">
                        <div className="text-foreground font-medium">{item.title}</div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a key={link.label} href={link.href} className={cn("text-foreground text-body-lg-medium tracking-[-0.36px]")} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </a>
              ),
            )}
            <div className="flex flex-col gap-3 pb-20 sm:gap-4 lg:flex-row">
              <a href="/book-a-call/"><Button variant="secondary" className="w-full" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Book Free Call</Button></a>
              <a href="/mortgage-renewal-calculator/"><Button className="w-full" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Compare Rates</Button></a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
