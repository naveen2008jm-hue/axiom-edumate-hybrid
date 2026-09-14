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
  Moon,
  Users,
  Send,
  Bell,
  Award,
} from 'lucide-react';
import {
  WellbeingCheckin,
  WorkloadAssessment,
  SelfReportedStress,
  EnergyLevel,
  SleepLogEntry,
  StudyBuddyConfig,
} from '../../types';
import { INITIAL_SLEEP_LOGS, INITIAL_STUDY_BUDDY } from '../../data/groupProjectsData';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface WellbeingTrackerProps {
  checkins: WellbeingCheckin[];
  workload: WorkloadAssessment;
  onRecordCheckin: (stress: SelfReportedStress, energy: EnergyLevel, notes?: string) => void;
  onAwardXP?: (amount: number) => void;
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
  onAwardXP,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayCheckin = checkins.find((c) => c.date === today);

  const [stress, setStress] = useState<SelfReportedStress>(todayCheckin?.stressLevel || 'GOOD');
  const [energy, setEnergy] = useState<EnergyLevel>(todayCheckin?.energyLevel || 'HIGH');
  const [notes, setNotes] = useState(todayCheckin?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sleep Debt Tracker State
  const [sleepLogs, setSleepLogs] = useState<SleepLogEntry[]>(INITIAL_SLEEP_LOGS);
  const [hoursInput, setHoursInput] = useState('7.0');
  const [sleepQuality, setSleepQuality] = useState<SleepLogEntry['quality']>('RESTED');

  // Study Buddy Accountability State
  const [studyBuddy, setStudyBuddy] = useState<StudyBuddyConfig>(INITIAL_STUDY_BUDDY);
  const [buddyNameInput, setBuddyNameInput] = useState(studyBuddy.buddyName);
  const [buddyContactInput, setBuddyContactInput] = useState(studyBuddy.buddyContact);
  const [buddyGoalInput, setBuddyGoalInput] = useState(studyBuddy.studyPactGoal);
  const [isEditingBuddy, setIsEditingBuddy] = useState(false);

  const handleRecordSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedHours = parseFloat(hoursInput) || 7.0;
    const newEntry: SleepLogEntry = {
      id: `slp-${Date.now()}`,
      date: today,
      hoursSlept: parsedHours,
      quality: sleepQuality,
      targetHours: 8,
    };

    setSleepLogs((prev) => {
      const filtered = prev.filter((p) => p.date !== today);
      return [newEntry, ...filtered];
    });

    onAwardXP?.(15);
    soundFx.playSuccess();
    toast.success('Sleep Log Recorded', {
      description: `${parsedHours} hrs logged for ${today}. Rolling 7-day debt recalculated.`,
    });
  };

  const handleSendBuddyPing = () => {
    setStudyBuddy((prev) => ({
      ...prev,
      lastPingDate: today,
      totalPingsSent: prev.totalPingsSent + 1,
    }));

    onAwardXP?.(10);
    soundFx.playLevelUp();
    toast.success('⚡ Accountability Ping Broadcasted!', {
      description: `Sent daily focus check-in to ${studyBuddy.buddyName} (${studyBuddy.buddyContact}). +10 XP gained!`,
    });
  };

  const handleSaveBuddyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setStudyBuddy((prev) => ({
      ...prev,
      buddyName: buddyNameInput,
      buddyContact: buddyContactInput,
      studyPactGoal: buddyGoalInput,
    }));
    setIsEditingBuddy(false);
    toast.success('Study Buddy Pact Updated');
  };

  // Calculate 7-Day Rolling Sleep Debt
  const last7DaysLogs = sleepLogs.slice(0, 7);
  const totalHours7Days = last7DaysLogs.reduce((acc, l) => acc + l.hoursSlept, 0);
  const targetTotal7Days = last7DaysLogs.length * 8;
  const sleepDebt = totalHours7Days - targetTotal7Days; // negative means debt
  const avgSleep = last7DaysLogs.length > 0 ? (totalHours7Days / last7DaysLogs.length).toFixed(1) : '7.0';

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

      {/* Part 4: 7-Day Rolling Sleep Debt Tracker & Study Buddy Accountability Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Rolling Sleep Debt Tracker */}
        <div className="bezel-shell p-6 space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">7-Day Rolling Sleep Debt</h3>
                <p className="text-[11px] text-slate-400">Target: 8.0 hrs/night. Rolling total vs target.</p>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-full font-mono text-xs font-bold border ${
              sleepDebt >= 0 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                : sleepDebt > -5 
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {sleepDebt >= 0 ? `+${sleepDebt.toFixed(1)}h Surplus` : `${sleepDebt.toFixed(1)}h Debt`}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">7D Average</div>
              <div className="text-lg font-bold text-white font-mono">{avgSleep}h</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Recorded Days</div>
              <div className="text-lg font-bold text-indigo-400 font-mono">{last7DaysLogs.length}/7</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Status</div>
              <div className={`text-xs font-bold font-mono mt-1 ${
                sleepDebt >= 0 ? 'text-emerald-400' : sleepDebt > -4 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {sleepDebt >= 0 ? 'Optimum' : sleepDebt > -4 ? 'Mild Fatigue' : 'High Deficit'}
              </div>
            </div>
          </div>

          {/* Log Sleep Form */}
          <form onSubmit={handleRecordSleep} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-200 block">Log Last Night's Sleep (+15 XP)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Hours Slept</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="16"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Quality</label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value as SleepLogEntry['quality'])}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="RESTED">🌟 Deep & Rested</option>
                  <option value="OKAY">😐 Normal / Okay</option>
                  <option value="TIRED">🥱 Interrupted / Tired</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              Log Sleep Entry
            </button>
          </form>

          {/* Rolling Logs List */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Recent Logs</span>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {last7DaysLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <span className="font-mono text-[11px] text-slate-400">{log.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{log.hoursSlept}h</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      log.quality === 'EXCELLENT' || log.quality === 'RESTED' ? 'text-emerald-300 bg-emerald-500/10' :
                      log.quality === 'TIRED' ? 'text-amber-300 bg-amber-500/10' :
                      'text-rose-300 bg-rose-500/10'
                    }`}>
                      {log.quality}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Study Buddy Accountability Card */}
        <div className="bezel-shell p-6 space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Study Buddy Accountability</h3>
                <p className="text-[11px] text-slate-400">Mutual focus pact & daily study check-in pings.</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingBuddy(!isEditingBuddy)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              {isEditingBuddy ? 'Cancel' : 'Edit Pact'}
            </button>
          </div>

          {isEditingBuddy ? (
            <form onSubmit={handleSaveBuddyConfig} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Buddy Name</label>
                <input
                  type="text"
                  value={buddyNameInput}
                  onChange={(e) => setBuddyNameInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Buddy Contact (Email / Discord)</label>
                <input
                  type="text"
                  value={buddyContactInput}
                  onChange={(e) => setBuddyContactInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Study Pact Goal</label>
                <input
                  type="text"
                  value={buddyGoalInput}
                  onChange={(e) => setBuddyGoalInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
              >
                Save Pact Configuration
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {studyBuddy.buddyName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{studyBuddy.buddyName}</div>
                      <div className="text-[11px] text-slate-400">{studyBuddy.buddyContact}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/10 text-pink-300 border border-pink-500/30">
                    Active Pact
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block mb-0.5">Focus Pact Target:</span>
                  <p className="text-slate-200 italic font-mono text-[11px]">"{studyBuddy.studyPactGoal}"</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Total Pings</span>
                    <span className="font-bold text-white font-mono">{studyBuddy.totalPingsSent} Sent</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Last Check-in</span>
                    <span className="font-bold text-emerald-400 font-mono">{studyBuddy.lastPingDate}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendBuddyPing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Daily Accountability Ping (+10 XP)</span>
              </button>
            </div>
          )}
        </div>
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
