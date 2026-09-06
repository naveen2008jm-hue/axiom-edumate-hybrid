// Non-medical Stress-Aware Workload & Wellbeing Adaptation Engine
// Ported & enhanced from EduMate for Axiom Career Hybrid

import { SelfReportedStress, EnergyLevel, WorkloadAssessment } from '../types';

export interface WorkloadFactors {
  pendingAssignmentCount: number;
  urgentAssignmentCount: number;
  daysUntilNearestExam: number | null;
  scheduledClassHoursToday: number;
  dsaDailyTargetCount: number;
  selfReportedStress?: SelfReportedStress;
  selfReportedEnergy?: EnergyLevel;
}

export function assessWorkload(factors: WorkloadFactors): WorkloadAssessment {
  let score = 25; // baseline

  // 1. Pending & Urgent Assignments impact
  score += Math.min(35, factors.pendingAssignmentCount * 4 + factors.urgentAssignmentCount * 12);

  // 2. Exam proximity impact
  if (factors.daysUntilNearestExam !== null) {
    if (factors.daysUntilNearestExam <= 2) score += 30;
    else if (factors.daysUntilNearestExam <= 5) score += 20;
    else if (factors.daysUntilNearestExam <= 10) score += 10;
  }

  // 3. College class density
  if (factors.scheduledClassHoursToday >= 6) score += 20;
  else if (factors.scheduledClassHoursToday >= 4) score += 10;

  // 4. Self-reported check-in modifiers
  if (factors.selfReportedStress === 'VERY_STRESSED') score += 25;
  else if (factors.selfReportedStress === 'STRESSED') score += 15;
  else if (factors.selfReportedStress === 'GREAT') score -= 15;
  else if (factors.selfReportedStress === 'GOOD') score -= 5;

  if (factors.selfReportedEnergy === 'LOW') score += 12;
  else if (factors.selfReportedEnergy === 'HIGH') score -= 10;

  const finalScore = Math.max(5, Math.min(100, Math.round(score)));

  if (finalScore >= 68) {
    return {
      calculatedLevel: 'HIGH',
      workloadScore: finalScore,
      headlineMessage: 'High Academic Load Detected — Restorative Mode Active',
      adaptiveRecommendations: {
        suggestedFocusMinutes: 20,
        suggestedBreakMinutes: 10,
        shouldDeferLowPriorityTasks: true,
        notificationTone: 'GENTLE',
        actionTip: 'Trim non-critical tasks today. Prioritize only your top deadline and take 10-minute restorative breaks.',
      },
    };
  }

  if (finalScore >= 42) {
    return {
      calculatedLevel: 'MODERATE',
      workloadScore: finalScore,
      headlineMessage: 'Balanced Academic Cadence — Steady Progress',
      adaptiveRecommendations: {
        suggestedFocusMinutes: 25,
        suggestedBreakMinutes: 5,
        shouldDeferLowPriorityTasks: false,
        notificationTone: 'STANDARD',
        actionTip: 'Maintain standard 25/5 Pomodoro intervals. Tackle 1 high-priority assignment and 2 DSA pattern problems.',
      },
    };
  }

  return {
    calculatedLevel: 'LOW',
    workloadScore: finalScore,
    headlineMessage: 'Optimal Energy Window — High Performance Deep Work',
    adaptiveRecommendations: {
      suggestedFocusMinutes: 45,
      suggestedBreakMinutes: 10,
      shouldDeferLowPriorityTasks: false,
      notificationTone: 'CHALLENGE',
      actionTip: 'Your schedule is open and energy is optimal! Tackle complex DSA graph/DP patterns or milestone projects.',
    },
  };
}
