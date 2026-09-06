import React, { useState } from 'react';
import {
  HeartPulse,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Activity,
} from 'lucide-react';
import {
  WellbeingCheckin,
  WorkloadAssessment,
  SelfReportedStress,
  EnergyLevel,
} from '../../types';

interface WellbeingTrackerProps {
  checkins: WellbeingCheckin[];
  workload: WorkloadAssessment;
  onRecordCheckin: (stress: SelfReportedStress, energy: EnergyLevel, notes?: string) => void;
}

const STRESS_OPTIONS: { id: SelfReportedStress; label: string; icon: string; color: string }[] = [
  { id: 'GREAT', label: 'Great', icon: '😄', color: 'border-emerald-500/50 text-emerald-300 bg-emerald-500/10' },
  { id: 'GOOD', label: 'Good', icon: '🙂', color: 'border-indigo-500/50 text-indigo-300 bg-indigo-500/10' },
  { id: 'OKAY', label: 'Okay', icon: '😐', color: 'border-slate-600 text-slate-300 bg-slate-800' },
  { id: 'STRESSED', label: 'Stressed', icon: '😰', color: 'border-amber-500/50 text-amber-300 bg-amber-500/10' },
  { id: 'VERY_STRESSED', label: 'Overwhelmed', icon: '😫', color: 'border-rose-500/50 text-rose-300 bg-rose-500/10' },
];

const ENERGY_OPTIONS: { id: EnergyLevel; label: string; icon: string }[] = [
  { id: 'HIGH', label: 'High Energy', icon: '⚡' },
  { id: 'MEDIUM', label: 'Moderate', icon: '🔋' },
  { id: 'LOW', label: 'Drained', icon: '🪫' },
];

export const WellbeingTracker: React.FC<WellbeingTrackerProps> = ({
  checkins,
  workload,
  onRecordCheckin,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayCheckin = checkins.find((c) => c.date === today);

  const [stress, setStress] = useState<SelfReportedStress>(todayCheckin?.stressLevel || 'GOOD');
  const [energy, setEnergy] = useState<EnergyLevel>(todayCheckin?.energyLevel || 'HIGH');
  const [notes, setNotes] = useState(todayCheckin?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordCheckin(stress, energy, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getGaugeColor = (level: WorkloadAssessment['calculatedLevel']) => {
    switch (level) {
      case 'HIGH':
        return 'from-rose-500 to-amber-500 text-rose-400';
      case 'MODERATE':
        return 'from-amber-500 to-indigo-500 text-amber-400';
      case 'LOW':
        return 'from-indigo-500 to-emerald-500 text-emerald-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
          <div className="space-y-1">
            <div className="eyebrow-badge">
              <HeartPulse className="w-3 h-3 text-indigo-400" />
              <span>WELLBEING & WORKLOAD ADAPTATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Cognitive Energy & Burnout Safeguard
            </h2>
            <p className="text-xs text-slate-400">
              Adapts your study session duration, Pomodoro intervals, and daily agenda based on assignment deadlines and stress.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Workload Assessment HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Level Meter */}
        <div className="bezel-shell p-6 space-y-4 lg:col-span-1 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Live Workload Index
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                {workload.workloadScore}
              </span>
              <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded border border-white/10 text-indigo-300 bg-indigo-500/10">
                {workload.calculatedLevel} LOAD
              </span>
            </div>

            {/* Visual Bar Meter */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getGaugeColor(workload.calculatedLevel)} transition-all duration-500`}
                style={{ width: `${workload.workloadScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
            <span className="font-bold text-slate-200">Recommendation Mode:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Notification Tone: <strong className="text-indigo-300">{workload.adaptiveRecommendations.notificationTone}</strong>
            </p>
          </div>
        </div>

        {/* Adaptive Study Parameters */}
        <div className="bezel-shell p-6 space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                {workload.headlineMessage}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {workload.adaptiveRecommendations.actionTip}
            </p>
          </div>

          {/* Preset Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Suggested Focus</span>
              <div className="text-xl font-bold text-white font-mono">
                {workload.adaptiveRecommendations.suggestedFocusMinutes}m
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Suggested Break</span>
              <div className="text-xl font-bold text-indigo-300 font-mono">
                {workload.adaptiveRecommendations.suggestedBreakMinutes}m
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Task Filtering</span>
              <div className="text-xs font-bold text-white font-mono mt-1">
                {workload.adaptiveRecommendations.shouldDeferLowPriorityTasks ? 'Defer Low Priority' : 'All Tasks Active'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Check-in Form */}
      <div className="bezel-shell p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Daily Wellbeing Check-in</h3>
            <p className="text-xs text-slate-400">Takes 15 seconds. Rewards +25 XP and automatically recalibrates your workload score.</p>
          </div>
          {todayCheckin && (
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Checked In Today
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Stress Level Radio Group */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              How is your stress level today?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {STRESS_OPTIONS.map((opt) => {
                const isSelected = stress === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStress(opt.id)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? opt.color + ' ring-2 ring-indigo-500 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy Level Radio Group */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Current Energy & Focus Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {ENERGY_OPTIONS.map((opt) => {
                const isSelected = energy === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setEnergy(opt.id)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Private Reflection Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Feeling good after finishing Operating Systems lab; ready for LeetCode medium contest prep..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% private to you. Non-medical workload calculation only.</span>
            </div>

            <div className="flex items-center gap-2">
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-semibold animate-pulse">
                  ✅ Saved! Workload updated (+25 XP)
                </span>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
              >
                Save Daily Check-in
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Past Check-ins Timeline */}
      {checkins.length > 0 && (
        <div className="bezel-shell p-6 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Check-in History</h3>
          <div className="space-y-2">
            {checkins.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-400">{item.date}</span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-800 text-slate-300">
                    {item.stressLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-800 text-indigo-300">
                    {item.energyLevel} ENERGY
                  </span>
                </div>
                {item.notes && (
                  <p className="text-slate-400 text-[11px] truncate max-w-sm">{item.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
