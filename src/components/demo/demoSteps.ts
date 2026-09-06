import { TabType } from '../../types';

export interface DemoStep {
  id: string;
  stepNumber: number;
  tab: TabType;
  category: string;
  title: string;
  description: string;
  subBadge?: string;
  durationMs?: number;
  highlightSelector?: string;
  action?: 'overview' | 'theme-toggle' | 'omni-skill' | 'timetable-clash' | 'assignments-kanban' | 'flashcards-flip' | 'wellbeing-adaptation' | 'my-day' | 'dsa-tracker' | 'ai-mentor' | 'career-kanban' | 'pomodoro-timer' | 'gamification-crt';
}

export const DEMO_STEP_DURATION = 5500; // 5.5 seconds per step default

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'step-1-overview',
    stepNumber: 1,
    tab: 'overview',
    category: 'COMMAND CENTER',
    title: 'Command Center & Academic HUD',
    description: 'Unified intelligence hub synthesizing real-time CGPA, study streaks, XP gamification, and daily workload distribution.',
    subBadge: 'Core Dashboard',
    action: 'overview',
  },
  {
    id: 'step-2-theme',
    stepNumber: 2,
    tab: 'overview',
    category: 'DESIGN ENGINEERING',
    title: 'Dual-State Liquid Glass & Artisan Light Mode',
    description: 'Ultra-refined UI engineered with double-bezel depth, shifting seamlessly between Liquid Obsidian dark mode and Warm Artisan Paper light mode.',
    subBadge: 'Adaptive Theming',
    action: 'theme-toggle',
  },
  {
    id: 'step-3-omni-skill',
    stepNumber: 3,
    tab: 'omni-skill',
    category: 'AI CURRICULUM SYNTHESIZER',
    title: 'Omni-Skill Architect & Day-by-Day Roadmaps',
    description: 'Generates structured learning roadmaps for physical and conceptual disciplines with task milestones and video synthesis prompts.',
    subBadge: 'Generative AI Engine',
    action: 'omni-skill',
  },
  {
    id: 'step-4-timetable',
    stepNumber: 4,
    tab: 'timetable',
    category: 'COLLEGE TIMETABLE & CLASH DETECTOR',
    title: 'Automated Schedule Clash Detection & Reallocation',
    description: 'Instant conflict detection flags overlapping lectures and labs, automatically calculating next available conflict-free time slots.',
    subBadge: 'Smart Scheduling',
    action: 'timetable-clash',
  },
  {
    id: 'step-5-assignments',
    stepNumber: 5,
    tab: 'assignments',
    category: 'COURSEWORK & ASSIGNMENTS',
    title: 'Interactive Kanban with Dynamic Urgency Triage',
    description: 'Visual workflow management with deadline indicators, workload estimates, and priority tags to keep academic deliverables on track.',
    subBadge: 'Kanban Workflow',
    action: 'assignments-kanban',
  },
  {
    id: 'step-6-flashcards',
    stepNumber: 6,
    tab: 'flashcards',
    category: 'ACTIVE RECALL & NEURO-LEARNING',
    title: 'Interactive 3D Flashcards & Spaced Repetition',
    description: 'Hardware-accelerated 3D flip flashcards for OS invariants, algorithms, and systems engineering with progressive mastery scoring.',
    subBadge: 'Synaptic Retention',
    action: 'flashcards-flip',
  },
  {
    id: 'step-7-wellbeing',
    stepNumber: 7,
    tab: 'wellbeing',
    category: 'WELLBEING & WORKLOAD ADAPTATION',
    title: 'Cognitive Energy & Burnout Safeguard',
    description: 'Intelligent workload calculation adapts Pomodoro focus intervals, break ratios, and notification tones based on upcoming deadlines.',
    subBadge: 'Burnout Prevention',
    action: 'wellbeing-adaptation',
  },
  {
    id: 'step-8-my-day',
    stepNumber: 8,
    tab: 'my-day',
    category: 'ADAPTIVE DAILY PLANNER',
    title: 'My Day — Synthesized Academic Agenda',
    description: 'Automatically merges college timetable hours, urgent assignment blocks, DSA sprints, and break buffers into one seamless daily agenda.',
    subBadge: 'Unified Daily Roadmap',
    action: 'my-day',
  },
  {
    id: 'step-9-dsa',
    stepNumber: 9,
    tab: 'dsa',
    category: 'TECHNICAL INTERVIEW PREP',
    title: '75+ Core DSA Pattern Tracker with LeetCode Sync',
    description: 'Master patterns from Sliding Window to Dynamic Programming with difficulty tagging, optimal solution notes, and profile synchronization.',
    subBadge: 'Algorithms Mastery',
    action: 'dsa-tracker',
  },
  {
    id: 'step-10-ai-mentor',
    stepNumber: 10,
    tab: 'ai-mentor',
    category: 'AI PLACEMENT MENTOR',
    title: 'Context-Aware Career & Technical Interview Mentorship',
    description: 'AI mentor primed with student target companies, LeetCode progress, and academic history for personalized interview coaching.',
    subBadge: 'Placement AI Partner',
    action: 'ai-mentor',
  },
  {
    id: 'step-11-career',
    stepNumber: 11,
    tab: 'internships',
    category: 'RECRUITMENT PIPELINE & PORTFOLIO',
    title: 'Job Application Pipeline & STAR Resume Portfolio',
    description: 'Multi-stage recruitment Kanban paired with quantifiable STAR-method project portfolios formatted for high-ATS recruiter screening.',
    subBadge: 'SDE Career Launch',
    action: 'career-kanban',
  },
  {
    id: 'step-12-productivity',
    stepNumber: 12,
    tab: 'productivity',
    category: 'FOCUS & TIME ANALYTICS',
    title: 'Pomodoro Focus Engine & Category Analytics',
    description: 'Deep-work timer with category logging, distribution breakdown charts, and seamless integration with the student study log.',
    subBadge: 'Deep Work Telemetry',
    action: 'pomodoro-timer',
  },
  {
    id: 'step-13-gamification',
    stepNumber: 13,
    tab: 'overview',
    category: 'GAMIFICATION & RETRO AESTHETICS',
    title: 'Streak Multipliers, XP Bursts & 8-Bit Retro CRT Mode',
    description: 'Dopamine-driven progression with XP celebrations, streak multipliers, sound synthesizers, and vintage 90s CRT monochrome terminal mode.',
    subBadge: 'Engagement Engine',
    action: 'gamification-crt',
  },
];
