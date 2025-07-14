import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Phương thức không được hỗ trợ" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${API_KEY}`;

  const { messages } = req.body;

  try {
    const geminiRes = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: messages }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.json({ text: data.candidates[0].content.parts[0].text });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
