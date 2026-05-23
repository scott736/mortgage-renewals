const TZ = "America/Toronto";

/** Mon–Fri 9:00–17:00 Eastern */
export function isBusinessHours(date = new Date()): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      weekday: "short",
      hour: "numeric",
      hour12: false,
    }).formatToParts(date);

    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? -1);

    const isWeekday = !["Sat", "Sun"].includes(weekday);
    return isWeekday && hour >= 9 && hour < 17;
  } catch {
    return false;
  }
}

export function businessHoursLabel(): string {
  return "Mon–Fri, 9am–5pm ET";
}
