// Generates /public/downloads/renewal-checklist-2026.pdf
// Run with: bun scripts/generate-renewal-checklist-pdf.mjs
// Regenerate whenever the checklist content or rates change.

import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "downloads", "renewal-checklist-2026.pdf");
const SITE = "MortgageRenewalHub.ca";
const BRAND_NAVY = "#0f2239";
const BRAND_ACCENT = "#2f6bd9";
const BRAND_MUTED = "#5b6b7e";
const LINE = "#d7dde4";

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 54, left: 54, right: 54, bottom: 54 },
  info: {
    Title: "Canadian Mortgage Renewal Checklist 2026",
    Author: "Scott Dillingham, Licensed Mortgage Broker",
    Subject: "Mortgage Renewal Checklist for Canadian Homeowners",
    Keywords: "mortgage renewal, Canada, 2026, checklist, OSFI, stress test",
    Creator: SITE,
  },
});

doc.pipe(fs.createWriteStream(OUT));

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function h1(text) {
  doc.fillColor(BRAND_NAVY).font("Helvetica-Bold").fontSize(22).text(text);
  doc.moveDown(0.4);
}
function h2(text) {
  doc.moveDown(0.6);
  doc.fillColor(BRAND_NAVY).font("Helvetica-Bold").fontSize(14).text(text);
  doc.moveDown(0.3);
}
function p(text) {
  doc.fillColor("#222").font("Helvetica").fontSize(10.5).text(text, { lineGap: 2 });
  doc.moveDown(0.3);
}
function note(text) {
  doc.fillColor(BRAND_MUTED).font("Helvetica-Oblique").fontSize(9.5).text(text, { lineGap: 2 });
  doc.moveDown(0.25);
}
function hr() {
  const y = doc.y + 2;
  doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.moveDown(0.4);
}
function checkbox(label) {
  const startX = doc.x;
  const startY = doc.y;
  doc.rect(startX, startY + 2.5, 9, 9).lineWidth(0.6).strokeColor(BRAND_NAVY).stroke();
  doc.fillColor("#222").font("Helvetica").fontSize(10.5).text("    " + label, startX, startY, {
    lineGap: 2,
    continued: false,
  });
  doc.moveDown(0.1);
}
function subheader(label) {
  doc.fillColor(BRAND_ACCENT).font("Helvetica-Bold").fontSize(11).text(label);
  doc.moveDown(0.2);
}

// -----------------------------------------------------------------------------
// Cover
// -----------------------------------------------------------------------------
doc.rect(0, 0, doc.page.width, 140).fill(BRAND_NAVY);
doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(26).text("Canadian Mortgage", 54, 46);
doc.fontSize(26).text("Renewal Checklist", 54, 76);
doc.font("Helvetica").fontSize(12).fillColor("#c9d3e0").text("2026 Edition · Prepared by " + SITE, 54, 112);

doc.moveDown(2);
doc.fillColor("#222").font("Helvetica").fontSize(10.5).text(
  "Use this checklist to move through your Canadian mortgage renewal methodically. Each section maps to a 30-day window before your maturity date. Don't skip the first section — starting early is the single biggest factor in getting a great rate.",
  54,
  170,
  { width: doc.page.width - 108 }
);
doc.moveDown(0.5);

// Key facts callout
doc.rect(54, doc.y, doc.page.width - 108, 90).fillAndStroke("#eef3fa", "#bcd0ed");
const boxY = doc.y;
doc.fillColor(BRAND_NAVY).font("Helvetica-Bold").fontSize(11).text("Key facts (April 2026)", 66, boxY + 10);
doc.font("Helvetica").fontSize(9.8).fillColor("#222").text(
  "Bank of Canada overnight rate: 2.25%   ·   Prime rate: 4.45%   ·   Next BoC decision: April 29, 2026\n" +
  "Best broker 5-year fixed (insured): ~3.94–4.04%   ·   5-year variable: ~3.30–3.35%\n" +
  "Stress test is waived for uninsured straight-switch renewals (OSFI, Nov 21, 2024).\n" +
  "30-year amortization available for all first-time buyers of insured mortgages (Dec 15, 2024).",
  66,
  boxY + 28,
  { width: doc.page.width - 132, lineGap: 2 }
);
doc.y = boxY + 102;
doc.moveDown(0.6);

