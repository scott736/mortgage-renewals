// Internal-linking graph for MortgageRenewalHub.ca.
//
// LINK_META: one-line title + blurb for every linkable page. Used by the
// <RelatedLinks /> component so every page can surface a topically-matched,
// semantically-rich related-content block. Update here, render everywhere.
//
// RELATED: per-slug ordered list of 6 related hrefs, curated for topical
// relevance (cluster-mates + cross-cluster bridges). The goal is semantic
// SEO: every page reinforces 6 neighbour concepts with descriptive anchors,
// while hub pages (calculator hub, lender-types, renewal guide, best rates)
// receive proportionally more inbound links.

export type LinkMeta = { title: string; blurb: string };

export const LINK_META: Record<string, LinkMeta> = {
  // Homepage & core
  "/": {
    title: "Mortgage Renewal Home",
    blurb: "Canada's mortgage renewal resource — rates, calculators, and expert guidance.",
  },
  "/about/": {
    title: "About MortgageRenewalHub",
    blurb: "Who we are and why Canadians trust our renewal guidance.",
  },
  "/contact/": {
    title: "Contact Us",
    blurb: "Questions about your renewal? Reach our licensed team.",
  },
  "/pricing/": {
    title: "Broker Pricing",
    blurb: "Free to you — how Canadian mortgage brokers are compensated.",
  },
  "/book-a-call/": {
    title: "Book a Free Strategy Call",
    blurb: "15-minute call with a licensed broker — free, no obligation.",
  },

  // Guides (hub + spokes)
  "/mortgage-renewal-guide/": {
    title: "Complete Mortgage Renewal Guide",
    blurb: "Everything Canadians need to know about renewing a mortgage in 2026.",
  },
  "/what-is-a-mortgage-renewal/": {
    title: "What Is a Mortgage Renewal?",
    blurb: "Plain-English explainer of renewals, timelines, and your options.",
  },
  "/switching-lenders-at-renewal/": {
    title: "Switching Lenders at Renewal",
    blurb: "How to change lenders at renewal — no stress test on straight switches.",
  },
  "/stress-test-mortgage-renewal/": {
    title: "Stress Test at Renewal",
    blurb: "When the stress test applies, when it doesn't, and how to pass it.",
  },
  "/osfi-b20-stress-test-at-renewal/": {
    title: "OSFI B-20 Stress Test Rules",
    blurb: "The federal qualifying rule and how it shapes renewal switches.",
  },
  "/collateral-vs-standard-charge-mortgage/": {
    title: "Collateral vs. Standard Charge",
    blurb: "Why your mortgage charge type affects how easily you can switch.",
  },
  "/mortgage-prepayment-privileges-canada/": {
    title: "Prepayment Privileges in Canada",
    blurb: "Lump-sum, double-up, and 15/15 vs. 20/20 privilege breakdown.",
  },
  "/canadian-mortgage-charter/": {
    title: "Canadian Mortgage Charter",
    blurb: "Federal renewal protections every Canadian borrower should know.",
  },
  "/fixed-vs-variable-mortgage-renewal/": {
    title: "Fixed vs. Variable at Renewal",
    blurb: "Choosing between fixed and variable in today's rate environment.",
  },
  "/insured-vs-conventional-mortgage-renewal/": {
    title: "Insured vs. Conventional",
    blurb: "How mortgage insurance changes your rate and switching options.",
  },
  "/30-year-amortization-mortgage-renewal/": {
    title: "30-Year Amortization Rules",
    blurb: "When 30-year amortizations are allowed and who qualifies.",
  },
  "/trigger-rate-variable-mortgage-canada/": {
    title: "Trigger Rate & Variable Mortgages",
    blurb: "What a trigger rate is, how it's hit, and your response options.",
  },
  "/ird-vs-three-month-interest-penalty/": {
    title: "IRD vs. 3-Month Interest Penalty",
    blurb: "Breaking a mortgage early — how both penalty methods are calculated.",
  },
  "/porting-a-mortgage-canada/": {
    title: "Porting a Mortgage in Canada",
    blurb: "Moving your mortgage to a new property without breaking it.",
  },
  "/mortgage-renewal-mistakes/": {
    title: "Top Renewal Mistakes to Avoid",
    blurb: "The costliest errors Canadians make at renewal — and how to dodge them.",
  },
  "/renewal-vs-refinancing/": {
    title: "Renewal vs. Refinancing",
    blurb: "When a renewal is enough and when a refinance makes more sense.",
  },
  "/lower-mortgage-payments-at-renewal/": {
    title: "Lower Your Payments at Renewal",
    blurb: "Legitimate levers to reduce monthly payment pressure at renewal.",
  },
  "/mortgage-renewal-term-lengths/": {
    title: "Mortgage Term Lengths Explained",
    blurb: "1-year through 10-year fixed/variable terms compared for renewals.",
  },
  "/mortgage-term-decision-guide/": {
    title: "Term Decision Guide",
    blurb: "Framework for choosing your next term based on goals and risk.",
  },

  // Calculators (hub + spokes)
  "/mortgage-renewal-calculator/": {
    title: "All Renewal Calculators",
    blurb: "Payment, stress test, switch break-even, prepayment — all in one place.",
  },
  "/mortgage-stress-test-calculator/": {
    title: "Stress Test Calculator",
    blurb: "See if you qualify at today's benchmark qualifying rate.",
  },
  "/blend-and-extend-calculator/": {
    title: "Blend-and-Extend Calculator",
    blurb: "Model a blended rate vs. breaking and re-qualifying.",
  },
  "/switch-vs-stay-calculator/": {
    title: "Switch vs. Stay Calculator",
    blurb: "Compare staying with your lender vs. switching, net of fees.",
  },
  "/heloc-vs-refinance-calculator/": {
    title: "HELOC vs. Refinance Calculator",
    blurb: "Accessing equity — HELOC vs. refinance side-by-side.",
  },
  "/mortgage-payment-frequency-canada/": {
    title: "Payment Frequency Calculator",
    blurb: "Accelerated bi-weekly vs. monthly — see total interest saved.",
  },
  "/break-even-switch-calculator/": {
    title: "Break-Even Switch Calculator",
    blurb: "How many months until switching lenders pays for itself.",
  },
  "/accelerated-payment-calculator/": {
    title: "Accelerated Payment Calculator",
    blurb: "Shorten amortization with accelerated weekly or bi-weekly payments.",
  },
  "/affordability-requalification-calculator/": {
    title: "Affordability Requalification Calculator",
    blurb: "Re-test your borrowing capacity before switching lenders.",
  },
  "/amortization-schedule-calculator/": {
    title: "Amortization Schedule Calculator",
    blurb: "See the principal/interest split for every month of your new term.",
  },
  "/prepayment-lump-sum-calculator/": {
    title: "Lump-Sum Prepayment Calculator",
    blurb: "Model interest savings from a one-time lump-sum payment.",
  },
  "/rate-comparison-calculator/": {
    title: "Rate Comparison Calculator",
    blurb: "Compare up to four rates and terms side-by-side.",
  },
  "/refinance-debt-consolidation-calculator/": {
    title: "Debt Consolidation Refinance Calculator",
    blurb: "See the cash-flow impact of rolling debt into your mortgage.",
  },
  "/rental-income-qualifying-calculator/": {
    title: "Rental Income Qualifying Calculator",
    blurb: "How much of your rental income lenders will actually count.",
  },
  "/mortgage-penalty-calculator/": {
    title: "Prepayment Penalty Calculator",
    blurb: "Estimate IRD or 3-month interest before breaking early.",
  },

  // Lenders (hub + banks + broker + alt-lenders)
  "/mortgage-lender-types-canada/": {
    title: "Canadian Mortgage Lender Types",
    blurb: "Big banks, monolines, credit unions, B-lenders, private — compared.",
  },
  "/mortgage-broker-renewal/": {
    title: "Using a Broker at Renewal",
    blurb: "How a broker shops 30+ lenders at no cost to you.",
  },
  "/td-mortgage-renewal/": {
    title: "TD Canada Trust Renewal",
    blurb: "TD renewal rates, collateral-charge considerations, and switching tips.",
  },
  "/rbc-mortgage-renewal/": {
    title: "RBC Royal Bank Renewal",
    blurb: "RBC renewal process, rate discount tiers, and alternatives.",
  },
  "/bmo-mortgage-renewal/": {
    title: "BMO Bank of Montreal Renewal",
    blurb: "BMO Smart Fixed vs. standard — and how it renews.",
  },
  "/scotiabank-mortgage-renewal/": {
    title: "Scotiabank Renewal",
    blurb: "Scotiabank STEP renewal mechanics and switching considerations.",
  },
  "/cibc-mortgage-renewal/": {
    title: "CIBC Renewal",
    blurb: "CIBC renewal process and how to negotiate a better rate.",
  },
  "/national-bank-mortgage-renewal/": {
    title: "National Bank Renewal",
    blurb: "National Bank All-In-One and standard mortgage renewals.",
  },
  "/first-national-mortgage-renewal/": {
    title: "First National Renewal (Monoline)",
    blurb: "Renewing with Canada's largest monoline lender.",
  },
  "/mcap-mortgage-renewal/": {
    title: "MCAP Renewal (Monoline)",
    blurb: "MCAP renewal process, rate sheets, and switching options.",
  },
  "/credit-union-mortgage-renewal-canada/": {
    title: "Credit Union Renewals",
    blurb: "Provincially-regulated credit unions and renewal flexibility.",
  },
  "/b-lender-mortgage-renewal/": {
    title: "B-Lender Renewals",
    blurb: "Alternative lenders for bruised credit, self-employed, or rentals.",
  },
  "/private-mortgage-renewal/": {
    title: "Private Mortgage Renewal",
    blurb: "Private 1-year terms — when they fit and how to exit.",
  },
  "/canadian-lender-cheat-sheet/": {
    title: "Canadian Lender Cheat Sheet",
    blurb: "Side-by-side reference: every major Canadian mortgage lender.",
  },

  // Provinces
  "/ontario-mortgage-renewal/": {
    title: "Ontario Mortgage Renewal",
    blurb: "Ontario-specific rules, rates, and lender options at renewal.",
  },
  "/bc-mortgage-renewal/": {
    title: "British Columbia Mortgage Renewal",
    blurb: "BC renewals — property-transfer tax, PTT, and lender landscape.",
  },
  "/alberta-mortgage-renewal/": {
    title: "Alberta Mortgage Renewal",
    blurb: "Alberta renewals — non-recourse lending and unique considerations.",
  },
  "/quebec-mortgage-renewal/": {
    title: "Quebec Mortgage Renewal",
    blurb: "Quebec-specific civil code rules for renewing your mortgage.",
  },
  "/manitoba-mortgage-renewal/": {
    title: "Manitoba Mortgage Renewal",
    blurb: "Manitoba renewals — credit unions and regional lender options.",
  },
  "/saskatchewan-mortgage-renewal/": {
    title: "Saskatchewan Mortgage Renewal",
    blurb: "Saskatchewan renewals and the foreclosure/POS process to know.",
  },
  "/atlantic-canada-mortgage-renewal/": {
    title: "Atlantic Canada Mortgage Renewal",
    blurb: "NS, NB, PEI, NL — renewal rules, rates, and local lenders.",
  },
  "/territories-mortgage-renewal/": {
    title: "Territories Mortgage Renewal",
    blurb: "Yukon, NWT, Nunavut — lender access and renewal realities.",
  },

  // Rates
  "/best-mortgage-renewal-rates/": {
    title: "Best Mortgage Renewal Rates",
    blurb: "Current best renewal rates — fixed and variable — across Canada.",
  },
  "/current-mortgage-rates-canada/": {
    title: "Current Mortgage Rates",
    blurb: "Today's Canadian mortgage rates across major lenders.",
  },
  "/mortgage-rate-forecast/": {
    title: "Canadian Rate Forecast",
    blurb: "Where rates are heading — major bank forecasts for 2026 and beyond.",
  },
  "/bank-of-canada-rate-decisions/": {
    title: "Bank of Canada Rate Decisions",
    blurb: "Every BoC rate decision and what it means for your mortgage.",
  },
  "/rate-alert/": {
    title: "Rate Alert Signup",
    blurb: "Get notified when renewal rates move — weekly update.",
  },

  // Situations
  "/self-employed-mortgage-renewal/": {
    title: "Self-Employed Renewal",
    blurb: "BFS income, stated income, and lender-fit for self-employed borrowers.",
  },
  "/bad-credit-mortgage-renewal/": {
    title: "Bad Credit Renewal",
    blurb: "Renewing when your score has dropped — A, B, and private options.",
  },
  "/first-time-mortgage-renewal/": {
    title: "First-Time Renewer's Guide",
    blurb: "Step-by-step for anyone renewing a mortgage for the first time.",
  },
  "/seniors-mortgage-renewal-canada/": {
    title: "Seniors / Retirees Renewal",
    blurb: "Renewal options on fixed or pension income — and reverse alternatives.",
  },
  "/divorce-mortgage-renewal/": {
    title: "Divorce & Mortgage Renewal",
    blurb: "Renewing during or after a divorce — qualifying alone, buyout timing.",
  },
  "/mortgage-renewal-divorce-separation/": {
    title: "Separation & Renewal",
    blurb: "Practical mortgage steps when separating or divorcing.",
  },
  "/spousal-buyout-mortgage-renewal/": {
    title: "Spousal Buyout Program",
    blurb: "Insured refinance up to 95% to buy out an ex-spouse.",
  },
  "/job-loss-mortgage-renewal/": {
    title: "Job Loss at Renewal",
    blurb: "What happens to your renewal if you lose your job or income drops.",
  },
  "/estate-mortgage-renewal/": {
    title: "Estate / POA Renewal",
    blurb: "Renewing a mortgage inside an estate or under power of attorney.",
  },
  "/remove-co-signer-mortgage-renewal/": {
    title: "Remove a Co-Signer at Renewal",
    blurb: "Using renewal (or refinance) to remove a co-signer cleanly.",
  },
  "/investment-property-renewal/": {
    title: "Investment Property Renewal",
    blurb: "Renewing a rental mortgage — rental offset vs. add-back rules.",
  },
  "/investment-property-mortgage-renewal/": {
    title: "Investment Property Renewal (Detailed)",
    blurb: "Deeper dive on rental qualification and A vs. B-lender options.",
  },
  "/new-to-canada-mortgage-renewal/": {
    title: "New to Canada Renewal",
    blurb: "Renewing if you came to Canada within 5 years — programs and tips.",
  },
  "/non-resident-mortgage-renewal/": {
    title: "Non-Resident Mortgage Renewal",
    blurb: "Renewals for non-resident owners of Canadian property.",
  },
  "/canadian-expat-mortgage-renewal/": {
    title: "Canadian Expat Renewal",
    blurb: "Canadians living abroad — how to renew a Canadian mortgage.",
  },
  "/reverse-mortgage-at-renewal/": {
    title: "Reverse Mortgage at Renewal",
    blurb: "CHIP / Equitable reverse mortgages for 55+ as a renewal alternative.",
  },
  "/renewing-mortgage-with-arrears/": {
    title: "Renewing With Arrears",
    blurb: "Options when you're behind on payments heading into renewal.",
  },
  "/co-ownership-mortgage-renewal/": {
    title: "Co-Ownership Renewal",
    blurb: "Renewing when multiple owners share title and debt.",
  },
  "/common-law-mortgage-renewal/": {
    title: "Common-Law Partner Renewal",
    blurb: "How common-law status affects title, liability, and renewal.",
  },
  "/rent-to-own-first-mortgage-renewal/": {
    title: "Rent-to-Own First Renewal",
    blurb: "Converting a rent-to-own into a permanent mortgage at renewal.",
  },
  "/second-mortgage-at-renewal/": {
    title: "Second Mortgage at Renewal",
    blurb: "When a second mortgage beats refinancing the entire loan.",
  },
  "/military-relocation-mortgage-renewal/": {
    title: "Military Relocation Renewal",
    blurb: "CAF IRP, porting, and renewal timing for posted members.",
  },
  "/early-mortgage-renewal/": {
    title: "Early Mortgage Renewal",
    blurb: "Renewing before maturity — penalties, timing, and when it pays.",
  },
  "/assuming-a-mortgage-canada/": {
    title: "Assuming a Mortgage in Canada",
    blurb: "How mortgage assumptions work — and when they still happen.",
  },
  "/bridge-financing-at-renewal/": {
    title: "Bridge Financing at Renewal",
    blurb: "Short-term bridge loans to close a purchase before renewal proceeds.",
  },

  // Resources
  "/mortgage-renewal-faq/": {
    title: "Renewal FAQ",
    blurb: "Most-asked Canadian renewal questions, answered plainly.",
  },
  "/faq/": {
    title: "Site FAQ",
    blurb: "General questions about MortgageRenewalHub and our guidance.",
  },
  "/mortgage-renewal-checklist/": {
    title: "Renewal Checklist",
    blurb: "120-day countdown: every task from offer review to signing.",
  },
  "/mortgage-renewal-checklist-pdf/": {
    title: "Printable Renewal Checklist (PDF)",
    blurb: "Downloadable PDF version of our 120-day renewal countdown.",
  },
  "/mortgage-renewal-glossary/": {
    title: "Mortgage Glossary",
    blurb: "40+ Canadian mortgage terms explained in plain English.",
  },
  "/mortgage-renewal-sitemap/": {
    title: "Site Map",
    blurb: "Every guide, calculator, lender page, and province on this site.",
  },
  "/mortgage-renewal-news/": {
    title: "Renewal News",
    blurb: "Latest Canadian mortgage and renewal headlines.",
  },
  "/renewal-document-checklist-generator/": {
    title: "Document Checklist Generator",
    blurb: "Custom doc checklist based on your income type and lender.",
  },
  "/renewal-reminder/": {
    title: "Renewal Date Reminder",
    blurb: "Set an automated reminder 120 days before your renewal date.",
  },
  "/case-studies/": {
    title: "Renewal Case Studies",
    blurb: "Real Canadian renewals — numbers, decisions, and outcomes.",
  },
  "/mortgage-flex-features-canada/": {
    title: "Mortgage Flex Features",
    blurb: "Portability, prepayment, assumability — feature-by-feature.",
  },
  "/should-i-switch-quiz/": {
    title: "Should I Switch? Quiz",
    blurb: "90-second quiz to see whether switching lenders fits your situation.",
  },

  // Specialty / cross-cluster
  "/mortgage-refinance-canada/": {
    title: "Mortgage Refinance in Canada",
    blurb: "When a full refinance beats a simple renewal — rules and costs.",
  },
  "/mortgage-renewal-debt-consolidation/": {
    title: "Debt Consolidation at Renewal",
    blurb: "Rolling credit cards and loans into your renewal — when it works.",
  },
  "/renewal-funding-rrsp-renovations/": {
    title: "Using Renewal to Fund RRSP / Renos",
    blurb: "Accessing equity at renewal to top up RRSPs or fund renovations.",
  },
  "/smith-manoeuvre-at-renewal/": {
    title: "Smith Manoeuvre at Renewal",
    blurb: "Converting mortgage interest into tax-deductible interest.",
  },
  "/readvanceable-mortgage-canada/": {
    title: "Readvanceable Mortgages",
    blurb: "How readvanceable mortgages with HELOC sub-accounts actually work.",
  },
  "/canadian-heloc-guide/": {
    title: "Canadian HELOC Guide",
    blurb: "HELOC qualifying, rules, and when to pair it with a renewal.",
  },
  "/skip-a-payment-mortgage-canada/": {
    title: "Skip-a-Payment in Canada",
    blurb: "When skip-a-payment helps — and the hidden interest cost.",
  },
  "/mortgage-appraisal-at-renewal/": {
    title: "Mortgage Appraisal at Renewal",
    blurb: "When an appraisal is required on a renewal or switch.",
  },
  "/mortgage-discharge-fees-canada/": {
    title: "Discharge Fees by Province",
    blurb: "What each Canadian lender charges to discharge a mortgage.",
  },
  "/mortgage-insurance-at-switch/": {
    title: "Mortgage Insurance at Switch",
    blurb: "How CMHC/Sagen/CG insurance transfers (or doesn't) on a switch.",
  },
  "/mortgage-negotiation-scripts/": {
    title: "Renewal Negotiation Scripts",
    blurb: "Word-for-word scripts for negotiating a better renewal rate.",
  },
  "/title-insurance-legal-fees-switching/": {
    title: "Title Insurance & Legal Fees on Switches",
    blurb: "What a lender-paid switch covers — and what it doesn't.",
  },
  "/inter-province-mortgage-portability/": {
    title: "Inter-Province Portability",
    blurb: "Moving between provinces — which lenders port, which re-qualify.",
  },
  "/fcac-obsi-mortgage-complaints/": {
    title: "FCAC / OBSI Mortgage Complaints",
    blurb: "How to file a regulated complaint about your lender.",
  },
  "/cmhc-sagen-canada-guaranty-at-renewal/": {
    title: "CMHC / Sagen / Canada Guaranty",
    blurb: "How Canada's three default insurers affect your renewal.",
  },
};

