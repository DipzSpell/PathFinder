import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  app.post('/api/gemini/generate', async (req, res) => {
    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    try {
      const { systemInstruction, userPrompt } = req.body;
      if (!userPrompt) {
        return res.status(400).json({ error: 'Missing userPrompt' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          tools: [{ googleSearch: {} }],
        },
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error('Gemini API error:', err);
      const status = err?.status || 500;
      return res.status(status).json({
        error: err?.message || 'Failed to call Gemini API',
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PathFinder server running at http://0.0.0.0:${port}`);
  });
}

startServer();
