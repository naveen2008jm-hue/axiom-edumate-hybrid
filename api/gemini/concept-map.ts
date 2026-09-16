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

function getFallbackConceptMap(topic: string, track: string) {
  return {
    topic,
    track,
    summary: `Comprehensive conceptual breakdown of ${topic} for ${track.toUpperCase()} track mastery.`,
    root: {
      id: 'node-root',
      title: topic,
      description: `Central hub for ${topic}`,
      category: 'Core Pillar',
      keyConcepts: ['Foundations', 'Mechanics', 'Applications', 'Edge Cases'],
      children: [
        {
          id: 'node-1',
          title: 'Foundations & Invariants',
          description: `Core definitions, theoretical postulates, and fundamental invariants governing ${topic}.`,
          category: 'Basics',
          keyConcepts: ['First Principles', 'Axioms', 'Primitive Definitions'],
          children: [
            {
              id: 'node-1-1',
              title: 'Primitive Definitions',
              description: 'Atomic building blocks and standard notations.',
              category: 'Sub-concept',
              keyConcepts: ['Notations', 'Invariants', 'Scope Limits'],
            },
            {
              id: 'node-1-2',
              title: 'Boundary Conditions',
              description: 'Constraints and validity thresholds under extreme inputs.',
              category: 'Sub-concept',
              keyConcepts: ['Edge Conditions', 'Limits', 'Error States'],
            },
          ],
        },
        {
          id: 'node-2',
          title: 'Core Mechanisms & Protocols',
          description: 'Operational mechanisms, execution flow, statutory sections, or physiological pathways.',
          category: 'Architecture',
          keyConcepts: ['Mechanisms', 'Workflows', 'State Transitions'],
          children: [
            {
              id: 'node-2-1',
              title: 'Primary Process Flow',
              description: 'Standard execution and operational lifecycle.',
              category: 'Sub-concept',
              keyConcepts: ['Linear Flow', 'Standard Operation', 'State Machine'],
            },
            {
              id: 'node-2-2',
              title: 'Concurrency & Exception Handling',
              description: 'Handling race conditions, conflicts, and statutory exceptions.',
              category: 'Sub-concept',
              keyConcepts: ['Conflict Resolution', 'Fault Tolerance', 'Rollbacks'],
            },
          ],
        },
        {
          id: 'node-3',
          title: 'Advanced Applications & Trade-offs',
          description: 'Practical real-world case studies, industry benchmarks, and exam synthesis.',
          category: 'Applied',
          keyConcepts: ['Case Studies', 'Optimization', 'Exam Traps'],
          children: [
            {
              id: 'node-3-1',
              title: 'High-Yield Exam Scenarios',
              description: 'Frequently tested interview questions and deep conceptual derivations.',
              category: 'Sub-concept',
              keyConcepts: ['Pattern Solves', 'Interview Vignettes', 'Speed Hacks'],
            },
            {
              id: 'node-3-2',
              title: 'Optimization & Scaling',
              description: 'Cost-benefit analysis, performance tuning, and compliance audits.',
              category: 'Sub-concept',
              keyConcepts: ['Trade-offs', 'Scalability', 'Resilience'],
            },
          ],
        },
      ],
    },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic = 'Distributed Systems', track = 'engineering' } = req.body || {};

  try {
    const ai = getAI();
    if (!ai) {
      return res.status(200).json(getFallbackConceptMap(topic, track));
    }

    const systemPrompt = `You are the Axiom Concept Architecture Engine.
Generate a rich, deeply structured hierarchical Concept Map for "${topic}" in the discipline of ${track.toUpperCase()}.
The tree must have a root node with 3 major subtopic branches, each with 2 child nodes containing clear descriptions and key concepts.
Return purely valid JSON matching the schema without markdown wrappers.`;

    const prompt = `Generate a 3-level deep Concept Map tree for "${topic}" (Track: ${track}).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            track: { type: Type.STRING },
            summary: { type: Type.STRING },
            root: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                children: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      category: { type: Type.STRING },
                      keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                      children: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            category: { type: Type.STRING },
                            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                          },
                          required: ['id', 'title', 'description', 'keyConcepts'],
                        },
                      },
                    },
                    required: ['id', 'title', 'description', 'keyConcepts', 'children'],
                  },
                },
              },
              required: ['id', 'title', 'description', 'keyConcepts', 'children'],
            },
          },
          required: ['topic', 'track', 'summary', 'root'],
        },
      },
    });

    const raw = response.text?.trim() || '{}';
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('Vercel serverless concept-map error:', err);
    return res.status(200).json(getFallbackConceptMap(topic, track));
  }
}
