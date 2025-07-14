// /api/gemini.js
const express = require("express");
const { default: fetch } = require("node-fetch");
require("dotenv").config(); // ✅ Load biến môi trường từ .env

const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY; // ✅ Dùng từ .env
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${API_KEY}`;

app.post("/api/gemini", async (req, res) => {
  const { messages } = req.body;

  try {
    const geminiRes = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: messages }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Lỗi từ Gemini API:", data);
      return res.status(500).json({ error: data.error.message });
    }

    return res.json({ text: data.candidates[0].content.parts[0].text });
  } catch (err) {
    console.error("Lỗi xử lý backend:", err.message);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
});

// Export như Vercel yêu cầu
module.exports = app;