// Per-page related links — 6 curated hrefs per slug.
// Ordered by relevance (most topically adjacent first).
export const RELATED: Record<string, string[]> = {
  // ─── Homepage & core ──────────────────────────────────────────────
  "/": [
    "/mortgage-renewal-guide/",
    "/mortgage-renewal-calculator/",
    "/best-mortgage-renewal-rates/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-checklist/",
    "/mortgage-broker-renewal/",
  ],
  "/about/": [
    "/mortgage-broker-renewal/",
    "/mortgage-renewal-guide/",
    "/case-studies/",
    "/contact/",
    "/book-a-call/",
    "/pricing/",
  ],
  "/contact/": [
    "/book-a-call/",
    "/about/",
    "/mortgage-broker-renewal/",
    "/mortgage-renewal-faq/",
    "/renewal-reminder/",
    "/rate-alert/",
  ],
  "/pricing/": [
    "/mortgage-broker-renewal/",
    "/mortgage-lender-types-canada/",
    "/about/",
    "/book-a-call/",
    "/switching-lenders-at-renewal/",
    "/mortgage-negotiation-scripts/",
  ],
  "/book-a-call/": [
    "/mortgage-broker-renewal/",
    "/mortgage-renewal-checklist/",
    "/renewal-document-checklist-generator/",
    "/switching-lenders-at-renewal/",
    "/best-mortgage-renewal-rates/",
    "/mortgage-renewal-faq/",
  ],

  // ─── Guides ───────────────────────────────────────────────────────
  "/mortgage-renewal-guide/": [
    "/what-is-a-mortgage-renewal/",
    "/mortgage-renewal-checklist/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-calculator/",
    "/mortgage-renewal-mistakes/",
    "/mortgage-renewal-term-lengths/",
  ],
  "/what-is-a-mortgage-renewal/": [
    "/mortgage-renewal-guide/",
    "/renewal-vs-refinancing/",
    "/mortgage-renewal-term-lengths/",
    "/mortgage-renewal-glossary/",
    "/mortgage-renewal-checklist/",
    "/switching-lenders-at-renewal/",
  ],
  "/switching-lenders-at-renewal/": [
    "/break-even-switch-calculator/",
    "/title-insurance-legal-fees-switching/",
    "/mortgage-insurance-at-switch/",
    "/mortgage-discharge-fees-canada/",
    "/collateral-vs-standard-charge-mortgage/",
    "/mortgage-broker-renewal/",
  ],
  "/stress-test-mortgage-renewal/": [
    "/osfi-b20-stress-test-at-renewal/",
    "/mortgage-stress-test-calculator/",
    "/switching-lenders-at-renewal/",
    "/affordability-requalification-calculator/",
    "/insured-vs-conventional-mortgage-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/osfi-b20-stress-test-at-renewal/": [
    "/stress-test-mortgage-renewal/",
    "/mortgage-stress-test-calculator/",
    "/affordability-requalification-calculator/",
    "/switching-lenders-at-renewal/",
    "/canadian-mortgage-charter/",
    "/mortgage-renewal-guide/",
  ],
  "/collateral-vs-standard-charge-mortgage/": [
    "/switching-lenders-at-renewal/",
    "/td-mortgage-renewal/",
    "/readvanceable-mortgage-canada/",
    "/mortgage-discharge-fees-canada/",
    "/title-insurance-legal-fees-switching/",
    "/mortgage-lender-types-canada/",
  ],
  "/mortgage-prepayment-privileges-canada/": [
    "/mortgage-flex-features-canada/",
    "/prepayment-lump-sum-calculator/",
    "/accelerated-payment-calculator/",
    "/mortgage-payment-frequency-canada/",
    "/lower-mortgage-payments-at-renewal/",
    "/mortgage-renewal-glossary/",
  ],
  "/canadian-mortgage-charter/": [
    "/stress-test-mortgage-renewal/",
    "/osfi-b20-stress-test-at-renewal/",
    "/fcac-obsi-mortgage-complaints/",
    "/mortgage-renewal-mistakes/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/fixed-vs-variable-mortgage-renewal/": [
    "/trigger-rate-variable-mortgage-canada/",
    "/mortgage-renewal-term-lengths/",
    "/mortgage-rate-forecast/",
    "/ird-vs-three-month-interest-penalty/",
    "/mortgage-term-decision-guide/",
    "/rate-comparison-calculator/",
  ],
  "/insured-vs-conventional-mortgage-renewal/": [
    "/cmhc-sagen-canada-guaranty-at-renewal/",
    "/mortgage-insurance-at-switch/",
    "/stress-test-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/first-time-mortgage-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/30-year-amortization-mortgage-renewal/": [
    "/first-time-mortgage-renewal/",
    "/insured-vs-conventional-mortgage-renewal/",
    "/amortization-schedule-calculator/",
    "/lower-mortgage-payments-at-renewal/",
    "/cmhc-sagen-canada-guaranty-at-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/trigger-rate-variable-mortgage-canada/": [
    "/fixed-vs-variable-mortgage-renewal/",
    "/bank-of-canada-rate-decisions/",
    "/mortgage-rate-forecast/",
    "/lower-mortgage-payments-at-renewal/",
    "/mortgage-payment-frequency-canada/",
    "/mortgage-renewal-glossary/",
  ],
  "/ird-vs-three-month-interest-penalty/": [
    "/mortgage-penalty-calculator/",
    "/early-mortgage-renewal/",
    "/blend-and-extend-calculator/",
    "/fixed-vs-variable-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-glossary/",
  ],
  "/porting-a-mortgage-canada/": [
    "/inter-province-mortgage-portability/",
    "/mortgage-flex-features-canada/",
    "/bridge-financing-at-renewal/",
    "/military-relocation-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/mortgage-renewal-mistakes/": [
    "/mortgage-negotiation-scripts/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-checklist/",
    "/mortgage-renewal-guide/",
    "/best-mortgage-renewal-rates/",
    "/mortgage-broker-renewal/",
  ],
  "/renewal-vs-refinancing/": [
    "/mortgage-refinance-canada/",
    "/mortgage-renewal-debt-consolidation/",
    "/heloc-vs-refinance-calculator/",
    "/renewal-funding-rrsp-renovations/",
    "/lower-mortgage-payments-at-renewal/",
    "/what-is-a-mortgage-renewal/",
  ],
  "/lower-mortgage-payments-at-renewal/": [
    "/mortgage-renewal-term-lengths/",
    "/30-year-amortization-mortgage-renewal/",
    "/skip-a-payment-mortgage-canada/",
    "/mortgage-payment-frequency-canada/",
    "/renewal-vs-refinancing/",
    "/mortgage-renewal-calculator/",
  ],
  "/mortgage-renewal-term-lengths/": [
    "/mortgage-term-decision-guide/",
    "/fixed-vs-variable-mortgage-renewal/",
    "/mortgage-rate-forecast/",
    "/rate-comparison-calculator/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/mortgage-term-decision-guide/": [
    "/mortgage-renewal-term-lengths/",
    "/fixed-vs-variable-mortgage-renewal/",
    "/mortgage-rate-forecast/",
    "/bank-of-canada-rate-decisions/",
    "/rate-comparison-calculator/",
    "/best-mortgage-renewal-rates/",
  ],

  // ─── Calculators ──────────────────────────────────────────────────
  "/mortgage-renewal-calculator/": [
    "/mortgage-stress-test-calculator/",
    "/switch-vs-stay-calculator/",
    "/blend-and-extend-calculator/",
    "/amortization-schedule-calculator/",
    "/rate-comparison-calculator/",
    "/heloc-vs-refinance-calculator/",
  ],
  "/mortgage-stress-test-calculator/": [
    "/stress-test-mortgage-renewal/",
    "/osfi-b20-stress-test-at-renewal/",
    "/affordability-requalification-calculator/",
    "/mortgage-renewal-calculator/",
    "/switching-lenders-at-renewal/",
    "/mortgage-broker-renewal/",
  ],
  "/blend-and-extend-calculator/": [
    "/mortgage-penalty-calculator/",
    "/ird-vs-three-month-interest-penalty/",
    "/early-mortgage-renewal/",
    "/switch-vs-stay-calculator/",
    "/break-even-switch-calculator/",
    "/mortgage-renewal-calculator/",
  ],
  "/switch-vs-stay-calculator/": [
    "/break-even-switch-calculator/",
    "/switching-lenders-at-renewal/",
    "/title-insurance-legal-fees-switching/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-negotiation-scripts/",
    "/best-mortgage-renewal-rates/",
  ],
  "/heloc-vs-refinance-calculator/": [
    "/canadian-heloc-guide/",
    "/readvanceable-mortgage-canada/",
    "/mortgage-refinance-canada/",
    "/renewal-vs-refinancing/",
    "/refinance-debt-consolidation-calculator/",
    "/smith-manoeuvre-at-renewal/",
  ],
  "/mortgage-payment-frequency-canada/": [
    "/accelerated-payment-calculator/",
    "/amortization-schedule-calculator/",
    "/prepayment-lump-sum-calculator/",
    "/lower-mortgage-payments-at-renewal/",
    "/mortgage-prepayment-privileges-canada/",
    "/mortgage-renewal-calculator/",
  ],
  "/break-even-switch-calculator/": [
    "/switch-vs-stay-calculator/",
    "/switching-lenders-at-renewal/",
    "/title-insurance-legal-fees-switching/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-penalty-calculator/",
    "/best-mortgage-renewal-rates/",
  ],
  "/accelerated-payment-calculator/": [
    "/mortgage-payment-frequency-canada/",
    "/amortization-schedule-calculator/",
    "/prepayment-lump-sum-calculator/",
    "/mortgage-prepayment-privileges-canada/",
    "/lower-mortgage-payments-at-renewal/",
    "/mortgage-renewal-calculator/",
  ],
  "/affordability-requalification-calculator/": [
    "/mortgage-stress-test-calculator/",
    "/stress-test-mortgage-renewal/",
    "/osfi-b20-stress-test-at-renewal/",
    "/rental-income-qualifying-calculator/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-calculator/",
  ],
  "/amortization-schedule-calculator/": [
    "/mortgage-renewal-calculator/",
    "/mortgage-payment-frequency-canada/",
    "/accelerated-payment-calculator/",
    "/30-year-amortization-mortgage-renewal/",
    "/prepayment-lump-sum-calculator/",
    "/mortgage-renewal-term-lengths/",
  ],
  "/prepayment-lump-sum-calculator/": [
    "/mortgage-prepayment-privileges-canada/",
    "/accelerated-payment-calculator/",
    "/mortgage-payment-frequency-canada/",
    "/mortgage-flex-features-canada/",
    "/lower-mortgage-payments-at-renewal/",
    "/mortgage-renewal-calculator/",
  ],
  "/rate-comparison-calculator/": [
    "/best-mortgage-renewal-rates/",
    "/current-mortgage-rates-canada/",
    "/mortgage-renewal-term-lengths/",
    "/fixed-vs-variable-mortgage-renewal/",
    "/mortgage-renewal-calculator/",
    "/switch-vs-stay-calculator/",
  ],
  "/refinance-debt-consolidation-calculator/": [
    "/mortgage-renewal-debt-consolidation/",
    "/mortgage-refinance-canada/",
    "/heloc-vs-refinance-calculator/",
    "/renewal-vs-refinancing/",
    "/canadian-heloc-guide/",
    "/mortgage-renewal-calculator/",
  ],
  "/rental-income-qualifying-calculator/": [
    "/investment-property-renewal/",
    "/investment-property-mortgage-renewal/",
    "/affordability-requalification-calculator/",
    "/b-lender-mortgage-renewal/",
    "/self-employed-mortgage-renewal/",
    "/mortgage-renewal-calculator/",
  ],
  "/mortgage-penalty-calculator/": [
    "/ird-vs-three-month-interest-penalty/",
    "/blend-and-extend-calculator/",
    "/early-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/switch-vs-stay-calculator/",
    "/mortgage-renewal-calculator/",
  ],

  // ─── Lenders ──────────────────────────────────────────────────────
  "/mortgage-lender-types-canada/": [
    "/mortgage-broker-renewal/",
    "/canadian-lender-cheat-sheet/",
    "/credit-union-mortgage-renewal-canada/",
    "/b-lender-mortgage-renewal/",
    "/private-mortgage-renewal/",
    "/first-national-mortgage-renewal/",
  ],
  "/mortgage-broker-renewal/": [
    "/mortgage-lender-types-canada/",
    "/mortgage-negotiation-scripts/",
    "/pricing/",
    "/switching-lenders-at-renewal/",
    "/best-mortgage-renewal-rates/",
    "/canadian-lender-cheat-sheet/",
  ],
  "/td-mortgage-renewal/": [
    "/collateral-vs-standard-charge-mortgage/",
    "/rbc-mortgage-renewal/",
    "/bmo-mortgage-renewal/",
    "/scotiabank-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-negotiation-scripts/",
  ],
  "/rbc-mortgage-renewal/": [
    "/td-mortgage-renewal/",
    "/bmo-mortgage-renewal/",
    "/scotiabank-mortgage-renewal/",
    "/cibc-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-negotiation-scripts/",
  ],
  "/bmo-mortgage-renewal/": [
    "/td-mortgage-renewal/",
    "/rbc-mortgage-renewal/",
    "/scotiabank-mortgage-renewal/",
    "/national-bank-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-negotiation-scripts/",
  ],
  "/scotiabank-mortgage-renewal/": [
    "/collateral-vs-standard-charge-mortgage/",
    "/td-mortgage-renewal/",
    "/rbc-mortgage-renewal/",
    "/cibc-mortgage-renewal/",
    "/readvanceable-mortgage-canada/",
    "/switching-lenders-at-renewal/",
  ],
  "/cibc-mortgage-renewal/": [
    "/rbc-mortgage-renewal/",
    "/td-mortgage-renewal/",
    "/bmo-mortgage-renewal/",
    "/scotiabank-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-negotiation-scripts/",
  ],
  "/national-bank-mortgage-renewal/": [
    "/quebec-mortgage-renewal/",
    "/readvanceable-mortgage-canada/",
    "/bmo-mortgage-renewal/",
    "/rbc-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-broker-renewal/",
  ],
  "/first-national-mortgage-renewal/": [
    "/mcap-mortgage-renewal/",
    "/mortgage-lender-types-canada/",
    "/mortgage-broker-renewal/",
    "/switching-lenders-at-renewal/",
    "/best-mortgage-renewal-rates/",
    "/credit-union-mortgage-renewal-canada/",
  ],
  "/mcap-mortgage-renewal/": [
    "/first-national-mortgage-renewal/",
    "/mortgage-lender-types-canada/",
    "/mortgage-broker-renewal/",
    "/switching-lenders-at-renewal/",
    "/best-mortgage-renewal-rates/",
    "/credit-union-mortgage-renewal-canada/",
  ],
  "/credit-union-mortgage-renewal-canada/": [
    "/mortgage-lender-types-canada/",
    "/b-lender-mortgage-renewal/",
    "/first-national-mortgage-renewal/",
    "/self-employed-mortgage-renewal/",
    "/bad-credit-mortgage-renewal/",
    "/manitoba-mortgage-renewal/",
  ],
  "/b-lender-mortgage-renewal/": [
    "/private-mortgage-renewal/",
    "/bad-credit-mortgage-renewal/",
    "/self-employed-mortgage-renewal/",
    "/second-mortgage-at-renewal/",
    "/renewing-mortgage-with-arrears/",
    "/mortgage-lender-types-canada/",
  ],
  "/private-mortgage-renewal/": [
    "/b-lender-mortgage-renewal/",
    "/second-mortgage-at-renewal/",
    "/bad-credit-mortgage-renewal/",
    "/renewing-mortgage-with-arrears/",
    "/job-loss-mortgage-renewal/",
    "/mortgage-lender-types-canada/",
  ],
  "/canadian-lender-cheat-sheet/": [
    "/mortgage-lender-types-canada/",
    "/mortgage-broker-renewal/",
    "/best-mortgage-renewal-rates/",
    "/switching-lenders-at-renewal/",
    "/credit-union-mortgage-renewal-canada/",
    "/first-national-mortgage-renewal/",
  ],

  // ─── Provinces ────────────────────────────────────────────────────
  "/ontario-mortgage-renewal/": [
    "/quebec-mortgage-renewal/",
    "/bc-mortgage-renewal/",
    "/alberta-mortgage-renewal/",
    "/credit-union-mortgage-renewal-canada/",
    "/inter-province-mortgage-portability/",
    "/mortgage-broker-renewal/",
  ],
  "/bc-mortgage-renewal/": [
    "/alberta-mortgage-renewal/",
    "/ontario-mortgage-renewal/",
    "/credit-union-mortgage-renewal-canada/",
    "/inter-province-mortgage-portability/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-broker-renewal/",
  ],
  "/alberta-mortgage-renewal/": [
    "/bc-mortgage-renewal/",
    "/saskatchewan-mortgage-renewal/",
    "/credit-union-mortgage-renewal-canada/",
    "/inter-province-mortgage-portability/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-broker-renewal/",
  ],
  "/quebec-mortgage-renewal/": [
    "/ontario-mortgage-renewal/",
    "/national-bank-mortgage-renewal/",
    "/atlantic-canada-mortgage-renewal/",
    "/inter-province-mortgage-portability/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-broker-renewal/",
  ],
  "/manitoba-mortgage-renewal/": [
    "/saskatchewan-mortgage-renewal/",
    "/alberta-mortgage-renewal/",
    "/credit-union-mortgage-renewal-canada/",
    "/inter-province-mortgage-portability/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-broker-renewal/",
  ],
  "/saskatchewan-mortgage-renewal/": [
    "/manitoba-mortgage-renewal/",
    "/alberta-mortgage-renewal/",
    "/credit-union-mortgage-renewal-canada/",
    "/inter-province-mortgage-portability/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-broker-renewal/",
  ],
  "/atlantic-canada-mortgage-renewal/": [
    "/quebec-mortgage-renewal/",
    "/credit-union-mortgage-renewal-canada/",
    "/inter-province-mortgage-portability/",
    "/mortgage-discharge-fees-canada/",
    "/first-national-mortgage-renewal/",
    "/mortgage-broker-renewal/",
  ],
  "/territories-mortgage-renewal/": [
    "/bc-mortgage-renewal/",
    "/alberta-mortgage-renewal/",
    "/credit-union-mortgage-renewal-canada/",
    "/inter-province-mortgage-portability/",
    "/first-national-mortgage-renewal/",
    "/mortgage-broker-renewal/",
  ],

  // ─── Rates ────────────────────────────────────────────────────────
  "/best-mortgage-renewal-rates/": [
    "/current-mortgage-rates-canada/",
    "/mortgage-rate-forecast/",
    "/bank-of-canada-rate-decisions/",
    "/rate-comparison-calculator/",
    "/switching-lenders-at-renewal/",
    "/mortgage-negotiation-scripts/",
  ],
  "/current-mortgage-rates-canada/": [
    "/best-mortgage-renewal-rates/",
    "/mortgage-rate-forecast/",
    "/bank-of-canada-rate-decisions/",
    "/rate-alert/",
    "/fixed-vs-variable-mortgage-renewal/",
    "/rate-comparison-calculator/",
  ],
  "/mortgage-rate-forecast/": [
    "/bank-of-canada-rate-decisions/",
    "/current-mortgage-rates-canada/",
    "/best-mortgage-renewal-rates/",
    "/fixed-vs-variable-mortgage-renewal/",
    "/mortgage-renewal-term-lengths/",
    "/trigger-rate-variable-mortgage-canada/",
  ],
  "/bank-of-canada-rate-decisions/": [
    "/mortgage-rate-forecast/",
    "/trigger-rate-variable-mortgage-canada/",
    "/fixed-vs-variable-mortgage-renewal/",
    "/current-mortgage-rates-canada/",
    "/best-mortgage-renewal-rates/",
    "/rate-alert/",
  ],
  "/rate-alert/": [
    "/best-mortgage-renewal-rates/",
    "/current-mortgage-rates-canada/",
    "/mortgage-rate-forecast/",
    "/bank-of-canada-rate-decisions/",
    "/renewal-reminder/",
    "/book-a-call/",
  ],

  // ─── Situations ───────────────────────────────────────────────────
  "/self-employed-mortgage-renewal/": [
    "/b-lender-mortgage-renewal/",
    "/private-mortgage-renewal/",
    "/bad-credit-mortgage-renewal/",
    "/rental-income-qualifying-calculator/",
    "/stress-test-mortgage-renewal/",
    "/mortgage-broker-renewal/",
  ],
  "/bad-credit-mortgage-renewal/": [
    "/b-lender-mortgage-renewal/",
    "/private-mortgage-renewal/",
    "/renewing-mortgage-with-arrears/",
    "/second-mortgage-at-renewal/",
    "/job-loss-mortgage-renewal/",
    "/mortgage-broker-renewal/",
  ],
  "/first-time-mortgage-renewal/": [
    "/what-is-a-mortgage-renewal/",
    "/mortgage-renewal-guide/",
    "/stress-test-mortgage-renewal/",
    "/insured-vs-conventional-mortgage-renewal/",
    "/mortgage-renewal-checklist/",
    "/switching-lenders-at-renewal/",
  ],
  "/seniors-mortgage-renewal-canada/": [
    "/reverse-mortgage-at-renewal/",
    "/canadian-heloc-guide/",
    "/estate-mortgage-renewal/",
    "/lower-mortgage-payments-at-renewal/",
    "/affordability-requalification-calculator/",
    "/mortgage-broker-renewal/",
  ],
  "/divorce-mortgage-renewal/": [
    "/spousal-buyout-mortgage-renewal/",
    "/remove-co-signer-mortgage-renewal/",
    "/mortgage-renewal-divorce-separation/",
    "/common-law-mortgage-renewal/",
    "/mortgage-refinance-canada/",
    "/affordability-requalification-calculator/",
  ],
  "/mortgage-renewal-divorce-separation/": [
    "/divorce-mortgage-renewal/",
    "/spousal-buyout-mortgage-renewal/",
    "/remove-co-signer-mortgage-renewal/",
    "/common-law-mortgage-renewal/",
    "/mortgage-refinance-canada/",
    "/affordability-requalification-calculator/",
  ],
  "/spousal-buyout-mortgage-renewal/": [
    "/divorce-mortgage-renewal/",
    "/remove-co-signer-mortgage-renewal/",
    "/mortgage-renewal-divorce-separation/",
    "/mortgage-refinance-canada/",
    "/insured-vs-conventional-mortgage-renewal/",
    "/affordability-requalification-calculator/",
  ],
  "/job-loss-mortgage-renewal/": [
    "/renewing-mortgage-with-arrears/",
    "/skip-a-payment-mortgage-canada/",
    "/b-lender-mortgage-renewal/",
    "/second-mortgage-at-renewal/",
    "/lower-mortgage-payments-at-renewal/",
    "/affordability-requalification-calculator/",
  ],
  "/estate-mortgage-renewal/": [
    "/seniors-mortgage-renewal-canada/",
    "/reverse-mortgage-at-renewal/",
    "/assuming-a-mortgage-canada/",
    "/remove-co-signer-mortgage-renewal/",
    "/mortgage-refinance-canada/",
    "/mortgage-broker-renewal/",
  ],
  "/remove-co-signer-mortgage-renewal/": [
    "/divorce-mortgage-renewal/",
    "/spousal-buyout-mortgage-renewal/",
    "/mortgage-refinance-canada/",
    "/affordability-requalification-calculator/",
    "/switching-lenders-at-renewal/",
    "/common-law-mortgage-renewal/",
  ],
  "/investment-property-renewal/": [
    "/investment-property-mortgage-renewal/",
    "/rental-income-qualifying-calculator/",
    "/b-lender-mortgage-renewal/",
    "/smith-manoeuvre-at-renewal/",
    "/mortgage-refinance-canada/",
    "/self-employed-mortgage-renewal/",
  ],
  "/investment-property-mortgage-renewal/": [
    "/investment-property-renewal/",
    "/rental-income-qualifying-calculator/",
    "/b-lender-mortgage-renewal/",
    "/smith-manoeuvre-at-renewal/",
    "/mortgage-refinance-canada/",
    "/self-employed-mortgage-renewal/",
  ],
  "/new-to-canada-mortgage-renewal/": [
    "/first-time-mortgage-renewal/",
    "/non-resident-mortgage-renewal/",
    "/canadian-expat-mortgage-renewal/",
    "/b-lender-mortgage-renewal/",
    "/stress-test-mortgage-renewal/",
    "/mortgage-broker-renewal/",
  ],
  "/non-resident-mortgage-renewal/": [
    "/canadian-expat-mortgage-renewal/",
    "/new-to-canada-mortgage-renewal/",
    "/investment-property-renewal/",
    "/rental-income-qualifying-calculator/",
    "/b-lender-mortgage-renewal/",
    "/mortgage-broker-renewal/",
  ],
  "/canadian-expat-mortgage-renewal/": [
    "/non-resident-mortgage-renewal/",
    "/investment-property-renewal/",
    "/rental-income-qualifying-calculator/",
    "/new-to-canada-mortgage-renewal/",
    "/b-lender-mortgage-renewal/",
    "/mortgage-broker-renewal/",
  ],
  "/reverse-mortgage-at-renewal/": [
    "/seniors-mortgage-renewal-canada/",
    "/canadian-heloc-guide/",
    "/estate-mortgage-renewal/",
    "/lower-mortgage-payments-at-renewal/",
    "/renewal-funding-rrsp-renovations/",
    "/mortgage-refinance-canada/",
  ],
  "/renewing-mortgage-with-arrears/": [
    "/bad-credit-mortgage-renewal/",
    "/private-mortgage-renewal/",
    "/b-lender-mortgage-renewal/",
    "/job-loss-mortgage-renewal/",
    "/skip-a-payment-mortgage-canada/",
    "/mortgage-broker-renewal/",
  ],
  "/co-ownership-mortgage-renewal/": [
    "/common-law-mortgage-renewal/",
    "/remove-co-signer-mortgage-renewal/",
    "/assuming-a-mortgage-canada/",
    "/estate-mortgage-renewal/",
    "/mortgage-renewal-guide/",
    "/mortgage-broker-renewal/",
  ],
  "/common-law-mortgage-renewal/": [
    "/divorce-mortgage-renewal/",
    "/mortgage-renewal-divorce-separation/",
    "/co-ownership-mortgage-renewal/",
    "/remove-co-signer-mortgage-renewal/",
    "/spousal-buyout-mortgage-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/rent-to-own-first-mortgage-renewal/": [
    "/first-time-mortgage-renewal/",
    "/bad-credit-mortgage-renewal/",
    "/b-lender-mortgage-renewal/",
    "/stress-test-mortgage-renewal/",
    "/mortgage-renewal-checklist/",
    "/mortgage-broker-renewal/",
  ],
  "/second-mortgage-at-renewal/": [
    "/private-mortgage-renewal/",
    "/b-lender-mortgage-renewal/",
    "/canadian-heloc-guide/",
    "/heloc-vs-refinance-calculator/",
    "/mortgage-refinance-canada/",
    "/bad-credit-mortgage-renewal/",
  ],
  "/military-relocation-mortgage-renewal/": [
    "/porting-a-mortgage-canada/",
    "/inter-province-mortgage-portability/",
    "/bridge-financing-at-renewal/",
    "/early-mortgage-renewal/",
    "/mortgage-broker-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/early-mortgage-renewal/": [
    "/ird-vs-three-month-interest-penalty/",
    "/mortgage-penalty-calculator/",
    "/blend-and-extend-calculator/",
    "/switching-lenders-at-renewal/",
    "/break-even-switch-calculator/",
    "/mortgage-renewal-guide/",
  ],
  "/assuming-a-mortgage-canada/": [
    "/estate-mortgage-renewal/",
    "/porting-a-mortgage-canada/",
    "/mortgage-flex-features-canada/",
    "/divorce-mortgage-renewal/",
    "/co-ownership-mortgage-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/bridge-financing-at-renewal/": [
    "/porting-a-mortgage-canada/",
    "/inter-province-mortgage-portability/",
    "/mortgage-refinance-canada/",
    "/military-relocation-mortgage-renewal/",
    "/canadian-heloc-guide/",
    "/mortgage-broker-renewal/",
  ],

  // ─── Resources ────────────────────────────────────────────────────
  "/mortgage-renewal-faq/": [
    "/mortgage-renewal-guide/",
    "/mortgage-renewal-glossary/",
    "/mortgage-renewal-checklist/",
    "/what-is-a-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-mistakes/",
  ],
  "/faq/": [
    "/mortgage-renewal-faq/",
    "/mortgage-renewal-guide/",
    "/mortgage-renewal-glossary/",
    "/about/",
    "/contact/",
    "/book-a-call/",
  ],
  "/mortgage-renewal-checklist/": [
    "/mortgage-renewal-checklist-pdf/",
    "/renewal-document-checklist-generator/",
    "/renewal-reminder/",
    "/mortgage-renewal-guide/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-mistakes/",
  ],
  "/mortgage-renewal-checklist-pdf/": [
    "/mortgage-renewal-checklist/",
    "/renewal-document-checklist-generator/",
    "/renewal-reminder/",
    "/mortgage-renewal-guide/",
    "/book-a-call/",
    "/mortgage-renewal-faq/",
  ],
  "/mortgage-renewal-glossary/": [
    "/mortgage-renewal-faq/",
    "/mortgage-renewal-guide/",
    "/what-is-a-mortgage-renewal/",
    "/mortgage-renewal-term-lengths/",
    "/ird-vs-three-month-interest-penalty/",
    "/collateral-vs-standard-charge-mortgage/",
  ],
  "/mortgage-renewal-sitemap/": [
    "/mortgage-renewal-guide/",
    "/mortgage-renewal-calculator/",
    "/mortgage-lender-types-canada/",
    "/best-mortgage-renewal-rates/",
    "/mortgage-renewal-faq/",
    "/mortgage-renewal-glossary/",
  ],
  "/mortgage-renewal-news/": [
    "/bank-of-canada-rate-decisions/",
    "/mortgage-rate-forecast/",
    "/best-mortgage-renewal-rates/",
    "/book-a-call/",
    "/rate-alert/",
    "/case-studies/",
  ],
  "/renewal-document-checklist-generator/": [
    "/mortgage-renewal-checklist/",
    "/mortgage-renewal-checklist-pdf/",
    "/self-employed-mortgage-renewal/",
    "/investment-property-renewal/",
    "/switching-lenders-at-renewal/",
    "/mortgage-renewal-guide/",
  ],
  "/renewal-reminder/": [
    "/mortgage-renewal-checklist/",
    "/rate-alert/",
    "/book-a-call/",
    "/mortgage-renewal-guide/",
    "/best-mortgage-renewal-rates/",
    "/mortgage-renewal-mistakes/",
  ],
  "/case-studies/": [
    "/mortgage-renewal-guide/",
    "/switching-lenders-at-renewal/",
    "/best-mortgage-renewal-rates/",
    "/self-employed-mortgage-renewal/",
    "/divorce-mortgage-renewal/",
    "/mortgage-renewal-news/",
  ],
  "/mortgage-flex-features-canada/": [
    "/mortgage-prepayment-privileges-canada/",
    "/porting-a-mortgage-canada/",
    "/assuming-a-mortgage-canada/",
    "/skip-a-payment-mortgage-canada/",
    "/readvanceable-mortgage-canada/",
    "/mortgage-renewal-glossary/",
  ],
  "/should-i-switch-quiz/": [
    "/switch-vs-stay-calculator/",
    "/break-even-switch-calculator/",
    "/switching-lenders-at-renewal/",
    "/best-mortgage-renewal-rates/",
    "/mortgage-negotiation-scripts/",
    "/mortgage-broker-renewal/",
  ],

  // ─── Specialty / cross-cluster ────────────────────────────────────
  "/mortgage-refinance-canada/": [
    "/renewal-vs-refinancing/",
    "/mortgage-renewal-debt-consolidation/",
    "/heloc-vs-refinance-calculator/",
    "/refinance-debt-consolidation-calculator/",
    "/renewal-funding-rrsp-renovations/",
    "/canadian-heloc-guide/",
  ],
  "/mortgage-renewal-debt-consolidation/": [
    "/refinance-debt-consolidation-calculator/",
    "/mortgage-refinance-canada/",
    "/renewal-vs-refinancing/",
    "/canadian-heloc-guide/",
    "/second-mortgage-at-renewal/",
    "/lower-mortgage-payments-at-renewal/",
  ],
  "/renewal-funding-rrsp-renovations/": [
    "/smith-manoeuvre-at-renewal/",
    "/canadian-heloc-guide/",
    "/readvanceable-mortgage-canada/",
    "/heloc-vs-refinance-calculator/",
    "/mortgage-refinance-canada/",
    "/renewal-vs-refinancing/",
  ],
  "/smith-manoeuvre-at-renewal/": [
    "/readvanceable-mortgage-canada/",
    "/canadian-heloc-guide/",
    "/investment-property-renewal/",
    "/heloc-vs-refinance-calculator/",
    "/renewal-funding-rrsp-renovations/",
    "/mortgage-refinance-canada/",
  ],
  "/readvanceable-mortgage-canada/": [
    "/canadian-heloc-guide/",
    "/smith-manoeuvre-at-renewal/",
    "/heloc-vs-refinance-calculator/",
    "/collateral-vs-standard-charge-mortgage/",
    "/scotiabank-mortgage-renewal/",
    "/national-bank-mortgage-renewal/",
  ],
  "/canadian-heloc-guide/": [
    "/heloc-vs-refinance-calculator/",
    "/readvanceable-mortgage-canada/",
    "/smith-manoeuvre-at-renewal/",
    "/second-mortgage-at-renewal/",
    "/mortgage-refinance-canada/",
    "/renewal-funding-rrsp-renovations/",
  ],
  "/skip-a-payment-mortgage-canada/": [
    "/lower-mortgage-payments-at-renewal/",
    "/mortgage-flex-features-canada/",
    "/job-loss-mortgage-renewal/",
    "/renewing-mortgage-with-arrears/",
    "/mortgage-prepayment-privileges-canada/",
    "/mortgage-renewal-guide/",
  ],
  "/mortgage-appraisal-at-renewal/": [
    "/switching-lenders-at-renewal/",
    "/title-insurance-legal-fees-switching/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-insurance-at-switch/",
    "/mortgage-refinance-canada/",
    "/mortgage-renewal-checklist/",
  ],
  "/mortgage-discharge-fees-canada/": [
    "/title-insurance-legal-fees-switching/",
    "/switching-lenders-at-renewal/",
    "/break-even-switch-calculator/",
    "/switch-vs-stay-calculator/",
    "/collateral-vs-standard-charge-mortgage/",
    "/mortgage-renewal-glossary/",
  ],
  "/mortgage-insurance-at-switch/": [
    "/cmhc-sagen-canada-guaranty-at-renewal/",
    "/insured-vs-conventional-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
    "/title-insurance-legal-fees-switching/",
    "/mortgage-discharge-fees-canada/",
    "/mortgage-renewal-glossary/",
  ],
  "/mortgage-negotiation-scripts/": [
    "/switching-lenders-at-renewal/",
    "/best-mortgage-renewal-rates/",
    "/mortgage-renewal-mistakes/",
    "/mortgage-broker-renewal/",
    "/should-i-switch-quiz/",
    "/mortgage-renewal-guide/",
  ],
  "/title-insurance-legal-fees-switching/": [
    "/mortgage-discharge-fees-canada/",
    "/switching-lenders-at-renewal/",
    "/mortgage-appraisal-at-renewal/",
    "/break-even-switch-calculator/",
    "/switch-vs-stay-calculator/",
    "/mortgage-insurance-at-switch/",
  ],
  "/inter-province-mortgage-portability/": [
    "/porting-a-mortgage-canada/",
    "/military-relocation-mortgage-renewal/",
    "/mortgage-flex-features-canada/",
    "/ontario-mortgage-renewal/",
    "/bc-mortgage-renewal/",
    "/alberta-mortgage-renewal/",
  ],
  "/fcac-obsi-mortgage-complaints/": [
    "/canadian-mortgage-charter/",
    "/mortgage-renewal-mistakes/",
    "/mortgage-renewal-guide/",
    "/switching-lenders-at-renewal/",
    "/mortgage-broker-renewal/",
    "/mortgage-renewal-faq/",
  ],
  "/cmhc-sagen-canada-guaranty-at-renewal/": [
    "/mortgage-insurance-at-switch/",
    "/insured-vs-conventional-mortgage-renewal/",
    "/30-year-amortization-mortgage-renewal/",
    "/first-time-mortgage-renewal/",
    "/stress-test-mortgage-renewal/",
    "/switching-lenders-at-renewal/",
  ],
};

export function getRelated(slug: string): Array<{ href: string } & LinkMeta> {
  const hrefs = RELATED[slug] ?? [];
  return hrefs
    .map((href) => {
      const meta = LINK_META[href];
      if (!meta) return null;
      return { href, ...meta };
    })
    .filter((x): x is { href: string } & LinkMeta => x !== null);
}
