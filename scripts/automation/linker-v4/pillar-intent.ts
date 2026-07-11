// ============================================
// Smart Linker — Pillar Intent Cards (Mortgage Renewal Hub)
// ============================================
// Hand-authored purpose cards for renewal guide hubs & tools.

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
  "mortgage-renewal-guide": {
    readerPromise:
      "Walk through the full Canadian mortgage renewal process — timeline, documents, negotiation, and when switching beats staying.",
    topicsCovered: [
      "Renewal timeline (120/60/30 days)",
      "Reading your renewal letter",
      "Comparing bank offers",
      "Switching vs staying",
      "Working with a broker",
    ],
    questionsAnswered: [
      "How does mortgage renewal work in Canada?",
      "What should I do 120 days before maturity?",
      "Should I auto-renew with my bank?",
    ],
    linkWhen: [
      "when the reader needs the full renewal process overview",
      "when introducing renewal basics before a deeper topic",
      "when linking from news posts to evergreen guidance",
    ],
    doNotLinkWhen: [
      "when the paragraph is only about a specific bank product",
      "when a more specific hub (rates, checklist, switching) is the better target",
    ],
    assetTypes: ["owner-occupied", "investment-property"],
  },

  "what-is-a-mortgage-renewal": {
    readerPromise:
      "Get a plain-English definition of mortgage renewal, maturity, and your options at term end.",
    topicsCovered: [
      "What a renewal is",
      "Maturity date",
      "Term vs amortization",
      "Options at renewal",
    ],
    questionsAnswered: [
      "What is a mortgage renewal?",
      "What happens when my mortgage term ends?",
    ],
    linkWhen: [
      "when defining renewal for first-time renewers",
      "when a glossary-style explanation is needed",
    ],
    doNotLinkWhen: [
      "when the reader already understands renewals and needs rates or switch steps",
    ],
    assetTypes: ["owner-occupied"],
  },

  "switching-lenders-at-renewal": {
    readerPromise:
      "Learn how to switch mortgage lenders at renewal in Canada — stress-test rules, discharge fees, and timeline.",
    topicsCovered: [
      "Straight switch at maturity",
      "Stress-test exemption",
      "Discharge and legal fees",
      "Collateral vs standard charge",
      "Switch timeline",
    ],
    questionsAnswered: [
      "Can I switch lenders at renewal without a stress test?",
      "What fees apply when I leave my bank?",
      "How long does a switch take?",
    ],
    linkWhen: [
      "when discussing leaving your bank or transferring the mortgage",
      "when discharge fees or switch costs are mentioned",
      "when comparing stay vs switch outcomes",
    ],
    doNotLinkWhen: [
      "when the topic is refinancing mid-term with a break penalty as the main focus",
      "when the reader only needs a rate table",
    ],
    assetTypes: ["owner-occupied", "investment-property"],
  },

  "best-mortgage-renewal-rates": {
    readerPromise:
      "Compare current Canadian mortgage renewal rates for fixed and variable terms.",
    topicsCovered: [
      "Best renewal rates",
      "Fixed vs variable rate offers",
      "Rate shopping at renewal",
      "Broker vs bank rates",
    ],
    questionsAnswered: [
      "What are today's best mortgage renewal rates in Canada?",
      "How do I compare renewal rate offers?",
    ],
    linkWhen: [
      "when the article discusses renewal rates or rate shopping",
      "when BoC or market rate news needs an evergreen rates hub",
    ],
    doNotLinkWhen: [
      "when the paragraph is about stress-test qualification math only",
    ],
    assetTypes: ["fixed", "variable"],
  },

  "mortgage-renewal-checklist": {
    readerPromise:
      "Use a step-by-step checklist of documents and actions before your mortgage renewal date.",
    topicsCovered: [
      "Document checklist",
      "Renewal letter review",
      "Timeline reminders",
      "Prep for switching",
    ],
    questionsAnswered: [
      "What documents do I need for mortgage renewal?",
      "What should I check off before maturity?",
    ],
    linkWhen: [
      "when listing documents or preparation steps",
      "when first-renewal or payment-shock posts need a practical next step",
    ],
    doNotLinkWhen: [
      "when the reader only needs a calculator or rate quote",
    ],
    assetTypes: ["owner-occupied"],
  },

  "mortgage-renewal-payment-shock": {
    readerPromise:
      "Understand why renewal payments rise, estimate the increase, and find ways to reduce payment shock.",
    topicsCovered: [
      "Payment shock math",
      "2020–2021 borrower renewals",
      "Term and amortization levers",
      "Switching to lower the payment",
    ],
    questionsAnswered: [
      "Why is my renewal payment so much higher?",
      "How do I reduce payment shock at renewal?",
    ],
    linkWhen: [
      "when discussing payment increases at renewal",
      "when first-renewal borrowers face higher rates",
    ],
    doNotLinkWhen: [
      "when the topic is only BoC policy with no payment impact",
    ],
    assetTypes: ["owner-occupied"],
  },

  "stress-test-mortgage-renewal": {
    readerPromise:
      "Know when the mortgage stress test applies at renewal, when switches are exempt, and how to qualify if required.",
    topicsCovered: [
      "Stress test at renewal",
      "Straight-switch exemption",
      "When requalification is required",
      "Passing the qualifying rate",
    ],
    questionsAnswered: [
      "Do I need to pass the stress test to renew?",
      "When does switching trigger the stress test?",
    ],
    linkWhen: [
      "when OSFI, B-20, or qualifying rate is discussed",
      "when switch eligibility depends on stress-test rules",
    ],
    doNotLinkWhen: [
      "when the article is only about rate shopping with no qualification angle",
    ],
    assetTypes: ["owner-occupied", "investment-property"],
  },

  "osfi-b20-stress-test-at-renewal": {
    readerPromise:
      "Understand OSFI B-20 qualifying rules and how they shape renewal switches in Canada.",
    topicsCovered: [
      "OSFI B-20",
      "Qualifying rate formula",
      "Federally regulated lenders",
      "Switch exemptions",
    ],
    questionsAnswered: [
      "What is OSFI B-20 at renewal?",
      "How does the federal stress test affect switching?",
    ],
    linkWhen: [
      "when citing OSFI or B-20 specifically",
      "when explaining the legal/regulatory basis for stress-test rules",
    ],
    doNotLinkWhen: [
      "when a simpler stress-test explainer is enough for the reader",
    ],
    assetTypes: ["owner-occupied"],
  },

  "mortgage-renewal-calculator": {
    readerPromise:
      "Estimate your new renewal payment at different rates and terms.",
    topicsCovered: [
      "Payment calculation",
      "Rate scenarios",
      "Term comparison",
    ],
    questionsAnswered: [
      "What will my renewal payment be?",
      "How do I model different renewal rates?",
    ],
    linkWhen: [
      "when the reader needs to run payment numbers",
      "when payment shock or rate posts suggest calculating scenarios",
    ],
    doNotLinkWhen: [
      "when switch break-even or penalty math is the specific need",
    ],
    assetTypes: ["owner-occupied"],
  },

  "switch-vs-stay-calculator": {
    readerPromise:
      "Compare staying with your bank versus switching lenders at renewal, net of fees.",
    topicsCovered: [
      "Switch vs stay math",
      "Fee payback period",
      "Rate savings vs costs",
    ],
    questionsAnswered: [
      "Is switching worth it after discharge and legal fees?",
      "How long until a switch pays for itself?",
    ],
    linkWhen: [
      "when weighing stay vs switch quantitatively",
      "when discharge fees are being weighed against rate savings",
    ],
    doNotLinkWhen: [
      "when the reader only needs a qualitative switching guide",
    ],
    assetTypes: ["owner-occupied"],
  },

  "mortgage-penalty-calculator": {
    readerPromise:
      "Estimate IRD or three-month interest penalties if you break your mortgage early.",
    topicsCovered: ["IRD", "Three-month interest", "Break costs"],
    questionsAnswered: [
      "What penalty will I pay to break my mortgage?",
      "Is IRD or three-month interest higher for me?",
    ],
    linkWhen: [
      "when discussing early break, blend-and-extend, or mid-term refinance costs",
    ],
    doNotLinkWhen: [
      "when the reader is at maturity with no break penalty",
    ],
    assetTypes: ["fixed", "variable"],
  },

  "mortgage-discharge-fees-canada": {
    readerPromise:
      "Understand mortgage discharge fees and switch costs when leaving your lender at renewal.",
    topicsCovered: [
      "Discharge fees",
      "Legal fees on switch",
      "Title insurance",
      "Who pays switch costs",
    ],
    questionsAnswered: [
      "What does it cost to discharge my mortgage?",
      "Do switch promotions cover legal fees?",
    ],
    linkWhen: [
      "when discharge or switch costs are the topic",
      "when news covers legal-paid switch promotions",
    ],
    doNotLinkWhen: [
      "when the reader is staying with the same lender with no discharge",
    ],
    assetTypes: ["owner-occupied"],
  },

  "renewal-vs-refinancing": {
    readerPromise:
      "Decide when a straight renewal is enough and when refinancing or a HELOC makes more sense.",
    topicsCovered: [
      "Renewal vs refinance",
      "Equity access",
      "HELOC at renewal",
      "Requalification differences",
    ],
    questionsAnswered: [
      "Should I renew or refinance?",
      "When does a HELOC beat a cash-out refinance at renewal?",
    ],
    linkWhen: [
      "when comparing renewal to refinance or equity takeout",
    ],
    doNotLinkWhen: [
      "when the reader only wants a rate comparison on a straight renewal",
    ],
    assetTypes: ["owner-occupied", "investment-property"],
  },

  "mortgage-broker-renewal": {
    readerPromise:
      "See how a mortgage broker helps at renewal — comparing 30+ lenders without bank-shopping yourself.",
    topicsCovered: [
      "Broker at renewal",
      "Multi-lender shopping",
      "Free broker compensation",
      "When to call a broker",
    ],
    questionsAnswered: [
      "Should I use a broker for my renewal?",
      "How does a broker get paid at renewal?",
    ],
    linkWhen: [
      "when recommending professional help or multi-lender comparison",
      "when bank-specific pages need a broker alternative",
    ],
    doNotLinkWhen: [
      "when the reader is mid-calculator and only needs a tool link",
    ],
    assetTypes: ["owner-occupied"],
  },

  "fixed-vs-variable-mortgage-renewal": {
    readerPromise:
      "Choose fixed or variable at mortgage renewal — payment stability, trigger rates, and break costs.",
    topicsCovered: [
      "Fixed vs variable at renewal",
      "Trigger rate",
      "Break penalties by product",
      "BoC path dependency",
    ],
    questionsAnswered: [
      "Should I renew into fixed or variable?",
      "How does trigger rate affect variable renewals?",
    ],
    linkWhen: [
      "when the reader is choosing rate type at renewal",
    ],
    doNotLinkWhen: [
      "when the topic is only BoC policy without product choice",
    ],
    assetTypes: ["fixed", "variable"],
  },

  "first-time-mortgage-renewal": {
    readerPromise:
      "Prepare for your first mortgage renewal — what to expect, what to compare, and common first-renewal mistakes.",
    topicsCovered: [
      "First renewal journey",
      "Payment shock for first renewers",
      "Documents and timeline",
      "Bank offer negotiation",
    ],
    questionsAnswered: [
      "What should I expect at my first mortgage renewal?",
      "How do first renewals differ from later ones?",
    ],
    linkWhen: [
      "when addressing first-time renewers or 2020–2021 first maturity cohorts",
    ],
    doNotLinkWhen: [
      "when the reader is clearly on a subsequent renewal with portfolio complexity",
    ],
    assetTypes: ["owner-occupied"],
  },

  "ontario-mortgage-renewal": {
    readerPromise:
      "Ontario-specific mortgage renewal tips, legal fees, and lender options.",
    topicsCovered: ["Ontario legal fees", "ON lenders", "FSRA context"],
    questionsAnswered: [
      "How does mortgage renewal work in Ontario?",
      "What legal fees apply when switching in Ontario?",
    ],
    linkWhen: ["when the reader or content is Ontario-specific"],
    doNotLinkWhen: ["when another province is the clear context"],
    assetTypes: ["owner-occupied"],
  },

  "bc-mortgage-renewal": {
    readerPromise:
      "British Columbia mortgage renewal guide — rates, switching, and provincial considerations.",
    topicsCovered: ["BC renewal process", "BC legal costs", "Local lenders"],
    questionsAnswered: ["How does mortgage renewal work in BC?"],
    linkWhen: ["when the reader or content is BC-specific"],
    doNotLinkWhen: ["when another province is the clear context"],
    assetTypes: ["owner-occupied"],
  },

  "alberta-mortgage-renewal": {
    readerPromise:
      "Alberta mortgage renewal guide for homeowners comparing rates and lenders.",
    topicsCovered: ["Alberta renewal", "AB lenders", "Switch costs"],
    questionsAnswered: ["How does mortgage renewal work in Alberta?"],
    linkWhen: ["when the reader or content is Alberta-specific"],
    doNotLinkWhen: ["when another province is the clear context"],
    assetTypes: ["owner-occupied"],
  },

  "quebec-mortgage-renewal": {
    readerPromise:
      "Quebec mortgage renewal — notary fees, Desjardins, and switching rules.",
    topicsCovered: ["Quebec notary fees", "Desjardins", "QC switching"],
    questionsAnswered: ["How does mortgage renewal work in Quebec?"],
    linkWhen: ["when the reader or content is Quebec-specific"],
    doNotLinkWhen: ["when another province is the clear context"],
    assetTypes: ["owner-occupied"],
  },

  "current-mortgage-rates-canada": {
    readerPromise: "See current Canadian mortgage rates relevant to renewals and purchases.",
    topicsCovered: ["Current rates", "Fixed and variable", "Market context"],
    questionsAnswered: ["What are current mortgage rates in Canada?"],
    linkWhen: ["when live/current rate context is needed alongside renewal advice"],
    doNotLinkWhen: ["when best renewal rates hub is the better dedicated target"],
    assetTypes: ["fixed", "variable"],
  },

  "bank-of-canada-rate-decisions": {
    readerPromise:
      "Track Bank of Canada policy rate decisions and what they mean for mortgage renewals.",
    topicsCovered: ["BoC overnight rate", "Decision dates", "Renewal impact"],
    questionsAnswered: [
      "How do BoC decisions affect my renewal rate?",
      "What was the latest Bank of Canada rate decision?",
    ],
    linkWhen: [
      "when discussing BoC holds/cuts/hikes and renewal timing",
    ],
    doNotLinkWhen: [
      "when the reader only needs a static best-rates table",
    ],
    assetTypes: ["variable", "fixed"],
  },

  "canadian-lender-cheat-sheet": {
    readerPromise:
      "Compare Canadian lender types and renewal behaviors before you shop or switch.",
    topicsCovered: [
      "Big banks",
      "Monolines",
      "Credit unions",
      "B lenders",
    ],
    questionsAnswered: [
      "Which lender types are best at renewal?",
      "How do banks differ from monolines at renewal?",
    ],
    linkWhen: [
      "when comparing lender types or preparing to shop the market",
    ],
    doNotLinkWhen: [
      "when a single bank page is the correct deep link",
    ],
    assetTypes: ["owner-occupied"],
  },
};
