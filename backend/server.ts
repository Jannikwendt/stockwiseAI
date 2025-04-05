import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:8080' }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { messages, riskProfile } = req.body; // <-- receive riskProfile from frontend

  let riskMessage = 'You are a helpful financial assistant.';
  
  if (riskProfile) {
    riskMessage = `You are a helpful financial assistant. The user's risk profile is "${riskProfile.profile}". 
    Their preferred strategy includes: ${riskProfile.summary}.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: "system", content: riskMessage },
        ...messages
      ],
      temperature: 0.7,
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(4000, () => console.log('Server running on port 4000'));
