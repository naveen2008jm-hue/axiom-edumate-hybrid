import React, { useState } from 'react';
import {
  AlertOctagon,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { BacklogItem, Track } from '../../types';
import { useTrack } from '../../context/TrackContext';
import { INITIAL_BACKLOG_ITEMS } from '../../data/groupProjectsData';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface BacklogTrackerProps {
  onAwardXP?: (amount: number) => void;
}

export const BacklogTracker: React.FC<BacklogTrackerProps> = ({ onAwardXP }) => {
  const { track, trackMeta } = useTrack();
  const [backlogs, setBacklogs] = useState<BacklogItem[]>(INITIAL_BACKLOG_ITEMS);

  // Form state
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [originalSem, setOriginalSem] = useState(2);
  const [credits, setCredits] = useState(4);
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MODERATE'>('HIGH');

  const handleAddBacklog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    const newItem: BacklogItem = {
      id: `bkl-${Date.now()}`,
      subjectName,
      subjectCode: subjectCode || 'ARR101',
      track,
      originalSemester: originalSem,
      credits,
      difficulty: 'Hard',
      status: 'Registered',
      targetExamDate: targetDate || '2026-11-15',
      attemptCount: 1,
      priority,
    };

    setBacklogs((prev) => [newItem, ...prev]);
    setSubjectName('');
    setSubjectCode('');
    onAwardXP?.(10);
    soundFx.playClick();
    toast.success('Backlog Target Added', { description: 'Scheduled re-exam clearance plan.' });
  };

  const handleToggleCleared = (id: string) => {
    setBacklogs((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus = item.status === 'Cleared' ? 'Pending' : 'Cleared';
        if (nextStatus === 'Cleared') {
          onAwardXP?.(50);
          soundFx.playLevelUp();
          toast.success('🎉 Backlog Cleared!', { description: '+50 XP gained! Subject deficit resolved.' });
        } else {
          soundFx.playClick();
        }
        return { ...item, status: nextStatus };
      })
    );
  };

  const handleDeleteBacklog = (id: string) => {
    setBacklogs((prev) => prev.filter((item) => item.id !== id));
    soundFx.playClick();
  };

  const pendingCount = backlogs.filter((b) => b.status !== 'Cleared').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Backlog & Arrears Clearance Tracker</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Systematic re-exam roadmap for pending/failed subjects across semesters
          </p>
        </div>

        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
          pendingCount === 0
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
        }`}>
          {pendingCount === 0 ? 'Zero Arrears Clean Record ✓' : `${pendingCount} Arrears Pending`}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add Backlog Form */}
        <div className="lg:col-span-5 bezel-shell">
          <div className="bezel-core p-6 space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Record Pending / Re-Exam Subject</span>
            </h4>

            <form onSubmit={handleAddBacklog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Transform Calculus / Corporate Tax"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="MA201"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Original Sem</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={originalSem}
                    onChange={(e) => setOriginalSem(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Re-Exam Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Clearance Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CRITICAL">Critical (Graduation Prereq)</option>
                    <option value="HIGH">High</option>
                    <option value="MODERATE">Moderate</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-island w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition mt-2 pressable"
              >
                Schedule Clearance Plan
              </button>
            </form>
          </div>
        </div>

        {/* Backlog Items List */}
        <div className="lg:col-span-7 space-y-3">
          {backlogs.map((item) => {
            const isCleared = item.status === 'Cleared';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border transition-all ${
                  isCleared
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleCleared(item.id)}
                      className="mt-1 text-emerald-400 flex-shrink-0"
                    >
                      {isCleared ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-emerald-400 transition-colors" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">{item.subjectCode}</span>
                        <span className="text-[10px] font-mono text-slate-500">Sem {item.originalSemester} • {item.credits} Credits</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                          item.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                      <h4 className={`text-sm font-bold text-white font-display ${isCleared ? 'line-through text-slate-500' : ''}`}>
                        {item.subjectName}
                      </h4>
                      {item.notes && <p className="text-xs text-slate-400 leading-relaxed">{item.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right text-[11px] font-mono text-slate-400 hidden sm:block">
                      <span>Target: {item.targetExamDate}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteBacklog(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {backlogs.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 bezel-shell">
              No backlogs recorded. Excellent academic standing!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
