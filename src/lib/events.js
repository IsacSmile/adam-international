import { events } from '../data/events.js';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Returns human-friendly date label for the event:
 * - date ('YYYY-MM-DD') -> '25 September 2026'
 * - month ('YYYY-MM') -> 'October 2026'
 * - year only ('YYYY') -> '2026 · Date to be announced'
 */
export function getEventDateLabel(event) {
  if (!event) return '';

  if (event.date) {
    const parts = String(event.date).split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12) {
        return `${day} ${MONTH_NAMES[month - 1]} ${year}`;
      }
    }
  }

  if (event.month) {
    const parts = String(event.month).split('-');
    if (parts.length >= 2) {
      const year = Number(parts[0]);
      const month = Number(parts[1]);
      if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
        return `${MONTH_NAMES[month - 1]} ${year}`;
      }
    }
  }

  if (event.year) {
    return `${event.year} · Date to be announced`;
  }

  return '';
}

/**
 * Calculates end-of-window timestamp in Asia/Kolkata (+05:30) timezone:
 * - date: end of that day (23:59:59.999 +05:30)
 * - month: end of that month (23:59:59.999 +05:30 on the last day of the month)
 * - year: end of that year (31 December 23:59:59.999 +05:30)
 */
export function getEventExpiryDate(event) {
  if (!event) return null;

  if (event.date) {
    // End of that day in Asia/Kolkata
    return new Date(`${event.date}T23:59:59.999+05:30`);
  }

  if (event.month) {
    const [yStr, mStr] = String(event.month).split('-');
    const year = Number(yStr);
    const month = Number(mStr);
    if (!isNaN(year) && !isNaN(month)) {
      // Last day of month
      const lastDay = new Date(year, month, 0).getDate();
      const paddedDay = String(lastDay).padStart(2, '0');
      const paddedMonth = String(month).padStart(2, '0');
      return new Date(`${year}-${paddedMonth}-${paddedDay}T23:59:59.999+05:30`);
    }
  }

  if (event.year) {
    const year = Number(event.year);
    if (!isNaN(year)) {
      return new Date(`${year}-12-31T23:59:59.999+05:30`);
    }
  }

  return null;
}

/**
 * Returns 'upcoming' or 'past'.
 * Rule: The award type is always shown under Recent News & Achievements, never as upcoming.
 */
export function getEventStatus(event, now = new Date()) {
  if (!event) return 'past';
  if (event.type === 'award') {
    return 'past';
  }

  const expiry = getEventExpiryDate(event);
  if (!expiry) return 'upcoming';

  return now.getTime() > expiry.getTime() ? 'past' : 'upcoming';
}

export function isEventUpcoming(event, now = new Date()) {
  return getEventStatus(event, now) === 'upcoming';
}

export function isEventPast(event, now = new Date()) {
  return getEventStatus(event, now) === 'past';
}

/**
 * Returns a list of upcoming spot admission events, sorted:
 * exact date first (ascending), then month (ascending), then year (ascending).
 */
export function getUpcomingEvents(now = new Date(), eventList = events) {
  const upcoming = (eventList || []).filter(
    (e) => e.type !== 'award' && getEventStatus(e, now) === 'upcoming'
  );

  return upcoming.sort((a, b) => {
    // 1. Exact date compare
    if (a.date && b.date) return a.date.localeCompare(b.date);
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;

    // 2. Month compare
    if (a.month && b.month) return a.month.localeCompare(b.month);
    if (a.month && !b.month) return -1;
    if (!a.month && b.month) return 1;

    // 3. Year compare
    if (a.year && b.year) return String(a.year).localeCompare(String(b.year));
    return 0;
  });
}

/**
 * Returns recent news & achievements:
 * The award, plus any past events, newest first.
 */
export function getPastEvents(now = new Date(), eventList = events) {
  const past = (eventList || []).filter((e) => getEventStatus(e, now) === 'past');

  return past.sort((a, b) => {
    const expiryA = getEventExpiryDate(a)?.getTime() || 0;
    const expiryB = getEventExpiryDate(b)?.getTime() || 0;
    return expiryB - expiryA;
  });
}

/**
 * Returns an event by slug, or null if not found
 */
export function getEventBySlug(slug, eventList = events) {
  if (!slug) return null;
  const cleanSlug = String(slug).toLowerCase().trim();
  return (eventList || []).find((e) => e.slug.toLowerCase() === cleanSlug) || null;
}

/**
 * Returns events that can accept registrations right now
 * (registrationOpen: true and not past)
 */
export function getActiveRegistrationEvents(now = new Date(), eventList = events) {
  return (eventList || []).filter(
    (e) => e.registrationOpen === true && getEventStatus(e, now) === 'upcoming'
  );
}
