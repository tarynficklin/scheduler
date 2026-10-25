// Small request helpers shared by the controllers.
import { HTTPException } from 'hono/http-exception';

export const badRequest = (message) => new HTTPException(400, { message });

// Reads a JSON request body the way body-parser's json() did for this app:
// non-JSON requests and empty bodies give {}, malformed JSON is a 400.
// Compressed bodies are refused (415); the browser never sends them.
export async function readJson(c) {
  const encoding = c.req.header('content-encoding');
  if (encoding && encoding.toLowerCase() !== 'identity') {
    throw new HTTPException(415, { message: 'Compressed request bodies are not supported.' });
  }
  if (!(c.req.header('content-type') ?? '').toLowerCase().includes('application/json')) return {};

  const text = await c.req.text();
  if (!text.trim()) return {};
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw badRequest('Invalid JSON body.');
  }
  return body !== null && typeof body === 'object' && !Array.isArray(body) ? body : {};
}

const MAX_ID = 2 ** 31 - 1; // INTEGER columns

// A positive integer id (route param or body field); anything else is a 400.
export function toId(value, label = 'id') {
  const text = typeof value === 'number' ? String(value) : value;
  if (
    typeof text !== 'string' ||
    !/^\d+$/.test(text) ||
    Number(text) < 1 ||
    Number(text) > MAX_ID
  ) {
    throw badRequest(`Invalid ${label}.`);
  }
  return Number(text);
}

export const idParam = (c, name = 'id') => toId(c.req.param(name), name);

// A string field (numbers are accepted and stringified). Missing -> fallback.
export function toText(value, label, { max, fallback = '' } = {}) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'number' && Number.isFinite(value)) value = String(value);
  if (typeof value !== 'string') throw badRequest(`${label} must be text.`);
  if (max && value.length > max) throw badRequest(`${label} must be ${max} characters or fewer.`);
  return value;
}

// A non-negative amount (prices and budgets come from <input type="number"> as strings).
// Missing or '' -> 0.
export function toAmount(value, label) {
  if (value === undefined || value === null || value === '') return 0;
  const number = typeof value === 'string' ? Number(value.trim()) : value;
  if (typeof number !== 'number' || !Number.isFinite(number) || number < 0) {
    throw badRequest(`${label} must be a number of 0 or more.`);
  }
  return number;
}

export function toBoolean(value, label) {
  if (value === true || value === false) return value;
  if (value === 'true' || value === 'false') return value === 'true';
  throw badRequest(`${label} must be true or false.`);
}

// 404 for writes/reads of a single row that doesn't exist or isn't the user's.
export const notFound = (c, what = 'Not found.') => c.json({ error: what }, 404);
