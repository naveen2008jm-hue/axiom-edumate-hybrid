import { BADGE_DEFINITIONS } from '../data/badgeDefinitions';
import { BadgeDefinition, BadgeTier } from '../types';

export interface UserStatsForBadges {
  streakCount?: number;
  streak?: number;
  xpPoints?: number;
  xp?: number;
  dsaSolvedCount?: number;
  tasksCompleted?: number;
  omniCoursesCount?: number;
  voiceReviewsCount?: number;
  hasUsedVoiceRevision?: boolean;
  mockInterviewsCount?: number;
  mockInterviewsCompleted?: number;
  sleepLogsCount?: number;
  buddyPingsCount?: number;
  buddyPingsSent?: number;
  communityPostsCount?: number;
  forumPostsCreated?: number;
  clearedBacklogsCount?: number;
  totalFocusHours?: number;
}

export interface EvaluatedBadge {
  id: string;
  title: string;
  description: string;
  category: 'STREAK' | 'MASTERY' | 'AI_LEARNING' | 'WELLBEING' | 'COMMUNITY' | 'CAREER';
  tier: BadgeTier | 'PLATINUM';
  iconName: string;
  xpReward: number;
  isUnlocked: boolean;
  progressPercent: number;
}

export function computeUserBadges(stats: UserStatsForBadges): EvaluatedBadge[] {
  const normalizedStats = {
    streakCount: stats.streakCount ?? stats.streak ?? 7,
    xpPoints: stats.xpPoints ?? stats.xp ?? 1450,
    dsaSolvedCount: stats.dsaSolvedCount ?? stats.tasksCompleted ?? 12,
    omniCoursesCount: stats.omniCoursesCount ?? 2,
    voiceReviewsCount: stats.voiceReviewsCount ?? 4,
    hasUsedVoiceRevision: stats.hasUsedVoiceRevision ?? true,
    mockInterviewsCount: stats.mockInterviewsCount ?? stats.mockInterviewsCompleted ?? 1,
    sleepLogsCount: stats.sleepLogsCount ?? 4,
    buddyPingsCount: stats.buddyPingsCount ?? stats.buddyPingsSent ?? 3,
    communityPostsCount: stats.communityPostsCount ?? stats.forumPostsCreated ?? 2,
    clearedBacklogsCount: stats.clearedBacklogsCount ?? 1,
  };

  return BADGE_DEFINITIONS.map((badge) => {
    const isUnlocked = Boolean(badge.checkUnlocked(normalizedStats));
    let progressPercent = 0;

    switch (badge.id) {
      case 'badge-ignition-streak':
        progressPercent = Math.min(100, Math.round(((normalizedStats.streakCount) / 3) * 100));
        break;
      case 'badge-centurion-streak':
        progressPercent = Math.min(100, Math.round(((normalizedStats.streakCount) / 7) * 100));
        break;
      case 'badge-grandmaster-streak':
        progressPercent = Math.min(100, Math.round(((normalizedStats.streakCount) / 14) * 100));
        break;
      case 'badge-practice-novice':
        progressPercent = Math.min(100, Math.round(((normalizedStats.dsaSolvedCount) / 5) * 100));
        break;
      case 'badge-practice-veteran':
        progressPercent = Math.min(100, Math.round(((normalizedStats.dsaSolvedCount) / 20) * 100));
        break;
      case 'badge-ai-scholar':
        progressPercent = normalizedStats.omniCoursesCount >= 1 ? 100 : 0;
        break;
      case 'badge-voice-scholar':
        progressPercent = normalizedStats.hasUsedVoiceRevision || normalizedStats.voiceReviewsCount >= 1 ? 100 : 0;
        break;
      case 'badge-mock-interviewer':
        progressPercent = normalizedStats.mockInterviewsCount >= 1 ? 100 : 0;
        break;
      case 'badge-sleep-restored':
        progressPercent = Math.min(100, Math.round(((normalizedStats.sleepLogsCount) / 2) * 100));
        break;
      case 'badge-study-buddy-ping':
        progressPercent = normalizedStats.buddyPingsCount >= 1 ? 100 : 0;
        break;
      case 'badge-community-pillar':
        progressPercent = normalizedStats.communityPostsCount >= 1 ? 100 : 0;
        break;
      case 'badge-arrears-conqueror':
        progressPercent = normalizedStats.clearedBacklogsCount >= 1 ? 100 : 0;
        break;
      default:
        progressPercent = isUnlocked ? 100 : 40;
    }

    return {
      id: badge.id,
      title: badge.title,
      description: badge.description,
      category: badge.category,
      tier: badge.tier,
      iconName: badge.iconName,
      xpReward: badge.xpReward,
      isUnlocked,
      progressPercent: Math.max(0, Math.min(100, progressPercent)),
    };
  });
}
