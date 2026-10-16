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
    const str =
      event.date instanceof Date
        ? new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(event.date)
        : String(event.date).trim();
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
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
    const match = String(event.date).match(/^(\d{4}-\d{2}-\d{2})/);
    const dateStr = match ? match[1] : String(event.date).split('T')[0];
    return new Date(`${dateStr}T23:59:59.999+05:30`);
  }

  if (event.month) {
    const [yStr, mStr] = String(event.month).split('-');
    const year = Number(yStr);
    const month = Number(mStr);
    if (!isNaN(year) && !isNaN(month)) {
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
 * Accepts either (eventList, now) or (now, eventList).
 */
export function getUpcomingEvents(arg1 = [], arg2) {
  let now = new Date();
  let eventList = [];

  if (Array.isArray(arg1)) {
    eventList = arg1;
    if (arg2 instanceof Date) now = arg2;
  } else if (arg1 instanceof Date) {
    now = arg1;
    if (Array.isArray(arg2)) eventList = arg2;
  } else if (Array.isArray(arg2)) {
    eventList = arg2;
  }

  const upcoming = (eventList || []).filter(
    (e) => e.type !== 'award' && getEventStatus(e, now) === 'upcoming'
  );

  return upcoming.sort((a, b) => {
    const dateA = a.date ? String(a.date).split('T')[0] : null;
    const dateB = b.date ? String(b.date).split('T')[0] : null;

    if (dateA && dateB) return dateA.localeCompare(dateB);
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;

    if (a.month && b.month) return a.month.localeCompare(b.month);
    if (a.month && !b.month) return -1;
    if (!a.month && b.month) return 1;

    if (a.year && b.year) return String(a.year).localeCompare(String(b.year));
    return 0;
  });
}

/**
 * Returns recent news & achievements:
 * The award, plus any past events, newest first.
 * Accepts either (eventList, now) or (now, eventList).
 */
export function getPastEvents(arg1 = [], arg2) {
  let now = new Date();
  let eventList = [];

  if (Array.isArray(arg1)) {
    eventList = arg1;
    if (arg2 instanceof Date) now = arg2;
  } else if (arg1 instanceof Date) {
    now = arg1;
    if (Array.isArray(arg2)) eventList = arg2;
  } else if (Array.isArray(arg2)) {
    eventList = arg2;
  }

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
export function getEventBySlug(slug, eventList = []) {
  if (!slug) return null;
  const cleanSlug = String(slug).toLowerCase().trim();
  return (eventList || []).find((e) => e.slug?.toLowerCase() === cleanSlug) || null;
}

/**
 * Single source of truth for whether an event can accept registrations:
 * - registration_open === true (supports registration_open and registrationOpen, and boolean strings)
 * - status === 'published' (if status property is present on event)
 * - event not ended (type !== 'award' and not past based on expiry date in IST;
 *   month/year-only events count as not ended until the end of that month/year in IST)
 */
export function isRegistrationOpen(event, now = new Date()) {
  if (!event || typeof event !== 'object') return false;

  // 1. registration_open check (support both snake_case and camelCase, booleans and strings)
  const rawReg = event.registration_open !== undefined ? event.registration_open : event.registrationOpen;
  const isRegOpen = rawReg === true || rawReg === 'true' || rawReg === 'on' || rawReg === 1 || rawReg === '1';
  if (!isRegOpen) return false;

  // 2. status check: if status is provided, must be 'published'
  if (event.status && event.status !== 'published') return false;

  // 3. award type events never have open registration
  if (event.type === 'award') return false;

  // 4. event not ended (calculated in Asia/Kolkata IST)
  if (getEventStatus(event, now) === 'past') return false;

  return true;
}

/**
 * Returns events that can accept registrations right now
 * (registrationOpen: true and not past)
 */
export function getActiveRegistrationEvents(arg1 = [], arg2) {
  let now = new Date();
  let eventList = [];

  if (Array.isArray(arg1)) {
    eventList = arg1;
    if (arg2 instanceof Date) now = arg2;
  } else if (arg1 instanceof Date) {
    now = arg1;
    if (Array.isArray(arg2)) eventList = arg2;
  } else if (Array.isArray(arg2)) {
    eventList = arg2;
  }

  return (eventList || []).filter((e) => isRegistrationOpen(e, now));
}

/**
 * Returns registration status text for closed/non-open events:
 * - If event is upcoming and registration_open is false: "Registration not open yet — talk to an advisor"
 * - If event has ended (past): "Registration closed"
 */
export function getClosedRegistrationLabel(event, now = new Date()) {
  if (!event) return 'Registration closed';
  const status = getEventStatus(event, now);
  if (status === 'past') {
    return 'Registration closed';
  }
  return 'Registration not open yet — talk to an advisor';
}

/**
 * Maps event-level error messages from /api/lead into user-friendly banner text
 */
export function formatEventErrorMessage(msg) {
  if (!msg || typeof msg !== 'string') return 'Registration is unavailable for this event.';
  const lower = msg.toLowerCase();
  if (lower.includes('not open')) {
    return 'Registration not open yet — talk to an advisor';
  }
  if (lower.includes('closed') || lower.includes('ended') || lower.includes('past')) {
    return 'Registration closed';
  }
  if (
    lower.includes('not available') ||
    lower.includes('unknown event') ||
    lower.includes('not found')
  ) {
    return 'This event is no longer available.';
  }
  return msg;
}