// -----------------------------------------------------------------------------
// 6 months before maturity
// -----------------------------------------------------------------------------
h2("6 Months Before Maturity — Gather Information");
subheader("Know your current mortgage");
checkbox("Locate your most recent mortgage statement");
checkbox("Confirm your exact maturity (renewal) date");
checkbox("Note your current balance, rate, amortization, and term");
checkbox("Identify your charge type — standard or collateral? (affects switching cost)");
checkbox("Note your lender's prepayment privileges (lump sum % and payment increase %)");

doc.moveDown(0.3);
subheader("Understand your context");
checkbox("Review your credit score (Equifax or TransUnion — free via your bank)");
checkbox("Check your current home value (HPI estimate, recent comparable sales)");
checkbox("List any household income changes since your original mortgage");
checkbox("Review outstanding debts that could be consolidated at renewal");

// -----------------------------------------------------------------------------
// 4-5 months
// -----------------------------------------------------------------------------
doc.addPage();
h2("4–5 Months Before Maturity — Compare Options");
subheader("Shop the market");
checkbox("Contact a licensed mortgage broker (free — paid by the lender, not you)");
checkbox("Request quotes from at least 3 lenders: bank, monoline, credit union");
checkbox("Compare rates AND terms (prepayment, penalty, portability, skip-a-payment)");
checkbox("Review fixed vs. variable options against your risk tolerance");
checkbox("Decide on your target term (1, 2, 3, 4, 5, or 10 years)");

doc.moveDown(0.3);
subheader("Run the numbers");
checkbox("Calculate new payment at offered rate (use MortgageRenewalHub.ca calculator)");
checkbox("Compare blend-and-extend vs. break-and-switch if your bank offers a blend");
checkbox("Run a switch-vs-stay break-even including any discharge/legal/appraisal fees");
checkbox("If considering equity access, compare HELOC vs. cash-out refinance");

doc.moveDown(0.3);
subheader("Understand what changed");
checkbox("Confirm you qualify as a straight switch (same balance, same amortization)");
checkbox("If straight switch: no stress test required (OSFI exemption, November 2024)");
checkbox("If refinance or more money: stress test applies (contract rate + 2% or 5.25%)");

// -----------------------------------------------------------------------------
// 3-4 months
// -----------------------------------------------------------------------------
doc.addPage();
h2("3–4 Months Before Maturity — Lock Your Strategy");
subheader("Get a rate hold");
checkbox("Ask your broker to lock a rate hold (Canadian lenders hold up to 120 days)");
checkbox("Get the commitment letter in writing with full terms");
checkbox("Confirm which lender will cover which switching costs (legal, appraisal, discharge)");

doc.moveDown(0.3);
subheader("Negotiate with your current lender");
checkbox("Present the competing offer to your current lender");
checkbox("Ask them to match or beat — they often will");
checkbox("Compare the matched offer against the competitor on full terms, not just rate");
checkbox("Decide: stay or switch (if difference under 0.10%, staying is often easier)");

doc.moveDown(0.3);
subheader("Gather documents (if switching)");
checkbox("Recent mortgage statement");
checkbox("Proof of income (recent pay stubs, 2-year NOAs if self-employed)");
checkbox("Valid government photo ID");
checkbox("Most recent property tax bill");
checkbox("Property insurance certificate");
checkbox("Condo/strata documents (if applicable)");

// -----------------------------------------------------------------------------
// 1-2 months
// -----------------------------------------------------------------------------
doc.addPage();
h2("1–2 Months Before Maturity — Execute");
subheader("If switching lenders");
checkbox("Sign the new lender's commitment letter");
checkbox("Complete legal work with the new lender's lawyer or title insurance provider");
checkbox("Confirm the payout amount with your current lender (including any partial interest)");
checkbox("Transfer pre-authorized payments to the new lender's account details");

doc.moveDown(0.3);
subheader("If staying with your lender");
checkbox("Review and sign the renewal agreement");
checkbox("Confirm the new rate, term, and amortization match what was negotiated");
checkbox("Set up any new prepayment plan (accelerated bi-weekly saves ~3 yrs on a 25-yr amort)");

