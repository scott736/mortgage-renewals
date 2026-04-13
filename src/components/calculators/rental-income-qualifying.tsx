import React, { useState } from 'react';

// ============================================================================
// Canadian mortgage math — semi-annual compounding
// ============================================================================
function effectiveMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function _monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = effectiveMonthlyRate(annualRate);
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function fmt(n: number): string {
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
}

function _fmtPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

// ============================================================================
// Shared UI
// ============================================================================
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-body-sm-medium text-foreground mb-1">{children}</label>;
}

function Input({ value, onChange, min = 0, max, step = 1, prefix, suffix }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; prefix?: string; suffix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-muted-foreground text-body-sm">{prefix}</span>}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full rounded-lg border border-gray-200 bg-background py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100 ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
      />
      {suffix && <span className="absolute right-3 text-muted-foreground text-body-sm">{suffix}</span>}
    </div>
  );
}

function ResultCard({ label, value, highlight, sublabel }: { label: string; value: string; highlight?: boolean; sublabel?: string }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-secondary-25 border-secondary-50' : 'bg-gray-25 border-gray-100'}`}>
      <div className="text-body-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-secondary-200' : 'text-foreground'}`}>{value}</div>
      {sublabel && <div className="text-body-xs text-muted-foreground mt-1">{sublabel}</div>}
    </div>
  );
}

function BrokerCTA({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-xl bg-primary-0 border border-primary-25 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1">
        <p className="text-body-sm-medium text-primary-200">{message}</p>
        <p className="text-body-xs text-muted-foreground mt-1">A broker will confirm this with real lender quotes — for free.</p>
      </div>
      <a href="/book-a-call/" className="flex-shrink-0 rounded-lg bg-primary-100 text-white px-5 py-2.5 text-body-sm-medium hover:opacity-90 transition-opacity">
        Book Free Call
      </a>
    </div>
  );
}

