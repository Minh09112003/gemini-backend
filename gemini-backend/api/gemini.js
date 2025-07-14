const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const API_KEY = process.env.GEMINI_API_KEY;

// 🔁 Sửa model tại đây nếu muốn (gợi ý: dùng gemini-2.0-flash hoặc gemini-2.5-pro-latest)
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  // ✅ Chuyển messages (giống ChatGPT style) → contents (đúng format Gemini)
  const contents = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "Gemini API error" });
    }

    return res.status(200).json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response." });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
};
