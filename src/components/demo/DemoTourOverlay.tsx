import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Sparkles,
  Radio,
  Gauge,
  Video,
} from 'lucide-react';
import { DemoStep } from './demoSteps';

interface DemoTourOverlayProps {
  currentStep: DemoStep;
  totalSteps: number;
  stepIndex: number;
  isPlaying: boolean;
  stepProgressPercent: number; // 0 to 100 for current step
  speedMultiplier: number;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSelectSpeed: (speed: number) => void;
  onExitDemo: () => void;
}

export const DemoTourOverlay: React.FC<DemoTourOverlayProps> = ({
  currentStep,
  totalSteps,
  stepIndex,
  isPlaying,
  stepProgressPercent,
  speedMultiplier,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onSelectSpeed,
  onExitDemo,
}) => {
  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrevStep();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onExitDemo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onNextStep, onPrevStep, onExitDemo]);

  const totalProgress = Math.round(((stepIndex + stepProgressPercent / 100) / totalSteps) * 100);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between select-none">
      {/* ------------------------------------------------------------- */}
      {/* TOP BROADCAST HUD: Progress Bar & Recording Controls         */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 sm:p-6 w-full max-w-[1600px] mx-auto pointer-events-auto">
        <div className="glass-island backdrop-blur-2xl bg-slate-950/85 border border-white/15 rounded-2xl p-3 sm:px-5 sm:py-3 shadow-2xl shadow-black/80 flex items-center justify-between gap-4 transition-all">
          {/* Left: Recording status & step badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_#f43f5e]" />
              <span>REC 1080p</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                STEP {stepIndex + 1} OF {totalSteps}
              </span>
              <span className="text-xs text-slate-300 font-semibold hidden md:inline truncate max-w-[200px]">
                {currentStep.title}
              </span>
            </div>
          </div>

          {/* Center: Live Tour Progress Bar */}
          <div className="hidden sm:flex flex-col flex-1 max-w-xs md:max-w-md mx-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>DEMO TIMELINE</span>
              <span className="text-indigo-300 font-bold">{totalProgress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 relative">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-linear relative"
                style={{ width: `${totalProgress}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
              </div>
            </div>
          </div>

          {/* Right: Media Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-900/90 rounded-xl p-0.5 border border-white/10 text-[11px] font-mono font-bold">
              {[0.75, 1, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSelectSpeed(speed)}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    speedMultiplier === speed
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Play at ${speed}x speed`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Prev Step */}
            <button
              onClick={onPrevStep}
              title="Previous Step (Left Arrow)"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors pressable"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause Demo (Spacebar)' : 'Play Demo (Spacebar)'}
              className={`p-2 rounded-xl border font-bold transition-all pressable ${
                isPlaying
                  ? 'bg-indigo-600 text-white border-indigo-500/50 shadow-md shadow-indigo-600/30'
                  : 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            {/* Next Step */}
            <button
              onClick={onNextStep}
              title="Next Step (Right Arrow)"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors pressable"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Exit Demo */}
            <button
              onClick={onExitDemo}
              title="Exit Demo Tour (Esc)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-white border border-rose-500/30 transition-colors pressable text-xs font-semibold ml-1"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BROADCAST LOWER-THIRD CAPTION BANNER                         */}
      {/* Baked-in TV-grade overlay for screen recordings              */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1400px] mx-auto pointer-events-auto">
        <div
          key={currentStep.id}
          className="demo-lower-third bezel-shell relative overflow-hidden backdrop-blur-3xl bg-slate-950/90 border border-indigo-500/35 rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] animate-fade-in-up transition-all"
        >
          {/* Subtle Ambient Gradient Arc */}
          <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-500/15 rounded-full pointer-events-none blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              {/* Category Eyebrow Pill */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  {currentStep.category}
                </span>

                {currentStep.subBadge && (
                  <span className="text-[10px] font-mono font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-slate-900/80 border border-white/10 hidden sm:inline-block">
                    {currentStep.subBadge}
                  </span>
                )}
              </div>

              {/* Broadcast Headline */}
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-sm font-display">
                {currentStep.title}
              </h2>

              {/* Descriptive Value-Proposition Caption */}
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed drop-shadow">
                {currentStep.description}
              </p>
            </div>

            {/* Right: Micro Step Indicator and Timer Dial */}
            <div className="flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6 gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Step</span>
                <span className="text-base sm:text-xl font-black font-mono text-white bg-slate-900/90 border border-white/10 px-2.5 py-1 rounded-xl shadow-inner">
                  {stepIndex + 1}
                  <span className="text-xs font-normal text-slate-400">/{totalSteps}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="bg-indigo-400 h-full transition-all duration-100 ease-linear"
                    style={{ width: `${stepProgressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {Math.ceil(((100 - stepProgressPercent) / 100) * (5.5 / speedMultiplier))}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
