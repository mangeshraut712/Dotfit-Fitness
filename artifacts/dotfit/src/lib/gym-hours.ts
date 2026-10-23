export type GymStatus = {
  open: boolean;
  sub: string;
};

type IstClock = {
  /** 0 = Sunday */
  day: number;
  minutes: number;
};

const WEEKDAY_SHORT_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((item) => item.type === type)?.value ?? "";
}

/** Wall-clock time in Asia/Kolkata, independent of the browser timezone. */
export function istClock(now: Date): IstClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = part(parts, "weekday");
  const day = WEEKDAY_SHORT_TO_INDEX[weekday];
  if (day == null) {
    throw new Error(`Unable to read IST weekday from ${weekday || "empty"}`);
  }
  let hour = Number(part(parts, "hour"));
  if (hour === 24) hour = 0;
  const minute = Number(part(parts, "minute"));
  return { day, minutes: hour * 60 + minute };
}

const MORNING_OPEN = 6 * 60;
const MORNING_CLOSE = 12 * 60;
const EVENING_OPEN = 16 * 60;
const EVENING_CLOSE = 22 * 60;

export function getGymStatus(now: Date): GymStatus {
  const { day, minutes } = istClock(now);
  const morning = minutes >= MORNING_OPEN && minutes < MORNING_CLOSE;
  const evening = minutes >= EVENING_OPEN && minutes < EVENING_CLOSE;

  if (day === 0) {
    if (morning) return { open: true, sub: "Closes 12 PM" };
    if (minutes < MORNING_OPEN) return { open: false, sub: "Opens today at 6:00 AM" };
    return { open: false, sub: "Sunday hours are 6 AM – 12 PM" };
  }

  if (morning) return { open: true, sub: "Morning session · Closes 12 PM" };
  if (evening) return { open: true, sub: "Evening session · Closes 10 PM" };
  if (minutes >= MORNING_CLOSE && minutes < EVENING_OPEN) {
    return { open: false, sub: "Opens at 4:00 PM" };
  }
  if (minutes >= EVENING_CLOSE) return { open: false, sub: "Opens 6:00 AM" };
  return { open: false, sub: "Opens at 6:00 AM" };
}

/** Status text only. The banner already renders its own trial button. */
export function getDailyBanner(now: Date): string {
  const { day, minutes } = istClock(now);
  const morning = minutes >= MORNING_OPEN && minutes < MORNING_CLOSE;
  const evening = day !== 0 && minutes >= EVENING_OPEN && minutes < EVENING_CLOSE;

  if (day === 0 && morning) return "Open Sunday 6 AM – 12 PM";
  if (morning || evening) return "Open now · Mon–Sat 6–12 & 4–10, Sun 6–12";
  if (day === 0) return "Closed · Sunday hours are 6 AM – 12 PM";
  if (minutes < MORNING_OPEN) return "Closed · Opens today at 6 AM";
  if (minutes >= MORNING_CLOSE && minutes < EVENING_OPEN) return "Midday break · Reopens at 4 PM";
  if (minutes >= EVENING_CLOSE) return "Closed · Opens tomorrow at 6 AM";
  return "Book a free trial at Dotfit Fitness";
}
