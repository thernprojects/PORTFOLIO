import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import { createSessionToken } from '../../lib/session';
import { COOKIE_NAME } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { password } = req.body || {};
  const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64;

  if (!hashB64) {
    res.status(500).json({ error: 'ADMIN_PASSWORD_HASH_B64 is not configured on the server.' });
    return;
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Password is required.' });
    return;
  }

  const hash = Buffer.from(hashB64, 'base64').toString('utf8');
  const matches = await bcrypt.compare(password, hash);
  if (!matches) {
    res.status(401).json({ error: 'Incorrect password.' });
    return;
  }

  const token = createSessionToken();
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  );
  res.status(200).json({ ok: true });
}
