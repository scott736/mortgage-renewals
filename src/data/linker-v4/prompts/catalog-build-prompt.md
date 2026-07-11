# Page Catalog Enrichment Task

You are helping build a page catalog for an internal linking system.
For each page below, generate a **purpose card** that describes what the page delivers to readers.

## Output Format

Return a JSON array of objects with this structure for each page:
```json
{
  "slug": "the-page-slug",
  "readerPromise": "One sentence: what the reader gets by visiting this page",
  "topicsCovered": ["topic1", "topic2", "topic3"],
  "questionsAnswered": ["What is X?", "How do I Y?"],
  "linkWhen": ["when the article discusses X", "when the reader needs help with Y"],
  "doNotLinkWhen": ["when the article only mentions X in passing", "when the context is about Z not Y"]
}
```

## Guidelines

- **readerPromise**: Be specific about what the READER gets, not what the PAGE contains.
  Example: 'Learn how DSCR loans let you qualify for US rentals using property income instead of personal income'
- **topicsCovered**: 5-8 specific topics covered in depth
- **questionsAnswered**: 3-5 real questions a reader can get answered
- **linkWhen**: 3-5 contexts in a blog post where linking helps the reader
- **doNotLinkWhen**: 2-4 contexts where linking would mislead the reader
  Example: linking to DSCR page when the article is about Canadian conventional mortgages

## Pages to Enrich

### Mortgage Renewal Guide Canada
- **URL**: /mortgage-renewal-guide/
- **Type**: pillar
- **Description**: Complete guide to renewing your Canadian mortgage — timeline, documents, negotiation, and when to switch lenders.
- **Region**: canada
- **Tags**: renewal, guide, process

### Best Mortgage Renewal Rates Canada
- **URL**: /best-mortgage-renewal-rates/
- **Type**: pillar
- **Description**: Compare current mortgage renewal rates for fixed and variable terms across Canadian lenders.
- **Region**: canada
- **Tags**: rates, renewal

### Mortgage Renewal Checklist
- **URL**: /mortgage-renewal-checklist/
- **Type**: pillar
- **Description**: Step-by-step checklist of documents and actions before your mortgage renewal date.
- **Region**: canada
- **Tags**: checklist, documents

### Switching Lenders at Renewal
- **URL**: /switching-lenders-at-renewal/
- **Type**: pillar
- **Description**: How to switch mortgage lenders at renewal in Canada — stress test rules, discharge fees, and timeline.
- **Region**: canada
- **Tags**: switching, transfer

### Renewal vs Refinancing
- **URL**: /renewal-vs-refinancing/
- **Type**: pillar
- **Description**: When to renew versus refinance — equity takeout, HELOC, and payment goals at term end.
- **Region**: canada
- **Tags**: refinance, heloc

### Mortgage Broker Renewal
- **URL**: /mortgage-broker-renewal/
- **Type**: pillar
- **Description**: How a mortgage broker helps at renewal — comparing 30+ lenders without bank shopping yourself.
- **Region**: canada
- **Tags**: broker, renewal

### Fixed vs Variable at Renewal
- **URL**: /fixed-vs-variable-mortgage-renewal/
- **Type**: pillar
- **Description**: Choose fixed or variable at mortgage renewal — payment stability, trigger rates, and break costs.
- **Region**: canada
- **Tags**: fixed, variable

### Ontario Mortgage Renewal
- **URL**: /ontario-mortgage-renewal/
- **Type**: pillar
- **Description**: Ontario-specific mortgage renewal tips, legal fees, and lender options.
- **Region**: canada
- **Tags**: ontario, provincial

### BC Mortgage Renewal
- **URL**: /bc-mortgage-renewal/
- **Type**: pillar
- **Description**: British Columbia mortgage renewal guide — rates, switching, and provincial considerations.
- **Region**: canada
- **Tags**: bc, provincial

### Alberta Mortgage Renewal
- **URL**: /alberta-mortgage-renewal/
- **Type**: pillar
- **Description**: Alberta mortgage renewal guide for homeowners comparing rates and lenders.
- **Region**: canada
- **Tags**: alberta, provincial

### Quebec Mortgage Renewal
- **URL**: /quebec-mortgage-renewal/
- **Type**: pillar
- **Description**: Quebec mortgage renewal — notary fees, Desjardins, and switching rules.
- **Region**: canada
- **Tags**: quebec, provincial

### What Is a Mortgage Renewal?
- **URL**: /what-is-a-mortgage-renewal/
- **Type**: pillar
- **Description**: Plain-English explainer of Canadian mortgage renewals, timelines, and options at maturity.
- **Region**: canada
- **Tags**: renewal, basics

### Payment Shock at Renewal
- **URL**: /mortgage-renewal-payment-shock/
- **Type**: pillar
- **Description**: Why renewal payments rise and how to estimate and reduce payment shock in Canada.
- **Region**: canada
- **Tags**: payment-shock, rates

