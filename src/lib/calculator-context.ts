const CALCULATOR_CONTEXT_KEY = "mrh_calculator_context";

interface CalculatorContext {
  tool: string;
  page?: string;
  summary: string;
  savedAt: string;
  data?: Record<string, string | number | boolean>;
}

export function saveCalculatorContext(context: Omit<CalculatorContext, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    const payload: CalculatorContext = {
      ...context,
      savedAt: new Date().toISOString(),
    };
    sessionStorage.setItem(CALCULATOR_CONTEXT_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadCalculatorContext(): CalculatorContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CALCULATOR_CONTEXT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CalculatorContext;
  } catch {
    return null;
  }
}

export function formatCalculatorContextForNotes(context: CalculatorContext | null): string {
  if (!context) return "";
  const lines = [`Calculator: ${context.tool}`, context.summary];
  if (context.page) lines.push(`Page: ${context.page}`);
  if (context.data) {
    for (const [key, value] of Object.entries(context.data)) {
      lines.push(`${key}: ${value}`);
    }
  }
  return lines.join("\n");
}
