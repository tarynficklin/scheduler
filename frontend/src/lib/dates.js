// Native replacements for the moment calls the app made:
//   moment(date).format('MMMM DD YYYY')       -> formatLongDate(date)   ("December 04 2026")
//   getDaysBetween(start, end) (moment loop)  -> daysBetween(start, end)

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// "YYYY-MM-DD" (what <input type="date"> gives) and "M-D-YYYY" (the 2018 seed data) are
// read as local dates, like moment did; anything else goes through Date. null if invalid.
export function parseDate(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate());
  if (typeof value !== 'string' || !value.trim()) return null;
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value.trim());
  let date;
  if (match) {
    date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  } else if ((match = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(value.trim()))) {
    date = new Date(Number(match[3]), Number(match[1]) - 1, Number(match[2]));
  } else {
    date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  return Number.isNaN(date.getTime()) ? null : date;
}

// "MMMM DD YYYY", e.g. "December 04 2026". '' for an invalid date.
export function formatLongDate(value) {
  const date = parseDate(value);
  if (!date) return '';
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${date.getFullYear()}`;
}

// Every day from start to end (inclusive) as "MMMM DD YYYY". [] when either date is
// invalid or end is before start. Capped at maxDays so a typo can't create years of days.
export function daysBetween(start, end, maxDays = 366) {
  const first = parseDate(start);
  const last = parseDate(end);
  if (!first || !last || last < first) return [];
  const days = [];
  for (let day = first; day <= last && days.length < maxDays; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
    days.push(formatLongDate(day));
  }
  return days;
}
