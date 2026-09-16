import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function getFallbackReply(track: string, message: string): string {
  const replies: Record<string, string> = {
    engineering: `### 🎯 Engineering Mentor Guidance for "${message}"\n\n1. **Core Pattern**: Deconstruct into standard algorithms (Two Pointers, Sliding Window, DP).\n2. **Complexity Target**: Aim for $O(N)$ runtime with $O(1)$ or $O(K)$ auxiliary memory.\n3. **Practice Next**: Solve 2 related LeetCode problems to reinforce this pattern.`,
    commerce: `### 📊 Commerce & Finance Strategy for "${message}"\n\n1. **Statutory Standards**: Verify alignment with Ind AS, IFRS, and Companies Act provisions.\n2. **Financial Metrics**: Link to working capital velocity and EBITDA liquidity.\n3. **Next Step**: Review the balance sheet note disclosures.`,
    medical: `### 🩺 Clinical Case Review for "${message}"\n\n1. **Pathophysiology**: Analyze receptor pathways and physiological homeostatic feedback loops.\n2. **Diagnostics**: Order baseline serum labs before confirmatory imaging/biomarkers.\n3. **Therapeutics**: Initiate first-line guidelines with continuous renal/hepatic monitoring.`,
    law: `### ⚖️ Legal Jurisprudence for "${message}"\n\n1. **Statutory Provisions**: Frame arguments through operative BNS/BSA/BNSS sections.\n2. **Judicial Precedent**: Apply Supreme Court ratios and standard of proof criteria.\n3. **Drafting Format**: Structure with the IRAC (Issue, Rule, Application, Conclusion) framework.`,
    competitive_exams: `### 🏛️ UPSC & State PSC Strategy for "${message}"\n\n1. **Syllabus Mapping**: Connect to GS-II / GS-III, NITI Aayog indices, and Constitutional Articles.\n2. **Multi-Dimensional View**: Integrate Social, Economic, Administrative, and Global perspectives.\n3. **Answer Writing**: Provide a 2-line definition, 4 bulleted facts/data, and a forward-looking conclusion.`,
  };
  return replies[track] || replies.engineering;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, conversationHistory = [], userContext = {} } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const track = userContext.track || 'engineering';

  try {
    const ai = getAI();
    if (!ai) {
      return res.status(200).json({ reply: getFallbackReply(track, message) });
    }

    const systemPrompt = `You are the Axiom ${track.toUpperCase()} Placement & Career Mentor.
The student is ${userContext.name || 'Student'}, preparing for ${userContext.targetRole || 'careers/exams'} in ${track.toUpperCase()}.
Provide crisp, structured, highly actionable guidance in clean Markdown.`;

    let formattedHistory = '';
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      formattedHistory = conversationHistory
        .slice(-6)
        .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.text}`)
        .join('\n');
    }

    const prompt = `${formattedHistory ? `Recent Context:\n${formattedHistory}\n\n` : ''}Student Query (${track.toUpperCase()} Track): ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || getFallbackReply(track, message);
    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('Vercel serverless chat error:', err);
    return res.status(200).json({ reply: getFallbackReply(track, message) });
  }
}
