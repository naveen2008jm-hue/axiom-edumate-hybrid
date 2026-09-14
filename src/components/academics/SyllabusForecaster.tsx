import React from 'react';
import {
  TrendingUp,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { CoreSubject, ExamPlanner, Track } from '../../types';
import { useTrack } from '../../context/TrackContext';

interface SyllabusForecasterProps {
  coreSubjects: CoreSubject[];
  examPlanners: ExamPlanner[];
}

export const SyllabusForecaster: React.FC<SyllabusForecasterProps> = ({
  coreSubjects,
  examPlanners,
}) => {
  const { track, trackMeta } = useTrack();

  // Compute total core topics across all subjects
  const allTopics = coreSubjects.flatMap((s) => s.keyTopics);
  const totalTopics = allTopics.length || 20;
  const completedTopics = allTopics.filter((t) => t.completed).length;
  const syllabusPercent = Math.round((completedTopics / totalTopics) * 100);

  // Compute nearest upcoming exam
  const sortedExams = [...examPlanners].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );
  const targetExam = sortedExams[0];

  // Calculate days remaining to exam
  const today = new Date();
  const examDate = targetExam ? new Date(targetExam.examDate) : new Date(today.getTime() + 20 * 86400000);
  const diffTime = examDate.getTime() - today.getTime();
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Daily pace required
  const remainingTopics = totalTopics - completedTopics;
  const requiredPaceDaily = (remainingTopics / daysRemaining).toFixed(1);

  // Estimated completion date assuming 1.2 topics/day current pace
  const currentPace = 1.2;
  const daysNeededAtCurrentPace = Math.ceil(remainingTopics / currentPace);
  const forecastedDate = new Date(today.getTime() + daysNeededAtCurrentPace * 86400000);
  const forecastedDateStr = forecastedDate.toISOString().split('T')[0];

  const isOnTrack = daysNeededAtCurrentPace <= daysRemaining;
  const isAtRisk = daysNeededAtCurrentPace > daysRemaining && daysNeededAtCurrentPace <= daysRemaining + 4;
  const isBehind = daysNeededAtCurrentPace > daysRemaining + 4;

  const statusLabel = isOnTrack ? 'ON TRACK' : isAtRisk ? 'AT RISK' : 'BEHIND SCHEDULE';
  const statusBadgeStyle = isOnTrack
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    : isAtRisk
    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    : 'bg-rose-500/15 text-rose-300 border-rose-500/30';

  return (
    <div className="bezel-shell">
      <div className="bezel-core p-6 space-y-5 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-purple-950/20">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="eyebrow-badge">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>SYLLABUS COMPLETION FORECASTER</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${statusBadgeStyle} border uppercase`}>
              {statusLabel}
            </span>
          </div>

          {targetExam && (
            <div className="text-xs font-mono text-slate-400">
              Exam: <strong className="text-white">{targetExam.subjectName}</strong> ({targetExam.examDate})
            </div>
          )}
        </div>

        {/* Forecast Metrics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Current Syllabus Progress</span>
            <div className="text-xl font-bold text-white mt-1">{completedTopics} / {totalTopics} <span className="text-indigo-400 text-xs">({syllabusPercent}%)</span></div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Days to Target Exam</span>
            <div className="text-xl font-bold text-white mt-1">{daysRemaining} Days <span className="text-slate-400 text-xs font-normal">left</span></div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Required Daily Velocity</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{requiredPaceDaily} <span className="text-slate-400 text-xs font-normal">topics/day</span></div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Projected Completion</span>
            <div className={`text-xl font-bold mt-1 ${isOnTrack ? 'text-emerald-400' : 'text-rose-400'}`}>
              {forecastedDateStr}
            </div>
          </div>
        </div>

        {/* Recommendation Callout */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
          isOnTrack
            ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-200'
            : 'bg-rose-500/10 border-rose-500/20 text-slate-200'
        }`}>
          {isOnTrack ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-white block">
              {isOnTrack
                ? 'Optimal Velocity: You are scheduled to complete syllabus 3 days before exam date.'
                : `Velocity Alert: At current pace you will finish on ${forecastedDateStr}, which is after your exam!`}
            </span>
            <p className="text-slate-300 mt-0.5">
              {isOnTrack
                ? 'Maintain 1.5 topics/day focus to leave 72 hours for active recall mock tests and past-year solves.'
                : `Increase focus to ${requiredPaceDaily} topics/day or use AI Study Planner to sprint high-yield modules.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
