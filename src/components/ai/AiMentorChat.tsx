import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  RefreshCw,
  Zap,
  Code2,
  Lightbulb,
  Award,
  Stethoscope,
  Scale,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, UserProfile, Track } from '../../types';
import { TRACK_DEFINITIONS } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { DEMO_CHAT_MESSAGES } from '../demo/demoSeedData';

interface AiMentorChatProps {
  profile: UserProfile;
  demoMode?: boolean;
}

const TRACK_PRESETS: Record<Track, string[]> = {
  engineering: [
    'How do I crack SDE-1 interviews at Google / Atlassian?',
    'Explain Sliding Window vs Two Pointers with templates',
    'What are the most tested DBMS & OS questions?',
    'Review my STAR resume story for a distributed cache project',
  ],
  competitive_exams: [
    'How should I structure a 250-word GS-2 answer on Judicial Review vs Activism?',
    'Explain the Monetary Policy Committee repo rate transmission mechanism',
    'What are the high-yield environmental conventions (Ramsar, UNFCCC, CBD)?',
    'How do I eliminate CSAT math traps within a 2-minute limit?',
  ],
  medical: [
    'Walk through the differential diagnosis for acute chest pain with ST elevations',
    'Compare Erb-Duchenne vs Klumpke brachial plexus injuries with roots & signs',
    'What are the first-line pharmacotherapies for gestational hypertension?',
    'Explain the Alvarado score criteria for acute appendicitis evaluation',
  ],
  law: [
    'Explain the distinction between Culpable Homicide and Murder under BNS Sec 100/101',
    'Analyze the doctrine of Frustration of Contract under Section 56 with landmark cases',
    'How do I structure an IRAC memo for a writ petition under Article 226?',
    'What are the evidentiary prerequisites for electronic record certification under BSA?',
  ],
  commerce: [
    'Explain the 5-step revenue recognition framework under Ind AS 115 with examples',
    'What is the practical difference between qualified, adverse, and disclaimer audit opinions?',
    'How do I calculate Capital Gains exemptions under Section 54EC vs 54F?',
    'Walk through DCF enterprise valuation and WACC computation steps',
  ],
  humanities: [
    'Compare Hobbes, Locke, and Rousseau on the origin and extent of sovereign power',
    'How do Structural Functionalism and Conflict Theory view social stratification?',
    'Explain the core tenets of Realism vs Constructivism in international relations',
    'How do I formulate a grounded theory methodology for qualitative fieldwork?',
  ],
  other: [
    'How can I use the Feynman technique to deconstruct complex technical topics?',
    'What is the optimal spaced repetition schedule for long-term retention?',
    'Help me formulate an actionable 14-day mastery curriculum for a new domain',
    'How do I conduct deliberate practice sessions with immediate feedback loops?',
  ],
};

function getTrackWelcomeGreeting(track: Track = 'engineering', name: string): string {
  const firstName = name.split(' ')[0] || 'Student';
  switch (track) {
    case 'competitive_exams':
      return `👋 Namaste **${firstName}**! I am your **Axiom Civil Services & PSC Mentor**.\n\nI have context on your target examination goals, General Studies syllabus, CSAT practice sheets, and daily schedule.\n\nAsk me anything about:\n- **Mains Answer Writing Frameworks** (Intro, Subheadings, Case Law/Committees, Way Forward)\n- **Constitutional Articles & Landmark Judgments** (Polity & Governance)\n- **Macroeconomic Concepts & Budgetary Models** (GS-3)\n- **Ethics Case Study Solutions** using deontology and utilitarianism`;

    case 'medical':
      return `👋 Hello **Dr. ${firstName}**! I am your **Axiom Clinical & Medical Residency Mentor**.\n\nI have context on your NEET-PG / USMLE prep, clinical case sheets, and high-yield subject modules.\n\nAsk me anything about:\n- **Clinical Diagnostic Algorithms** & Gold Standard Investigations\n- **High-Yield Pharmacology Invariants** (Mechanisms, Indications & Toxicities)\n- **Radiological & Histopathological Signs** (Classic triad and eponymous recall)\n- **Emergency Triage & Patient Management Guidelines**`;

    case 'law':
      return `👋 Greetings **${firstName}**! I am your **Axiom Jurisprudence & Legal Mentor**.\n\nI have context on your Judiciary & CLAT-PG goals, Bare Act sections (BNS/BNSS/BSA), and moot court case repository.\n\nAsk me anything about:\n- **Statutory Interpretation & Bare Act Mappings** (BNS vs IPC, BNSS, BSA)\n- **Constitutional Jurisprudence & Writ Petitions** (Art 32 / Art 226 / PILs)\n- **IRAC Method Legal Briefing** for judicial exam problem questions\n- **Landmark Supreme Court Ratios** & Constitutional Bench Precedents`;

    case 'commerce':
      return `👋 Hello **${firstName}**! I am your **Axiom Financial & Corporate Mentor**.\n\nI have context on your CA, CFA, CS, and Commerce curriculum, Ind AS standards, and corporate tax modules.\n\nAsk me anything about:\n- **Ind AS / IFRS Problem Solutions** (Ind AS 115, 116, 109, 36)\n- **Corporate Taxation & Capital Gains Computations**\n- **Auditing Standards & Reporting Modifications** (SA 700 series)\n- **Financial Statement Analysis, DCF Valuation & WACC Models**`;

    case 'humanities':
      return `👋 Hello **${firstName}**! I am your **Axiom Humanities & Policy Research Mentor**.\n\nI have context on your academic curriculum, sociological frameworks, historical debates, and UGC-NET prep.\n\nAsk me anything about:\n- **Comparative Political Philosophy & Ideological Debates**\n- **Historiographical Methodologies & Source Evaluation**\n- **Sociological Paradigms & Structural Analysis**\n- **Qualitative Research Design & Academic Paper Structuring**`;

    case 'other':
      return `👋 Hello **${firstName}**! I am your **Axiom Universal Learning Coach**.\n\nI am equipped to deconstruct any complex discipline into first principles, systematic practice drills, and active recall cues.\n\nAsk me anything about:\n- **Rapid Skill Acquisition & Mental Models**\n- **Deconstructing Complex Technical or Analytical Subjects**\n- **Designing Deliberate Practice Routines & Retrieval Drills**`;

    default: // engineering
      return `👋 Hello **${firstName}**! I am your **Axiom Placement & Technical Mentor**.\n\nI have context on your target companies, solved DSA patterns, and core CS subjects.\n\nAsk me anything about:\n- **Algorithm Problem-Solving** & time complexity trade-offs\n- **System Design Fundamentals** (Caching, Raft, Load Balancing)\n- **OS / DBMS Interview FAQs** (Indexing, Concurrency, Normalization)\n- **STAR Behavioral Stories** for technical interviews`;
  }
}

