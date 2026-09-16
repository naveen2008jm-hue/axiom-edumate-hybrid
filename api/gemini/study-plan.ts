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

function getFallbackStudyPlan(topic: string, days: number, targetLevel: string, hoursPerDay: number) {
  const count = Math.min(Math.max(Number(days) || 7, 3), 30);
  const hours = Number(hoursPerDay) || 3;
  const milestones = [
    'Foundations & Core Invariants',
    'Pattern Recognition & Standard Templates',
    'Edge Case Boundary Testing & Optimization',
    'Advanced Sub-problem Deconstruction',
    'Full Mock Synthesis & Timed Drills',
  ];

  return {
    topicName: topic,
    totalDays: count,
    difficulty: targetLevel || 'Medium',
    estimatedTotalHours: count * hours,
    summary: `Structured ${count}-day study masterplan for ${topic} with ${hours}h/day deliberate practice.`,
    days: Array.from({ length: count }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${topic} - ${milestones[i % milestones.length]}`,
      durationHours: hours,
      subtopics: [
        `${topic} Core Principles and Formulations`,
        `Common traps and space-time complexity analysis`,
        `Boundary conditions and verification routines`,
      ],
      practiceProblems: [
        `${topic} Fundamental Warmup Problem`,
        `${topic} Core Pattern Solve`,
        `${topic} Interview / Exam Challenge`,
      ],
      keyTakeaway: `Master the standard template and avoid redundant recalculations in ${topic}.`,
      completed: false,
    })),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic = 'DSA & System Design', days = 7, targetLevel = 'Medium', hoursPerDay = 3 } = req.body || {};
  const count = Math.min(Math.max(Number(days) || 7, 3), 30);
  const hours = Number(hoursPerDay) || 3;

  try {
    const ai = getAI();
    if (!ai) {
      return res.status(200).json(getFallbackStudyPlan(topic, count, targetLevel, hours));
    }

    const prompt = `Generate a structured, high-yield ${count}-day study and revision schedule for topic: "${topic}".
Target Difficulty: ${targetLevel}
Study Capacity: ${hours} hours/day.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert technical curriculum designer. Output a rigorous JSON plan.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topicName: { type: Type.STRING },
            totalDays: { type: Type.INTEGER },
            difficulty: { type: Type.STRING },
            estimatedTotalHours: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  durationHours: { type: Type.INTEGER },
                  subtopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  practiceProblems: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  keyTakeaway: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN },
                },
                required: ['day', 'title', 'durationHours', 'subtopics', 'practiceProblems', 'keyTakeaway'],
              },
            },
          },
          required: ['topicName', 'totalDays', 'difficulty', 'summary', 'days'],
        },
      },
    });

    const raw = response.text?.trim() || '{}';
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('Vercel serverless study-plan error:', err);
    return res.status(200).json(getFallbackStudyPlan(topic, count, targetLevel, hours));
  }
}
