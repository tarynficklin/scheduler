import { expect, test } from 'bun:test';
import { consumeDonationResult } from './donation.js';

function fakeWindow(url) {
  const parsed = new URL(url);
  const replaced = [];
  return {
    location: { search: parsed.search, hash: parsed.hash, pathname: parsed.pathname },
    history: { replaceState: (_state, _title, next) => replaced.push(next) },
    replaced,
  };
}

test('success return: cleans the URL and goes back to the trip', () => {
  const w = fakeWindow('http://localhost:3108/?donation=success&trip=12');
  expect(consumeDonationResult(w.location, w.history)).toBe('success');
  expect(w.replaced).toEqual(['/#/trip/12']);
});

test('cancel return without a trip keeps the current hash', () => {
  const w = fakeWindow('http://localhost:3108/?donation=cancelled#/');
  expect(consumeDonationResult(w.location, w.history)).toBe('cancelled');
  expect(w.replaced).toEqual(['/#/']);
});

test('no donation parameter: nothing happens', () => {
  const w = fakeWindow('http://localhost:3108/#/trip/3');
  expect(consumeDonationResult(w.location, w.history)).toBeNull();
  expect(consumeDonationResult(fakeWindow('http://localhost:3108/?donation=<script>').location, w.history)).toBeNull();
  expect(w.replaced).toEqual([]);
});
