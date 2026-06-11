import CalculatorLeadCapture from '@/components/lead/calculator-lead-capture';
import TrackedBrokerLink from '@/components/lead/tracked-broker-link';

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-body-sm-medium text-foreground mb-1 block">
      {children}
    </label>
  );
}

export function Input({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  id,
  'aria-label': ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  id?: string;
  'aria-label'?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-body-sm text-muted-foreground">{prefix}</span>}
      <input
        type="number"
        id={id}
        aria-label={ariaLabel}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`text-body-md w-full rounded-lg border border-gray-200 bg-background py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary-100 ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
      />
      {suffix && <span className="absolute right-3 text-body-sm text-muted-foreground">{suffix}</span>}
    </div>
  );
}

export function ResultCard({
  label,
  value,
  highlight,
  sublabel,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sublabel?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${highlight ? 'border-secondary-50 bg-secondary-25' : 'border-gray-100 bg-gray-25'}`}
    >
      <div className="text-body-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-secondary-200' : 'text-foreground'}`}>{value}</div>
      {sublabel && <div className="text-body-xs text-muted-foreground mt-1">{sublabel}</div>}
    </div>
  );
}

export function BrokerCTA({
  message,
  calculatorContext,
  showEmailCapture = true,
}: {
  message: string;
  calculatorContext: { tool: string; summary: string; data?: Record<string, string | number | boolean> };
  showEmailCapture?: boolean;
}) {
  return (
    <>
      <div className="bg-primary-0 border-primary-25 mt-6 flex flex-col items-start gap-4 rounded-xl border p-5 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-body-sm-medium text-primary-200">{message}</p>
          <p className="text-body-xs text-muted-foreground mt-1">
            A broker will confirm this with real lender quotes, for free.
          </p>
        </div>
        <TrackedBrokerLink
          location="calculator_broker_cta"
          calculatorContext={calculatorContext}
          className="text-body-sm-medium bg-primary-100 flex-shrink-0 rounded-lg px-5 py-2.5 text-white transition-opacity hover:opacity-90"
        >
          Book Free Call
        </TrackedBrokerLink>
      </div>
      {showEmailCapture && (
        <CalculatorLeadCapture
          className="mt-4"
          tool={calculatorContext.tool}
          summary={calculatorContext.summary}
          data={calculatorContext.data}
        />
      )}
    </>
  );
}
