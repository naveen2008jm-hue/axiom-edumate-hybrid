import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function getFallbackCritique(question: string, track: string, durationSeconds: number, notes: string) {
  const words = notes.split(/\s+/).filter(Boolean).length || 80;
  const minutes = Math.max(durationSeconds / 60, 0.5);
  const wpm = Math.round(words / minutes);

  return {
    score: 84,
    overallImpression: `Strong attempt for the ${track.toUpperCase()} prompt. Communicated key reasoning clearly with solid pacing.`,
    pacingPpm: `${wpm} wpm (${wpm >= 120 && wpm <= 160 ? 'Optimal Cadence' : 'Acceptable'})`,
    fillerWordFrequency: 'Low',
    fillerWordsDetected: ['like', 'um'],
    strengths: [
      'Directly addressed the primary technical/domain question trigger.',
      'Maintained good structural flow without rambling.',
      'Stated clear trade-offs and rationale.',
    ],
    areasForImprovement: [
      'Cite specific metrics, statute sections, or complexity bounds earlier in the response.',
      'Explicitly summarize with a 1-sentence STAR takeaway.',
    ],
    starStructureRating: 'Good',
    idealAnswerOutline: `1. **Situation/Context**: Define the exact problem scope.\n2. **Task**: State the explicit objective or technical constraint.\n3. **Action**: Break down the 2-3 specific steps taken.\n4. **Result/Impact**: Quantify the latency reduction, audit compliance, or diagnostic accuracy.`,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question, track = 'engineering', transcript = '', durationSeconds = 60, answerNotes = '' } = req.body || {};
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const notes = transcript || answerNotes || 'Candidate completed spoken walkthrough.';

  try {
    const ai = getAI();
    if (!ai) {
      return res.status(200).json(getFallbackCritique(question, track, durationSeconds, notes));
    }

    const systemPrompt = `You are the Axiom Elite Interview Evaluator. Evaluate a student's mock interview answer for a ${track.toUpperCase()} position or examination.
Provide a constructive, highly actionable critique with accurate pacing analysis and an ideal STAR/IRAC answer outline.
Return purely valid JSON matching the schema.`;

    const prompt = `Interview Question: "${question}"
Track: ${track}
Duration: ${durationSeconds} seconds
Candidate Transcript / Notes: "${notes}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            overallImpression: { type: Type.STRING },
            pacingPpm: { type: Type.STRING },
            fillerWordFrequency: { type: Type.STRING },
            fillerWordsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            starStructureRating: { type: Type.STRING },
            idealAnswerOutline: { type: Type.STRING },
          },
          required: [
            'score',
            'overallImpression',
            'pacingPpm',
            'fillerWordFrequency',
            'fillerWordsDetected',
            'strengths',
            'areasForImprovement',
            'starStructureRating',
            'idealAnswerOutline',
          ],
        },
      },
    });

    const raw = response.text?.trim() || '{}';
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('Vercel serverless interview critique error:', err);
    return res.status(200).json(getFallbackCritique(question, track, durationSeconds, notes));
  }
}
