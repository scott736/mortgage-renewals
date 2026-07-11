/**
 * Contextual bottom-of-page CTA config for Mortgage Renewal Hub.
 * Primary action is always book-a-call; secondary is contextual.
 */

export type CtaActionType = "book-call" | "calculator" | "guide" | "checklist" | "rates" | "switching";

export interface CtaAction {
  type: CtaActionType;
  label: string;
  href: string;
}

export interface PageCtaConfig {
  title: string;
  description: string;
  primary: CtaAction;
  secondary: CtaAction;
}

type Lang = "en" | "fr";

const STRINGS = {
  en: {
    bookCall: "Book Free Strategy Call",
    tryCalculator: "Use Renewal Calculator",
    readGuide: "Read the Renewal Guide",
    viewChecklist: "Open Renewal Checklist",
    compareRates: "Compare Best Rates",
    howSwitchingWorks: "How Switching Works",
    switchVsStay: "Switch vs Stay Calculator",
  },
  fr: {
    bookCall: "Réserver un appel stratégique",
    tryCalculator: "Utiliser le calculateur",
    readGuide: "Lire le guide de renouvellement",
    viewChecklist: "Ouvrir la liste de contrôle",
    compareRates: "Comparer les meilleurs taux",
    howSwitchingWorks: "Comment changer de prêteur",
    switchVsStay: "Calculateur changer ou rester",
  },
} as const;

const BOOK_CALL: Record<Lang, string> = {
  en: "/book-a-call/",
  fr: "/book-a-call/",
};

function prefixPath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  if (path.startsWith("/fr/")) return path;
  return `/fr${path}`;
}

function bookCall(lang: Lang): CtaAction {
  return { type: "book-call", label: STRINGS[lang].bookCall, href: BOOK_CALL[lang] };
}

function calculator(lang: Lang, path: string, label?: string): CtaAction {
  return {
    type: "calculator",
    label: label || STRINGS[lang].tryCalculator,
    href: prefixPath(lang, path),
  };
}

function guide(lang: Lang, path = "/mortgage-renewal-guide/", label?: string): CtaAction {
  return {
    type: "guide",
    label: label || STRINGS[lang].readGuide,
    href: prefixPath(lang, path),
  };
}

function checklist(lang: Lang): CtaAction {
  return {
    type: "checklist",
    label: STRINGS[lang].viewChecklist,
    href: prefixPath(lang, "/mortgage-renewal-checklist/"),
  };
}

function rates(lang: Lang): CtaAction {
  return {
    type: "rates",
    label: STRINGS[lang].compareRates,
    href: prefixPath(lang, "/best-mortgage-renewal-rates/"),
  };
}

function switching(lang: Lang): CtaAction {
  return {
    type: "switching",
    label: STRINGS[lang].howSwitchingWorks,
    href: prefixPath(lang, "/switching-lenders-at-renewal/"),
  };
}

/** Normalize pathname: strip trailing slash, extract lang and path without locale prefix. */
export function parsePagePath(pathname: string): { lang: Lang; path: string } {
  let path = pathname.replace(/\/$/, "") || "/";
  let lang: Lang = "en";

  if (path.startsWith("/fr/") || path === "/fr") {
    lang = "fr";
    path = path === "/fr" ? "/" : path.slice(3) || "/";
  }

  if (!path.startsWith("/")) path = `/${path}`;
  return { lang, path };
}

function matches(path: string, pattern: RegExp): boolean {
  return pattern.test(path);
}

function defaultPageCta(lang: Lang): PageCtaConfig {
  return {
    title:
      lang === "fr"
        ? "Prêt à économiser à votre renouvellement ?"
        : "Ready to Save at Your Mortgage Renewal?",
    description:
      lang === "fr"
        ? "Réservez un appel stratégique gratuit avec un courtier hypothécaire agréé. Comparez les taux de 30+ prêteurs."
        : "Book a free strategy call with a licensed Canadian mortgage broker. Compare rates from 30+ lenders and find the best deal for your renewal.",
    primary: bookCall(lang),
    secondary: guide(lang),
  };
}

/**
 * Contextual bottom-of-page CTA for static pages and blog posts.
 */
