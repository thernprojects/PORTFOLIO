import cookie from 'cookie';
import { verifySessionToken } from './session';

export const COOKIE_NAME = 'tommy_admin_session';

export function isAuthed(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return verifySessionToken(cookies[COOKIE_NAME]);
}

// Wrap an API handler so it 401s unless the admin session cookie is valid.
export function requireAuth(handler) {
  return async function (req, res) {
    if (!isAuthed(req)) {
      res.status(401).json({ error: 'Not signed in.' });
      return;
    }
    return handler(req, res);
  };
}
