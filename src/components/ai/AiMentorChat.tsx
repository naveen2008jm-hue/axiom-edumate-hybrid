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
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, UserProfile } from '../../types';
import { soundFx } from '../../lib/sound';

interface AiMentorChatProps {
  profile: UserProfile;
}

const PRESET_PROMPTS = [
  'How do I crack SDE-1 interviews at Google / Atlassian?',
  'Explain Sliding Window vs Two Pointers with templates',
  'What are the most tested DBMS & OS questions?',
  'Review my STAR resume story for a distributed cache project',
];

export const AiMentorChat: React.FC<AiMentorChatProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      role: 'model',
      content: `👋 Hello **${profile.name.split(' ')[0]}**! I am your **Axiom Placement & Technical Mentor**.\n\nI have context on your target companies (${profile.targetCompanies.slice(0, 3).join(', ')}), your solved DSA patterns, and core subjects.\n\nAsk me anything about:\n- **Algorithm Problem-Solving** & time complexity trade-offs\n- **System Design Fundamentals** (Caching, Raft, Load Balancing)\n- **OS / DBMS Interview FAQs** (Indexing, Concurrency, Normalization)\n- **STAR Behavioral Stories** for tech interviews`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
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
            graduationYear: profile.graduationYear,
            targetCompanies: profile.targetCompanies,
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

  const clearChat = () => {
    soundFx.playClick();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        content: `Chat cleared. Ready for your next technical question, **${profile.name.split(' ')[0]}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Banner with Double-Bezel Shell */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 flex flex-col h-[740px] justify-between">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-display">
                  <span>Axiom Placement & Technical Mentor</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                    Gemini Intelligence
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-normal">
                  24/7 Context-Aware Technical Interviewer & System Design Coach
                </p>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-white/5 transition pressable"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Log with ReactMarkdown Parsing */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-none'
                        : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap font-sans font-medium">{msg.content}</div>
                    ) : (
                      <div className="font-sans space-y-2 leading-relaxed">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-sm sm:text-base font-bold text-white font-display mt-2 mb-1 border-b border-white/5 pb-1">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xs sm:text-sm font-bold text-indigo-300 font-display mt-2 mb-1">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xs font-bold text-purple-300 font-display mt-1.5 mb-0.5">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({ children }) => (
                              <ul className="list-disc list-outside space-y-1 my-1.5 ml-4 text-slate-300">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-outside space-y-1 my-1.5 ml-4 text-slate-300">{children}</ol>
                            ),
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-indigo-300">{children}</strong>,
                            code: ({ inline, children, ...props }: any) => {
                              return inline ? (
                                <code className="px-1.5 py-0.5 rounded bg-slate-950 font-mono text-[11px] text-indigo-300 border border-white/10">
                                  {children}
                                </code>
                              ) : (
                                <pre className="p-3 my-2 rounded-xl bg-slate-950/90 border border-white/10 font-mono text-xs overflow-x-auto text-slate-200">
                                  <code>{children}</code>
                                </pre>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    <div
                      className={`text-[9px] font-mono text-right ${
                        isUser ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-purple-400">
                <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 font-mono text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Mentor is synthesizing your response...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Preset Prompts Chips */}
          <div className="pt-2 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-white/5">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider flex-shrink-0">
              Quick Inquiries:
            </span>
            {PRESET_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-purple-500/40 text-slate-300 hover:text-white text-[11px] font-medium transition pressable flex-shrink-0 truncate max-w-xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                placeholder="Ask about DSA algorithms, system design, core CS, or behavioral interview prep..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition pressable shadow-md shadow-purple-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
