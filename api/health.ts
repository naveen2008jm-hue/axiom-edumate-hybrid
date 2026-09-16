import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    service: 'Axiom Career Architect Serverless Engine',
    geminiConfigured: !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
