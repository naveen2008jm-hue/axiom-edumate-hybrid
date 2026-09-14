import React, { useState } from 'react';
import {
  X,
  User,
  Building2,
  GraduationCap,
  Github,
  Code,
  Check,
  Sparkles,
  Layers,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { UserProfile, Track } from '../../types';
import { ALL_TRACKS, TRACK_DEFINITIONS } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
  onOpenTrackOnboarding?: () => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onOpenTrackOnboarding,
  onLogout,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [companiesInput, setCompaniesInput] = useState(profile.targetCompanies.join(', '));
  const [selectedTrack, setSelectedTrack] = useState<Track>(profile.track || 'engineering');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const companies = companiesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      ...formData,
      track: selectedTrack,
      targetCompanies: companies,
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const currentTrackMeta = TRACK_DEFINITIONS[selectedTrack] || TRACK_DEFINITIONS.engineering;
  const TrackIcon = currentTrackMeta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Student Profile & Track Settings</h2>
              <p className="text-xs text-slate-400">Configure your discipline vertical & career goals</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition pressable">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Track Selection Section */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Discipline Track</span>
              </div>
              {onOpenTrackOnboarding && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTrackOnboarding();
                  }}
                  className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold underline"
                >
                  Full Track Guide ↗
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALL_TRACKS.map((t) => {
                const isChosen = selectedTrack === t.id;
                const IconComp = t.icon;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedTrack(t.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition ${
                      isChosen
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <IconComp className="w-3.5 h-3.5" />
                      <span className={`text-[8px] font-mono px-1 py-0.2 rounded uppercase ${isChosen ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {t.badge.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold truncate block w-full">{t.shortLabel}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Selected: <strong className="text-white">{currentTrackMeta.label}</strong> — {currentTrackMeta.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">College / University / Institution</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Branch / Degree / Specialization</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">GitHub / Research Repository</label>
              <div className="relative">
                <Github className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">LeetCode / Question Bank Username</label>
              <div className="relative">
                <Code className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={formData.leetcodeUsername}
                  onChange={(e) => setFormData({ ...formData, leetcodeUsername: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Dream Companies / Exam Goals (comma separated)</label>
            <input
              type="text"
              value={companiesInput}
              onChange={(e) => setCompaniesInput(e.target.value)}
              placeholder="e.g. Google, UPSC CSE, AIIMS, Trilegal, KPMG, Microsoft"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bio / Professional Elevator Pitch</label>
            <textarea
              rows={2}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            {onLogout ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition pressable"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Switch User</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition pressable"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition pressable"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
