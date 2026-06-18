import { uploadImage } from '../../lib/store';
import { requireAuth } from '../../lib/auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { filename, contentType, dataBase64 } = req.body || {};
  if (!filename || !contentType || !dataBase64) {
    res.status(400).json({ error: 'filename, contentType, and dataBase64 are required.' });
    return;
  }

  if (!contentType.startsWith('image/')) {
    res.status(400).json({ error: 'Only image uploads are allowed.' });
    return;
  }

  const buffer = Buffer.from(dataBase64, 'base64');
  try {
    const url = await uploadImage(buffer, filename, contentType);
    res.status(200).json({ url });
  } catch (err) {
    console.error('POST /api/upload failed:', err);
    res.status(500).json({ error: err.message || 'Upload failed.' });
  }
}

export default requireAuth(handler);