export const AiMentorChat: React.FC<AiMentorChatProps> = ({ profile, demoMode = false }) => {
  const currentTrack: Track = profile.track || 'engineering';
  const trackMeta = TRACK_DEFINITIONS[currentTrack] || TRACK_DEFINITIONS.engineering;
  const presets = TRACK_PRESETS[currentTrack] || TRACK_PRESETS.engineering;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (demoMode) return DEMO_CHAT_MESSAGES;
    return [
      {
        id: 'msg-0',
        role: 'model',
        content: getTrackWelcomeGreeting(currentTrack, profile.name),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Re-initialize welcome if track changes
  useEffect(() => {
    if (!demoMode && messages.length <= 1) {
      setMessages([
        {
          id: `msg-${Date.now()}`,
          role: 'model',
          content: getTrackWelcomeGreeting(currentTrack, profile.name),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [currentTrack]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    soundFx.playClick();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        text: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: history,
          userContext: {
            name: profile.name,
            branch: profile.branch,
            track: currentTrack,
            graduationYear: profile.graduationYear,
            targetCompanies: profile.targetCompanies,
            targetRole: profile.targetRole || trackMeta.targetExamsOrRoles,
            leetcodeUsername: profile.leetcodeUsername,
          },
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'I analyzed your question. How else can I guide your preparation?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      soundFx.playBlip();
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          content: 'I encountered a connection hiccup with the AI mentor engine. Try asking again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    soundFx.playClick();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        content: getTrackWelcomeGreeting(currentTrack, profile.name),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl mx-auto">
      {/* Header (Double-Bezel) */}
      <div className="bezel-shell">
        <div className="bezel-core p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white font-display">AI Exam & Career Mentor</h2>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
                  {trackMeta.shortLabel} Coach
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalized guidance tuned for <strong className="text-slate-200">{trackMeta.targetExamsOrRoles}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 text-xs font-mono transition pressable self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase font-bold px-1">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Recommended {trackMeta.shortLabel} Prompts:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {presets.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 text-xs whitespace-nowrap transition pressable flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bezel-shell min-h-[420px] max-h-[560px] flex flex-col justify-between">
        <div className="bezel-core p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[480px]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : `${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[78%] text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md'
                      : 'bg-slate-900/90 border border-white/5 text-slate-200'
                  }`}
                >
                  <div className="prose prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  <div
                    className={`text-[9px] font-mono text-right pt-1 ${
                      isUser ? 'text-indigo-200/80' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 animate-pulse">
              <div className={`w-8 h-8 rounded-xl ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent} flex items-center justify-center text-xs`}>
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/5 text-xs text-slate-400 font-mono">
                {trackMeta.shortLabel} Mentor is synthesizing guidance...
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-white/5 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask your ${trackMeta.shortLabel} mentor anything (e.g. concepts, exam strategy, interview questions)...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md shadow-indigo-600/30 flex-shrink-0 pressable"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
