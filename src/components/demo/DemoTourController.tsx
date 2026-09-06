import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Sparkles,
  LayoutDashboard,
  Sun,
  Moon,
  Bot,
  CalendarCheck,
  FileCheck,
  Layers,
  HeartPulse,
  Code2,
  Briefcase,
  Timer,
  Zap,
  Terminal,
  Volume2,
  Clock,
  Compass,
  CheckCircle2,
  Flame,
  Award,
} from 'lucide-react';
import { TabType, ThemeMode } from '../../types';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

export interface DemoStep {
  id: number;
  tab: TabType;
  title: string;
  badge: string;
  icon: React.ElementType;
  narration: string;
  durationSeconds: number;
  action?: (helpers: {
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    toggleRetroMode: () => void;
    awardXP: (amount: number, reason?: string) => void;
    soundFx: typeof soundFx;
  }) => (() => void) | void;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    tab: 'overview',
    title: 'Command Center & Live Pulse',
    badge: 'Overview HUD',
    icon: LayoutDashboard,
    narration:
      'The Command Center unifies your academic CGPA, active streak multipliers, 75+ DSA progress, and daily workload index into one glassmorphic dashboard.',
    durationSeconds: 6,
    action: ({ awardXP, soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 2,
    tab: 'overview',
    title: 'Dual Theme Architecture (Obsidian & Paper)',
    badge: 'Design System',
    icon: Sun,
    narration:
      'Seamlessly switch between Liquid Obsidian Dark Mode with glowing neon accents and Warm Artisan Paper Light Mode with embossed double-bezel depth.',
    durationSeconds: 6,
    action: ({ setTheme, soundFx }) => {
      // Switch to light mode after 1.2s, then switch back to dark mode before advancing
      const t1 = setTimeout(() => {
        setTheme('light');
        soundFx.playClick();
      }, 1200);

      const t2 = setTimeout(() => {
        setTheme('dark');
        soundFx.playClick();
      }, 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        setTheme('dark');
      };
    },
  },
  {
    id: 3,
    tab: 'omni-skill',
    title: 'Omni-Skill AI Curriculum Architect',
    badge: 'Gemini 2.5 Engine',
    icon: Sparkles,
    narration:
      'Deconstruct any human discipline—from distributed consensus protocols to athletic swim mechanics—into progressive daily drills with generative technical diagrams.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 4,
    tab: 'timetable',
    title: 'College Timetable & Conflict Detector',
    badge: 'Clash Resolution',
    icon: Clock,
    narration:
      'Automated timetable scheduling detects overlaps between lectures, labs, and tutorials in real time with instant conflict warning alerts.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: '5' as any,
    tab: 'assignments',
    title: 'Coursework & Assignments Kanban',
    badge: 'Priority Board',
    icon: FileCheck,
    narration:
      'Track engineering assignments across Kanban stages with automated urgency tags, countdown timers, and submission status verification.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 6,
    tab: 'flashcards',
    title: '3D Active Recall Flashcards',
    badge: 'Spaced Repetition',
    icon: Layers,
    narration:
      'Master core CS definitions and OS algorithms through tactile 3D interactive flashcards with mastery tracking and spaced repetition drills.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 7,
    tab: 'wellbeing',
    title: 'Wellbeing & Workload Adaptation Engine',
    badge: 'Cognitive Health',
    icon: HeartPulse,
    narration:
      'An intelligent workload index assesses daily commitments and self-reported energy to dynamically recommend Pomodoro splits and prevent student burnout.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 8,
    tab: 'my-day',
    title: 'My Day: AI-Synthesized Daily Agenda',
    badge: 'Time Blocking',
    icon: CalendarCheck,
    narration:
      'A chronological, hour-by-hour focus schedule unifying timetable lectures, DSA problem sprints, and rest breaks into an executable daily plan.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 9,
    tab: 'dsa',
    title: '75+ Core DSA Pattern Tracker',
    badge: 'Interview Sprints',
    icon: Code2,
    narration:
      'Curated algorithm patterns tested at Google, Microsoft, and Atlassian with difficulty tags, LeetCode synchronization, and revision tracking.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 10,
    tab: 'ai-mentor',
    title: 'AI Placement & Technical Interview Mentor',
    badge: 'Context-Aware AI',
    icon: Bot,
    narration:
      '24/7 technical coach powered by Gemini with full markdown formatting, system design guidance, and real-time STAR story resume feedback.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 11,
    tab: 'internships',
    title: 'Job Application Pipeline & STAR Portfolio',
    badge: 'Career Engine',
    icon: Briefcase,
    narration:
      'Manage company applications across interview stages, track online assessment dates, and catalog technical projects using the STAR framework.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 12,
    tab: 'productivity',
    title: 'Focus Pomodoro & Productivity Analytics',
    badge: 'Focus Sprint',
    icon: Timer,
    narration:
      'Deep work Pomodoro timer with ambient focus sounds, session logging, and weekly study hour distribution charts.',
    durationSeconds: 6,
    action: ({ soundFx }) => {
      soundFx.playBlip();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 13,
    tab: 'overview',
    title: 'Gamification Flow & 8-Bit Retro CRT Mode',
    badge: 'Momentum Engine',
    icon: Terminal,
    narration:
      'Keep learning addictive with XP rewards, streak multipliers, 8-bit sound synthesizers, and a vintage CRT terminal scanline toggle.',
    durationSeconds: 7,
    action: ({ awardXP, toggleRetroMode, soundFx }) => {
      soundFx.playLevelUp();
      awardXP(100, 'Demo Tour Complete!');
      toggleRetroMode();

      const t = setTimeout(() => {
        toggleRetroMode();
      }, 3500);

      return () => {
        clearTimeout(t);
      };
    },
  },
];

interface DemoTourControllerProps {
  isActive: boolean;
  onClose: () => void;
  onTabChange: (tab: TabType) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  retroMode: boolean;
  toggleRetroMode: () => void;
  awardXP: (amount: number, reason?: string) => void;
}

export const DemoTourController: React.FC<DemoTourControllerProps> = ({
  isActive,
  onClose,
  onTabChange,
  theme,
  setTheme,
  toggleTheme,
  retroMode,
  toggleRetroMode,
  awardXP,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 1.5 | 0.75>(1);
  const [progressPercent, setProgressPercent] = useState(0);

  const cleanupRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentStep = DEMO_STEPS[currentStepIndex];
  const stepDurationMs = (currentStep.durationSeconds * 1000) / speedMultiplier;

  // Execute Step Action & Switch Tab
  useEffect(() => {
    if (!isActive) return;

    // Cleanup previous action if needed
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Switch to step tab
    onTabChange(currentStep.tab);

    // Run action
    if (currentStep.action) {
      const cleanup = currentStep.action({
        setTheme,
        toggleTheme,
        toggleRetroMode,
        awardXP,
        soundFx,
      });
      if (typeof cleanup === 'function') {
        cleanupRef.current = cleanup;
      }
    }

    // Reset progress
    setProgressPercent(0);
    startTimeRef.current = Date.now();
  }, [currentStepIndex, isActive]);

  // Handle Progress & Auto-Advance
  useEffect(() => {
    if (!isActive || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 50; // update progress every 50ms
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / stepDurationMs) * 100, 100);
      setProgressPercent(progress);

      if (elapsed >= stepDurationMs) {
        if (currentStepIndex < DEMO_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          // Completed all steps
          toast.success('🎬 Demo Tour Completed!', {
            description: 'You have explored all 13 core pillars of Axiom EduMate Hybrid.',
          });
          soundFx.playLevelUp();
          onClose();
        }
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPlaying, currentStepIndex, stepDurationMs]);

  // Handle Exit Cleanup
  const handleExit = () => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    soundFx.playClick();
    onClose();
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleExit();
    }
  };

  const togglePlayPause = () => {
    soundFx.playClick();
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      startTimeRef.current = Date.now() - (progressPercent / 100) * stepDurationMs;
      setIsPlaying(true);
    }
  };

