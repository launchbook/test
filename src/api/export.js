// 📦 /api/export.js – Backend handler to generate and return ebook file
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { uploadToSupabase } from '../lib/storage';
import puppeteer from 'puppeteer';

const writeFileAsync = promisify(fs.writeFile);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { title, format, sections, formatting } = req.body;
    const fileSlug = title?.toLowerCase().replace(/\s+/g, '-') || 'ebook';
    const fileId = uuidv4();
    const filename = `${fileSlug}-${fileId}.${format === 'kindle' ? 'mobi' : format}`;
    const outputPath = path.resolve(`/tmp/${filename}`);

    // 1. Build HTML from sections and formatting
    const html = buildHTML(title, sections, formatting);

    // 2. Convert HTML to file (PDF for now)
    if (format === 'pdf') {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
          top: formatting.margin_top || '1in',
          right: formatting.margin_right || '1in',
          bottom: formatting.margin_bottom || '1in',
          left: formatting.margin_left || '1in',
        },
        printBackground: true
      });
      await browser.close();
    } else {
      return res.status(400).json({ error: 'Only PDF export supported for now' });
    }

    // 3. Upload to Supabase (or any public storage)
    const fileBuffer = fs.readFileSync(outputPath);
    const fileUrl = await uploadToSupabase(filename, fileBuffer);

    // 4. Return link to frontend
    return res.status(200).json({ file_url: fileUrl });

  } catch (err) {
    console.error('Export failed:', err);
    return res.status(500).json({ error: 'Export failed' });
  }
}

function buildHTML(title, sections, formatting) {
  const font = formatting.font_family || 'Inter';
  const textAlign = formatting.text_align || 'justify';
  const lineHeight = formatting.line_spacing || '1.5';
  const textSize = formatting.text_size || '14pt';
  const headlineSize = formatting.headline_size || '24pt';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: ${font};
      text-align: ${textAlign};
      line-height: ${lineHeight};
      font-size: ${textSize};
    }
    .section {
      margin-bottom: 40px;
    }
    h2 {
      font-size: ${headlineSize};
      margin-bottom: 10px;
    }
    p {
      margin-top: 10px;
    }
    img {
      max-width: 100%;
      border-radius: 12px;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${sections.map(sec => `
    <div class="section">
      <h2>${sec.headline || ''}</h2>
      <h3>${sec.subheading || ''}</h3>
      <p>${sec.text || ''}</p>
      ${sec.image ? `<img src="${sec.image}" />` : ''}
    </div>
  `).join('')}
</body>
</html>`;
}
