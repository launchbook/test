// /api/regenerate-section.js
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { title, headline } = req.body;

  if (!title && !headline) {
    return res.status(400).json({ error: "Missing prompt data" });
  }

  const prompt = `Rewrite the following section in a clean, clear, and structured way:

Title: ${title}
Headline: ${headline}

Respond with only the main body content.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
