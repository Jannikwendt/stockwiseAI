// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
// @ts-ignore
import yf from "yahoo-finance2";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface ChatMsg { role: "system"|"user"|"assistant"; content: string; }

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body as { messages: ChatMsg[] };
  const lastUser = messages.filter(m=>m.role==="user").slice(-1)[0]?.content||"";

  // simple ticker sniff: “META”, “$AAPL”, etc.
  const m = lastUser.match(/\$?([A-Za-z]{1,5})(?:\s|$)/);
  const ticker = m?.[1]?.toUpperCase();

  let liveText = "";
  if (ticker) {
    try {
      const q: any = await yf.quote(ticker);
      const price = q.regularMarketPrice;
      const pct   = q.regularMarketChangePercent;
      if (typeof price==="number" && typeof pct==="number") {
        liveText = `\n\n[Live YahooFinance] ${ticker}: $${price.toFixed(2)} (${pct.toFixed(2)}%)`;
      } else {
        liveText = `\n\n[Note] Couldn’t fetch price for ${ticker}.`;
      }
    } catch (e) {
      console.warn("yf error:", e);
      liveText = `\n\n[Note] Error fetching ${ticker}.`;
    }
  }

  const systemPrompt: ChatMsg = {
    role: "system",
    content: `You are a helpful financial assistant. Give balanced pros & cons.`
  };

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        systemPrompt,
        ...messages,
        { role:"assistant", content: liveText }
      ]
    });
    return res.json({ content: chat.choices[0].message?.content });
  } catch(err: any) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = +process.env.PORT!;
app.listen(PORT, ()=>console.log(`Server ∙ port ${PORT}`));
