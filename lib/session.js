import crypto from 'crypto';

// Single-user session token: "<expiryTimestamp>.<hmacSignature>"
// Signed with SESSION_SECRET so it can't be forged without that secret.
// This is intentionally simple: there's exactly one admin account, so a
// full session-store / database isn't needed for it.

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set.');
  }
  return secret;
}

export function createSessionToken() {
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(String(expiry))
    .digest('hex');
  return `${expiry}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [expiryStr, signature] = token.split('.');
  const expiry = Number(expiryStr);
  if (!expiry || Number.isNaN(expiry)) return false;
  if (Date.now() > expiry) return false; // expired

  const expectedSignature = crypto
    .createHmac('sha256', getSecret())
    .update(String(expiry))
    .digest('hex');

  const a = Buffer.from(signature || '', 'hex');
  const b = Buffer.from(expectedSignature, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