// ============================================================================
// Rental Income Qualifying Calculator
//    Shows how much rental income each Canadian lender method will credit
//    toward mortgage qualification. Major methods: 50% add-back, 80% offset,
//    DCR 1.10 (rental worksheet), DCR 1.00.
// ============================================================================
export function RentalIncomeQualifying() {
  const [grossRent, setGrossRent] = useState(3200);
  const [pith, setPith] = useState(2800); // P+I+T+H on the rental property
  const [insured, setInsured] = useState(false);

  // Method 1: 50% add-back
  // Credits 50% of gross rent as income to add to applicant's income.
  const method50Addback = grossRent * 0.50;

  // Method 2: 80% offset (rental offset)
  // 80% of rent offsets PITH; any shortfall counts as debt. Surplus is ignored.
  const offset80Credit = grossRent * 0.80;
  const offset80Net = offset80Credit - pith; // positive = surplus, negative = shortfall added to TDS
  const _method80Offset = offset80Net >= 0 ? 0 : offset80Net; // Doesn't add income, only adjusts debt

  // Method 3: DCR 1.10 (rental worksheet)
  // Debt coverage ratio. Gross rent must be at least 1.10x PITH for 100% rent to count as income.
  const dcr = pith > 0 ? grossRent / pith : 99;
  const dcr110Passes = dcr >= 1.10;
  const dcr110Credit = dcr110Passes ? grossRent - pith : 0; // Net cashflow added as income

  // Method 4: DCR 1.00 (more lenient monoline method)
  const dcr100Passes = dcr >= 1.00;
  const dcr100Credit = dcr100Passes ? (grossRent - pith) : 0;

  // Best-case for applicant
  const bestMethod = Math.max(method50Addback, dcr110Passes ? dcr110Credit : 0, dcr100Passes ? dcr100Credit : 0);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Rental Income Qualifying Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">See how much rental income each Canadian lender method credits toward your mortgage qualification.</p>
      <div className="rounded-lg bg-primary-0 border border-primary-25 px-4 py-3 text-body-xs text-primary-200 mb-6">
        ℹ️ Insured (CMHC/Sagen/Canada Guaranty) rentals use fixed 50% add-back or 80% offset. Uninsured lenders can use DCR methods, which are often more generous. Owner-occupied with rental suite follows different rules.
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div>
          <Label>Gross Monthly Rent</Label>
          <Input value={grossRent} onChange={setGrossRent} min={500} max={20000} step={50} prefix="$" />
        </div>
        <div>
          <Label>PITH (P+I+Tax+Heat)</Label>
          <Input value={pith} onChange={setPith} min={0} max={20000} step={50} prefix="$" />
        </div>
        <div>
          <Label>Mortgage Type</Label>
          <select
            value={insured ? 'insured' : 'uninsured'}
            onChange={e => setInsured(e.target.value === 'insured')}
            className="w-full rounded-lg border border-gray-200 bg-background py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-100"
          >
            <option value="uninsured">Uninsured (&gt;20% down)</option>
            <option value="insured">Insured (CMHC/Sagen/CG)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-body-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Method</th>
              <th className="p-3">How It Counts</th>
              <th className="p-3">Income Credited</th>
              <th className="p-3">Available For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-3 font-medium">50% Add-Back</td>
              <td className="p-3 text-body-xs text-muted-foreground">50% of gross rent added to gross income</td>
              <td className="p-3 font-bold">{fmt(method50Addback)}/mo</td>
              <td className="p-3 text-body-xs">Insured + uninsured (all lenders)</td>
            </tr>
            <tr className="border-b border-gray-100 bg-gray-25">
              <td className="p-3 font-medium">80% Offset</td>
              <td className="p-3 text-body-xs text-muted-foreground">80% of rent offsets PITH; shortfall = debt, surplus ignored</td>
              <td className="p-3 font-bold">{offset80Net >= 0 ? 'neutralizes PITH' : `${fmt(offset80Net)}/mo (adds to TDS)`}</td>
              <td className="p-3 text-body-xs">Insured (CMHC default)</td>
            </tr>
            <tr className={`border-b border-gray-100 ${dcr110Passes ? '' : 'opacity-60'}`}>
              <td className="p-3 font-medium">DCR 1.10 (Rental Worksheet)</td>
              <td className="p-3 text-body-xs text-muted-foreground">Rent must be ≥1.10× PITH. Net cashflow added as income.</td>
              <td className="p-3 font-bold">{dcr110Passes ? `${fmt(dcr110Credit)}/mo` : `fails (DCR ${dcr.toFixed(2)})`}</td>
              <td className="p-3 text-body-xs">Uninsured only</td>
            </tr>
            <tr className={`${dcr100Passes ? '' : 'opacity-60'}`}>
              <td className="p-3 font-medium">DCR 1.00 (Monoline)</td>
              <td className="p-3 text-body-xs text-muted-foreground">Rent must ≥ PITH. Surplus added as income.</td>
              <td className="p-3 font-bold">{dcr100Passes ? `${fmt(dcr100Credit)}/mo` : `fails (DCR ${dcr.toFixed(2)})`}</td>
              <td className="p-3 text-body-xs">Uninsured monolines</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <ResultCard label="Debt Coverage Ratio" value={dcr.toFixed(2)} highlight={dcr >= 1.10} sublabel={dcr >= 1.10 ? '✓ Passes 1.10 DCR' : dcr >= 1.00 ? '✓ Passes 1.00 DCR' : '✗ Shortfall — adds to TDS'} />
        <ResultCard label="Best Method Credit" value={fmt(bestMethod)} highlight sublabel="Per month — max across methods" />
        <ResultCard label="Annual Income Boost" value={fmt(bestMethod * 12)} highlight sublabel="= best-case qualifying addition" />
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground mb-6">
        <strong className="text-foreground">Why this matters at renewal:</strong> If your rental property's PITH has climbed (taxes, insurance, interest rates) while rents stayed flat, your DCR may have dropped below 1.10 — meaning you can't use DCR methods anymore. Switching to a lender that uses 50% add-back (always available, less efficient) may be the only way to qualify at renewal.
      </div>

      <BrokerCTA message={bestMethod > 0
        ? `Best method gives you ${fmt(bestMethod)}/mo qualifying income boost. A broker knows which lenders apply each method.`
        : `Your rental currently doesn't help qualification. A broker can find lenders with looser DCR or structure the file differently.`} />
    </div>
  );
}
