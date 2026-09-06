import React from 'react';
import {
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Database,
  Download,
  Terminal,
  Activity,
  Sun,
  Moon,
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../../types';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface NavbarProps {
  profile: UserProfile;
  xpPoints: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  retroMode: boolean;
  onToggleRetro: () => void;
  onOpenProfile: () => void;
  onOpenSupabase: () => void;
  onExportData: () => void;
  onResetData: () => void;
  onNavigateLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  xpPoints,
  theme,
  onToggleTheme,
  retroMode,
  onToggleRetro,
  onOpenProfile,
  onOpenSupabase,
  onExportData,
  onNavigateLanding,
}) => {
  const [soundEnabled, setSoundEnabled] = React.useState(soundFx.enabled);

  const toggleSound = () => {
    soundFx.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundFx.playClick();
      toast.success('8-Bit Sound Effects Enabled', { description: 'Interactive audio feedback is now active.' });
    } else {
      toast.info('Audio Muted', { description: 'Sound effects turned off.' });
    }
  };

  const handleRetroToggle = () => {
    onToggleRetro();
    if (!retroMode) {
      toast('CRT 8-Bit Retro Mode Activated', { description: 'Monochrome scanlines and vintage terminal styling applied.' });
    } else {
      toast('Modern Liquid Glass Mode Restored');
    }
  };

  const handleThemeToggle = () => {
    onToggleTheme();
    if (theme === 'dark') {
      toast.info('Warm Artisan Paper Light Mode', { description: 'Embossed double-bezel depth and high-contrast typography active.' });
    } else {
      toast.info('Liquid Obsidian Dark Mode', { description: 'Deep neon contrast and glow depth active.' });
    }
  };

  return (
    <header className="sticky top-3 z-30 px-4 sm:px-6 max-w-[1600px] w-full mx-auto">
      <div className="glass-island rounded-2xl px-5 py-3 flex items-center justify-between transition-transform duration-200">
        {/* Left: Machined Brand Mark */}
        <div
          className={`flex items-center gap-3.5 ${onNavigateLanding ? 'cursor-pointer group' : ''}`}
          onClick={onNavigateLanding}
          title={onNavigateLanding ? 'Back to Overview Landing Page' : undefined}
        >
          <div className="relative group cursor-pointer pressable">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center ring-1 ring-white/20 text-white font-black text-lg shadow-inner">
              <span className="bg-gradient-to-tr from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">⚡</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2 font-display">
                AXIOM <span className="text-indigo-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">HYBRID ARCHITECT</span>
              </h1>
              {retroMode && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
                  8-BIT CRT ON
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Universal Omni-Learning & Career Acceleration Engine</p>
          </div>
        </div>

        {/* Right: Gamification HUD & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Indicator Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold shadow-sm pressable cursor-default">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
            <span className="font-mono">{profile.streakCount || 7}d Streak</span>
          </div>

          {/* XP Points HUD Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-indigo-500/10 border border-indigo-500/35 text-indigo-300 text-xs font-bold font-mono shadow-sm pressable cursor-default">
            <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
            <span>{xpPoints} XP</span>
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute 8-bit Audio' : 'Enable 8-bit Audio'}
            className={`p-2 rounded-xl border pressable ${
              soundEnabled
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25'
                : 'bg-slate-900/80 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={handleThemeToggle}
            title={`Switch to ${theme === 'dark' ? 'Light Mode (Warm Artisan Paper)' : 'Dark Mode (Liquid Obsidian)'}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold pressable border transition-colors ${
              theme === 'light'
                ? 'bg-amber-100/90 border-amber-400/60 text-amber-900 shadow-sm'
                : 'bg-slate-900/80 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
            }`}
          >
            {theme === 'light' ? (
              <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span className="hidden lg:inline">{theme === 'light' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Retro Aesthetic Toggle */}
          <button
            onClick={handleRetroToggle}
            title="Toggle Axiom 90s Retro-Functionalist CRT Mode"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold pressable border ${
              retroMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/80 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{retroMode ? 'CRT: ON' : 'CRT'}</span>
          </button>

          {/* Cloud Sync */}
          <button
            onClick={onOpenSupabase}
            title="Supabase Cloud Sync"
            className="p-2 rounded-xl bg-slate-900/80 border border-white/5 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 pressable"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Export JSON */}
          <button
            onClick={() => {
              onExportData();
              toast.success('Workspace Backup Exported', { description: 'Saved full JSON snapshot of courses, DSA, and assignments.' });
            }}
            title="Export Workspace JSON Backup"
            className="p-2 rounded-xl bg-slate-900/80 border border-white/5 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 pressable hidden sm:flex"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* User Profile Pill with Double-Bezel Avatar */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-indigo-500/50 pressable group shadow-sm"
          >
            <div className="w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate max-w-[110px] hidden md:inline">
              {profile.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
