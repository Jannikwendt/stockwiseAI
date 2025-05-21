import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
// @ts-ignore (we declared yahoo-finance2 above)
import yf from "yahoo-finance2";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN! }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type ChatRole = "system" | "user" | "assistant";
interface ChatMsg { role: ChatRole; content: string; }

app.post("/api/chat", async (req, res) => {
  const messages = Array.isArray(req.body.messages) ? req.body.messages as ChatMsg[] : [];
  const systemMsg = messages.find(m => m.role === "system") || {
    role: "system" as const,
    content: "You are a helpful financial assistant."
  };
  const lastUser = messages.slice().reverse().find(m => m.role === "user")?.content.trim() || "";

  // 1) detect a ticker
  let ticker: string | null = null;
  const m1 = lastUser.match(/\b(?:what(?:'s| is)?|show me|give me)?\s*\$?([A-Za-z]{1,5})\s+stock price/i);
  if (m1) ticker = m1[1].toUpperCase();
  if (!ticker) {
    const m2 = lastUser.match(/\bstock price of\s+\$?([A-Za-z]{1,5})/i);
    if (m2) ticker = m2[1].toUpperCase();
  }
  if (!ticker) {
    const m3 = lastUser.match(/^\$?([A-Za-z]{1,5})$/i);
    if (m3) ticker = m3[1].toUpperCase();
  }

  // 2) fetch enriched data if we have a ticker
  let liveQuoteMsg: ChatMsg | null = null;
  if (ticker) {
    try {
      console.log(`Fetching live data for ${ticker}…`);
      // basic quote
      const q: any = await yf.quote(ticker);

      // summary + additional modules
      const sum: any = await yf.quoteSummary(ticker, {
        modules: [
          "price",
          "summaryDetail",
          "defaultKeyStatistics",
          "financialData",
          "recommendationTrend"
        ],
        formatted: false
      });

      const price = q.regularMarketPrice;
      const pct   = q.regularMarketChangePercent * 100;
      const vol   = sum.price?.regularMarketVolume;
      const mcap  = sum.summaryDetail?.marketCap;
      const pe    = sum.summaryDetail?.trailingPE;
      const week52High = sum.summaryDetail?.fiftyTwoWeekHigh;
      const week52Low  = sum.summaryDetail?.fiftyTwoWeekLow;
      const avgVol     = sum.summaryDetail?.averageDailyVolume3Month;
      const recTrend   = sum.recommendationTrend?.trend?.[0]?.rating || "N/A";

      // build a multiline system message
      const lines = [];
      lines.push(`[Live Quote] ${ticker}: $${price.toFixed(2)} (${pct.toFixed(2)}%)`);
      if (typeof vol === "number")      lines.push(`• Volume: ${vol.toLocaleString()}`);
      if (typeof avgVol === "number")   lines.push(`• Avg Vol (3mo): ${avgVol.toLocaleString()}`);
      if (typeof pe === "number")       lines.push(`• P/E Ratio: ${pe.toFixed(2)}`);
      if (typeof mcap === "number")     lines.push(`• Market Cap: $${(mcap/1e9).toFixed(2)}B`);
      if (typeof week52Low === "number" && typeof week52High === "number")
                                        lines.push(`• 52 wk Low/High: $${week52Low.toFixed(2)}/$${week52High.toFixed(2)}`);
      lines.push(`• Analyst Consensus: ${recTrend}`);

      liveQuoteMsg = {
        role: "system",
        content: lines.join("\n")
      };
    } catch (err) {
      console.warn("Yahoo fetch error for", ticker, err);
      liveQuoteMsg = {
        role: "system",
        content: `[Live Quote] Could not fetch data for ${ticker}.`
      };
    }
  }

  // 3) assemble messages for OpenAI
  const toOpenAI: ChatMsg[] = [
    systemMsg,
    ...messages.filter(m => m.role !== "system")
  ];
  if (liveQuoteMsg) toOpenAI.push(liveQuoteMsg);

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: toOpenAI
    });
    return res.json({ content: chat.choices[0].message?.content });
  } catch (err: any) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
