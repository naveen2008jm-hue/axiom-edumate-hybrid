import React, { useState } from 'react';
import {
  Award,
  Lock,
  Sparkles,
  Trophy,
  CheckCircle2,
  Filter,
  Flame,
  Zap,
  Crown,
  BookOpen,
  Bot,
  Mic,
  Video,
  Moon,
  Users,
  Share2,
} from 'lucide-react';
import { computeUserBadges, UserStatsForBadges, EvaluatedBadge } from '../../lib/badgeEngine';

interface BadgesVaultProps {
  stats: UserStatsForBadges;
}

type BadgeCategoryFilter = 'ALL' | 'STREAK' | 'MASTERY' | 'AI_LEARNING' | 'WELLBEING' | 'COMMUNITY' | 'CAREER';

const CATEGORIES: { id: BadgeCategoryFilter; label: string }[] = [
  { id: 'ALL', label: 'All Badges' },
  { id: 'STREAK', label: 'Streaks' },
  { id: 'MASTERY', label: 'Curriculum Mastery' },
  { id: 'AI_LEARNING', label: 'AI Intelligence' },
  { id: 'WELLBEING', label: 'Wellbeing & Sleep' },
  { id: 'COMMUNITY', label: 'Collaboration' },
  { id: 'CAREER', label: 'Career & Interview' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Zap,
  Crown,
  BookOpen,
  Award,
  Bot,
  Mic,
  Video,
  Moon,
  Users,
  Share2,
  CheckCircle2,
};

export const BadgesVault: React.FC<BadgesVaultProps> = ({ stats }) => {
  const [activeCategory, setActiveCategory] = useState<BadgeCategoryFilter>('ALL');
  const evaluatedBadges = computeUserBadges(stats);

  const unlockedCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
  const totalCount = evaluatedBadges.length;

  const filteredBadges = evaluatedBadges.filter(
    (b) => activeCategory === 'ALL' || b.category === activeCategory
  );

  const getTierBadgeStyle = (tier: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        cardBg: 'bg-slate-950/60 border-slate-800/80 opacity-70',
        badgePill: 'border-slate-700 text-slate-500 bg-slate-900',
        iconColor: 'text-slate-600 bg-slate-900 border-slate-800',
        progressBar: 'bg-slate-700',
      };
    }

    switch (tier) {
      case 'GOLD':
      case 'DIAMOND':
        return {
          cardBg: 'bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-950/30',
          badgePill: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
          iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
          progressBar: 'bg-gradient-to-r from-amber-500 to-yellow-300',
        };
      case 'SILVER':
      case 'PLATINUM':
        return {
          cardBg: 'bg-gradient-to-b from-cyan-500/15 via-slate-900 to-slate-950 border-cyan-500/40 shadow-lg shadow-cyan-950/30',
          badgePill: 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10',
          iconColor: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
          progressBar: 'bg-gradient-to-r from-cyan-500 to-indigo-400',
        };
      case 'BRONZE':
      default:
        return {
          cardBg: 'bg-gradient-to-b from-orange-500/15 via-slate-900 to-slate-950 border-orange-500/40 shadow-lg shadow-orange-950/30',
          badgePill: 'border-orange-400/40 text-orange-300 bg-orange-500/10',
          iconColor: 'text-orange-400 bg-orange-500/20 border-orange-500/40',
          progressBar: 'bg-gradient-to-r from-orange-500 to-amber-400',
        };
    }
  };

  return (
    <div className="bezel-shell p-6 space-y-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="eyebrow-badge">
            <Award className="w-3 h-3 text-amber-400" />
            <span>HALL OF MASTERY & ACHIEVEMENTS</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Tiered Achievement Badges Vault
          </h3>
          <p className="text-xs text-slate-400">
            Earn milestone credentials across discipline study, streak maintenance, AI sessions, and peer collaboration.
          </p>
        </div>

        {/* Unlock Tally HUD */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Badges Unlocked</div>
            <div className="text-base font-extrabold text-white font-mono">
              {unlockedCount} / {totalCount}{' '}
              <span className="text-xs text-amber-400 font-normal">
                ({Math.round((unlockedCount / totalCount) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.isUnlocked;
          const styles = getTierBadgeStyle(badge.tier, isUnlocked);
          const IconComponent = ICON_MAP[badge.iconName] || Award;

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${styles.cardBg}`}
            >
              {/* Top Row: Icon + Tier */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${styles.iconColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${styles.badgePill}`}>
                      {badge.tier}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-300 mt-1">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Badge Info */}
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    {badge.title}
                    {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Status */}
              <div className="pt-4 space-y-1.5 mt-auto">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{isUnlocked ? 'UNLOCKED' : 'PROGRESS'}</span>
                  <span className="font-bold">{Math.round(badge.progressPercent)}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all duration-500 ${styles.progressBar}`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
