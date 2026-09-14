import React, { useState } from 'react';
import {
  Download,
  Share2,
  Sparkles,
  Trophy,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { useTrack } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface WeeklyRecapCardProps {
  stats: {
    xp: number;
    streak: number;
    tasksCompleted: number;
    focusHours: number;
    topSubject: string;
  };
}

export const WeeklyRecapCard: React.FC<WeeklyRecapCardProps> = ({ stats }) => {
  const { config } = useTrack();
  const [generating, setGenerating] = useState(false);

  const xpValue = stats.xp || 1450;
  const streakValue = stats.streak || 7;
  const focusHoursValue = stats.focusHours || 8.5;
  const tasksValue = stats.tasksCompleted || 24;
  const topSubjectValue = stats.topSubject || config.subjects[0]?.name || 'Core Discipline Focus';

  const handleDownload = () => {
    try {
      setGenerating(true);
      soundFx.playClick();

      // Create an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 800, 1000);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#090d16');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1000);

      // Accent Glow Orb
      const orbGrad = ctx.createRadialGradient(400, 200, 10, 400, 200, 350);
      orbGrad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      orbGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = orbGrad;
      ctx.fillRect(0, 0, 800, 600);

      // Outer Bezel Border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 760, 960);

      // Inner Bezel Border
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 30, 740, 940);

      // Header Tag
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('AXIOM EDUMATE HYBRID // WEEKLY TELEMETRY', 60, 80);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('Weekly Mastery Recap', 60, 130);

      // Discipline Badge
      ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.fillRect(60, 155, 340, 36);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1;
      ctx.strokeRect(60, 155, 340, 36);
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`TRACK: ${config.name.toUpperCase()}`, 75, 178);

      // Metric 1: XP
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(60, 220, 320, 140);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('TOTAL EXPERIENCE', 80, 255);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(`${xpValue.toLocaleString()} XP`, 80, 315);

      // Metric 2: Streak
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(420, 220, 320, 140);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('STREAK SHIELD', 440, 255);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(`🔥 ${streakValue} Days`, 440, 315);

      // Metric 3: Focus Hours
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(60, 380, 320, 140);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('POMODORO FOCUS', 80, 415);
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(`${focusHoursValue}h Focus`, 80, 475);

      // Metric 4: Tasks Done
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(420, 380, 320, 140);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('ACADEMIC MILESTONES', 440, 415);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(`✓ ${tasksValue} Done`, 440, 475);

      // Top Focus Domain Card
      ctx.fillStyle = '#111827';
      ctx.fillRect(60, 540, 680, 150);
      ctx.strokeStyle = '#374151';
      ctx.strokeRect(60, 540, 680, 150);

      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('TOP FOCUS DOMAIN', 85, 580);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(topSubjectValue, 85, 620);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Discipline alignment: Active in ${config.name} vertical syllabus.`, 85, 655);

      // Quote / Motivation
      ctx.fillStyle = '#818cf8';
      ctx.font = 'italic 16px serif';
      ctx.fillText('"Continuous effort — not strength nor intelligence — is the key to unlocking potential."', 60, 750);

      // Footer
      ctx.fillStyle = '#475569';
      ctx.font = '12px monospace';
      ctx.fillText(`Generated on ${new Date().toLocaleDateString()} via Campus2Career AI`, 60, 880);
      ctx.fillText('https://campus2career.axiom.ai', 60, 910);

      // Export image
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Axiom_Weekly_Recap_${config.name}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      soundFx.playSuccess();
      toast.success('🎉 Weekly Recap Card Downloaded!', {
        description: 'Your high-res progress badge is ready to share on LinkedIn or Discord.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Export Error', { description: 'Could not generate PNG recap image.' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bezel-shell p-6 space-y-5 bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-950 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="eyebrow-badge">
            <Share2 className="w-3 h-3 text-indigo-400" />
            <span>SHAREABLE PERFORMANCE CANVAS</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Weekly Progress & Mastery Card
          </h3>
          <p className="text-xs text-slate-400">
            Export a high-resolution milestone badge tailored for {config.name} peers.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={generating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{generating ? 'Rendering...' : 'Download Card (PNG)'}</span>
        </button>
      </div>

      {/* Visual Live Card Preview */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/20 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-wider">
            {config.name.toUpperCase()} VERTICAL // LIVE BADGE PREVIEW
          </span>
          <span className="text-[10px] font-mono text-slate-500">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-sky-400" /> Total XP
            </div>
            <div className="text-xl font-bold font-mono text-sky-400 mt-1">{xpValue.toLocaleString()}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Streak
            </div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">{streakValue} Days</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-400" /> Focus Time
            </div>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">{focusHoursValue}h</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Milestones
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{tasksValue}</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-medium">Primary Focus Subject:</span>
            <span className="text-white font-bold">{topSubjectValue}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Optimal Velocity
          </span>
        </div>
      </div>
    </div>
  );
};
