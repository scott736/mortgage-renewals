export const SITE_TITLE = "MortgageRenewalHub.ca — Canada's Mortgage Renewal Resource";
export const SITE_DESCRIPTION =
  "Canada's most comprehensive mortgage renewal resource. Compare rates, use our free calculators, and get expert guidance to save thousands at renewal.";

export const PROVINCE_PAGES = [
  { name: "Ontario", href: "/ontario-mortgage-renewal" },
  { name: "British Columbia", href: "/bc-mortgage-renewal" },
  { name: "Alberta", href: "/alberta-mortgage-renewal" },
  { name: "Quebec", href: "/quebec-mortgage-renewal" },
  { name: "Saskatchewan & Manitoba", href: "/saskatchewan-manitoba-mortgage-renewal" },
];

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
