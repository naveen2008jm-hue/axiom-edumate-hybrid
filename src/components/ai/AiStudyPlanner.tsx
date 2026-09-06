import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { StudyPlan } from '../../types';

interface AiStudyPlannerProps {
  studyPlans: StudyPlan[];
  onAddPlan: (p: Omit<StudyPlan, 'id' | 'createdAt'>) => void;
  onToggleDay: (planId: string, dayIdx: number) => void;
  onDeletePlan: (id: string) => void;
}

export const AiStudyPlanner: React.FC<AiStudyPlannerProps> = ({
  studyPlans,
  onAddPlan,
  onToggleDay,
  onDeletePlan,
}) => {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState(7);
  const [difficulty, setDifficulty] = useState('Medium');
  const [hours, setHours] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          days,
          targetLevel: difficulty,
          hoursPerDay: hours,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate study plan');
      const data = await res.json();

      onAddPlan({
        topicName: data.topicName || topic,
        totalDays: Number(data.totalDays) || days,
        difficulty: data.difficulty || difficulty,
        estimatedTotalHours: Number(data.estimatedTotalHours) || days * hours,
        summary: data.summary || `Study roadmap for ${topic}`,
        days: data.days || [],
        isActive: true,
      });

      setTopic('');
    } catch (err: any) {
      setError(err.message || 'Error generating AI study plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400">
              <Compass className="w-3.5 h-3.5" />
              <span>AI ROADMAP GENERATOR</span>
            </div>
            <h2 className="text-xl font-bold text-white">Generate Custom Study Plan</h2>
            <p className="text-xs text-slate-400">
              Gemini AI generates structured multi-day revision sprints tailored to your interview timeframe.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Topic / Skill</label>
              <input
                type="text"
                placeholder="e.g. Graph Algorithms & Dijkstra, Spring Boot Microservices"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Duration (Days)</label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Hours/Day</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {error && <p className="text-rose-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Roadmap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Build Study Roadmap</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Saved Plans List */}
        <div className="lg:col-span-7 space-y-4">
          {studyPlans.map((plan) => {
            const completedCount = plan.days.filter((d) => d.completed).length;
            const progress = plan.days.length ? Math.round((completedCount / plan.days.length) * 100) : 0;

            return (
              <div key={plan.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {plan.totalDays} Days • {plan.difficulty}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        ~{plan.estimatedTotalHours}h total
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{plan.topicName}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.summary}</p>
                  </div>

                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Roadmap Progress: {completedCount}/{plan.days.length} Days</span>
                    <span className="text-indigo-400 font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Day-by-Day List */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {plan.days.map((d, dIdx) => (
                    <div
                      key={dIdx}
                      onClick={() => onToggleDay(plan.id, dIdx)}
                      className={`p-3 rounded-2xl border cursor-pointer transition text-xs space-y-1 ${
                        d.completed
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 font-semibold">
                          <button className="text-emerald-400">
                            {d.completed ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-slate-950" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                          <span className={d.completed ? 'line-through text-slate-500' : ''}>{d.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-400">+{d.durationHours}h (+20 XP)</span>
                      </div>

                      {d.practiceProblems && d.practiceProblems.length > 0 && (
                        <div className="text-[11px] text-slate-400 pl-6">
                          <strong>Practice:</strong> {d.practiceProblems.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
