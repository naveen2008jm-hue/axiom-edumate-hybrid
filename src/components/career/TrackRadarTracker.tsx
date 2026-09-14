import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Circle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  RefreshCw,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Track } from '../../types';
import { useTrack } from '../../context/TrackContext';
import { getTrackRadarConfig, TrackRadarConfig } from '../../data/trackRadarData';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface TrackRadarTrackerProps {
  onAwardXP?: (amount: number) => void;
}

export const TrackRadarTracker: React.FC<TrackRadarTrackerProps> = ({ onAwardXP }) => {
  const { track, trackMeta } = useTrack();
  const config = getTrackRadarConfig(track);
  const TrackIcon = trackMeta.icon;

  const [categories, setCategories] = useState(config.categories);
  const [syncStatus, setSyncStatus] = useState({
    lastSynced: 'Just now',
    syncing: false,
    ratingOrScore: track === 'commerce' ? 'Ind AS Score: 94%' : track === 'medical' ? 'Vignette Score: 88%' : track === 'law' ? 'IRAC Accuracy: 91%' : track === 'competitive_exams' ? 'GS-2/3 Mock Percentile: 96.4%' : 'Target Mastery: 89%',
  });

  const totalSolved = categories.reduce((acc, c) => acc + c.solvedCount, 0);
  const totalCount = categories.reduce((acc, c) => acc + c.totalCount, 0);
  const progressPercent = totalCount > 0 ? Math.round((totalSolved / totalCount) * 100) : 0;

  const handleSyncPlatform = () => {
    setSyncStatus((prev) => ({ ...prev, syncing: true }));
    soundFx.playClick();
    setTimeout(() => {
      setSyncStatus({
        lastSynced: 'Just now',
        syncing: false,
        ratingOrScore: track === 'commerce' ? 'Ind AS Score: 96%' : track === 'medical' ? 'Vignette Score: 92%' : track === 'law' ? 'IRAC Accuracy: 93%' : 'GS Percentile: 97.2%',
      });
      onAwardXP?.(15);
      soundFx.playLevelUp();
      toast.success('Live Discipline Radar Synced!', {
        description: `Refreshed ${config.platformSyncName}. +15 XP gained!`,
      });
    }, 1200);
  };

  const handleIncrementTopic = (catIdx: number) => {
    setCategories((prev) => {
      const next = [...prev];
      const target = next[catIdx];
      if (target && target.solvedCount < target.totalCount) {
        target.solvedCount += 1;
        if (target.solvedCount === target.totalCount) {
          target.status = 'Mastered';
        }
        onAwardXP?.(10);
        soundFx.playSuccess();
        toast.success(`Progress Recorded in ${target.title}`, { description: '+10 XP gained.' });
      }
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="eyebrow-badge">
                  <TrackIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>DISCIPLINE RADAR BENCHMARK</span>
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
                  {config.badgeLabel}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-white font-display">
                {config.radarTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {config.radarSubtitle}. Track your domain syllabus coverage, statutory milestones, and clinical / judicial benchmarking in real-time.
              </p>
            </div>

            {/* Platform Live Sync Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 text-right">
              <div className="flex items-center justify-end gap-2 text-xs font-mono font-bold text-white">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>{config.platformSyncName}</span>
              </div>
              <div className="text-sm font-black text-emerald-400 font-mono">{syncStatus.ratingOrScore}</div>
              <button
                onClick={handleSyncPlatform}
                disabled={syncStatus.syncing}
                className="btn-island px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1 ml-auto disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus.syncing ? 'animate-spin' : ''}`} />
                <span>{syncStatus.syncing ? 'Syncing...' : 'Live Sync'}</span>
              </button>
            </div>
          </div>

          {/* Progress Overview Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Overall Discipline Syllabus Mastery ({config.totalTargetMetric})</span>
              <span className="text-indigo-400 font-bold">{totalSolved} / {totalCount} ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Radar Categories Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const catPercent = cat.totalCount > 0 ? Math.round((cat.solvedCount / cat.totalCount) * 100) : 0;
          return (
            <div key={cat.code} className="bezel-shell group hover:border-indigo-500/40 transition-all">
              <div className="bezel-core p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {cat.code} • Weightage: {cat.weightagePercent}%
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5 font-display">{cat.title}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                      cat.status === 'Mastered'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : cat.status === 'On Track'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Target Modules</span>
                    <span className="text-white font-bold">{cat.solvedCount} / {cat.totalCount} ({catPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${catPercent}%` }} />
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">High-Yield Modules</span>
                  <div className="space-y-1">
                    {cat.keyHighlights.map((hl, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => handleIncrementTopic(idx)}
                    disabled={cat.solvedCount >= cat.totalCount}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 hover:text-white text-xs font-semibold transition pressable border border-slate-800"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{cat.solvedCount >= cat.totalCount ? 'All Modules Mastered ✓' : 'Record Module Practice (+10 XP)'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Yield Strategy Tips Card */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 bg-slate-900/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Senior Advisor Strategic Invariants for {trackMeta.shortLabel}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {config.highYieldTips.map((tip, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white block mb-1">Rule #{i + 1}</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
