import fs from 'fs';
import path from 'path';
import { defaultContent } from './defaultContent';

const CONTENT_KEY = 'tommy-portfolio/content.json';
const LOCAL_DATA_DIR = path.join(process.cwd(), '.local-data');
const LOCAL_CONTENT_FILE = path.join(LOCAL_DATA_DIR, 'content.json');

function hasBlobToken() {
  // Newer Vercel Blob stores authenticate via OIDC + BLOB_STORE_ID instead of
  // the older long-lived BLOB_READ_WRITE_TOKEN. Either one means Blob storage
  // is actually connected and usable.
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export async function getContent() {
  if (hasBlobToken()) {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: CONTENT_KEY });
    if (blobs.length === 0) return defaultContent;
    const res = await fetch(blobs[0].url);
    if (!res.ok) return defaultContent;
    return res.json();
  }

  // Local fallback, used only for `next dev` / local testing.
  if (!fs.existsSync(LOCAL_CONTENT_FILE)) return defaultContent;
  const raw = fs.readFileSync(LOCAL_CONTENT_FILE, 'utf8');
  return JSON.parse(raw);
}

export async function saveContent(content) {
  const json = JSON.stringify(content, null, 2);

  if (hasBlobToken()) {
    const { put } = await import('@vercel/blob');
    await put(CONTENT_KEY, json, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  // Local fallback.
  if (!fs.existsSync(LOCAL_DATA_DIR)) fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  fs.writeFileSync(LOCAL_CONTENT_FILE, json, 'utf8');
}

export async function uploadImage(buffer, filename, contentType) {
  if (hasBlobToken()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`tommy-portfolio/images/${Date.now()}-${filename}`, buffer, {
      access: 'public',
      contentType,
    });
    return blob.url;
  }

  // Local fallback: write into /public/uploads so `next dev` can serve it.
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const safeName = `${Date.now()}-${filename}`.replace(/[^a-zA-Z0-9.\-_]/g, '');
  fs.writeFileSync(path.join(uploadsDir, safeName), buffer);
  return `/uploads/${safeName}`;
}