### Stress Test at Renewal
- **URL**: /stress-test-mortgage-renewal/
- **Type**: pillar
- **Description**: When the mortgage stress test applies at renewal and when switches are exempt.
- **Region**: canada
- **Tags**: stress-test, osfi

### OSFI B-20 Stress Test at Renewal
- **URL**: /osfi-b20-stress-test-at-renewal/
- **Type**: pillar
- **Description**: OSFI B-20 qualifying rules and how they shape renewal switches.
- **Region**: canada
- **Tags**: osfi, stress-test

### Mortgage Discharge Fees Canada
- **URL**: /mortgage-discharge-fees-canada/
- **Type**: pillar
- **Description**: Discharge fees and switch costs when leaving your lender at renewal.
- **Region**: canada
- **Tags**: discharge-fees, switching

### First-Time Mortgage Renewal
- **URL**: /first-time-mortgage-renewal/
- **Type**: pillar
- **Description**: What to expect at your first mortgage renewal — timeline, payment shock, and comparison checklist.
- **Region**: canada
- **Tags**: first-renewal

### Canadian Lender Cheat Sheet
- **URL**: /canadian-lender-cheat-sheet/
- **Type**: pillar
- **Description**: Compare Canadian lender types and renewal behaviors before you shop or switch.
- **Region**: canada
- **Tags**: lenders, broker

### Mortgage Renewal Calculator
- **URL**: /mortgage-renewal-calculator/
- **Type**: page
- **Description**: Estimate your new renewal payment at different rates and terms.
- **Region**: canada
- **Tags**: calculator, payment

### Switch vs Stay Calculator
- **URL**: /switch-vs-stay-calculator/
- **Type**: page
- **Description**: Compare staying with your bank versus switching lenders at renewal.
- **Region**: canada
- **Tags**: calculator, switching

### Mortgage Penalty Calculator
- **URL**: /mortgage-penalty-calculator/
- **Type**: page
- **Description**: Estimate IRD or three-month interest penalties if you break your mortgage early.
- **Region**: canada
- **Tags**: calculator, penalty

### Break-Even Switch Calculator
- **URL**: /break-even-switch-calculator/
- **Type**: page
- **Description**: Find how long a rate savings needs to cover switch costs at renewal.
- **Region**: canada
- **Tags**: calculator, switching

### Mortgage Stress Test Calculator
- **URL**: /mortgage-stress-test-calculator/
- **Type**: page
- **Description**: Check OSFI B-20 stress test qualification for switches that require it.
- **Region**: canada
- **Tags**: calculator, stress-test

### Rate Comparison Calculator
- **URL**: /rate-comparison-calculator/
- **Type**: page
- **Description**: Compare two mortgage rate offers side by side for your renewal.
- **Region**: canada
- **Tags**: calculator, rates

### Current Mortgage Rates Canada
- **URL**: /current-mortgage-rates-canada/
- **Type**: page
- **Description**: Current Canadian mortgage rates for renewals and purchases.
- **Region**: canada
- **Tags**: rates

### Bank of Canada Rate Decisions
- **URL**: /bank-of-canada-rate-decisions/
- **Type**: page
- **Description**: BoC policy rate decisions and what they mean for mortgage renewals.
- **Region**: canada
- **Tags**: rates, boc

### Mortgage Renewal FAQ
- **URL**: /mortgage-renewal-faq/
- **Type**: page
- **Description**: Frequently asked questions about Canadian mortgage renewals.
- **Region**: canada
- **Tags**: faq

### Mortgage Renewal Glossary
- **URL**: /mortgage-renewal-glossary/
- **Type**: page
- **Description**: Definitions of common mortgage renewal terms for Canadian homeowners.
- **Region**: canada
- **Tags**: glossary

### About Mortgage Renewal Hub
- **URL**: /about/
- **Type**: page
- **Description**: About MortgageRenewalHub.ca — Canadian mortgage renewal education from licensed brokers.
- **Region**: canada
- **Tags**: about

### Book a Call
- **URL**: /book-a-call/
- **Type**: page
- **Description**: Book a free mortgage renewal strategy call with a licensed Canadian broker.
- **Region**: canada
- **Tags**: booking

### TD Mortgage Renewal
- **URL**: /td-mortgage-renewal/
- **Type**: page
- **Description**: TD Bank mortgage renewal options — compare before you auto-renew.
- **Region**: canada
- **Tags**: td, lender

### RBC Mortgage Renewal
- **URL**: /rbc-mortgage-renewal/
- **Type**: page
- **Description**: RBC mortgage renewal guide — rates, process, and switching alternatives.
- **Region**: canada
- **Tags**: rbc, lender

### Scotiabank Mortgage Renewal
- **URL**: /scotiabank-mortgage-renewal/
- **Type**: page
- **Description**: Scotiabank mortgage renewal — compare offers and switch options.
- **Region**: canada
- **Tags**: scotiabank, lender
