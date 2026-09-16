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

function getFallbackCourse(topic: string) {
  const isPhysical = /swim|run|yoga|workout|gym|guitar|handstand|skate|boxing|dance/i.test(topic);
  const category = isPhysical ? 'Physical' : 'Conceptual';
  return {
    category,
    title: `Mastering ${topic}`,
    summary: `A structured step-by-step mastery curriculum for ${topic} built on first principles.`,
    days: [
      {
        day: 1,
        title: 'Foundations & Baseline Setup',
        summary: `Master the fundamental mechanics and terminology of ${topic}.`,
        tasks: [
          `Understand the core terminology and baseline rules of ${topic}`,
          `Set up your daily practice workspace / environment`,
          `Complete 15 minutes of fundamental drills`,
        ],
        videoPrompt: `${topic} fundamental movement, 2D flat vector animation, minimalist instructional schematic, bone-white background, thick black outlines, 8fps stepping animation`,
      },
      {
        day: 2,
        title: 'Core Mechanics & Progressive Drills',
        summary: `Isolate individual mechanics and build muscle/mental memory.`,
        tasks: [
          `Isolate the primary action or algorithm in ${topic}`,
          `Execute 3 sets of deliberate practice repetitions`,
          `Log common pitfalls and errors encountered`,
        ],
        videoPrompt: `${topic} core drills breakdown, 2D technical diagrammatic movement, high-contrast retro schematic, 8fps`,
      },
      {
        day: 3,
        title: 'Integration, Speed & Edge Cases',
        summary: `Combine sub-skills into fluid, continuous execution.`,
        tasks: [
          `Perform full-sequence end-to-end execution`,
          `Test under timed or high-intensity conditions`,
          `Conduct self-assessment against the mastery rubric`,
        ],
        videoPrompt: `${topic} full integration mastery, chalkboard blueprint aesthetic, flat vector, high contrast digital retro`,
      },
    ],
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body || {};
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const ai = getAI();
    if (!ai) {
      return res.status(200).json(getFallbackCourse(topic));
    }

    const systemPrompt = `You are the Axiom Omni-Tutor, a universal Skill Architect. Deconstruct any topic into an actionable curriculum.
Determine if the topic is 'Physical' (Kinesthetic/Sports/Craft) or 'Conceptual' (Theoretical/Coding/Academics).
Output purely valid JSON without markdown wrapping.`;

    const prompt = `Topic: "${topic}". Generate a 3 to 7 day day-by-day mastery curriculum with actionable tasks and visual prompt scenes for each day.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  videoPrompt: { type: Type.STRING },
                },
                required: ['day', 'title', 'summary', 'tasks', 'videoPrompt'],
              },
            },
          },
          required: ['category', 'title', 'days'],
        },
      },
    });

    const raw = response.text?.trim() || '{}';
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('Vercel serverless omni-course error:', err);
    return res.status(200).json(getFallbackCourse(topic));
  }
}
