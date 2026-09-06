import React from 'react';
import {
  CalendarCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  Zap,
  BookOpen,
  Code2,
  FileCheck,
  Layers,
  HeartPulse,
} from 'lucide-react';
import { DailyScheduleSlot, WorkloadAssessment } from '../../types';

interface MyDayPlannerProps {
  slots: DailyScheduleSlot[];
  workload: WorkloadAssessment;
  onToggleSlot: (slotId: string) => void;
  onRefreshAgenda: () => void;
}

export const MyDayPlanner: React.FC<MyDayPlannerProps> = ({
  slots,
  workload,
  onToggleSlot,
  onRefreshAgenda,
}) => {
  const total = slots.length;
  const completedCount = slots.filter((s) => s.completed).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const getSlotIcon = (type: DailyScheduleSlot['type']) => {
    switch (type) {
      case 'CLASS':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'ASSIGNMENT':
        return <FileCheck className="w-4 h-4 text-amber-400" />;
      case 'DSA':
        return <Code2 className="w-4 h-4 text-indigo-400" />;
      case 'ROADMAP':
        return <Layers className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSlotBadgeColor = (type: DailyScheduleSlot['type']) => {
    switch (type) {
      case 'CLASS':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30';
      case 'ASSIGNMENT':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      case 'DSA':
        return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30';
      case 'ROADMAP':
        return 'text-purple-300 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="eyebrow-badge">
                <CalendarCheck className="w-3 h-3 text-indigo-400" />
                <span>AI ADAPTIVE DAILY PLANNER</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                My Day — Integrated Academic Agenda
              </h2>
              <p className="text-xs text-slate-400">
                Synthesizes college timetable hours, urgent assignments, 75+ DSA targets, and your live workload score into a conflict-free roadmap.
              </p>
            </div>

            <button
              onClick={onRefreshAgenda}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-white/5 transition-all self-start sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resync Today's Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Progress Card */}
        <div className="bezel-shell p-4 space-y-2 bg-slate-900/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Completion</span>
            <span className="font-mono font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            {completedCount} of {total} slots completed
          </div>
        </div>

        {/* Workload Index Card */}
        <div className="bezel-shell p-4 space-y-1 bg-slate-900/80">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <HeartPulse className="w-3.5 h-3.5 text-indigo-400" />
            <span>Workload Mode</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white font-mono">{workload.workloadScore}/100</span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              {workload.calculatedLevel}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {workload.adaptiveRecommendations.suggestedFocusMinutes}m Focus · {workload.adaptiveRecommendations.suggestedBreakMinutes}m Break
          </p>
        </div>

        {/* XP Boost */}
        <div className="bezel-shell p-4 space-y-1 bg-slate-900/80">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily XP Target</span>
          </span>
          <div className="text-lg font-bold text-amber-400 font-mono">+75 XP Potential</div>
          <p className="text-[11px] text-slate-400">Each completed slot adds +15 XP with 8-bit sound</p>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-3">
        {slots.map((slot) => {
          const isDone = slot.completed;

          return (
            <div
              key={slot.id}
              className={`bezel-shell p-4 sm:p-5 transition-all duration-200 group ${
                isDone ? 'opacity-70 bg-slate-950/40' : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    onClick={() => onToggleSlot(slot.id)}
                    className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      isDone
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-700 hover:border-indigo-500 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-indigo-300">
                        {slot.timeSlot}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${getSlotBadgeColor(
                          slot.type
                        )}`}
                      >
                        {getSlotIcon(slot.type)}
                        <span>{slot.type}</span>
                      </span>
                      {slot.priority && (
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {slot.priority}
                        </span>
                      )}
                      {slot.isLocked && (
                        <span title="Fixed Timetable Slot (Locked)">
                          <Lock className="w-3 h-3 text-emerald-400" />
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-bold text-white tracking-tight ${
                        isDone ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {slot.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="font-mono text-xs text-slate-500">{slot.durationMinutes}m</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
