require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const OPENROUTER_API_KEY = process.env.CLAUDE_API_KEY; // your OpenRouter API key

app.post("/journal", async (req, res) => {
  const { journal } = req.body;
  if (!journal) return res.status(400).json({ error: "Journal is required" });

  const prompt = `Here's my journal:\n${journal}\nPlease provide a thoughtful reflection and highlight what I can improve.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4", // or the exact model your OpenRouter supports
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return res.status(500).json({ error: "OpenRouter API error", details: errorData });
    }

    const data = await response.json();
    console.log("OpenRouter API raw response:", JSON.stringify(data, null, 2));
    const summary = data.choices?.[0]?.message?.content || "No response from model.";

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
