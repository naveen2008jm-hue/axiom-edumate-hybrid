import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Code2,
  GraduationCap,
  Briefcase,
  Layers,
  Zap,
  Flame,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Terminal,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  LayoutDashboard,
  CalendarCheck,
  FileCheck,
  HeartPulse,
  Bot,
  Play,
  Award,
} from 'lucide-react';
import { ThemeMode } from '../../types';
import { soundFx } from '../../lib/sound';

interface LandingPageProps {
  onEnterApp: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onStartDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  theme,
  onToggleTheme,
  onStartDemo,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'omni' | 'dsa' | 'college'>('overview');

  const handleLaunch = () => {
    soundFx.playLevelUp();
    onEnterApp();
  };

  const handleDemoLaunch = () => {
    if (onStartDemo) {
      onStartDemo();
    } else {
      handleLaunch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Ambient Radial Mesh Layer */}
      <div className="ambient-mesh" />

      {/* -------------------------------------------------------------------- */}
      {/* STICKY TOP NAVIGATION BAR                                            */}
      {/* -------------------------------------------------------------------- */}
      <header className="sticky top-3 z-50 px-4 sm:px-6 max-w-[1500px] w-full mx-auto">
        <div className="glass-island rounded-2xl px-5 py-3 flex items-center justify-between shadow-2xl">
          {/* Brand Mark */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLaunch}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center ring-1 ring-white/20 text-white font-black text-base shadow-inner">
                <span className="bg-gradient-to-tr from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">⚡</span>
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white font-display flex items-center gap-2">
                AXIOM <span className="text-indigo-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 hidden sm:inline">HYBRID</span>
              </span>
            </div>
          </div>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#pillars" className="hover:text-indigo-400 transition-colors">Four Pillars</a>
            <a href="#preview" className="hover:text-indigo-400 transition-colors">Command Center</a>
            <a href="#workflow" className="hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#architecture" className="hover:text-indigo-400 transition-colors">Architecture</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {onStartDemo && (
              <button
                onClick={handleDemoLaunch}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold pressable"
              >
                <Play className="w-3 h-3 fill-indigo-400" />
                <span>Demo Tour</span>
              </button>
            )}

            <button
              onClick={onToggleTheme}
              title="Toggle Theme Mode"
              className={`p-2 rounded-xl border pressable transition-colors ${
                theme === 'light'
                  ? 'bg-amber-100/90 border-amber-400/60 text-amber-900 shadow-sm'
                  : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={handleLaunch}
              className="btn-island group flex items-center justify-between pl-4 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-white/10 pressable"
            >
              <span className="mr-2.5 tracking-wide">Enter Platform</span>
              <div className="btn-icon-wrapper w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* HERO SECTION                                                         */}
      {/* -------------------------------------------------------------------- */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto text-center space-y-8">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold tracking-wider uppercase animate-fade-in-up shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Universal Omni-Learning & Career Operating System</span>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-display">
            Accelerate from Engineering Student to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Tier-1 Software Architect
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            One cohesive glassmorphic engine unifying <strong>75+ DSA pattern tracking</strong>, <strong>AI-synthesized mastery curriculums</strong>, <strong>adaptive timetable clash detection</strong>, and career placement pipelines.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-600/35 border border-white/20 pressable flex items-center justify-center gap-3 group"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {onStartDemo && (
            <button
              onClick={handleDemoLaunch}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-200 border border-indigo-500/40 text-sm font-bold pressable flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40"
            >
              <Play className="w-4 h-4 fill-indigo-400 text-indigo-400" />
              <span>Watch Automated Tour (13 Steps)</span>
            </button>
          )}

          <a
            href="#pillars"
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 text-sm font-bold pressable flex items-center justify-center gap-2"
          >
            <span>Explore 4 Core Pillars</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Live Key Stats Bar (Double-Bezel) */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="bezel-shell">
            <div className="bezel-core p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
              <div className="space-y-0.5 pt-2 md:pt-0">
                <div className="text-2xl sm:text-3xl font-black font-mono text-white">75+</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">DSA Core Patterns</div>
              </div>
              <div className="space-y-0.5 pt-2 md:pt-0">
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">100%</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Clash-Free Timetable</div>
              </div>
              <div className="space-y-0.5 pt-2 md:pt-0">
                <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">Gemini 2.5</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">AI Skill Architect</div>
              </div>
              <div className="space-y-0.5 pt-2 md:pt-0">
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">Dual Theme</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">CRT & Liquid Glass</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* PRODUCT SHOWCASE BROWSER MOCKUP                                      */}
      {/* -------------------------------------------------------------------- */}
      <section id="preview" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="eyebrow-badge">
              <LayoutDashboard className="w-3 h-3 text-indigo-400" />
              <span>LIVE PLATFORM INTERFACE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              Designed for Flow, Speed & Cognitive Focus
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Switch between views to explore how Axiom orchestrates your daily academic and career sprints.
            </p>
          </div>

          {/* Browser Frame Shell */}
          <div className="bezel-shell">
            <div className="bezel-core p-4 sm:p-6 space-y-4">
              {/* Browser Window Chrome */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2 truncate">
                    axiom-hybrid://command-center.local
                  </span>
                </div>

                {/* View Switcher Tabs inside mockup */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/5 text-xs font-semibold overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActivePreviewTab('overview')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activePreviewTab === 'overview'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Command Center
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('omni')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activePreviewTab === 'omni'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Omni-Skill AI
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('dsa')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activePreviewTab === 'dsa'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    75+ DSA Sheet
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('college')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activePreviewTab === 'college'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    College Hub
                  </button>
                </div>
              </div>

              {/* Dynamic Preview Content */}
              <div className="rounded-2xl bg-slate-950/80 p-6 border border-white/5 min-h-[360px] flex flex-col justify-between">
                {activePreviewTab === 'overview' && (
                  <div className="space-y-5 animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/20">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">COMMAND CENTER PULSE</span>
                        <h4 className="text-lg font-bold text-white font-display">Targeting SDE Roles at Google, Microsoft, Atlassian</h4>
                        <p className="text-xs text-slate-300">Synchronized Daily Agenda • 7-Day Active Streak • 420 XP Earned</p>
                      </div>
                      <button onClick={handleLaunch} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 pressable flex-shrink-0">
                        <span>Open Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">DSA Pattern Coverage</div>
                        <div className="text-2xl font-bold font-mono text-indigo-300">42 / 75 Solved</div>
                        <div className="text-[11px] text-emerald-400 font-mono">56% Completed</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Today's Schedule</div>
                        <div className="text-2xl font-bold font-mono text-white">4 Classes</div>
                        <div className="text-[11px] text-cyan-300 font-mono">Next: DAA (09:00 AM)</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Cognitive Workload</div>
                        <div className="text-2xl font-bold font-mono text-emerald-400">BALANCED</div>
                        <div className="text-[11px] text-slate-400 font-mono">Optimal focus cadence</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'omni' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">AI CURRICULUM ARCHITECT</span>
                        <h4 className="text-lg font-bold text-white font-display">Mastering Distributed Consensus (Raft & Paxos)</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-mono text-xs font-bold">Conceptual Track</span>
                    </div>
                    <p className="text-xs text-slate-300">Deconstructed from first principles into term timeouts, log replication RPCs, and state machine transitions.</p>
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300">Day 1: The Consensus Problem & Log Replication</span>
                      <span className="text-indigo-400 font-bold font-mono">+25 XP / Day</span>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'dsa' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">CURATED 75+ PATTERNS</span>
                        <h4 className="text-lg font-bold text-white font-display">Algorithm Mastery Track</h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400">Syncs with LeetCode API</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Sliding Window Maximum (Deque O(n))</span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-mono text-[10px] font-bold">HARD</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Topological Sort BFS (Kahn's Algorithm)</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono text-[10px] font-bold">MEDIUM</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'college' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">ADAPTIVE COLLEGE HUB</span>
                        <h4 className="text-lg font-bold text-white font-display">Timetable & Assignment Kanban</h4>
                      </div>
                      <span className="text-xs font-mono text-emerald-400">0 Overlaps Detected</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                        <span className="text-indigo-300 font-bold">Design & Analysis of Algorithms</span>
                        <p className="text-[11px] text-slate-400">09:00 - 10:30 AM • Hall 302</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                        <span className="text-amber-300 font-bold">Producer-Consumer Thread Pool</span>
                        <p className="text-[11px] text-rose-400 font-mono">Due in 2 Days (High Priority)</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-white/5 text-[11px] text-slate-400 font-mono">
                  <span>⚡ Powered by Google Gemini 2.5</span>
                  <button onClick={handleLaunch} className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                    <span>Launch Full Interactive View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 4 CORE PILLARS BENTO SECTION                                         */}
      {/* -------------------------------------------------------------------- */}
      <section id="pillars" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="eyebrow-badge">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span>FOUR CORE PILLARS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Built for the Complete Engineering Student Life-Cycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            From daily 9 AM lectures to cracking tier-1 software engineering interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Omni-Skill */}
          <div className="bezel-shell group hover:scale-[1.01] transition-transform duration-200">
            <div className="bezel-core p-7 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">1. Omni-Skill AI Curriculum Architect</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Deconstruct any human discipline into step-by-step masteries. Whether athletic mechanics (Butterfly Stroke, Muscle-up) or distributed engineering (Raft Consensus, Redis Engine), generate actionable day-by-day drills with generative technical diagrams.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold">
                <span>Multi-Day Progression • Visual Schematics • First-Principles</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Adaptive College Hub */}
          <div className="bezel-shell group hover:scale-[1.01] transition-transform duration-200">
            <div className="bezel-core p-7 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">2. Adaptive College Hub & Wellbeing</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Eliminate scheduling friction with automatic lecture conflict detection, Kanban coursework tracking with priority countdowns, 3D active recall flashcards, and an intelligent daily workload calculator that protects focus.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                <span>Conflict Resolution • Priority Kanban • Active Recall 3D</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Placement & Career Hub */}
          <div className="bezel-shell group hover:scale-[1.01] transition-transform duration-200">
            <div className="bezel-core p-7 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">3. 75+ Pattern Placement Engine</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Master interview algorithms categorized by core patterns tested at Google, Microsoft, and Atlassian. Synchronize live LeetCode stats, track job applications across interview rounds, build STAR stories, and catalog technical mistakes.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-purple-400 font-bold">
                <span>LeetCode Sync • STAR Stories • Interview Pipelines</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Gamification System */}
          <div className="bezel-shell group hover:scale-[1.01] transition-transform duration-200">
            <div className="bezel-core p-7 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">4. Gamified Flow & Retro 8-Bit Engine</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Maintain daily momentum with active streak multipliers, instant XP rewards for completed drills, customizable sound effect synthesizer, and a vintage 8-bit CRT scanline aesthetic that transforms studying into an engaging flow state.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                <span>Streak Multipliers • XP Leveling • 8-Bit Audio Synth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* WORKFLOW / HOW IT WORKS                                              */}
      {/* -------------------------------------------------------------------- */}
      <section id="workflow" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="eyebrow-badge">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span>SEAMLESS WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            How Axiom Powers Your Day
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bezel-shell">
            <div className="bezel-core p-6 space-y-3 h-full">
              <div className="text-3xl font-black font-mono text-indigo-400">01</div>
              <h4 className="text-base font-bold text-white font-display">Set Target Companies & Academics</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Define your graduation year, college timetable, target tier-1 tech firms, and semester examination dates in under 60 seconds.
              </p>
            </div>
          </div>

          <div className="bezel-shell">
            <div className="bezel-core p-6 space-y-3 h-full">
              <div className="text-3xl font-black font-mono text-purple-400">02</div>
              <h4 className="text-base font-bold text-white font-display">AI Synthesizes Your Daily Cadence</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Axiom resolves lecture overlaps, prepares 3D flashcards, and sequences high-probability algorithmic patterns into your daily agenda.
              </p>
            </div>
          </div>

          <div className="bezel-shell">
            <div className="bezel-core p-6 space-y-3 h-full">
              <div className="text-3xl font-black font-mono text-emerald-400">03</div>
              <h4 className="text-base font-bold text-white font-display">Execute & Accelerate</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Earn XP, track streak multipliers, rehearse with the AI Placement Mentor, and convert dream job applications into offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* FINAL HIGH-CONVERTING CALL TO ACTION                                 */}
      {/* -------------------------------------------------------------------- */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] w-full mx-auto">
        <div className="bezel-shell">
          <div className="bezel-core p-8 sm:p-12 text-center space-y-6 relative overflow-hidden bg-gradient-to-br from-indigo-950/60 via-slate-950 to-purple-950/50">
            <div className="eyebrow-badge">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>READY TO ELEVATE YOUR CAREER?</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display max-w-2xl mx-auto">
              Master Your Engineering Journey with Axiom
            </h2>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join students accelerating their academic and software placement readiness.
            </p>
            <div className="pt-2">
              <button
                onClick={handleLaunch}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm sm:text-base shadow-2xl shadow-indigo-600/40 border border-white/20 pressable inline-flex items-center gap-3 group"
              >
                <span>Enter Axiom Command Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* FOOTER                                                               */}
      {/* -------------------------------------------------------------------- */}
      <footer id="architecture" className="relative z-10 border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 font-bold text-sm">
              ⚡
            </div>
            <span className="text-xs font-bold text-white font-display">
              AXIOM EDUMATE HYBRID
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-6 text-xs text-slate-400 font-medium">
            <button onClick={handleLaunch} className="hover:text-indigo-300 transition-colors">Command Center</button>
            <button onClick={handleLaunch} className="hover:text-indigo-300 transition-colors">Omni-Skill</button>
            <button onClick={handleLaunch} className="hover:text-indigo-300 transition-colors">75+ DSA Sheet</button>
            <button onClick={handleLaunch} className="hover:text-indigo-300 transition-colors">College Hub</button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Powered by Google Gemini 2.5 • React 19 • Vite
          </div>
        </div>
      </footer>
    </div>
  );
};
