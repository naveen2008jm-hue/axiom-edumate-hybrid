import { Track, PracticeSheetConfig } from '../../types';
import { ENGINEERING_PRACTICE_CONFIG } from './engineeringPractice';
import { COMPETITIVE_EXAMS_PRACTICE_CONFIG } from './competitiveExamsPractice';
import { MEDICAL_PRACTICE_CONFIG } from './medicalPractice';
import { COMMERCE_PRACTICE_CONFIG } from './commercePractice';
import { LAW_PRACTICE_CONFIG } from './lawPractice';
import { HUMANITIES_PRACTICE_CONFIG } from './humanitiesPractice';

export const TRACK_PRACTICE_CONFIGS: Record<Track, PracticeSheetConfig> = {
  engineering: ENGINEERING_PRACTICE_CONFIG,
  competitive_exams: COMPETITIVE_EXAMS_PRACTICE_CONFIG,
  medical: MEDICAL_PRACTICE_CONFIG,
  commerce: COMMERCE_PRACTICE_CONFIG,
  law: LAW_PRACTICE_CONFIG,
  humanities: HUMANITIES_PRACTICE_CONFIG,
  other: {
    track: 'other',
    sheetTitle: 'Universal Skill & Domain Practice Sheet',
    sheetSubtitle: 'Deconstructed mastery topics across cross-disciplinary domains and foundational sciences.',
    categoryTitle: 'Focus Areas',
    actionLabel: 'Practice Drill',
    statProxyName: 'Skill Drill Metrics',
    statProxyDescription: 'Retention metrics and deliberate practice session logging.',
    categories: ['All', 'Foundations', 'Core Techniques', 'Case Studies', 'Advanced Applications'],
    defaultTopics: [
      {
        id: 'oth-1',
        category: 'Foundations',
        title: 'First Principles Deconstruction & Mental Models (Feynman Technique)',
        difficulty: 'Easy',
        keyPattern: 'Explain simply -> Identify gaps -> Review & Refine',
        referenceCode: 'MOD-01',
        completed: true,
        notes: 'Break down complex concepts into simplest underlying truths.',
      },
      {
        id: 'oth-2',
        category: 'Core Techniques',
        title: 'Spaced Repetition & Interleaved Practice Scheduling',
        difficulty: 'Medium',
        keyPattern: 'Leitner System / Optimal Interval Curves',
        referenceCode: 'MOD-02',
        completed: true,
        notes: 'Interleaving distinct problem types enhances transfer learning compared to blocked practice.',
      },
    ],
  },
};

export function getPracticeSheetConfig(track: Track = 'engineering'): PracticeSheetConfig {
  return TRACK_PRACTICE_CONFIGS[track] || TRACK_PRACTICE_CONFIGS.engineering;
}

export {
  ENGINEERING_PRACTICE_CONFIG,
  COMPETITIVE_EXAMS_PRACTICE_CONFIG,
  MEDICAL_PRACTICE_CONFIG,
  COMMERCE_PRACTICE_CONFIG,
  LAW_PRACTICE_CONFIG,
  HUMANITIES_PRACTICE_CONFIG,
};
