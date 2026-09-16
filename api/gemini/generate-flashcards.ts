import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
    });
  }
  return aiClient;
}

function generateFallbackCards(topic: string, count: number) {
  return [
    {
      front: `What is the core intuition and primary invariant of ${topic}?`,
      back: `${topic} establishes foundational state invariants, resource management principles, and algorithmic guarantees.`,
      subtopic: 'Core Invariants',
      difficulty: 'EASY',
    },
    {
      front: `What are the critical edge cases and boundary conditions in ${topic}?`,
      back: `Boundary condition overflow, null/undefined pointers, empty state sets, and off-by-one errors.`,
      subtopic: 'Edge Cases',
      difficulty: 'MEDIUM',
    },
    {
      front: `Analyze the time and space complexity trade-offs in ${topic}.`,
      back: `Optimizing runtime latency requires auxiliary spatial caching, hash indices, or memoized lookup buffers.`,
      subtopic: 'Complexity',
      difficulty: 'MEDIUM',
    },
    {
      front: `What is a classic pitfall or anti-pattern when applying ${topic}?`,
      back: `Premature optimization, lack of concurrency synchronization locks, and failing to handle unexpected error states.`,
      subtopic: 'Pitfalls',
      difficulty: 'HARD',
    },
    {
      front: `How does ${topic} perform under distributed scaling or high concurrency?`,
      back: `Requires partitioned sharding, idempotent transaction handling, and lock-free or asynchronous queues.`,
      subtopic: 'Scalability',
      difficulty: 'HARD',
    },
  ].slice(0, count);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic = 'System Design', description = '', track = 'engineering', cardCount = 10 } = req.body || {};
  const count = Math.min(Math.max(parseInt(cardCount) || 10, 5), 20);

  try {
    const ai = getAI();
    if (!ai) {
      return res.status(200).json({
        deckTitle: `${topic} Active Recall`,
        subject: topic,
        cards: generateFallbackCards(topic, count),
      });
    }

    const systemPrompt = `You are the Axiom Flashcard Mastery Engine. Generate exactly ${count} high-yield, active recall flashcards for topic "${topic}".
User focus: "${description || 'Comprehensive mastery'}".
Every card must have: 'front', 'back', 'difficulty' ('EASY'|'MEDIUM'|'HARD'), and 'subtopic'.`;

    const prompt = `Topic: "${topic}"\nTrack: ${track}\nFocus: "${description}"\nCount: ${count}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            deckTitle: { type: Type.STRING },
            subject: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  subtopic: { type: Type.STRING },
                },
                required: ['front', 'back'],
              },
            },
          },
          required: ['deckTitle', 'cards'],
        },
      },
    });

    const raw = response.text?.trim() || '{}';
    const parsed = JSON.parse(raw);
    return res.status(200).json({
      deckTitle: parsed.deckTitle || `${topic} Active Recall`,
      subject: parsed.subject || topic,
      cards: Array.isArray(parsed.cards) && parsed.cards.length > 0 ? parsed.cards : generateFallbackCards(topic, count),
    });
  } catch (err: any) {
    console.error('Serverless flashcard generation error:', err);
    return res.status(200).json({
      deckTitle: `${topic} Active Recall`,
      subject: topic,
      cards: generateFallbackCards(topic, count),
    });
  }
}
