import React, { useEffect } from 'react';

import { BrokerCTA, Input, Label, ResultCard } from '@/components/calculators/calculator-ui';
import CalculatorLeadCapture from '@/components/lead/calculator-lead-capture';
import { usePatchState } from '@/hooks/use-patch-state';
import { saveCalculatorContext } from '@/lib/calculator-context';
import { effectiveMonthlyRate, fmt, fmtPct, monthlyPayment } from '@/lib/mortgage-math';

export function BreakEvenSwitch() {
  const [state, setState] = usePatchState({
    balance: 450000,
    monthsRemaining: 24,
    currentRate: 5.49,
    newRate: 4.19,
    amortYears: 22,
    penalty: 6000,
    legalFee: 0,
    dischargeFee: 325,
    appraisalFee: 0,
  });
  const { balance, monthsRemaining, currentRate, newRate, amortYears, penalty, legalFee, dischargeFee, appraisalFee } = state;

  const amortMonths = amortYears * 12;
  const currentPmt = monthlyPayment(balance, currentRate, amortMonths);
  const newPmt = monthlyPayment(balance, newRate, amortMonths);
  const monthlySaving = currentPmt - newPmt;

  const totalCosts = penalty + legalFee + dischargeFee + appraisalFee;
  const totalSavingsRemainingTerm = monthlySaving * monthsRemaining;
  const netRemainingTerm = totalSavingsRemainingTerm - totalCosts;
  const breakEvenMonths = monthlySaving > 0 ? Math.ceil(totalCosts / monthlySaving) : Infinity;

  const switchNow = netRemainingTerm > 0;
  const verdict = switchNow
    ? `Switch now, you'll recover costs in ${breakEvenMonths} months and save ${fmt(netRemainingTerm)} over the remaining ${monthsRemaining} months.`
    : breakEvenMonths > monthsRemaining
      ? `Wait for renewal, break-even of ${breakEvenMonths} months is longer than your ${monthsRemaining} months remaining.`
      : `Close call, switching costs roughly match the savings. Wait unless rates look set to rise further.`;

  const calcSummary =
    `${verdict} Balance ${fmt(balance)}, ${currentRate}% → ${newRate}%, switching costs ${fmt(totalCosts)}, net ${fmt(netRemainingTerm)} over ${monthsRemaining} mo.`;

  useEffect(() => {
    saveCalculatorContext({
      tool: 'Break-Even Switch Calculator',
      summary: calcSummary,
      data: {
        balance,
        currentRate,
        newRate,
        netRemainingTerm,
        switchNow,
      },
    });
  }, [calcSummary, balance, currentRate, newRate, netRemainingTerm, switchNow]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-heading-4 mb-1">Break-Even Switch Calculator</h3>
      <p className="text-body-sm text-muted-foreground mb-2">Should you break your mortgage and switch now, or wait for renewal?</p>
      <div className="rounded-lg bg-primary-0 border border-primary-25 px-4 py-3 text-body-xs text-primary-200 mb-6">
        💡 If you're within 120 days of your renewal date, most lenders let you lock in the new rate without any penalty. This calculator is for switching more than 120 days before renewal.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
          <Input id="mortgage-balance" aria-label="Mortgage Balance" value={balance} onChange={(v) => setState({ balance: v })} min={50000} max={5000000} step={10000} prefix="$" />
        </div>
        <div>
          <Label htmlFor="months-remaining">Months Remaining</Label>
          <Input id="months-remaining" aria-label="Months Remaining" value={monthsRemaining} onChange={(v) => setState({ monthsRemaining: v })} min={1} max={60} step={1} suffix="mo" />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input id="amortization" aria-label="Amortization" value={amortYears} onChange={(v) => setState({ amortYears: v })} min={1} max={30} step={1} suffix="yrs" />
        </div>
        <div>
          <Label htmlFor="current-rate">Current Rate</Label>
          <Input id="current-rate" aria-label="Current Rate" value={currentRate} onChange={(v) => setState({ currentRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="new-lender-rate">New Lender Rate</Label>
          <Input id="new-lender-rate" aria-label="New Lender Rate" value={newRate} onChange={(v) => setState({ newRate: v })} min={0.5} max={15} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="penalty-to-break">Penalty to Break</Label>
          <Input id="penalty-to-break" aria-label="Penalty to Break" value={penalty} onChange={(v) => setState({ penalty: v })} min={0} max={200000} step={500} prefix="$" />
        </div>
      </div>

      <div className="mb-4">
        <Label>Additional Switching Costs</Label>
        <div className="grid sm:grid-cols-3 gap-3 mt-1">
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Legal Fee</div>
            <Input id="legal-fee" aria-label="Legal Fee" value={legalFee} onChange={(v) => setState({ legalFee: v })} min={0} max={3000} step={25} prefix="$" />
          </div>
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Discharge Fee</div>
            <Input id="discharge-fee" aria-label="Discharge Fee" value={dischargeFee} onChange={(v) => setState({ dischargeFee: v })} min={0} max={2000} step={25} prefix="$" />
          </div>
          <div>
            <div className="text-body-xs text-muted-foreground mb-1">Appraisal</div>
            <Input id="appraisal" aria-label="Appraisal" value={appraisalFee} onChange={(v) => setState({ appraisalFee: v })} min={0} max={1500} step={25} prefix="$" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResultCard label="Monthly Saving" value={fmt(monthlySaving)} highlight />
        <ResultCard label="Total Switching Cost" value={fmt(totalCosts)} sublabel="Penalty + legal + discharge + appraisal" />
        <ResultCard label="Break-Even" value={breakEvenMonths === Infinity ? 'N/A' : `${breakEvenMonths} mo`} highlight sublabel={breakEvenMonths === Infinity ? 'No savings' : `~${(breakEvenMonths / 12).toFixed(1)} years`} />
        <ResultCard label="Net Saving (Remaining Term)" value={fmt(netRemainingTerm)} highlight sublabel={`Over ${monthsRemaining} months`} />
      </div>

      <div className={`rounded-xl p-5 border-2 mb-6 ${switchNow ? 'bg-secondary-25 border-secondary-100' : 'bg-warning-0 border-warning-50'}`}>
        <div className={`text-body-sm-medium mb-1 ${switchNow ? 'text-secondary-200' : 'text-warning-200'}`}>Verdict</div>
        <div className="text-body-md">{verdict}</div>
      </div>

      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4 text-body-sm text-muted-foreground mb-6">
        <strong className="text-foreground">Under the Canadian Mortgage Charter (2023),</strong> lenders must offer renewal-terms flexibility to borrowers in distress. If your penalty looks ruinous, check whether you qualify for a penalty waiver, amortization extension, or lump-sum relief directly from your lender before paying to break.
      </div>

      <BrokerCTA
        message={switchNow
          ? `Switching now nets ${fmt(netRemainingTerm)} over the remaining term. A broker will pull your exact payout and pair you with a lender that may cover legal fees.`
          : `Waiting is cheaper at these numbers. A broker can lock in a renewal rate hold up to 120 days ahead of your maturity date.`}
        calculatorContext={{
          tool: 'Break-Even Switch Calculator',
          summary: calcSummary,
          data: { balance, switchNow, netRemainingTerm },
        }}
      />

      <CalculatorLeadCapture
        className="mt-4"
        tool="Break-Even Switch Calculator"
        summary={calcSummary}
        data={{ balance, switchNow, netRemainingTerm }}
      />
    </div>
  );
}
