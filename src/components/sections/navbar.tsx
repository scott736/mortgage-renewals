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
import { cn } from "@/lib/utils";

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

  const ITEMS = [
    {
      label: "Calculators",
      href: "/mortgage-renewal-calculator",
      dropdownItems: [
        { title: "Renewal Payment Estimator", href: "/mortgage-renewal-calculator" },
        { title: "Rate Comparison Calculator", href: "/mortgage-renewal-calculator#rate-comparison" },
        { title: "Amortization Extension Calculator", href: "/mortgage-renewal-calculator#amortization" },
        { title: "Early Renewal Penalty Estimator", href: "/mortgage-renewal-calculator#penalty" },
        { title: "Debt Consolidation Calculator", href: "/mortgage-renewal-calculator#debt-consolidation" },
      ],
    },
    {
      label: "Guides",
      href: "/mortgage-renewal-guide",
      dropdownItems: [
        { title: "Complete Renewal Guide", href: "/mortgage-renewal-guide" },
        { title: "What Is a Mortgage Renewal?", href: "/what-is-a-mortgage-renewal" },
        { title: "Switching Lenders at Renewal", href: "/switching-lenders-at-renewal" },
        { title: "Lower Your Payments", href: "/lower-mortgage-payments-at-renewal" },
        { title: "Renewal vs. Refinancing", href: "/renewal-vs-refinancing" },
        { title: "Fixed vs. Variable", href: "/fixed-vs-variable-mortgage-renewal" },
        { title: "How a Broker Helps", href: "/mortgage-broker-renewal" },
        { title: "Renewal Mistakes to Avoid", href: "/mortgage-renewal-mistakes" },
        { title: "Mortgage Glossary", href: "/mortgage-renewal-glossary" },
      ],
    },
    { label: "Rates", href: "/best-mortgage-renewal-rates" },
    { label: "FAQ", href: "/mortgage-renewal-faq" },
    { label: "Provinces", href: "/ontario-mortgage-renewal" },
  ];

  const bgColor = "bg-background";

  return (
    <header
      className={cn(
        "lg:h-22 relative z-50 h-16 border-b border-b-gray-50 px-2.5 lg:px-0",
        bgColor,
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
            <a href="/book-a-call" className="hidden lg:block">
              <Button size="sm" variant="secondary">
                Book Free Call
              </Button>
            </a>
            <a href="/mortgage-renewal-calculator" className="hidden lg:block">
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
          bgColor,
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
              <a href="/book-a-call"><Button variant="secondary" className="w-full" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Book Free Call</Button></a>
              <a href="/mortgage-renewal-calculator"><Button className="w-full" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}>Compare Rates</Button></a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
