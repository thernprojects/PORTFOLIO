import { isAuthed } from '../../lib/auth';

export default async function handler(req, res) {
  res.status(200).json({ authed: isAuthed(req) });
}
