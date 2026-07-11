/**
 * Contextual bottom-of-page CTA config for Mortgage Renewal Hub.
 * Fresh renewer copy — primary always /book-a-call/.
 */

export type CtaActionType =
  | "book-call"
  | "calculator"
  | "guide"
  | "checklist"
  | "rates"
  | "switching"
  | "stress-test"
  | "payment-shock";

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
    bookCall: "Book Free Renewal Call",
    tryCalculator: "Run Renewal Calculator",
    readGuide: "Read the Renewal Guide",
    viewChecklist: "Open Renewal Checklist",
    compareRates: "See Best Renewal Rates",
    howSwitchingWorks: "See How Switching Works",
    switchVsStay: "Switch vs Stay Calculator",
    stressTest: "Stress Test at Renewal",
    paymentShock: "Payment Shock Guide",
  },
  fr: {
    bookCall: "Réserver un appel de renouvellement",
    tryCalculator: "Lancer le calculateur",
    readGuide: "Lire le guide de renouvellement",
    viewChecklist: "Ouvrir la liste de contrôle",
    compareRates: "Voir les meilleurs taux",
    howSwitchingWorks: "Comment changer de prêteur",
    switchVsStay: "Calculateur changer ou rester",
    stressTest: "Test de résistance",
    paymentShock: "Guide choc de paiement",
  },
} as const;

function prefixPath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  if (path.startsWith("/fr/")) return path;
  return `/fr${path}`;
}

function bookCall(lang: Lang): CtaAction {
  return {
    type: "book-call",
    label: STRINGS[lang].bookCall,
    href: "/book-a-call/",
  };
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
        ? "Ne renouvelez pas à l'aveugle"
        : "Don't Auto-Renew Blind",
    description:
      lang === "fr"
        ? "Réservez un appel gratuit avec un courtier agréé. On compare les offres de 30+ prêteurs avant la date d'échéance."
        : "Book a free call with a licensed broker. We'll compare offers from 30+ lenders before your maturity date.",
    primary: bookCall(lang),
    secondary: guide(lang),
  };
}

