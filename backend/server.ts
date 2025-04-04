import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:8080' }));

// Correct instantiation for project-based keys
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1', // explicitly set base URL
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
      temperature: 0.7,
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(4000, () => console.log('Server running on port 4000'));
