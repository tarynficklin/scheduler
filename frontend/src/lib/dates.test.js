import { describe, expect, test } from 'bun:test';
import { daysBetween, formatLongDate, parseDate } from './dates.js';

describe('formatLongDate (was moment(...).format("MMMM DD YYYY"))', () => {
  test('date input values are local dates', () => {
    expect(formatLongDate('2026-12-04')).toBe('December 04 2026');
    expect(formatLongDate('2027-03-21')).toBe('March 21 2027');
  });

  test('2018 seed format M-D-YYYY', () => {
    expect(formatLongDate('7-26-2018')).toBe('July 26 2018');
    expect(formatLongDate('12-31-2018')).toBe('December 31 2018');
  });

  test('invalid input gives an empty string', () => {
    expect(formatLongDate('')).toBe('');
    expect(formatLongDate('not a date')).toBe('');
    expect(formatLongDate(undefined)).toBe('');
    expect(parseDate('2026-02-30')?.getMonth()).toBe(2); // rolls over like Date (and moment's fallback)
  });
});

describe('daysBetween (was NewTrip.getDaysBetween)', () => {
  test('inclusive range across a month and year boundary', () => {
    expect(daysBetween('2026-12-30', '2027-01-02')).toEqual(['December 30 2026', 'December 31 2026', 'January 01 2027', 'January 02 2027']);
  });

  test('single day', () => {
    expect(daysBetween('2026-12-04', '2026-12-04')).toEqual(['December 04 2026']);
  });

  test('DST changes do not skip or repeat days', () => {
    expect(daysBetween('2026-03-07', '2026-03-09')).toEqual(['March 07 2026', 'March 08 2026', 'March 09 2026']);
    expect(daysBetween('2026-10-31', '2026-11-02')).toEqual(['October 31 2026', 'November 01 2026', 'November 02 2026']);
  });

  test('empty for a reversed or missing range, capped for huge ones', () => {
    expect(daysBetween('2026-12-05', '2026-12-04')).toEqual([]);
    expect(daysBetween('', '2026-12-04')).toEqual([]);
    expect(daysBetween('2026-01-01', '2099-01-01')).toHaveLength(366);
  });
});