export function getPageCta(pathname: string): PageCtaConfig {
  const { lang, path } = parsePagePath(pathname);
  const s = STRINGS[lang];

  if (matches(path, /^\/blog(\/|$)/)) {
    return {
      title:
        lang === "fr"
          ? "Votre renouvellement approche ?"
          : "Renewal coming up?",
      description:
        lang === "fr"
          ? "Passez du billet de nouvelles au plan d'action — guide evergreen, puis appel gratuit."
          : "Go from news to a plan — read the evergreen guide, then book a free call.",
      primary: bookCall(lang),
      secondary: guide(lang),
    };
  }

  if (path === "/mortgage-renewal-guide" || path.includes("guide-renouvellement")) {
    return {
      title:
        lang === "fr"
          ? "Passez du guide à l'action"
          : "Put the guide into action",
      description:
        lang === "fr"
          ? "Cochez la liste de contrôle, puis réservez un appel pour comparer de vraies offres."
          : "Tick the checklist, then book a call to compare real lender offers.",
      primary: bookCall(lang),
      secondary: checklist(lang),
    };
  }

  if (matches(path, /first-time-mortgage-renewal|first-renewal/)) {
    return {
      title:
        lang === "fr"
          ? "Premier renouvellement — faites-le bien"
          : "First renewal — do it once the right way",
      description:
        lang === "fr"
          ? "La plupart des Canadiens signent trop vite. On compare les options avant l'échéance."
          : "Most Canadians sign too fast. We'll compare options before maturity.",
      primary: bookCall(lang),
      secondary: checklist(lang),
    };
  }

  if (matches(path, /switching-lenders|changer-preteur|switch-vs-stay|discharge/)) {
    return {
      title:
        lang === "fr"
          ? "Changer ou rester — on calcule avec vous"
          : "Switch or stay — we'll run the math",
      description:
        lang === "fr"
          ? "Frais de quittance, échéancier et économies de taux — clairs avant de décider."
          : "Discharge fees, timeline, and rate savings — clear before you decide.",
      primary: bookCall(lang),
      secondary: calculator(lang, "/switch-vs-stay-calculator/", s.switchVsStay),
    };
  }

  if (matches(path, /checklist|liste-de-controle|document-checklist|renewal-letter|renewal-reminder/)) {
    return {
      title:
        lang === "fr"
          ? "Documents prêts — et les taux ?"
          : "Docs ready — what about the rate?",
      description:
        lang === "fr"
          ? "Une fois la liste cochée, comparez avant de signer la lettre de la banque."
          : "Once the checklist is done, compare before you sign the bank's letter.",
      primary: bookCall(lang),
      secondary: calculator(lang, "/mortgage-renewal-calculator/"),
    };
  }

  if (matches(path, /payment-shock/)) {
    return {
      title:
        lang === "fr"
          ? "Choc de paiement — options concrètes"
          : "Payment shock — concrete options",
      description:
        lang === "fr"
          ? "Terme, amortissement ou changement de prêteur — on modèle avant que vous signiez."
          : "Term, amortization, or a lender switch — we'll model it before you sign.",
      primary: bookCall(lang),
      secondary: calculator(lang, "/mortgage-renewal-calculator/"),
    };
  }

  if (matches(path, /stress-test|osfi-b20/)) {
    return {
      title:
        lang === "fr"
          ? "Le test de résistance décide-t-il pour vous ?"
          : "Does the stress test decide for you?",
      description:
        lang === "fr"
          ? "On confirme si un transfert simple est exempté — puis on compare les prêteurs."
          : "We'll confirm whether a straight switch is exempt — then compare lenders.",
      primary: bookCall(lang),
      secondary: switching(lang),
    };
  }

  if (
    matches(
      path,
      /best-mortgage-renewal-rates|current-mortgage-rates|mortgage-rate-forecast|bank-of-canada|meilleurs-taux/
    )
  ) {
    return {
      title:
        lang === "fr"
          ? "Les tableaux, c'est l'étape 1"
          : "Rate tables are step one",
      description:
        lang === "fr"
          ? "Un appel transforme les taux affichés en plan de renouvellement pour votre dossier."
          : "A call turns posted rates into a renewal plan for your file.",
      primary: bookCall(lang),
      secondary: calculator(lang, "/mortgage-renewal-calculator/"),
    };
  }

  if (matches(path, /calculator|calculateur/)) {
    return {
      title:
        lang === "fr"
          ? "Les chiffres collent — et maintenant ?"
          : "The numbers check out — now what?",
      description:
        lang === "fr"
          ? "Réservez un appel pour des offres réelles, ou consultez les meilleurs taux."
          : "Book a call for live offers, or check today's best renewal rates.",
      primary: bookCall(lang),
      secondary: rates(lang),
    };
  }

  if (
    matches(
      path,
      /(td|rbc|scotiabank|bmo|cibc|national-bank|desjardins|first-national|mcap|equitable|haventree|home-trust|credit-union|b-lender|private)-mortgage-renewal|lender/
    )
  ) {
    return {
      title:
        lang === "fr"
          ? "Votre banque ne magasine qu'une tablette"
          : "Your bank only shops one shelf",
      description:
        lang === "fr"
          ? "Comparez l'offre de renouvellement avec d'autres prêteurs — souvent sans test de résistance."
          : "Compare your renewal offer across lenders — often with no stress test.",
      primary: bookCall(lang),
      secondary: switching(lang),
    };
  }

  if (
    matches(
      path,
      /(ontario|bc|alberta|quebec|manitoba|saskatchewan|atlantic-canada|territories)-mortgage-renewal/
    )
  ) {
    return {
      title:
        lang === "fr"
          ? "Renouvellement dans votre province"
          : "Renewing in your province",
      description:
        lang === "fr"
          ? "Liste de contrôle locale, puis appel pour des options de prêteurs qui collent."
          : "Local checklist first, then a call for lender options that fit.",
      primary: bookCall(lang),
      secondary: checklist(lang),
    };
  }

  if (
    matches(
      path,
      /divorce|self-employed|bad-credit|job-loss|investment-property|seniors|military|new-to-canada|expat|estate|co-ownership|blend-and-extend|heloc|negotiation/
    )
  ) {
    return {
      title:
        lang === "fr"
          ? "Votre situation mérite un plan sur mesure"
          : "Your situation needs a custom plan",
      description:
        lang === "fr"
          ? "Réservez un appel gratuit — ou commencez par le guide de renouvellement."
          : "Book a free call — or start with the full renewal guide.",
      primary: bookCall(lang),
      secondary: guide(lang),
    };
  }

  if (matches(path, /faq|case-studies/)) {
    return {
      title:
        lang === "fr"
          ? "Encore des questions ?"
          : "Still have questions?",
      description:
        lang === "fr"
          ? "Parlez à un courtier — sans obligation, juste des réponses claires."
          : "Talk to a broker — no obligation, just clear answers.",
      primary: bookCall(lang),
      secondary: guide(lang),
    };
  }

  if (path === "/") {
    return {
      title:
        lang === "fr"
          ? "Prêt pour votre renouvellement ?"
          : "Ready for your renewal?",
      description:
        lang === "fr"
          ? "Comparez les taux, utilisez les calculateurs, puis réservez un appel gratuit."
          : "Compare rates, use the calculators, then book a free call.",
      primary: bookCall(lang),
      secondary: rates(lang),
    };
  }

  if (matches(path, /terms|privacy|cookie|accessibility/)) {
    return {
      title:
        lang === "fr"
          ? "Des questions sur le renouvellement ?"
          : "Questions about renewal?",
      description:
        lang === "fr"
          ? "On explique vos options clairement — sans jargon de banque."
          : "We'll explain your options clearly — without bank jargon.",
      primary: bookCall(lang),
      secondary: guide(lang),
    };
  }

  if (matches(path, /^\/(book-a-call|contact|pricing)(\/|$)/)) {
    return defaultPageCta(lang);
  }

  return defaultPageCta(lang);
}
