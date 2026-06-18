import cookie from 'cookie';
import { COOKIE_NAME } from '../../lib/auth';

export default async function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  );
  res.status(200).json({ ok: true });
}
