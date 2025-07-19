// /api/upload-image.js
import formidable from 'formidable';
import fs from 'fs/promises';
import { uploadToSupabase } from '@/lib/storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Image upload failed' });

    const file = files.image;
    if (!file) return res.status(400).json({ error: 'No file provided' });

    const buffer = await fs.readFile(file[0].filepath);
    const url = await uploadToSupabase(file[0].originalFilename, buffer);

    return res.status(200).json({ image_url: url });
  });
}
