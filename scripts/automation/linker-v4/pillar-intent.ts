// ============================================
// Smart Linker v6 — Pillar Page Intent Cards
// ============================================
// Hand-authored purpose cards for pillar and regional sub-pages.
// Consumed by enrich-catalog.ts during catalog build.

export interface PillarIntentCard {
  readerPromise: string;
  topicsCovered: string[];
  questionsAnswered: string[];
  linkWhen: string[];
  doNotLinkWhen: string[];
  assetTypes: string[];
  unitRange?: string;
}

export const PILLAR_INTENT_CARDS: Record<string, PillarIntentCard> = {
  // ----------------
  // Main pillar pages
  // ----------------
  "multi-family-mortgage-financing": {
    readerPromise:
      "Learn how to finance 5+ unit apartment buildings using DSCR, CMHC MLI programs, and commercial underwriting based on property cash flow.",
    topicsCovered: [
      "Apartment building financing",
      "DSCR qualification",
      "CMHC MLI Select and MLI Standard",
      "Net operating income (NOI)",
      "Cap rates",
      "Bridge to permanent financing",
      "Blanket and portfolio mortgages",
    ],
    questionsAnswered: [
      "How do I finance an apartment building in Canada?",
      "What DSCR do lenders require for multifamily?",
      "How does CMHC MLI Select work for apartment acquisitions?",
    ],
    linkWhen: [
      "when the article discusses 5+ unit or apartment building financing",
      "when mentioning NOI, cap rates, or DSCR for rental properties",
      "when scaling from residential rentals to multifamily",
      "when CMHC MLI or commercial multifamily programs are relevant",
    ],
    doNotLinkWhen: [
      "when the property is 1–4 units and residential qualification applies",
      "when the article is about single-family or duplex investing only",
      "when the context is US-only DSCR with no multifamily angle",
    ],
    assetTypes: ["multifamily", "apartment"],
    unitRange: "5+",
  },

  "residential-mortgage-financing": {
    readerPromise:
      "Get financing options for 1–4 unit residential investment properties with flexible qualification including stated income and rental offset programs.",
    topicsCovered: [
      "Single-family rental financing",
      "Duplex, triplex, and fourplex mortgages",
      "Rental income qualification",
      "Stated income programs",
      "Investment property down payments",
      "Refinancing residential rentals",
      "A-lender vs B-lender options",
    ],
    questionsAnswered: [
      "How do I finance a rental property with 1–4 units?",
      "Can I use rental income to qualify for a residential investment mortgage?",
      "What down payment do I need for a duplex or triplex?",
    ],
    linkWhen: [
      "when the reader needs financing for 1–4 unit residential rentals",
      "when discussing duplex, triplex, or fourplex investing",
      "when residential mortgage qualification or rental offset is the topic",
      "when a beginner investor is buying their first rental home",
    ],
    doNotLinkWhen: [
      "when the article is a case study focused on unit counts as portfolio milestones rather than financing",
      "when the context is mixed-use or commercial property financing",
      "when residential is mentioned only as a property type label in a commercial or multifamily discussion",
      "when the article discusses 5+ unit apartment buildings or commercial underwriting",
    ],
    assetTypes: ["single-family", "residential", "duplex", "triplex", "fourplex"],
    unitRange: "1-4",
  },

  "flip-mortgage-financing": {
    readerPromise:
      "Access short-term capital for fix-and-flip renovations and BRRRR projects with bridge and construction financing tailored to value-add deals.",
    topicsCovered: [
      "Fix-and-flip loans",
      "BRRRR strategy financing",
      "Bridge and hard money lending",
      "After-repair value (ARV)",
      "Renovation draw schedules",
      "Exit to permanent financing",
    ],
    questionsAnswered: [
      "How do I finance a house flip?",
      "What is a bridge loan for renovations?",
      "How does BRRRR refinancing work after rehab?",
    ],
    linkWhen: [
      "when the article discusses fix-and-flip or BRRRR strategy",
      "when mentioning renovation financing or short-term construction loans",
      "when the reader needs capital for a value-add residential project",
    ],
    doNotLinkWhen: [
      "when the article is about long-term buy-and-hold rental financing only",
      "when the context is ground-up development or commercial construction",
      "when flip is mentioned only as a market trend without financing need",
    ],
    assetTypes: ["single-family", "residential"],
  },

  "development-mortgage-financing": {
    readerPromise:
      "Secure ground-up construction financing from land acquisition through completion for real estate development projects.",
    topicsCovered: [
      "Ground-up construction loans",
      "Land acquisition financing",
      "Construction draw management",
      "Pre-sale and pre-lease requirements",
      "Development pro forma underwriting",
      "Takeout and permanent financing",
    ],
    questionsAnswered: [
      "How do I finance a ground-up development project?",
      "What do construction lenders require before funding draws?",
      "How does development financing convert to permanent debt?",
    ],
    linkWhen: [
      "when the article discusses ground-up construction or new development",
      "when mentioning land acquisition plus build financing",
      "when the reader is developing condos, townhomes, or commercial projects",
    ],
    doNotLinkWhen: [
      "when the article is about renovating an existing property (flip/BRRRR)",
      "when pre-construction condo assignments are the focus without development lending",
      "when the context is purely residential resale with no construction phase",
    ],
    assetTypes: ["development", "construction"],
  },

  "office-mortgage-financing": {
    readerPromise:
      "Finance office buildings and professional office space using commercial lending based on tenant quality, lease terms, and property NOI.",
    topicsCovered: [
      "Office building acquisition financing",
      "Single-tenant and multi-tenant office",
      "Medical and professional office",
      "Net lease underwriting",
      "Office market vacancy risk",
      "Commercial DSCR requirements",
    ],
    questionsAnswered: [
      "How do I finance an office building investment?",
      "What do lenders look for in office tenant leases?",
      "Can I get a commercial mortgage for a medical office?",
    ],
    linkWhen: [
      "when the article discusses office building or office space financing",
      "when mentioning medical, dental, or professional office acquisitions",
      "when commercial tenant quality and lease terms drive the deal",
    ],
    doNotLinkWhen: [
      "when the article is about residential or multifamily rentals only",
      "when office is mentioned as a general commercial category without financing context",
      "when the reader needs retail or industrial financing specifically",
    ],
    assetTypes: ["office", "commercial"],
  },

  "retail-mortgage-financing": {
    readerPromise:
      "Finance shopping centers, strip malls, and retail investment properties with lenders who understand tenant mix and retail cash flow.",
    topicsCovered: [
      "Strip mall and plaza financing",
      "Anchor tenant analysis",
      "Retail net operating income",
      "NNN lease structures",
      "Retail vacancy and rollover risk",
      "Commercial mortgage qualification",
    ],
    questionsAnswered: [
      "How do I finance a strip mall or retail plaza?",
      "What DSCR do retail lenders require?",
      "How does anchor tenant quality affect retail financing?",
    ],
    linkWhen: [
      "when the article discusses retail property or shopping center financing",
      "when mentioning strip malls, plazas, or retail tenant analysis",
      "when the reader is acquiring income-producing retail assets",
    ],
    doNotLinkWhen: [
      "when retail is mentioned only in a mixed-use context better served by mixed-use financing",
      "when the article focuses on residential or multifamily lending",
      "when the context is e-commerce trends without property financing",
    ],
    assetTypes: ["retail", "commercial"],
  },

  "padsplit-mortgage-financing": {
    readerPromise:
      "Finance PadSplit and co-living room rental properties in the US with lenders who understand per-room income models.",
    topicsCovered: [
      "PadSplit investment financing",
      "Room rental income qualification",
      "Co-living property underwriting",
      "Workforce housing strategies",
      "US single-family room rentals",
      "PadSplit cash flow analysis",
    ],
    questionsAnswered: [
      "Can I get a mortgage for a PadSplit property?",
      "How do lenders underwrite room rental income?",
      "What financing options exist for co-living investments?",
    ],
    linkWhen: [
      "when the article discusses PadSplit, room rentals, or co-living investing",
      "when mentioning per-room income strategies in the US",
      "when the reader needs financing for workforce housing models",
    ],
    doNotLinkWhen: [
      "when the article is about Canadian residential rentals only",
      "when short-term rental (Airbnb) is the focus without room-rental model",
      "when the property is multifamily apartments rather than single-family room rentals",
    ],
    assetTypes: ["single-family", "padsplit", "co-living"],
    unitRange: "1",
  },

  "dscr-loans": {
    readerPromise:
      "Qualify for US investment property mortgages based on rental income and DSCR — no W-2 or personal income verification required.",
    topicsCovered: [
      "US DSCR loan qualification",
      "Debt service coverage ratio",
      "Foreign national investor programs",
      "No-income-verification lending",
      "US rental property financing",
      "LLC closing structures",
    ],
    questionsAnswered: [
      "What is a DSCR loan and how does it work?",
      "Can Canadians get US DSCR loans without US income?",
      "What DSCR ratio do US lenders require?",
    ],
    linkWhen: [
      "when the article discusses US DSCR or income-based property qualification",
      "when mentioning no W-2 or foreign national US lending",
      "when the reader needs US rental financing without personal income docs",
    ],
    doNotLinkWhen: [
      "when the article is about Canadian conventional or CMHC residential mortgages",
      "when DSCR is discussed only for Canadian commercial multifamily",
      "when the context is primary residence financing in Canada",
    ],
    assetTypes: ["investment-property", "rental"],
  },

  "investment-property-lending-locations": {
    readerPromise:
      "Compare cross-border investment property financing options across Canada, the USA, and Mexico for portfolio diversification.",
    topicsCovered: [
      "Cross-border investing",
      "Canada vs US vs Mexico financing",
      "Foreign national lending",
      "Currency and tax considerations overview",
      "Regional lender access",
      "Portfolio diversification strategies",
    ],
    questionsAnswered: [
      "Where can Canadians finance investment properties abroad?",
      "How does cross-border mortgage financing work?",
      "What are the financing options in Canada, USA, and Mexico?",
    ],
    linkWhen: [
      "when the article compares investing across multiple countries",
      "when the reader is deciding between Canada, US, or Mexico markets",
      "when cross-border financing logistics are the topic",
    ],
    doNotLinkWhen: [
      "when the article is focused on a single country with a dedicated regional pillar page",
      "when location is mentioned only as a market analysis without financing angle",
      "when the reader already needs a specific US DSCR or Canada CMHC program page",
    ],
    assetTypes: ["investment-property"],
  },

  "investor-resources": {
    readerPromise:
      "Access free investor education including podcasts, newsletters, calculators, community, and tools to grow your real estate knowledge.",
    topicsCovered: [
      "Investor education",
      "Podcasts and newsletters",
      "Mortgage calculators",
      "Private investor community",
      "Getting started guides",
      "Portfolio planning resources",
    ],
    questionsAnswered: [
      "Where can I learn about real estate investing for free?",
      "What tools does Mortgage Renewal Hub offer renewing homeowners?",
      "How do I connect with other real estate investors?",
    ],
    linkWhen: [
      "when the article introduces beginner investors to learning resources",
      "when mentioning podcasts, calculators, or educational content",
      "when the reader needs general investor education rather than a specific loan product",
    ],
    doNotLinkWhen: [
      "when the reader needs specific mortgage product or regional financing pages",
      "when the article is a deep technical guide that warrants a product pillar link instead",
      "when resources are mentioned in passing without educational intent",
    ],
    assetTypes: ["education"],
  },

  "invest-in-real-estate": {
    readerPromise:
      "Compare two capital deployment paths in Canadian real estate — secured private mortgage lending vs. development equity partnerships — and choose the fit for your goals.",
    topicsCovered: [
      "Private mortgage investing vs development equity",
      "Passive income from secured lending",
      "Development partnership structures",
      "RRSP/TFSA private lending options",
      "Capital provider due diligence",
      "Return expectations and timelines",
    ],
    questionsAnswered: [
      "How can I invest in private mortgages in Canada?",
      "How do I invest in real estate development projects?",
      "What is the difference between private lending and development equity?",
      "Where should I put capital if I want passive real estate income?",
    ],
    linkWhen: [
      "when the article discusses passive real estate income or capital deployment",
      "when the reader has money to lend or invest but is not buying rental properties",
      "when private lending vs development equity is compared or introduced",
      "when the article targets high-net-worth or passive investors with capital",
    ],
    doNotLinkWhen: [
      "when the reader is an active rental property buyer needing acquisition financing",
      "when the article is about borrowing mortgages, not investing capital",
      "when a more specific private lending or development sub-page is the clear fit",
    ],
    assetTypes: ["passive-income", "private-lending", "development"],
  },

  "invest-in-private-mortgages": {
    readerPromise:
      "Earn secured 10–12% yield by lending capital as a private mortgage investor in Canada — including RRSP, TFSA, and cash options with legal charge on property.",
    topicsCovered: [
      "Private mortgage investing returns",
      "Mortgage security and LTV margins",
      "RRSP and TFSA private lending",
      "MIC vs direct private lending",
      "Due diligence for private lenders",
      "Power of Sale and borrower default protection",
    ],
    questionsAnswered: [
      "How do I invest in private mortgages in Canada?",
      "Can I use my RRSP to lend as a private mortgage?",
      "What returns can private mortgage investors expect?",
      "How is private mortgage lending secured?",
    ],
    linkWhen: [
      "when the article discusses private lending, mortgage notes, or MIC investing",
      "when the reader wants passive income from secured real estate debt",
      "when RRSP/TFSA private mortgage investing is mentioned",
      "when the topic is lending capital rather than buying properties",
    ],
    doNotLinkWhen: [
      "when the reader needs a borrower mortgage, not capital-provider investing",
      "when development equity or syndication is the primary topic",
      "when private lending is mentioned only in a borrower context",
    ],
    assetTypes: ["passive-income", "private-lending", "secured-lending"],
  },

  "invest-in-development": {
    readerPromise:
      "Partner as an equity investor in Canadian multi-family and social housing development projects — GP/LP structures, preferred returns, and project due diligence.",
    topicsCovered: [
      "Development equity partnerships",
      "GP/LP syndication structures",
      "Construction and CMHC MLI Select projects",
      "LP due diligence and GP vetting",
      "Return expectations on development deals",
      "Capital raising for housing development",
    ],
    questionsAnswered: [
      "How do I invest in real estate development projects in Canada?",
      "What is an LP in a real estate development syndication?",
      "How do development equity partnerships work?",
      "What should I look for in a development GP partner?",
    ],
    linkWhen: [
      "when the article discusses development syndications, GP/LP structures, or equity partnerships",
      "when the reader has capital for development deals rather than rental acquisitions",
      "when syndication or passive development investing is the topic",
      "when evaluating development partners or LP opportunities",
    ],
    doNotLinkWhen: [
      "when the reader is a developer seeking construction financing only",
      "when private mortgage lending is the better fit for the reader's capital",
      "when development is discussed only as a borrower/builder topic",
    ],
    assetTypes: ["development", "capital-raising", "joint-ventures-partnerships"],
  },

  "commercial-mortgage-canada": {
    readerPromise:
      "Compare commercial mortgage rates and programs from 50+ lenders for multifamily, office, retail, industrial, and mixed-use properties across Canada.",
    topicsCovered: [
      "Commercial mortgage qualification",
      "DSCR and NOI underwriting",
      "CMHC insured commercial programs",
      "Office, retail, and industrial financing",
      "Mixed-use property lending",
      "Commercial down payment requirements",
    ],
    questionsAnswered: [
      "How do commercial mortgages work in Canada?",
      "What do I need to qualify for a commercial mortgage?",
      "How is a commercial mortgage different from residential?",
    ],
    linkWhen: [
      "when the article discusses commercial property financing in Canada broadly",
      "when the reader needs a commercial mortgage overview before a property-type-specific page",
      "when mentioning DSCR, NOI, or commercial qualification for Canadian deals",
    ],
    doNotLinkWhen: [
      "when the article focuses on a specific asset class with a dedicated pillar (office, retail, industrial, mixed-use, multifamily)",
      "when the context is US commercial lending only",
      "when commercial is mentioned only to contrast with residential 1–4 unit financing",
    ],
    assetTypes: ["commercial", "multifamily", "office", "retail", "industrial", "mixed-use"],
  },

  "mixed-use-mortgage-financing": {
    readerPromise:
      "Finance mixed-use properties combining residential and commercial uses — retail-over-residential, live-work, and hybrid income streams across Canada.",
    topicsCovered: [
      "Residential-over-retail financing",
      "Live-work property mortgages",
      "Hybrid income underwriting",
      "Mixed-use DSCR analysis",
      "Owner-occupied mixed-use programs",
      "Conversion and repositioning financing",
    ],
    questionsAnswered: [
      "Can I get a mortgage on a mixed-use building?",
      "How do lenders underwrite residential plus commercial income?",
      "What LTV is available for retail-with-apartments properties?",
    ],
    linkWhen: [
      "when the article discusses mixed-use or hybrid residential-commercial properties",
      "when mentioning retail with apartments above or live-work buildings",
      "when the reader needs financing for combined-use income streams",
    ],
    doNotLinkWhen: [
      "when the property is purely residential (1–4 units) or purely single-use commercial",
      "when mixed-use is mentioned only as a zoning concept without financing context",
      "when CMHC multifamily applies to a pure apartment building with no commercial component",
    ],
    assetTypes: ["mixed-use", "commercial", "residential"],
  },

  "industrial-mortgage-financing": {
    readerPromise:
      "Finance warehouses, distribution centers, manufacturing facilities, and flex industrial space with lenders who understand logistics and industrial operations.",
    topicsCovered: [
      "Warehouse and distribution financing",
      "Manufacturing facility mortgages",
      "Flex and multi-tenant industrial",
      "Clear height and dock requirements",
      "Environmental and Phase 1 considerations",
      "Sale-leaseback industrial capital",
    ],
    questionsAnswered: [
      "How do I finance a warehouse or industrial property?",
      "What do industrial lenders look for in underwriting?",
      "Can I get a mortgage on a manufacturing facility?",
    ],
    linkWhen: [
      "when the article discusses warehouse, industrial, or logistics property financing",
      "when mentioning distribution centers, manufacturing plants, or flex space",
      "when environmental or industrial-specific due diligence affects lending",
    ],
    doNotLinkWhen: [
      "when the article is about residential or office financing only",
      "when industrial is mentioned as a zoning category without property financing",
      "when the reader needs retail or mixed-use financing specifically",
    ],
    assetTypes: ["industrial", "warehouse", "commercial"],
  },

  // ----------------
  // Canada regional pages
  // ----------------
  "mortgage-financing-for-canadians-in-canada": {
    readerPromise:
      "Explore Canadian mortgage financing for primary residences, investment properties, and commercial real estate as a Canadian borrower.",
    topicsCovered: [
      "Canadian residential mortgages",
      "Investment property financing in Canada",
      "CMHC and insurer programs",
      "Self-employed Canadian borrowers",
      "Refinancing and HELOC options",
      "Canadian commercial lending overview",
    ],
    questionsAnswered: [
      "How do Canadian mortgages work for investors?",
      "What financing options exist for Canadians buying in Canada?",
      "How do I qualify for an investment property mortgage in Canada?",
    ],
    linkWhen: [
      "when the article discusses Canadian domestic mortgage financing broadly",
      "when the reader is a Canadian investing in Canada",
      "when multiple Canadian product types are compared without a specific sub-page fit",
    ],
    doNotLinkWhen: [
      "when the article focuses on US or Mexico cross-border investing",
      "when a specific sub-page (first-time buyer, self-employed, HELOC) is the clear fit",
      "when the context is purely commercial multifamily with a dedicated pillar",
    ],
    assetTypes: ["residential", "investment-property", "commercial"],
  },

  "mortgage-financing-for-canadians-in-canada/first-time-buyer": {
    readerPromise:
      "Learn first-time home buyer mortgage programs in Canada including FTHBI, Home Buyers Plan, and low down payment options.",
    topicsCovered: [
      "First-time home buyer programs",
      "FTHBI shared equity",
      "Home Buyers Plan (RRSP)",
      "Minimum down payments",
      "First-time buyer incentives",
      "Qualification for new homeowners",
    ],
    questionsAnswered: [
      "What programs help first-time buyers in Canada?",
      "Can I use my RRSP for a down payment?",
      "How does the First-Time Home Buyer Incentive work?",
    ],
    linkWhen: [
      "when the article discusses first-time home buying in Canada",
      "when mentioning FTHBI, HBP, or first-time buyer incentives",
      "when the reader is purchasing their first primary residence in Canada",
    ],
    doNotLinkWhen: [
      "when the reader is an experienced investor scaling a rental portfolio",
      "when the article is about US or Mexico property purchases",
      "when the context is commercial or multifamily investing",
    ],
    assetTypes: ["primary-residence", "residential"],
  },

  "mortgage-financing-for-canadians-in-canada/primary-residence": {
    readerPromise:
      "Get owner-occupied home mortgage options in Canada with down payment assistance and flexible qualification paths.",
    topicsCovered: [
      "Primary residence mortgages",
      "Owner-occupied qualification",
      "Down payment assistance",
      "Insured vs conventional mortgages",
      "Rate and term options",
      "Primary home refinancing",
    ],
    questionsAnswered: [
      "How do I get a mortgage for my primary home in Canada?",
      "What down payment do I need for an owner-occupied property?",
      "How is primary residence financing different from investment property?",
    ],
    linkWhen: [
      "when the article discusses buying or refinancing a primary residence in Canada",
      "when the reader is an owner-occupant not an investor",
      "when comparing insured vs conventional owner-occupied options",
    ],
    doNotLinkWhen: [
      "when the article is about rental or investment property financing",
      "when the reader is buying in the US or Mexico",
      "when the context is commercial property lending",
    ],
    assetTypes: ["primary-residence", "residential"],
    unitRange: "1-4",
  },

  "mortgage-financing-for-canadians-in-canada/investment-property": {
    readerPromise:
      "Finance rental and investment properties in Canada with programs designed for residential and small-scale investors.",
    topicsCovered: [
      "Canadian rental property mortgages",
      "Rental income qualification",
      "Investment property down payments",
      "House hacking and basement suites",
      "Portfolio lending in Canada",
      "Refinancing investment properties",
    ],
    questionsAnswered: [
      "How do I finance a rental property in Canada?",
      "Can I use rental income to qualify?",
      "What down payment is required for an investment property in Canada?",
    ],
    linkWhen: [
      "when the article discusses Canadian rental or investment property financing",
      "when the reader is buying income property domestically in Canada",
      "when rental offset or investment qualification is the topic",
    ],
    doNotLinkWhen: [
      "when the article is about US cross-border investing for Canadians",
      "when the property is 5+ units requiring commercial multifamily financing",
      "when the reader is buying a primary residence only",
    ],
    assetTypes: ["investment-property", "residential", "rental"],
    unitRange: "1-4",
  },

  "mortgage-financing-for-canadians-in-canada/refinance": {
    readerPromise:
      "Access rate reduction and equity take-out refinancing options for Canadian property owners.",
    topicsCovered: [
      "Rate-and-term refinancing",
      "Equity take-out and cash-out refi",
      "Breaking and blending mortgages",
      "Refinance qualification",
      "Penalty considerations",
      "Using equity for next deals",
    ],
    questionsAnswered: [
      "When should I refinance my Canadian mortgage?",
      "How do I pull equity out of my property in Canada?",
      "What are the costs of breaking my mortgage early?",
    ],
    linkWhen: [
      "when the article discusses refinancing a Canadian property",
      "when mentioning equity access, rate reduction, or mortgage renewal",
      "when the reader wants to leverage existing Canadian property equity",
    ],
    doNotLinkWhen: [
      "when the article is about US cash-out refi or DSCR refi",
      "when the context is a new purchase with no existing mortgage",
      "when BRRRR refinance is the focus (link flip pillar instead)",
    ],
    assetTypes: ["residential", "investment-property"],
  },

  "mortgage-financing-for-canadians-in-canada/self-employed": {
    readerPromise:
      "Get approved for a Canadian mortgage as a self-employed or business owner borrower with alternative income documentation.",
    topicsCovered: [
      "Stated income programs",
      "Business-for-self qualification",
      "Notice of assessment underwriting",
      "Bank statement programs",
      "Self-employed investment property financing",
      "A-lender vs B-lender for business owners",
    ],
    questionsAnswered: [
      "Can self-employed Canadians get a mortgage?",
      "How do lenders verify income for business owners?",
      "What documents do I need as a self-employed borrower?",
    ],
    linkWhen: [
      "when the article discusses self-employed or business owner mortgage qualification",
      "when mentioning stated income, NOA, or bank statement programs in Canada",
      "when the reader cannot prove income with T4s or pay stubs",
    ],
    doNotLinkWhen: [
      "when the borrower is a salaried employee with standard income docs",
      "when the article is about US DSCR without personal income verification",
      "when self-employed is mentioned only in a commercial context",
    ],
    assetTypes: ["residential", "investment-property"],
  },

  "mortgage-financing-for-canadians-in-canada/new-construction": {
    readerPromise:
      "Finance new construction and pre-construction homes in Canada with draw schedules and completion guarantees.",
    topicsCovered: [
      "New construction mortgages",
      "Pre-construction deposit structures",
      "Construction draw financing",
      "Builder completion policies",
      "New home warranty requirements",
      "Conversion from construction to permanent",
    ],
    questionsAnswered: [
      "How does new construction financing work in Canada?",
      "What is a progress draw mortgage?",
      "Can I finance a pre-construction condo purchase?",
    ],
    linkWhen: [
      "when the article discusses building or buying new construction in Canada",
      "when mentioning pre-construction deposits or construction draws",
      "when the reader is purchasing from a builder or developing infill housing",
    ],
    doNotLinkWhen: [
      "when the article is about ground-up commercial development (link development pillar)",
      "when pre-construction refers to Mexico or US projects",
      "when the context is renovating an existing property",
    ],
    assetTypes: ["residential", "construction"],
  },

  "mortgage-financing-for-canadians-in-canada/debt-consolidation": {
    readerPromise:
      "Consolidate high-interest debt into your Canadian mortgage for lower monthly payments and simplified finances.",
    topicsCovered: [
      "Debt consolidation refinancing",
      "High-interest debt payoff",
      "Cash-out equity for debt",
      "Payment reduction strategies",
      "Credit improvement through consolidation",
      "Second mortgage vs refinance",
    ],
    questionsAnswered: [
      "Should I consolidate debt into my mortgage?",
      "How much can I save by rolling debt into my mortgage?",
      "What are the risks of debt consolidation refinancing?",
    ],
    linkWhen: [
      "when the article discusses consolidating consumer debt via mortgage",
      "when mentioning high-interest credit card or line of credit payoff",
      "when the reader wants to reduce monthly payments using home equity",
    ],
    doNotLinkWhen: [
      "when the article is about using equity to fund investment properties",
      "when debt consolidation is unrelated to real estate or mortgages",
      "when the context is US or cross-border lending",
    ],
    assetTypes: ["primary-residence", "residential"],
  },

  "mortgage-financing-for-canadians-in-canada/heloc": {
    readerPromise:
      "Access revolving home equity credit in Canada for investing, renovations, or flexible capital deployment.",
    topicsCovered: [
      "Home equity lines of credit",
      "Revolving credit against equity",
      "HELOC for investing",
      "Readvanceable mortgages",
      "HELOC qualification and limits",
      "Using HELOC for down payments",
    ],
    questionsAnswered: [
      "How does a HELOC work in Canada?",
      "Can I use a HELOC to fund my next investment property?",
      "What is the difference between a HELOC and a mortgage refinance?",
    ],
    linkWhen: [
      "when the article discusses HELOCs or revolving home equity in Canada",
      "when mentioning readvanceable mortgages or equity lines for investing",
      "when the reader needs flexible access to property equity",
    ],
    doNotLinkWhen: [
      "when the article is about US home equity products",
      "when a full refinance or term mortgage is the better fit",
      "when equity access is for commercial property (different products apply)",
    ],
    assetTypes: ["primary-residence", "residential"],
  },

  "mortgage-financing-for-canadians-in-canada/reverse-mortgage": {
    readerPromise:
      "Access CHIP and other reverse mortgage options for Canadian homeowners 55+ to unlock equity without monthly payments.",
    topicsCovered: [
      "CHIP reverse mortgage",
      "Equity access for seniors",
      "No monthly payment structures",
      "Reverse mortgage qualification",
      "Estate and repayment considerations",
      "Alternatives to reverse mortgages",
    ],
    questionsAnswered: [
      "What is a reverse mortgage in Canada?",
      "Who qualifies for a CHIP reverse mortgage?",
      "How is a reverse mortgage repaid?",
    ],
    linkWhen: [
      "when the article discusses reverse mortgages or equity access for seniors in Canada",
      "when mentioning CHIP or no-payment equity products for 55+",
      "when the reader is a retiree looking to access home equity",
    ],
    doNotLinkWhen: [
      "when the article targets active real estate investors building portfolios",
      "when the reader is under 55 or buying investment properties",
      "when the context is US reverse mortgage products",
    ],
    assetTypes: ["primary-residence", "residential"],
  },

  "mortgage-financing-for-canadians-in-canada/dscr-loans": {
    readerPromise:
      "Qualify for Canadian commercial mortgages using rental income and Debt Coverage Ratio instead of personal income.",
    topicsCovered: [
      "Canadian DCR/DSCR programs",
      "Cash-flow-based commercial qualification",
      "Multifamily income underwriting",
      "Commercial rental property financing",
      "Debt coverage ratio requirements",
      "CMHC commercial cash-flow lending",
    ],
    questionsAnswered: [
      "Can I qualify for a commercial mortgage on rental income in Canada?",
      "What DCR do Canadian commercial lenders require?",
      "How is Canadian DSCR different from US DSCR loans?",
    ],
    linkWhen: [
      "when the article discusses Canadian commercial cash-flow or DCR qualification",
      "when mentioning debt coverage ratio for Canadian multifamily or commercial",
      "when the reader needs income-based commercial lending in Canada",
    ],
    doNotLinkWhen: [
      "when the article is about US DSCR loans for Canadian investors",
      "when the property is 1–4 units with residential qualification",
      "when DSCR is mentioned only in a US investing context",
    ],
    assetTypes: ["commercial", "multifamily"],
    unitRange: "5+",
  },

  // ----------------
  // USA regional pages
  // ----------------
  "mortgage-financing-for-canadians-in-the-u-s-a": {
    readerPromise:
      "Finance US investment properties as a Canadian including DSCR loans, LLC structures, and cross-border mortgage expertise.",
    topicsCovered: [
      "Canadian investing in the US",
      "Cross-border mortgage process",
      "Foreign national lending",
      "US entity structures overview",
      "Currency and banking setup",
      "US rental property financing options",
    ],
    questionsAnswered: [
      "How can Canadians finance US investment properties?",
      "What do Canadian investors need to buy rental property in the US?",
      "How does cross-border US mortgage lending work?",
    ],
    linkWhen: [
      "when the article discusses Canadians buying or financing in the US broadly",
      "when cross-border US investing logistics are the topic",
      "when the reader needs an overview before a specific US product page",
    ],
    doNotLinkWhen: [
      "when a specific sub-page (DSCR, LLC, STR, flip) is the clear fit",
      "when the article is about Canadian domestic investing only",
      "when Mexico or other international markets are the focus",
    ],
    assetTypes: ["investment-property", "rental"],
  },

  "mortgage-financing-for-canadians-in-the-u-s-a/llc-financing": {
    readerPromise:
      "Close US investment properties in an LLC for liability protection and portfolio management as a Canadian investor.",
    topicsCovered: [
      "LLC property ownership",
      "Foreign national LLC lending",
      "Entity structuring for Canadians",
      "Liability protection strategies",
      "US bank account requirements",
      "Closing in an LLC as a non-resident",
    ],
    questionsAnswered: [
      "Can Canadians buy US property in an LLC?",
      "How do I get a mortgage closed in my LLC?",
      "What entity structure should Canadian US investors use?",
    ],
    linkWhen: [
      "when the article discusses LLC ownership or entity structure for US properties",
      "when mentioning liability protection or closing in a US entity",
      "when the reader is setting up their US investing structure",
    ],
    doNotLinkWhen: [
      "when the article is about personal-name US purchases only",
      "when LLC is mentioned in a tax context without financing need",
      "when the context is Canadian corporate ownership domestically",
    ],
    assetTypes: ["investment-property"],
  },

  "mortgage-financing-for-canadians-in-the-u-s-a/short-term-rental": {
    readerPromise:
      "Finance Airbnb and VRBO properties in the US with lenders who accept short-term rental income for Canadian investors.",
    topicsCovered: [
      "Airbnb property financing",
      "VRBO and STR income qualification",
      "Short-term rental DSCR",
      "Platform income underwriting",
      "Vacation rental financing",
      "STR cash flow analysis",
    ],
    questionsAnswered: [
      "Can I get a mortgage using Airbnb income?",
      "How do lenders qualify STR properties for Canadians?",
      "What DSCR do STR lenders require?",
    ],
    linkWhen: [
      "when the article discusses Airbnb, VRBO, or short-term rental financing in the US",
      "when mentioning platform income for US property qualification",
      "when the reader is buying a vacation rental or STR asset",
    ],
    doNotLinkWhen: [
      "when the article is about long-term rental DSCR only",
      "when STR is mentioned as a strategy without financing context",
      "when the property is in Canada (different STR rules apply)",
    ],
    assetTypes: ["short-term-rental", "vacation-rental"],
  },

  "mortgage-financing-for-canadians-in-the-u-s-a/fix-and-flip": {
    readerPromise:
      "Access fix-and-flip and BRRRR financing in the US tailored for Canadian investors doing value-add projects.",
    topicsCovered: [
      "US flip financing for Canadians",
      "BRRRR in the US market",
      "Foreign national hard money",
      "Renovation draw schedules",
      "ARV-based lending",
      "Exit to DSCR permanent financing",
    ],
    questionsAnswered: [
      "Can Canadians get fix-and-flip loans in the US?",
      "How does BRRRR work for Canadian US investors?",
      "What do US hard money lenders require from foreign nationals?",
    ],
    linkWhen: [
      "when the article discusses Canadian investors flipping or BRRRR-ing in the US",
      "when mentioning US renovation or bridge financing for value-add",
      "when the reader needs short-term US capital for a rehab project",
    ],
    doNotLinkWhen: [
      "when the article is about Canadian domestic flip financing",
      "when the context is long-term US rental acquisition only",
      "when flip is mentioned as a market statistic without financing need",
    ],
    assetTypes: ["single-family", "residential"],
  },

  "mortgage-financing-for-canadians-in-the-u-s-a/multi-family": {
    readerPromise:
      "Finance US apartment buildings and 5+ unit properties as a Canadian investor using commercial and DSCR programs.",
    topicsCovered: [
      "US multifamily for Canadians",
      "Apartment building DSCR",
      "Foreign national commercial lending",
      "5+ unit US qualification",
      "US multifamily cap rate analysis",
      "Portfolio scaling in the US",
    ],
    questionsAnswered: [
      "Can Canadians finance US apartment buildings?",
      "What DSCR is required for US multifamily?",
      "How do foreign nationals qualify for US commercial multifamily?",
    ],
    linkWhen: [
      "when the article discusses Canadian investors buying US multifamily or apartments",
      "when mentioning 5+ unit US properties for cross-border investors",
      "when the reader is scaling into US apartment buildings",
    ],
    doNotLinkWhen: [
      "when the article is about Canadian domestic multifamily (CMHC)",
      "when the property is a single-family US rental",
      "when multifamily is mentioned only in a market comparison",
    ],
    assetTypes: ["multifamily", "apartment"],
    unitRange: "5+",
  },

  "mortgage-financing-for-canadians-in-the-u-s-a/investment-property": {
    readerPromise:
      "Get US rental property mortgages as a Canadian investor with programs matched to your entity structure and income docs.",
    topicsCovered: [
      "US rental property financing",
      "Foreign national investment mortgages",
      "Long-term hold financing",
      "Single-family rental portfolios",
      "Cross-border documentation",
      "US landlord financing basics",
    ],
    questionsAnswered: [
      "How do Canadians finance US rental properties?",
      "What documents do US lenders need from Canadian investors?",
      "Can I get a US mortgage without US credit history?",
    ],
    linkWhen: [
      "when the article discusses Canadians buying US long-term rental properties",
      "when the reader needs general US investment property financing (not STR or flip)",
      "when cross-border rental acquisition is the topic",
    ],
    doNotLinkWhen: [
      "when DSCR-specific or LLC-specific pages are the better fit",
      "when the article is about Canadian domestic rentals",
      "when the context is Mexico or other international markets",
    ],
    assetTypes: ["investment-property", "rental", "single-family"],
  },

  "mortgage-financing-for-canadians-in-the-u-s-a/dscr-loans": {
    readerPromise:
      "Learn how Canadian investors qualify for US DSCR loans through foreign national programs without US income verification.",
    topicsCovered: [
      "US DSCR for Canadians",
      "Foreign national DSCR programs",
      "No US income verification",
      "DSCR ratio requirements",
      "LLC and entity closing",
      "Canadian cross-border DSCR process",
    ],
    questionsAnswered: [
      "Can Canadians get US DSCR loans?",
      "What DSCR do foreign national lenders require?",
      "How is the US DSCR process different for Canadians?",
    ],
    linkWhen: [
      "when the article discusses Canadians using US DSCR programs specifically",
      "when mentioning foreign national DSCR or no-income-verification US lending",
      "when the reader is a Canadian scaling a US portfolio with DSCR",
    ],
    doNotLinkWhen: [
      "when the article is about Canadian commercial DCR programs",
      "when US investors (not Canadians) are the audience",
      "when DSCR is mentioned only for Canadian multifamily",
    ],
    assetTypes: ["investment-property", "rental"],
  },

  // ----------------
  // Mexico regional pages
  // ----------------
  "mortgage-financing-for-canadians-in-mexico": {
    readerPromise:
      "Finance Mexican property purchases for Canadian investors including vacation homes, rentals, and pre-construction projects.",
    topicsCovered: [
      "Mexican property financing for Canadians",
      "Fideicomiso (bank trust) basics",
      "Cross-border Mexico investing",
      "Vacation and investment property options",
      "Mexican lender landscape",
      "Currency and closing process overview",
    ],
    questionsAnswered: [
      "Can Canadians get a mortgage in Mexico?",
      "How does financing work for Mexican property?",
      "What is a Fideicomiso and do I need one?",
    ],
    linkWhen: [
      "when the article discusses Canadians buying property in Mexico broadly",
      "when cross-border Mexico investing is the topic",
      "when the reader needs an overview before a specific Mexico sub-page",
    ],
    doNotLinkWhen: [
      "when a specific sub-page (vacation home, pre-construction) is the clear fit",
      "when the article is about US or Canadian domestic investing",
      "when Mexico is mentioned only as a lifestyle destination without financing",
    ],
    assetTypes: ["vacation-home", "investment-property"],
  },

  "mortgage-financing-for-canadians-in-mexico/vacation-home": {
    readerPromise:
      "Finance vacation properties, beachfront condos, and snowbird homes in Mexico for Canadian buyers.",
    topicsCovered: [
      "Mexico vacation home financing",
      "Beachfront condo mortgages",
      "Snowbird property purchases",
      "Resort and gated community financing",
      "Seasonal use property lending",
      "Fideicomiso for vacation properties",
    ],
    questionsAnswered: [
      "Can I get a mortgage on a Mexico vacation home?",
      "How do Canadians finance beachfront property in Mexico?",
      "What down payment is required for a Mexican vacation condo?",
    ],
    linkWhen: [
      "when the article discusses vacation or second homes in Mexico",
      "when mentioning snowbird, beachfront, or resort property purchases",
      "when the reader wants a personal-use property in Mexico",
    ],
    doNotLinkWhen: [
      "when the article is about Mexico rental investments (link investment-property sub-page)",
      "when the context is US vacation property financing",
      "when Mexico is mentioned only for travel without buying intent",
    ],
    assetTypes: ["vacation-home", "condo"],
  },

  "mortgage-financing-for-canadians-in-mexico/investment-property": {
    readerPromise:
      "Finance rental and investment properties in Mexico with Fideicomiso expertise for Canadian investors seeking yield.",
    topicsCovered: [
      "Mexico rental property financing",
      "Investment yield analysis",
      "Fideicomiso for investors",
      "Long-term rental in Mexico",
      "Property management considerations",
      "Cross-border tax basics for rentals",
    ],
    questionsAnswered: [
      "Can Canadians finance rental property in Mexico?",
      "How do I structure a Mexican investment property purchase?",
      "What returns can I expect from Mexico rentals?",
    ],
    linkWhen: [
      "when the article discusses Mexico rental or investment property for Canadians",
      "when mentioning Fideicomiso for income-producing Mexican assets",
      "when the reader wants yield from Mexican real estate",
    ],
    doNotLinkWhen: [
      "when the article is about vacation homes for personal use only",
      "when pre-construction off-plan is the focus",
      "when the context is US or Canadian domestic investing",
    ],
    assetTypes: ["investment-property", "rental"],
  },

  "mortgage-financing-for-canadians-in-mexico/pre-construction": {
    readerPromise:
      "Finance pre-construction and new build property purchases in Mexico for Canadian investors with staged payment structures.",
    topicsCovered: [
      "Mexico pre-construction financing",
      "New build payment schedules",
      "Developer deposit structures",
      "Off-plan purchase financing",
      "Completion and closing process",
      "Pre-construction risk management",
    ],
    questionsAnswered: [
      "How does pre-construction financing work in Mexico?",
      "Can I get a mortgage on an off-plan Mexico condo?",
      "What deposits are required for pre-construction in Mexico?",
    ],
    linkWhen: [
      "when the article discusses pre-construction or new build purchases in Mexico",
      "when mentioning off-plan deposits or developer payment schedules",
      "when the reader is buying before construction completes in Mexico",
    ],
    doNotLinkWhen: [
      "when the article is about resale vacation or rental property",
      "when pre-construction refers to Canadian or US projects",
      "when the context is ground-up development lending",
    ],
    assetTypes: ["pre-construction", "condo"],
  },

  "mortgage-financing-for-canadians-in-mexico/refinance": {
    readerPromise:
      "Refinance Canadian-owned properties in Mexico to access better rates or pull equity from existing Mexican assets.",
    topicsCovered: [
      "Mexico mortgage refinancing",
      "Equity access on Mexican property",
      "Rate improvement strategies",
      "Refinance qualification in Mexico",
      "Cross-border refinance logistics",
      "Existing Fideicomiso refinancing",
    ],
    questionsAnswered: [
      "Can I refinance my Mexican property as a Canadian?",
      "How do I pull equity from a Mexico vacation home?",
      "When does refinancing a Mexican mortgage make sense?",
    ],
    linkWhen: [
      "when the article discusses refinancing existing Mexican property owned by Canadians",
      "when mentioning equity access or rate reduction on Mexico assets",
      "when the reader already owns property in Mexico",
    ],
    doNotLinkWhen: [
      "when the article is about a new Mexico purchase",
      "when refinance refers to Canadian or US property",
      "when the reader does not yet own Mexican real estate",
    ],
    assetTypes: ["vacation-home", "investment-property"],
  },

  "mortgage-financing-for-canadians-in-mexico/retirement-home": {
    readerPromise:
      "Finance retirement and expat homes in Mexico for Canadian retirees seeking warm-climate living with manageable payments.",
    topicsCovered: [
      "Retirement property financing in Mexico",
      "Expat home purchases",
      "Fixed-income borrower qualification",
      "Retirement community properties",
      "Long-term residency planning",
      "Affordable retirement living options",
    ],
    questionsAnswered: [
      "Can Canadian retirees get a mortgage in Mexico?",
      "How do I finance a retirement home in Mexico?",
      "What income do Mexican lenders accept from retirees?",
    ],
    linkWhen: [
      "when the article discusses retiring or relocating to Mexico as a Canadian",
      "when mentioning expat or retirement home purchases in Mexico",
      "when the reader is a retiree buying a primary or seasonal home abroad",
    ],
    doNotLinkWhen: [
      "when the article targets active investors building rental portfolios",
      "when the context is US retirement destinations",
      "when Mexico is mentioned only for travel without buying intent",
    ],
    assetTypes: ["primary-residence", "vacation-home"],
  },
};
