// /api/regenerate-image.js
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing image prompt" });
  }

  try {
    // Optional: use real DALL·E API call if enabled
    // const imageRes = await openai.images.generate({ prompt, n: 1, size: "1024x768" });
    // const imageUrl = imageRes.data[0].url;

    // Placeholder fallback
    const imageUrl = `https://via.placeholder.com/800x600?text=${encodeURIComponent(prompt)}`;

    return res.status(200).json({ image_url: imageUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
