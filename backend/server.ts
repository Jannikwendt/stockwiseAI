import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
// @ts-ignore
import yf from "yahoo-finance2";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
  })
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type ChatRole = "system" | "user" | "assistant";
interface ChatMsg { role: ChatRole; content: string; }

app.post("/api/chat", async (req, res) => {
  // 1) pull messages array, default to empty
  const messages = Array.isArray(req.body.messages)
    ? (req.body.messages as ChatMsg[])
    : [];

  // 2) ensure we have a system prompt
  const systemMsg = messages.find((m) => m.role === "system") || {
    role: "system" as const,
    content: "You are a helpful financial assistant.",
  };

  // 3) grab last user content safely
  const lastUser = messages
    .slice()
    .reverse()
    .find((m) => m.role === "user")?.content.trim() || "";

  // 4) ticker detection
  let ticker: string | null = null;
  const m1 = lastUser.match(
    /\b(?:what(?:'s| is)?|show me|give me)?\s*\$?([A-Za-z]{1,5})\s+stock price/i
  );
  if (m1) ticker = m1[1].toUpperCase();
  if (!ticker) {
    const m2 = lastUser.match(/\bstock price of\s+\$?([A-Za-z]{1,5})/i);
    if (m2) ticker = m2[1].toUpperCase();
  }
  if (!ticker) {
    const m3 = lastUser.match(/^\$?([A-Za-z]{1,5})$/i);
    if (m3) ticker = m3[1].toUpperCase();
  }

  // 5) fetch live quote, build a system message if found
  let liveQuoteMsg: ChatMsg | null = null;
  if (ticker) {
    try {
      console.log(`Fetching live quote for ${ticker}…`);
      const q: any = await yf.quote(ticker);
      const price = q.regularMarketPrice;
      const pct = q.regularMarketChangePercent;
      if (typeof price === "number" && typeof pct === "number") {
        liveQuoteMsg = {
          role: "system",
          content: `[Live Quote] ${ticker}: $${price.toFixed(
            2
          )} (${(pct * 100).toFixed(2)}%)`,
        };
      }
    } catch (e) {
      console.warn("Yahoo fetch failed for", ticker, e);
      liveQuoteMsg = {
        role: "system",
        content: `[Live Quote] Could not fetch data for ${ticker}.`,
      };
    }
  }

  // 6) assemble the payload for OpenAI
  //   – start with your risk/system prompt
  //   – then all user+assistant turns (dropping any other stray “system”)
  //   – then the live-quote system note if present
  const toOpenAI: ChatMsg[] = [
    systemMsg,
    ...messages.filter((m) => m.role !== "system"),
  ];
  if (liveQuoteMsg) toOpenAI.push(liveQuoteMsg);

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: toOpenAI,
    });
    return res.json({ content: chat.choices[0].message?.content });
  } catch (err: any) {
    console.error("OpenAI error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Server error" });
  }
});

const PORT = parseInt(process.env.PORT || "4000", 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
