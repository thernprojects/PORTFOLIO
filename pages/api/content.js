import { getContent, saveContent } from '../../lib/store';
import { isAuthed } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const content = await getContent();
      res.status(200).json(content);
    } catch (err) {
      console.error('GET /api/content failed:', err);
      res.status(500).json({ error: err.message || 'Failed to load content.' });
    }
    return;
  }

  if (req.method === 'POST') {
    if (!isAuthed(req)) {
      res.status(401).json({ error: 'Not signed in.' });
      return;
    }
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object') {
      res.status(400).json({ error: 'Invalid content payload.' });
      return;
    }
    try {
      await saveContent(newContent);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('POST /api/content failed:', err);
      res.status(500).json({ error: err.message || 'Failed to save content.' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
