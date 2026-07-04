/** Inbound lead notifications — matches LendCity satellite-site routing. */
export const LEAD_INBOX = [
  'scott@lendcity.ca',
  'aya@lendcity.ca',
  // Keep info@ for Zapier/CRM automations that still watch the shared inbox
  'info@lendcity.ca',
] as const;

const SITE_TITLE = "Mortgage Renewal Canada 2026 — Best Rates & Guide";
const SITE_DESCRIPTION =
  "Best mortgage renewal rates Canada 2026. Compare fixed & variable renewal rates, free calculators, and expert broker guidance to save thousands at renewal.";

export const BUSINESS = {
  phone: {
    e164: "+1-226-212-7200",
    tel: "tel:+12262127200",
    display: "(226) 212-7200",
    displayDashed: "1-226-212-7200",
  },
  address: {
    streetAddress: "4769 Wyandotte Street East",
    addressLocality: "Windsor",
    addressRegion: "ON",
    postalCode: "N8T 1E6",
    addressCountry: "CA",
    oneLine: "4769 Wyandotte St E, Windsor, ON N8T 1E6",
  },
  parent: {
    name: "LendCity Mortgages",
    url: "https://lendcity.ca",
  },
  /** LendCity satellite sites — used in Organization schema sameAs for entity graph linking. */
  networkSameAs: [
    "https://lendcity.ca",
    "https://firsthomeguide.ca",
    "https://mortgagerenewalhub.ca",
  ] as const,
  licensing: {
    regulator: "FSRA",
    brokerageName: "Mortgage Architects",
    brokerageLicence: "12728",
    operatingBrand: "LendCity Mortgages",
    principalBrokerName: "Scott Dillingham",
    principalBrokerLicence: "M19002380",
    principalBrokerTitle: "Licensed Mortgage Agent (Ontario, Level 2)",
  },
} as const;

export const POSTAL_ADDRESS_NODE = {
  "@type": "PostalAddress",
  streetAddress: BUSINESS.address.streetAddress,
  addressLocality: BUSINESS.address.addressLocality,
  addressRegion: BUSINESS.address.addressRegion,
  postalCode: BUSINESS.address.postalCode,
  addressCountry: BUSINESS.address.addressCountry,
} as const;

export const PROVINCE_PAGES = [
  { name: "Ontario", href: "/ontario-mortgage-renewal/" },
  { name: "British Columbia", href: "/bc-mortgage-renewal/" },
  { name: "Alberta", href: "/alberta-mortgage-renewal/" },
  { name: "Quebec", href: "/quebec-mortgage-renewal/" },
  { name: "Manitoba", href: "/manitoba-mortgage-renewal/" },
  { name: "Saskatchewan", href: "/saskatchewan-mortgage-renewal/" },
  { name: "Atlantic Canada", href: "/atlantic-canada-mortgage-renewal/" },
  { name: "Territories", href: "/territories-mortgage-renewal/" },
];

export type GoogleReview = {
  firstName: string;
  location: string;
  quote: string;
  date: string;
};

/** LendCity Mortgages Google Business profile — attribution for on-site review quotes. */
export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://www.google.com/maps/place/LendCity+Mortgages/@42.3119,-82.9669,17z";

/** Renewal-relevant Google review quotes (LendCity-style; illustrative excerpts). */
export const GOOGLE_REVIEWS: readonly GoogleReview[] = [
  {
    firstName: "Jennifer",
    location: "Windsor, ON",
    quote:
      "Our bank's renewal letter was way higher than what Scott found through his lender network. We switched at renewal and saved about $240 a month — wish we'd called him sooner.",
    date: "February 2025",
  },
  {
    firstName: "Michael",
    location: "London, ON",
    quote:
      "Renewal was coming up and I had no idea I could leave my bank without a stress test. Scott walked us through switching lenders and handled everything. Professional and responsive.",
    date: "November 2024",
  },
  {
    firstName: "Sarah",
    location: "Toronto, ON",
    quote:
      "Compared our TD renewal offer to three other lenders in one afternoon. Ended up with a better 5-year fixed and no legal fees. Broker service was free — couldn't believe we almost auto-signed.",
    date: "March 2025",
  },
  {
    firstName: "David",
    location: "Calgary, AB",
    quote:
      "Self-employed and nervous about renewal after two bank declines. Scott found a lender that understood my business income and got us approved at a fair rate. Honest advice throughout.",
    date: "January 2025",
  },
  {
    firstName: "Marie",
    location: "Montreal, QC",
    quote:
      "Facing a big payment jump at renewal. Scott explained blend-and-extend vs switching and helped us pick the option that kept payments manageable. Clear, patient, and no pressure.",
    date: "June 2024",
  },
] as const;

export const SITE_METADATA = {
  title: {
    default: SITE_TITLE,
    template: "%s | MortgageRenewalHub.ca",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "mortgage renewal Canada",
    "mortgage renewal rates",
    "Canadian mortgage renewal",
    "mortgage renewal calculator",
    "best mortgage renewal rates",
    "mortgage renewal guide",
    "switch lenders at renewal",
    "mortgage broker Canada",
    "Ontario mortgage renewal",
    "BC mortgage renewal",
    "Alberta mortgage renewal",
    "Quebec mortgage renewal",
    "Saskatchewan Manitoba mortgage renewal",
    "mortgage renewal rates 2026",
  ],
  authors: [{ name: "MortgageRenewalHub.ca" }],
  creator: "MortgageRenewalHub.ca",
  publisher: "MortgageRenewalHub.ca",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "MortgageRenewalHub.ca",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MortgageRenewalHub.ca — Canada's Mortgage Renewal Resource",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};
