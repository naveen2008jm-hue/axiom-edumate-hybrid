import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  Calendar,
  Clock,
  Flame,
  Plus,
} from 'lucide-react';
import { StudySession } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ProductivityDashboardProps {
  studySessions: StudySession[];
  onAddSession: (s: Omit<StudySession, 'id'>) => void;
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];

export const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({
  studySessions,
  onAddSession,
}) => {
  // Pomodoro timer state
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [selectedCategory, setSelectedCategory] = useState('DSA');
  const [topicName, setTopicName] = useState('Pattern Drills');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            setIsActive(false);
            if (mode === 'focus') {
              onAddSession({
                category: selectedCategory,
                topicName,
                durationMinutes: 25,
                sessionDate: new Date().toISOString().split('T')[0],
              });
              setMode('break');
              setMinutes(5);
            } else {
              setMode('focus');
              setMinutes(25);
            }
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, selectedCategory, topicName]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  // Aggregated Category Stats for Recharts
  const categoryMap: Record<string, number> = {};
  studySessions.forEach((s) => {
    categoryMap[s.category] = (categoryMap[s.category] || 0) + s.durationMinutes;
  });

  const chartData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    minutes: categoryMap[cat],
    hours: Number((categoryMap[cat] / 60).toFixed(1)),
  }));

  const totalMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="eyebrow-badge">
              <Timer className="w-3.5 h-3.5 text-indigo-400" />
              <span>DEEP WORK & FOCUS ACCELERATOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Pomodoro Focus Timer & Analytics</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Log focused preparation sprints, earn XP multipliers, and analyze daily time distribution.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-full border border-white/10 font-mono text-xs shadow-sm">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400">Total Focus Logged:</span>
            <span className="text-emerald-400 font-extrabold text-sm">{totalHours}h</span>
          </div>
        </div>
      </div>

      {/* Grid: Timer on Left, Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pomodoro Timer (Double-Bezel) */}
        <div className="lg:col-span-5 bezel-shell">
          <div className="bezel-core p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-6 h-full bg-gradient-to-br from-indigo-950/30 via-slate-950 to-purple-950/20">
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => {
                  setMode('focus');
                  setMinutes(25);
                  setSeconds(0);
                  setIsActive(false);
                }}
                className={`px-5 py-1.5 rounded-full transition duration-200 ${
                  mode === 'focus'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => {
                  setMode('break');
                  setMinutes(5);
                  setSeconds(0);
                  setIsActive(false);
                }}
                className={`px-5 py-1.5 rounded-full transition duration-200 ${
                  mode === 'break'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Break (5m)
              </button>
            </div>

            {/* Clock Display */}
            <div className="relative">
              <div className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tighter drop-shadow-lg">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mt-1 font-bold">
                {mode === 'focus' ? '🎯 Intense Focus Sprint' : '☕ Relax & Recharge'}
              </div>
            </div>

            {/* Category selection */}
            <div className="w-full space-y-2 max-w-sm">
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="DSA">DSA</option>
                  <option value="Aptitude">Aptitude</option>
                  <option value="Core CS">Core CS</option>
                  <option value="Projects">Projects</option>
                  <option value="Omni-Skill">Omni-Skill</option>
                  <option value="Academics">Academics</option>
                </select>

                <input
                  type="text"
                  placeholder="Task or subject description..."
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Action Buttons with Button-in-Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimer}
                className={`btn-island group flex items-center justify-between pl-6 pr-2 py-2.5 rounded-full font-bold text-xs text-white shadow-xl transition-all duration-300 border border-white/10 ${
                  isActive
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
                }`}
              >
                <span className="mr-3 tracking-wide">{isActive ? 'Pause Focus' : 'Start Focus (+10 XP)'}</span>
                <div className="btn-icon-wrapper w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </div>
              </button>

              <button
                onClick={resetTimer}
                className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition duration-200"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics & History (Double-Bezel) */}
        <div className="lg:col-span-7 bezel-shell">
          <div className="bezel-core p-6 space-y-4 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-base font-bold text-white mb-3 font-display">Time Allocation by Subject</h3>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} unit="m" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#080c18',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Sessions List */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Recent Focus Blocks:</div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {studySessions.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                        {s.category}
                      </span>
                      <span className="text-slate-200 truncate font-medium">{s.topicName || 'Practice'}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] flex-shrink-0">
                      {s.durationMinutes} mins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
