import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Track, UserProfile } from '../../types';
import { ALL_TRACKS, TRACK_DEFINITIONS } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';
import confetti from 'canvas-confetti';

interface TrackOnboardingModalProps {
  isOpen: boolean;
  currentTrack?: Track;
  onSelectTrack: (track: Track) => void;
  onClose?: () => void;
  isChangeMode?: boolean;
}

export const TrackOnboardingModal: React.FC<TrackOnboardingModalProps> = ({
  isOpen,
  currentTrack = 'engineering',
  onSelectTrack,
  onClose,
  isChangeMode = false,
}) => {
  const [selected, setSelected] = useState<Track>(currentTrack);

  if (!isOpen) return null;

  const handleConfirm = () => {
    soundFx.playLevelUp();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSelectTrack(selected);
    const meta = TRACK_DEFINITIONS[selected];
    toast.success(`Discipline Vertical Activated: ${meta.label}`, {
      description: `Curriculum sheets, AI exam mentor & opportunities tuned for ${meta.shortLabel}. +50 XP awarded!`,
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bezel-shell">
        <div className="bezel-core p-6 sm:p-8 space-y-6 bg-slate-950/95 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>SWAYAM-INSPIRED MULTI-DISCIPLINE ARCHITECTURE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              {isChangeMode ? 'Switch Your Discipline Vertical' : 'What are you studying / preparing for?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Select your primary track. Axiom customizes your <strong>Skill Practice Sheets</strong>, <strong>AI Exam & Career Mentor</strong>, and <strong>Opportunities Pipeline</strong> while keeping all gamification (XP, timetable, flashcards) identical.
            </p>
          </div>

          {/* 7 Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {ALL_TRACKS.map((t) => {
              const Icon = t.icon;
              const isChosen = selected === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelected(t.id);
                  }}
                  className={`relative p-4 rounded-2xl cursor-pointer pressable border transition-all duration-200 flex flex-col justify-between ${
                    isChosen
                      ? 'bg-slate-900 border-indigo-500/70 shadow-xl shadow-indigo-600/20 ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Badge + Check */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${t.bgSubtle} ${t.color} border ${t.borderAccent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5 font-bold">
                          {t.badge}
                        </span>
                        {isChosen ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-500/20" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-700" />
                        )}
                      </div>
                    </div>

                    {/* Label & Description */}
                    <div>
                      <h4 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                        {t.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  {/* Target Exams Preview */}
                  <div className="pt-3 mt-3 border-t border-white/5 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span className="truncate">🎯 {t.targetExamsOrRoles.split(',')[0]}</span>
                    <span className="text-indigo-400 font-bold">{t.shortLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-slate-400 font-mono text-center sm:text-left">
              🔒 You can change your track anytime from <strong className="text-slate-200">Settings → Profile</strong>.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isChangeMode && onClose && (
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition pressable"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleConfirm}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/35 border border-white/20 pressable flex items-center justify-center gap-2"
              >
                <span>{isChangeMode ? 'Confirm & Switch Track' : 'Launch My Customized Track'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