export function getPageCta(pathname: string): PageCtaConfig {
  const { lang, path } = parsePagePath(pathname);
  const s = STRINGS[lang];

  // Blog
  if (matches(path, /^\/blog(\/|$)/)) {
    return {
      title:
        lang === "fr"
          ? "Votre renouvellement approche ?"
          : "Is Your Renewal Coming Up?",
      description:
        lang === "fr"
          ? "Lisez le guide, puis réservez un appel pour comparer les offres avant d’auto-renouveler."
          : "Read the guide, then book a call to compare offers before you auto-renew.",
      primary: bookCall(lang),
      secondary: guide(lang),
    };
  }

  // Guide hub
  if (path === "/mortgage-renewal-guide" || path.includes("guide-renouvellement")) {
    return {
      title:
        lang === "fr"
          ? "Prêt à passer à l’action ?"
          : "Ready to Put This Guide Into Action?",
      description:
        lang === "fr"
          ? "Utilisez la liste de contrôle ou réservez un appel pour comparer les prêteurs."
          : "Use the checklist or book a call and we’ll compare lenders for your renewal.",
      primary: bookCall(lang),
      secondary: checklist(lang),
    };
  }

  // Switching
  if (matches(path, /switching-lenders|changer-preteur|switch-vs-stay/)) {
    return {
      title:
        lang === "fr"
          ? "Changer ou rester — on calcule avec vous"
          : "Switch or Stay — Let’s Run the Numbers",
      description:
        lang === "fr"
          ? "Comparez les coûts de transfert et les économies de taux avec un courtier."
          : "Compare transfer costs and rate savings with a licensed broker before you decide.",
      primary: bookCall(lang),
      secondary: calculator(lang, "/switch-vs-stay-calculator/", s.switchVsStay),
    };
  }

  // Checklist
  if (matches(path, /checklist|liste-de-controle|document-checklist/)) {
    return {
      title:
        lang === "fr"
          ? "Documents prêts — et les taux ?"
          : "Documents Ready — What About Rates?",
      description:
        lang === "fr"
          ? "Une fois la liste cochée, comparez les taux avant de signer la lettre de votre banque."
          : "Once the checklist is done, compare rates before you sign your bank’s letter.",
      primary: bookCall(lang),
      secondary: calculator(lang, "/mortgage-renewal-calculator/"),
    };
  }

  // Rates / BoC
  if (
    matches(
      path,
      /best-mortgage-renewal-rates|current-mortgage-rates|mortgage-rate-forecast|bank-of-canada|meilleurs-taux/
    )
  ) {
    return {
      title:
        lang === "fr"
          ? "Besoin d’aide pour interpréter ces taux ?"
          : "Need Help Interpreting These Rates?",
      description:
        lang === "fr"
          ? "Les tableaux sont un point de départ — un appel transforme les taux en plan de renouvellement."
          : "Rate tables are step one — a strategy call turns the numbers into a renewal plan.",
      primary: bookCall(lang),
      secondary: calculator(lang, "/mortgage-renewal-calculator/"),
    };
  }

  // Calculators
  if (matches(path, /calculator|calculateur/)) {
    return {
      title:
        lang === "fr"
          ? "Les chiffres ont du sens — et maintenant ?"
          : "The Numbers Make Sense — What’s Next?",
      description:
        lang === "fr"
          ? "Réservez un appel pour comparer les offres réelles, ou consultez les meilleurs taux."
          : "Book a call to compare real lender offers, or check today’s best renewal rates.",
      primary: bookCall(lang),
      secondary: rates(lang),
    };
  }

  // Bank / lender pages
  if (
    matches(
      path,
      /(td|rbc|scotiabank|bmo|cibc|national-bank|desjardins|first-national|mcap|equitable|haventree|home-trust|credit-union|b-lender|private)-mortgage-renewal|lender/
    )
  ) {
    return {
      title:
        lang === "fr"
          ? "Ne renouvelez pas automatiquement"
          : "Don’t Auto-Renew With Your Bank",
      description:
        lang === "fr"
          ? "Comparez l’offre de votre banque avec d’autres prêteurs — souvent sans test de résistance au renouvellement."
          : "Compare your bank’s offer against other lenders — often with no stress test at renewal.",
      primary: bookCall(lang),
      secondary: switching(lang),
    };
  }

  // Provincial
  if (
    matches(
      path,
      /(ontario|bc|alberta|quebec|manitoba|saskatchewan|atlantic-canada|territories)-mortgage-renewal/
    )
  ) {
    return {
      title:
        lang === "fr"
          ? "Renouvellement dans votre province ?"
          : "Renewing in Your Province?",
      description:
        lang === "fr"
          ? "Utilisez la liste de contrôle, puis réservez un appel pour des options locales."
          : "Use the checklist, then book a call for lender options that fit your province.",
      primary: bookCall(lang),
      secondary: checklist(lang),
    };
  }

  // Situation / specialty guides
  if (
    matches(
      path,
      /divorce|self-employed|bad-credit|job-loss|investment-property|first-time|seniors|payment-shock|military|new-to-canada|expat|estate|co-ownership|stress-test|blend-and-extend|heloc|penalty|discharge|negotiation/
    )
  ) {
    return {
      title:
        lang === "fr"
          ? "Votre situation mérite un plan sur mesure"
          : "Your Situation Deserves a Custom Plan",
      description:
        lang === "fr"
          ? "Réservez un appel gratuit — ou commencez par le guide de renouvellement."
          : "Book a free call — or start with the full renewal guide for the big picture.",
      primary: bookCall(lang),
      secondary: guide(lang),
    };
  }

  // FAQ / case studies
  if (matches(path, /faq|case-studies|reviews/)) {
    return {
      title:
        lang === "fr"
          ? "Encore des questions sur votre renouvellement ?"
          : "Still Have Questions About Your Renewal?",
      description:
        lang === "fr"
          ? "Parlez directement à un courtier — sans obligation, juste des réponses claires."
          : "Talk directly with a broker — no obligation, just clear answers.",
      primary: bookCall(lang),
      secondary: guide(lang),
    };
  }

  // Homepage
  if (path === "/") {
    return {
      title:
        lang === "fr"
          ? "Prêt pour votre renouvellement hypothécaire ?"
          : "Ready for Your Mortgage Renewal?",
      description:
        lang === "fr"
          ? "Comparez les taux, utilisez nos calculateurs, et réservez un appel gratuit avec un courtier agréé."
          : "Compare rates, use our calculators, and book a free call with a licensed broker.",
      primary: bookCall(lang),
      secondary: rates(lang),
    };
  }

  // Legal / soft
  if (matches(path, /terms|privacy|cookie|accessibility|editorial/)) {
    return {
      title:
        lang === "fr"
          ? "Des questions sur le renouvellement ?"
          : "Questions About Mortgage Renewal?",
      description:
        lang === "fr"
          ? "Nous sommes là pour vous aider à comprendre vos options en toute transparence."
          : "We’re here to help you understand your options with transparency.",
      primary: bookCall(lang),
      secondary: guide(lang),
    };
  }

  // Skip conversion pages themselves
  if (matches(path, /^\/(book-a-call|contact|pricing)(\/|$)/)) {
    return defaultPageCta(lang);
  }

  return defaultPageCta(lang);
}
