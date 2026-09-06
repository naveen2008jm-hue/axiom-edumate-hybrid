import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const appDir = typeof __dirname !== 'undefined'
  ? __dirname
  : (typeof import.meta !== 'undefined' && import.meta.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd());

// Safe Gemini client initializer
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Axiom Career Architect Server',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Omni-Skill Course Architect (Axiom Engine)
  app.post('/api/gemini/omni-course', async (req, res) => {
    try {
      const { topic } = req.body;
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      const ai = getAI();
      if (!ai) {
        // High quality fallback course
        const isPhysical = /swim|run|yoga|workout|gym|guitar|handstand|skate|boxing|dance/i.test(topic);
        const category = isPhysical ? 'Physical' : 'Conceptual';
        return res.json({
          category,
          title: `Mastering ${topic}`,
          summary: `A structured step-by-step mastery curriculum for ${topic} built on first principles.`,
          days: [
            {
              day: 1,
              title: 'Foundations & Posture / Baseline Setup',
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
        });
      }

      const systemPrompt = `You are the Axiom.edu Omni-Tutor, a universal Skill Architect. Your goal is to deconstruct any topic into a comprehensive, actionable curriculum.
Determine the exact number of days necessary for the user to achieve solid mastery in this topic (anywhere from 3 to 14 days depending on topic depth).
Determine if the topic is 'Physical' (Kinesthetic/Sports/Craft) or 'Conceptual' (Theoretical/Coding/Academics).

If Physical: Use videoPrompt suffix: "2D flat vector animation, minimalist fitness app aesthetic, bone-white background, thick black outlines, 8fps stepping animation, instructional diagrammatic movement."
If Conceptual: Use videoPrompt suffix: "2D blueprint schematic, chalkboard aesthetic, minimalist technical drawing, flat vector, 8fps, high-contrast digital retro, simplified moving parts."

Output purely valid JSON without markdown wrapping.`;

      const prompt = `Topic: "${topic}". Generate the complete day-by-day mastery curriculum with actionable tasks and visual prompt scenes for each day.`;

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
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/gemini/omni-course:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate course curriculum' });
    }
  });

  // 2. AI Placement & Career Mentor Chat
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, conversationHistory = [], userContext = {} } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getAI();
      if (!ai) {
        return res.json({
          reply: `**Axiom Placement Mentor Advice**:
Great question! Preparing for top-tier software engineering and technical roles requires balancing:
1. **DSA Mastery**: Practice pattern recognition (Sliding Window, Fast & Slow Pointers, Monotonic Stack, DP).
2. **Core CS Depth**: Review OS concurrency, DBMS indexing/ACID, and Network TCP/IP 3-way handshake.
3. **Behavioral & STAR Impact**: Quantify your project metrics and challenges.

*(Tip: Connect your Gemini API key in settings for real-time personalized AI coaching!)*`,
        });
      }

      const systemPrompt = `You are "Axiom Career Mentor" — an elite, encouraging, and highly technical placement coach for engineering students aiming for top product companies (Google, Microsoft, Amazon, Uber, Atlassian) and high-growth tech startups.

Student Profile Context:
- Target roles: ${userContext.targetRole || 'Software Development Engineer (SDE 1 / Intern)'}
- Target Companies: ${userContext.targetCompanies?.length ? userContext.targetCompanies.join(', ') : 'Top Product Companies'}
- Branch / Year: ${userContext.branch || 'CSE'}, ${userContext.graduationYear || '2026/2027'}
- Target Skills: Data Structures & Algorithms, System Design, Core CS (OS, DBMS, CN, OOP), Full Stack Development.

Instructions:
1. Provide practical, high-yield, structured guidance with clean markdown, bullet points, and code snippets where appropriate.
2. When explaining algorithmic concepts, state time/space complexity, pattern name, and key edge cases.
3. If discussing behavioral or interview questions, provide STAR method framing.`;

      let formattedHistory = '';
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        formattedHistory = conversationHistory
          .slice(-6)
          .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.text}`)
          .join('\n');
      }

      const prompt = `${formattedHistory ? `Recent Context:\n${formattedHistory}\n\n` : ''}Student Query: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'I am analyzing your query. How can I help you ace your preparation today?';
      return res.json({ reply });
    } catch (err: any) {
      console.error('Error in /api/gemini/chat:', err);
      return res.status(500).json({
        error: err.message || 'Mentor chat service error',
        reply: 'I had trouble connecting to the AI mentor engine. Try asking again in a moment!',
      });
    }
  });

  // 3. AI Study Planner Generator Route
  app.post('/api/gemini/study-plan', async (req, res) => {
    try {
      const { topic, days = 7, targetLevel = 'Medium', hoursPerDay = 3 } = req.body;
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      const ai = getAI();
      if (!ai) {
        return res.json({
          topicName: topic,
          totalDays: Number(days),
          difficulty: targetLevel,
          estimatedTotalHours: Number(days) * Number(hoursPerDay),
          summary: `Comprehensive ${days}-day structured revision roadmap for ${topic}, optimized for engineering placement interviews.`,
          days: Array.from({ length: Number(days) }, (_, i) => ({
            day: i + 1,
            title: `Day ${i + 1}: ${topic} Fundamentals & Core Patterns Part ${i + 1}`,
            durationHours: Number(hoursPerDay),
            subtopics: [
              `Core theory & mathematical intuition for ${topic}`,
              `Time and space complexity trade-offs`,
              `Standard edge cases and boundary conditions`,
            ],
            practiceProblems: [
              `${topic} - Easy Warmup (LeetCode)`,
              `${topic} - Medium Pattern Application`,
              `${topic} - Interview Favorite Question`,
            ],
            keyTakeaway: `Master the standard template and avoid redundant state recalculations.`,
            completed: false,
          })),
        });
      }

      const prompt = `Generate a structured, high-yield ${days}-day study and revision schedule for an engineering student preparing for tech interviews on the topic: "${topic}".
Target Difficulty: ${targetLevel}
Study Capacity: ${hoursPerDay} hours/day.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are an expert technical curriculum designer. Output a rigorous JSON plan with no extra conversational commentary.`,
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
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/gemini/study-plan:', err);
      const fallbackDays = Number(req.body.days || 7);
      return res.json({
        topicName: req.body.topic || 'Data Structures & Algorithms',
        totalDays: fallbackDays,
        difficulty: req.body.targetLevel || 'Medium',
        estimatedTotalHours: fallbackDays * 3,
        summary: `Structured ${fallbackDays}-day study masterplan for ${req.body.topic || 'Engineering Placements'}.`,
        days: Array.from({ length: fallbackDays }, (_, i) => ({
          day: i + 1,
          title: `Day ${i + 1}: ${req.body.topic} - Module ${i + 1}`,
          durationHours: 3,
          subtopics: ['Core Definitions & Architecture', 'Algorithm Trace & Dry Run', 'Complexity Analysis'],
          practiceProblems: ['Problem 1: Standard Variation', 'Problem 2: Optimal Space Approach'],
          keyTakeaway: 'Focus on clean modular implementation and clarifying questions.',
          completed: false,
        })),
      });
    }
  });

  // 3b. AI Flashcard Synthesizer (Active Recall Generator)
  app.post('/api/gemini/generate-flashcards', async (req, res) => {
    try {
      const { topic, subject = 'Computer Science', count = 5 } = req.body;
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      const ai = getAI();
      if (!ai) {
        return res.json({
          cards: [
            {
              front: `What is the core intuition behind ${topic}?`,
              back: `Fundamental principles, invariants, and time/space complexity trade-offs governing ${topic}.`,
              subtopic: topic,
              difficulty: 'MEDIUM',
            },
            {
              front: `What are the critical edge cases when implementing ${topic}?`,
              back: `Boundary condition overflow, null pointers/references, empty sets, and off-by-one indices.`,
              subtopic: topic,
              difficulty: 'HARD',
            },
            {
              front: `How does ${topic} compare to its closest alternative?`,
              back: `Analyzed through access patterns, memory footprint, cache locality, and algorithmic efficiency.`,
              subtopic: topic,
              difficulty: 'MEDIUM',
            },
          ],
        });
      }

      const prompt = `Generate ${count} concise, high-yield technical interview & exam flashcards for the topic: "${topic}" (Subject: ${subject}).
Each card must have a clear "front" question/prompt and a rich, bullet-pointed "back" answer explaining the invariant, time/space complexity, or solution.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite CS professor and technical interviewer. Output purely valid JSON without markdown.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING },
                    subtopic: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                  },
                  required: ['front', 'back', 'subtopic', 'difficulty'],
                },
              },
            },
            required: ['cards'],
          },
        },
      });

      const raw = response.text?.trim() || '{"cards":[]}';
      const parsed = JSON.parse(raw);
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/gemini/generate-flashcards:', err);
      return res.status(500).json({ error: err.message || 'Failed to synthesize flashcards' });
    }
  });

  // 4. LeetCode Public Statistics Proxy
  app.get('/api/leetcode/:username', async (req, res) => {
    const { username } = req.params;
    if (!username || username === 'undefined') {
      return res.status(400).json({ error: 'Valid username required' });
    }

    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://leetcode.com',
        },
        body: JSON.stringify({
          query: `
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                username
                profile {
                  ranking
                  reputation
                  starRating
                }
                submitStatsGlobal {
                  acSubmissionNum {
                    difficulty
                    count
                    submissions
                  }
                }
                submissionCalendar
              }
              allQuestionsCount {
                difficulty
                count
              }
            }
          `,
          variables: { username },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.matchedUser) {
          const user = data.data.matchedUser;
          const stats = user.submitStatsGlobal.acSubmissionNum;
          const totalSolved = stats.find((s: any) => s.difficulty === 'All')?.count || 0;
          const easySolved = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
          const mediumSolved = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
          const hardSolved = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;
          const ranking = user.profile?.ranking || 45210;

          let calendar: Record<string, number> = {};
          try {
            calendar = JSON.parse(user.submissionCalendar || '{}');
          } catch (e) {
            calendar = {};
          }

          return res.json({
            success: true,
            username,
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking,
            acceptanceRate: 68.4,
            submissionCalendar: calendar,
            isLive: true,
          });
        }
      }
    } catch (e) {
      console.warn('LeetCode live fetch fallback', e);
    }

    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const total = 180 + (hash % 120);
    const easy = Math.floor(total * 0.45);
    const medium = Math.floor(total * 0.45);
    const hard = total - easy - medium;

    return res.json({
      success: true,
      username,
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      ranking: 28400 + (hash % 15000),
      acceptanceRate: 71.2,
      submissionCalendar: generateSampleCalendar(),
      isLive: false,
    });
  });

  // 5. GitHub Public Repos & Contribution Activity Proxy
  app.get('/api/github/:username', async (req, res) => {
    const { username } = req.params;
    if (!username || username === 'undefined') {
      return res.status(400).json({ error: 'Valid GitHub username required' });
    }

    try {
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: { 'User-Agent': 'Axiom-Career-App' },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, {
          headers: { 'User-Agent': 'Axiom-Career-App' },
        });
        const reposData = reposRes.ok ? await reposRes.json() : [];

        return res.json({
          success: true,
          username: userData.login,
          name: userData.name || userData.login,
          avatarUrl: userData.avatar_url,
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          bio: userData.bio || 'Engineering Student & Developer',
          repos: Array.isArray(reposData) ? reposData.map((r: any) => ({
            name: r.name,
            description: r.description || 'Full stack project repository',
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language || 'TypeScript',
            url: r.html_url,
            updatedAt: r.updated_at,
          })) : [],
          isLive: true,
        });
      }
    } catch (err) {
      console.warn('GitHub live fetch fallback', err);
    }

    return res.json({
      success: true,
      username,
      name: `${username.charAt(0).toUpperCase() + username.slice(1)} (Student)`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      publicRepos: 18,
      followers: 42,
      following: 38,
      bio: 'B.Tech CSE Student | SDE Aspirant | Building scalable web apps & solving DSA',
      repos: [
        {
          name: 'Axiom-Career-Architect',
          description: 'Hybrid AI Omni-Learning Platform & Placement Suite with gamified DSA tracking',
          stars: 32,
          forks: 8,
          language: 'TypeScript',
          url: `https://github.com/${username}/Axiom-Career-Architect`,
          updatedAt: new Date().toISOString(),
        },
      ],
      isLive: false,
    });
  });

  function generateSampleCalendar(): Record<string, number> {
    const calendar: Record<string, number> = {};
    const now = Math.floor(Date.now() / 1000);
    const daySeconds = 86400;
    for (let i = 0; i < 120; i++) {
      const timestamp = now - (i * daySeconds);
      if (Math.random() > 0.3) {
        calendar[timestamp.toString()] = Math.floor(Math.random() * 6) + 1;
      }
    }
    return calendar;
  }

  // Vite middleware in dev, static serving in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(appDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Axiom Career Architect running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
