import React, { useState } from 'react';
import {
  Calculator,
  Search,
  CheckCircle2,
  Circle,
  HelpCircle,
  BookOpen,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { AptitudeTopic } from '../../types';

interface AptitudeTrackerProps {
  aptitudeList: AptitudeTopic[];
  onToggleComplete: (id: string) => void;
  onUpdatePractice: (id: string, count: number) => void;
}

export const AptitudeTracker: React.FC<AptitudeTrackerProps> = ({
  aptitudeList,
  onToggleComplete,
  onUpdatePractice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Quantitative' | 'Reasoning' | 'Verbal'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = aptitudeList.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyConcept?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const completedCount = aptitudeList.filter((t) => t.completed).length;
  const progressPercent = aptitudeList.length ? Math.round((completedCount / aptitudeList.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400">
              <Calculator className="w-3.5 h-3.5" />
              <span>APTITUDE & REASONING DRILLS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Placement Aptitude & Formula Vault</h2>
            <p className="text-xs text-slate-400">
              Quantitative shortcuts, logical Venn hierarchies, and verbal elimination strategies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
            <span className="text-slate-400">Mastery:</span>
            <span className="text-emerald-400 font-bold">{completedCount}/{aptitudeList.length} Topics</span>
            <span className="text-indigo-400">({progressPercent}%)</span>
          </div>
        </div>

        {/* Categories Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {(['All', 'Quantitative', 'Reasoning', 'Verbal'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search topics or formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => {
          const solved = topic.practiceSolved || 0;
          const target = topic.practiceTarget || 15;

          return (
            <div
              key={topic.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                topic.completed
                  ? 'bg-slate-900 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {topic.category}
                  </span>
                  <button
                    onClick={() => onToggleComplete(topic.id)}
                    className="text-emerald-400 hover:scale-110 transition"
                    title={topic.completed ? 'Mark pending' : 'Mark completed (+10 XP)'}
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-900" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-indigo-400" />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{topic.title}</h3>
                  {topic.keyConcept && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{topic.keyConcept}</p>
                  )}
                </div>

                {/* Formulas List */}
                {topic.formulas && topic.formulas.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Key Formulas:</div>
                    {topic.formulas.map((formula, fIdx) => (
                      <div key={fIdx} className="text-[11px] font-mono text-indigo-300">
                        • {formula}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Practice target controls */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  Solved: <strong className="text-white">{solved}</strong> / {target} Qs
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdatePractice(topic.id, Math.max(0, solved - 1))}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdatePractice(topic.id, solved + 1)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
