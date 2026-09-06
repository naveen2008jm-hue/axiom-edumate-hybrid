import React, { useState } from 'react';
import {
  AlertOctagon,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Lightbulb,
  Tag,
} from 'lucide-react';
import { MistakeLog } from '../../types';

interface MistakesLogProps {
  mistakes: MistakeLog[];
  onAddMistake: (m: Omit<MistakeLog, 'id'>) => void;
  onToggleResolved: (id: string) => void;
  onDeleteMistake: (id: string) => void;
}

export const MistakesLog: React.FC<MistakesLogProps> = ({
  mistakes,
  onAddMistake,
  onToggleResolved,
  onDeleteMistake,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [context, setContext] = useState('');
  const [mistakeText, setMistakeText] = useState('');
  const [lessonText, setLessonText] = useState('');
  const [tagInput, setTagInput] = useState('DSA, Interview');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mistakeText) return;
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    onAddMistake({
      logDate: new Date().toISOString().split('T')[0],
      contextOrCompany: context || 'Technical Interview / Contest',
      mistakeDescription: mistakeText,
      lessonLearned: lessonText,
      tags,
      resolved: false,
    });
    setContext('');
    setMistakeText('');
    setLessonText('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-rose-400">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>INTERVIEW & CONTEST REFLECTIONS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Mistakes & Anti-Patterns Log</h2>
          <p className="text-xs text-slate-400">
            Log algorithmic bugs, interview edge-case traps, and key lessons so you never repeat them.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Mistake</span>
        </button>
      </div>

      {/* Grid of Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mistakes.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between gap-4 relative group ${
              item.resolved
                ? 'bg-slate-900/60 border-emerald-500/20'
                : 'bg-slate-900 border-rose-500/20 shadow-lg shadow-rose-500/5'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500">{item.logDate || 'Recent'}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{item.contextOrCompany}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleResolved(item.id)}
                    className="text-emerald-400 hover:scale-110 transition"
                    title={item.resolved ? 'Mark unresolved' : 'Mark resolved (+15 XP)'}
                  >
                    {item.resolved ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-900" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-emerald-400" />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteMistake(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* What went wrong */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-rose-300 leading-relaxed">
                <span className="font-mono text-[10px] text-rose-400 font-bold block mb-1">WHAT WENT WRONG:</span>
                {item.mistakeDescription || item.mistake}
              </div>

              {/* Key Lesson */}
              <div className="p-3 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-amber-400 font-bold block mb-0.5">KEY TAKEAWAY:</span>
                  {item.lessonLearned || item.lesson}
                </div>
              </div>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 rounded-full bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Log Reflection / Bug</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Context / Interview / Contest</label>
                <input
                  type="text"
                  placeholder="e.g. Mock Interview - Amazon (Trees LCA)"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Mistake Description</label>
                <textarea
                  rows={2}
                  placeholder="What caused the bug or confusion..."
                  value={mistakeText}
                  onChange={(e) => setMistakeText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Lesson Learned / Fix Strategy</label>
                <textarea
                  rows={2}
                  placeholder="Rule of thumb to remember next time..."
                  value={lessonText}
                  onChange={(e) => setLessonText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