doc.moveDown(0.3);
subheader("Set up going forward");
checkbox("Update your mortgage tracking spreadsheet with new rate and term");
checkbox("Set a calendar reminder 12 months before the next maturity date");
checkbox("Consider property tax and insurance payment changes if switching lenders");
checkbox("Keep a copy of your new mortgage agreement and commitment letter");

// -----------------------------------------------------------------------------
// Red flags
// -----------------------------------------------------------------------------
doc.addPage();
h2("Red Flags — Stop and Ask Questions");
p("• You were told you need to re-qualify under a stress test for a straight switch (check OSFI Nov 2024 exemption).");
p("• The renewal offer is higher than the original posted rate even though the market has moved down.");
p("• Legal fees over $1,500 on a straight-charge switch (most lenders cover $700–$1,200 in legal).");
p("• IRD penalty quoted over 3% of your balance with more than 2 years remaining (ask for the formula).");
p("• Pressure to sign immediately without time to review or compare (you have 21 days to renegotiate under the Canadian Mortgage Charter).");
p("• You were told a collateral charge is 'the same' as a standard charge (it is not — collateral cannot be assigned).");

// -----------------------------------------------------------------------------
// Glossary quick reference
// -----------------------------------------------------------------------------
h2("Quick Glossary");
p("Straight switch: Moving your mortgage to a new lender with the same balance, amortization, and no new money. No stress test required since Nov 2024.");
p("Stress test / MQR: OSFI B-20 minimum qualifying rate = greater of contract rate + 2% or 5.25%. Applies to refinances and non-straight-switch scenarios.");
p("IRD: Interest Rate Differential — a prepayment penalty tied to the difference between your rate and today's comparable rate. Big 6 inflate this using posted rates.");
p("Blend-and-extend: A way to lock in a lower rate early by blending your current rate with today's rate, weighted by months remaining. Big-6 bank product.");
p("Prepayment privileges: Annual lump-sum % (typically 10–20%) and payment-increase % you can use without penalty. Use-it-or-lose-it per year.");
p("Rate hold: A lender's commitment to honour today's rate for up to 120 days before your maturity date. Lock one while you shop.");

// -----------------------------------------------------------------------------
// Footer / CTA
// -----------------------------------------------------------------------------
doc.addPage();
doc.rect(0, 0, doc.page.width, doc.page.height).fill(BRAND_NAVY);
doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(22).text("Need help running the numbers?", 54, 120, { width: doc.page.width - 108 });
doc.moveDown(0.5);
doc.font("Helvetica").fontSize(12).fillColor("#c9d3e0").text(
  "A licensed mortgage broker is free to use — paid by the lender, not you. They compare 30+ Canadian lenders at once, confirm your charge type, run the switch-vs-stay math with real penalty numbers, and lock rate holds on your behalf.",
  54,
  doc.y,
  { width: doc.page.width - 108, lineGap: 3 }
);
doc.moveDown(1.5);
doc.font("Helvetica-Bold").fontSize(14).fillColor("#ffffff").text("Book a free renewal strategy call:", 54, doc.y, { width: doc.page.width - 108 });
doc.moveDown(0.4);
doc.font("Helvetica").fontSize(13).fillColor("#ffd66e").text("https://mortgagerenewalhub.ca/book-a-call/", 54, doc.y, { link: "https://mortgagerenewalhub.ca/book-a-call/" });

doc.moveDown(3);
doc.font("Helvetica").fontSize(10).fillColor("#c9d3e0").text(
  "Prepared by Scott Dillingham, Licensed Mortgage Broker\n" +
  "MortgageRenewalHub.ca · Canada's most comprehensive mortgage renewal resource\n" +
  "Content updated April 11, 2026. Rate data changes weekly — check the site for current rates.\n\n" +
  "Sources cited in the online guide: OSFI Guideline B-20, Canada Mortgage and Housing Corporation (CMHC), Financial Consumer Agency of Canada (FCAC), Bank of Canada, Department of Finance Canada.\n\n" +
  "Educational content only. Confirm all figures with a licensed broker or lender before acting.",
  54,
  doc.y,
  { width: doc.page.width - 108, lineGap: 2 }
);

doc.end();

console.log(`Wrote ${OUT}`);