  const cycleSpeed = () => {
    soundFx.playClick();
    if (speedMultiplier === 1) setSpeedMultiplier(1.5);
    else if (speedMultiplier === 1.5) setSpeedMultiplier(0.75);
    else setSpeedMultiplier(1);
  };

  if (!isActive) return null;

  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 px-4 max-w-5xl mx-auto pointer-events-auto animate-fade-in-up">
      {/* Lower-Third Broadcast Style Shell */}
      <div className="relative rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/80 p-5 md:p-6 overflow-hidden ring-1 ring-white/15">
        {/* Animated Background Mesh Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Top Floating Progress Track */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-75 ease-linear shadow-sm shadow-indigo-400/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          {/* Left: Step Info & Live Subtitle Captions */}
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-600/30 border border-white/20">
              <Icon className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-extrabold tracking-wider uppercase">
                  STEP {String(currentStepIndex + 1).padStart(2, '0')} / {String(DEMO_STEPS.length).padStart(2, '0')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 font-mono text-[10px] font-semibold">
                  {currentStep.badge}
                </span>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  Tab: <strong className="text-white font-bold">{currentStep.tab}</strong>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white tracking-tight font-display flex items-center gap-2">
                <span>{currentStep.title}</span>
              </h3>

              {/* Broadcast Voiceover Captions (baked into UI for video recording) */}
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed bg-slate-900/70 p-2.5 rounded-xl border border-white/5 shadow-inner">
                🎙️ <span className="italic">"{currentStep.narration}"</span>
              </p>
            </div>
          </div>

          {/* Right: Media & Tour HUD Controls */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
            {/* Step Pills Navigation on Desktop */}
            <div className="hidden lg:flex items-center gap-1 mr-2">
              {DEMO_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentStepIndex(idx);
                  }}
                  title={`Jump to Step ${idx + 1}: ${step.title}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-6 bg-indigo-400 shadow-sm shadow-indigo-400'
                      : idx < currentStepIndex
                      ? 'bg-indigo-600/60'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 hover:text-white border border-white/10 pressable"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 border border-white/20 pressable"
              title={isPlaying ? 'Pause Demo' : 'Resume Demo'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 pressable"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Speed Toggle */}
            <button
              onClick={cycleSpeed}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-bold pressable"
              title="Toggle Auto-Advance Speed"
            >
              {speedMultiplier}x
            </button>

            {/* Exit Demo Button */}
            <button
              onClick={handleExit}
              className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 pressable ml-1"
              title="Exit Demo Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
