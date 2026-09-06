import React from 'react';
import {
  Sparkles,
  Code2,
  GraduationCap,
  Briefcase,
  Flame,
  Zap,
  Timer,
  ArrowRight,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  Award,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  Clock,
  FileCheck,
  HeartPulse,
  CalendarCheck,
} from 'lucide-react';
import {
  UserProfile,
  OmniCourse,
  DsaTopic,
  Internship,
  ExamPlanner,
  TabType,
  TimetableEvent,
  Assignment,
  WorkloadAssessment,
} from '../../types';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface OverviewDashboardProps {
  profile: UserProfile;
  xpPoints: number;
  dsaList: DsaTopic[];
  omniCourses: OmniCourse[];
  internships: Internship[];
  examPlanners: ExamPlanner[];
  runningCgpa: number;
  onTabChange: (tab: TabType) => void;
  onToggleOmniTask: (courseId: string, dayNumber: number, taskIndex: number) => void;
  timetableEvents?: TimetableEvent[];
  assignments?: Assignment[];
  workload?: WorkloadAssessment;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  profile,
  xpPoints,
  dsaList,
  omniCourses,
  internships,
  examPlanners,
  runningCgpa,
  onTabChange,
  onToggleOmniTask,
  timetableEvents = [],
  assignments = [],
  workload,
}) => {
  const dsaSolved = dsaList.filter((t) => t.completed).length;
  const activeCourse = omniCourses.find((c) => c.isActive) || omniCourses[0];
  const activeAppsCount = internships.filter((i) => i.status !== 'Rejected').length;

  const dayOfWeek = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const todayClasses = timetableEvents.filter((e) => e.dayOfWeek === dayOfWeek);
  const pendingAssignments = assignments.filter((a) => a.status !== 'COMPLETED');
  const urgentAssignments = pendingAssignments.filter((a) => a.priority === 'URGENT' || a.priority === 'HIGH');

  const handleTaskToggle = (courseId: string, dayNumber: number, taskIndex: number, currentDone: boolean) => {
    soundFx.playSuccess();
    onToggleOmniTask(courseId, dayNumber, taskIndex);
    if (!currentDone) {
      toast.success('Omni-Skill Step Mastered!', {
        description: '+25 XP gained. Kept your daily momentum alive!',
      });
    }
  };

  const handleNav = (tab: TabType) => {
    soundFx.playClick();
    onTabChange(tab);
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner (Double-Bezel Shell) */}
      <div className="bezel-shell animate-fade-in-up">
        <div className="bezel-core p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="eyebrow-badge">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>CAREER COMMAND CENTER</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
                Welcome back,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300">
                  {profile.name}
                </span>
                !
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Targeting top software engineering roles at{' '}
                <strong className="text-white font-semibold">
                  {profile.targetCompanies.slice(0, 3).join(', ')}
                </strong>
                . Accelerate your career with synchronized DSA patterns, academic planning, and Omni-Skill AI curricula.
              </p>
            </div>

            {/* Button-in-Button Action CTAs */}
            <div className="flex items-center gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => handleNav('omni-skill')}
                className="btn-island group flex items-center justify-between pl-5 pr-2 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-white/10"
              >
                <span className="mr-3 tracking-wide">Architect Omni-Skill</span>
                <div className="btn-icon-wrapper w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => handleNav('dsa')}
                className="btn-island group flex items-center justify-between pl-5 pr-2 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs border border-white/10 shadow-sm"
              >
                <span className="mr-3 tracking-wide">75+ DSA Sheet</span>
                <div className="btn-icon-wrapper w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-white">
                  <Code2 className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Stats Grid (Double-Bezel Bento) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* DSA Solved */}
        <div
          onClick={() => handleNav('dsa')}
          className="bezel-shell cursor-pointer group pressable animate-fade-in-up stagger-1"
        >
          <div className="bezel-core p-5 space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">DSA Syllabus</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform duration-150">
                <Code2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {dsaSolved} <span className="text-sm font-normal text-slate-500">/ {dsaList.length}</span>
              </div>
              <div className="text-[11px] text-indigo-400 font-mono font-medium flex items-center gap-1.5 mt-1">
                <span>{Math.round((dsaSolved / (dsaList.length || 1)) * 100)}% Pattern Coverage</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Running CGPA */}
        <div
          onClick={() => handleNav('academics')}
          className="bezel-shell cursor-pointer group pressable animate-fade-in-up stagger-2"
        >
          <div className="bezel-core p-5 space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Cumulative CGPA</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform duration-150">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {runningCgpa} <span className="text-sm font-normal text-slate-500">/ 10</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1.5 mt-1">
                <span>Engineering Academics</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Job Pipeline */}
        <div
          onClick={() => handleNav('internships')}
          className="bezel-shell cursor-pointer group pressable animate-fade-in-up stagger-3"
        >
          <div className="bezel-core p-5 space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Active Applications</span>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform duration-150">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {activeAppsCount} <span className="text-sm font-normal text-slate-500">Roles</span>
              </div>
              <div className="text-[11px] text-purple-400 font-mono font-medium flex items-center gap-1.5 mt-1">
                <span>Kanban Pipeline</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Total XP Points */}
        <div
          onClick={() => handleNav('productivity')}
          className="bezel-shell cursor-pointer group pressable animate-fade-in-up stagger-4"
        >
          <div className="bezel-core p-5 space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Gamification HUD</span>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform duration-150">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
                {xpPoints} <span className="text-sm font-normal text-slate-500">XP</span>
              </div>
              <div className="text-[11px] text-amber-400 font-mono font-medium flex items-center gap-1.5 mt-1">
                <span>{profile.streakCount || 7} Day Active Streak</span>
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 inline" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive College & Wellbeing Live Pulse Strip (EduMate Hybrid Engine) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Classes */}
        <div
          onClick={() => handleNav('timetable')}
          className="bezel-shell p-4 glass-subtle hover:border-cyan-500/30 cursor-pointer group pressable"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">Today's Timetable</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {todayClasses.length} Classes
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate font-mono">
            {todayClasses.length > 0
              ? `Next: ${todayClasses[0].title} (${todayClasses[0].startTime})`
              : 'No scheduled lectures today — Study Day'}
          </p>
        </div>

        {/* Pending Assignments */}
        <div
          onClick={() => handleNav('assignments')}
          className="bezel-shell p-4 glass-subtle hover:border-amber-500/30 cursor-pointer group pressable"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">Pending Coursework</span>
            </div>
            {urgentAssignments.length > 0 ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                {urgentAssignments.length} Urgent
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {pendingAssignments.length} Pending
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate font-mono">
            {pendingAssignments.length > 0 ? pendingAssignments[0].title : 'All submissions up to date!'}
          </p>
        </div>

        {/* Live Workload Indicator */}
        <div
          onClick={() => handleNav('wellbeing')}
          className="bezel-shell p-4 glass-subtle hover:border-emerald-500/30 cursor-pointer group pressable"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">Workload & Wellbeing</span>
            </div>
            {workload ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {workload.calculatedLevel} LOAD ({workload.workloadScore})
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300">
                Balanced
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {workload?.headlineMessage || 'Optimal focus cadence active'}
          </p>
        </div>
      </div>

      {/* Grid: Active Omni Course on Left, Upcoming Exams & Quick Links on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Omni-Skill Spotlight */}
        <div className="lg:col-span-7 bezel-shell">
          <div className="bezel-core p-6 space-y-5 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  ACTIVE OMNI-SKILL
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeCourse?.category} Track
                </span>
              </div>
              <button
                onClick={() => handleNav('omni-skill')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group transition-colors pressable"
              >
                <span>View Full Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {activeCourse ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">{activeCourse.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeCourse.summary}</p>
                </div>

                {/* Day 1 Checklist Preview */}
                {activeCourse.days[0] && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                        Day 1: {activeCourse.days[0].title}
                      </span>
                      <span className="text-indigo-400 text-[11px]">{activeCourse.days[0].tasks.length} tasks</span>
                    </div>

                    <div className="space-y-2">
                      {activeCourse.days[0].tasks.slice(0, 3).map((task, tIdx) => {
                        const isDone = activeCourse.days[0].completedTasks?.[tIdx] || false;
                        return (
                          <div
                            key={tIdx}
                            onClick={() => handleTaskToggle(activeCourse.id, 1, tIdx, isDone)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer pressable text-xs ${
                              isDone
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-slate-400'
                                : 'hover:bg-slate-800/80 bg-slate-950/60 border border-white/5 text-slate-200'
                            }`}
                          >
                            <button className="text-emerald-400 mt-0.5 flex-shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-slate-950" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-600" />
                              )}
                            </button>
                            <span className={`flex-1 font-medium ${isDone ? 'line-through text-slate-500' : ''}`}>{task}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">No active course. Generate one now!</div>
            )}
          </div>
        </div>

        {/* Upcoming Exams & AI Mentor Quick Launch */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bezel-shell">
            <div className="bezel-core p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Semester Exam Countdown</span>
                </h3>
                <button
                  onClick={() => handleNav('academics')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold pressable"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-2.5">
                {examPlanners.slice(0, 3).map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white font-display">{exam.subjectName}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{exam.subjectCode} • {exam.examDate}</div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase">
                      {exam.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Mentor Quick Launch Card */}
          <div
            onClick={() => handleNav('ai-mentor')}
            className="bezel-shell cursor-pointer group pressable"
          >
            <div className="bezel-core p-5 bg-gradient-to-r from-purple-950/50 via-slate-950 to-indigo-950/50 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                  AI PLACEMENT MENTOR
                </div>
                <div className="text-sm font-bold text-white font-display">
                  Ask algorithm & interview questions ↗
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-105 group-hover:translate-x-0.5 transition-transform duration-150">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
