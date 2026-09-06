export type ThemeMode = 'dark' | 'light';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  college: string;
  branch: string;
  graduationYear: number;
  githubUsername: string;
  leetcodeUsername: string;
  targetRole?: string;
  targetCompanies: string[];
  bio?: string;
  streakCount?: number;
  xpPoints?: number;
  isSupabaseSynced?: boolean;
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  designation: string;
  category: 'Determination' | 'Wisdom' | 'Hard Work' | 'Leadership' | 'Vision';
  favorite?: boolean;
}

export interface DsaTopic {
  id: string;
  category: 'Arrays' | 'Strings' | 'Two Pointers' | 'Sliding Window' | 'Linked Lists' | 'Stacks & Queues' | 'Trees & BST' | 'Graphs' | 'Dynamic Programming' | 'Greedy' | 'Backtracking' | 'Bit Manipulation' | 'Trie';
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeSlug?: string;
  leetcodeUrl?: string;
  keyPattern?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface DsaStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  acceptanceRate: number;
  submissionCalendar: Record<string, number>;
  isLive: boolean;
}

export interface AptitudeTopic {
  id: string;
  category: 'Quantitative' | 'Reasoning' | 'Verbal';
  title: string;
  dayNumber?: number;
  formulas?: string[];
  keyConcept?: string;
  completed: boolean;
  completedDate?: string;
  practiceTarget?: number;
  practiceSolved?: number;
}

export interface CgpaRecord {
  id: string;
  semester: number;
  sgpa: number;
  credits: number;
  academicYear?: string;
}

export interface ExamPlanner {
  id: string;
  semester: number;
  subjectCode: string;
  subjectName: string;
  examDate: string; // YYYY-MM-DD
  examTime?: string;
  credits?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  status: 'Upcoming' | 'Revising' | 'Completed';
  revisionPlan: {
    day: string;
    topic: string;
    done: boolean;
  }[];
}

export interface CoreSubject {
  id: string;
  subjectName: string;
  category: 'Core CS' | 'Systems' | 'Software Engineering';
  confidenceLevel: number; // 1 to 5
  status: 'Not Started' | 'Learning' | 'Confident' | 'Mastered';
  keyTopics: {
    name: string;
    completed: boolean;
  }[];
  notes?: string;
  frequentlyAskedQuestions?: string[];
}

export interface Internship {
  id: string;
  companyName: string;
  roleTitle: string;
  location?: string;
  stipendOrCtc?: string;
  applicationDate?: string;
  deadline?: string;
  duration?: string;
  status:
    | 'Bookmarked'
    | 'Applied'
    | 'Online Assessment'
    | 'OA Scheduled'
    | 'Technical Round'
    | 'HR Round'
    | 'Interviewing'
    | 'Offered'
    | 'Offer'
    | 'Rejected'
    | 'Completed';
  roundsInfo?: {
    roundName: string;
    date: string;
    status: 'Pending' | 'Cleared' | 'Failed';
    notes: string;
  }[];
  notes?: string;
  jobLink?: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  techStack: string[];
  githubRepoUrl?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  starBulletPoints?: string[];
  starsCount?: number;
  lastUpdated?: string;
  status?: 'In Progress' | 'Completed' | 'Deployed';
}

export interface MistakeLog {
  id: string;
  date?: string;
  logDate?: string;
  context?: string;
  contextOrCompany?: string;
  mistakeDescription?: string;
  mistake?: string;
  lessonLearned?: string;
  lesson?: string;
  tags?: string[];
  tag?: string;
  category?: string;
  severity?: 'High' | 'Medium' | 'Low';
  resolved: boolean;
}

export interface ExternalCourse {
  id: string;
  platform: 'Coursera' | 'Infosys Springboard' | 'HackerRank' | 'Udemy' | 'NPTEL' | 'AWS/GCP' | 'Other' | string;
  courseTitle?: string;
  title?: string;
  credentialId?: string;
  completionDate?: string;
  certificateUrl?: string;
  skillsAcquired?: string[];
  isVerified?: boolean;
  status?: 'In Progress' | 'Completed';
  progress?: number;
  totalModules?: number;
  completedModules?: number;
}

export interface StudySession {
  id: string;
  category: 'DSA' | 'Aptitude' | 'Academics' | 'Projects' | 'Core CS' | 'Omni-Skill' | 'Interview Prep' | string;
  topicName?: string;
  durationMinutes: number;
  sessionDate?: string;
  date?: string;
  notes?: string;
}

// Axiom Omni-Skill Interfaces
export interface OmniDayTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface OmniDayPlan {
  day: number;
  title: string;
  summary: string;
  tasks: string[];
  completedTasks?: boolean[];
  videoPrompt: string;
  imageUrl?: string;
  imageStatus?: 'idle' | 'generating' | 'done' | 'error';
}

export interface OmniCourse {
  id: string;
  topicName: string;
  category: 'Physical' | 'Conceptual';
  title: string;
  summary?: string;
  days: OmniDayPlan[];
  createdAt: string;
  isActive?: boolean;
}

// AI Study Planner Interfaces
export interface StudyPlanDay {
  day: number;
  title: string;
  durationHours: number;
  subtopics: string[];
  practiceProblems: string[];
  keyTakeaway: string;
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  topicName: string;
  totalDays: number;
  difficulty: string;
  estimatedTotalHours: number;
  summary: string;
  days: StudyPlanDay[];
  isActive: boolean;
  createdAt: string;
}

export interface LinkedInTask {
  id: string;
  taskKey?: string;
  taskTitle?: string;
  title?: string;
  description: string;
  category: string;
  isCompleted?: boolean;
  completed?: boolean;
  frequency?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

// EduMate Integrated Types
export interface TimetableEvent {
  id: string;
  title: string;
  subjectCode?: string;
  dayOfWeek: number; // 1: Mon, 2: Tue, ..., 7: Sun
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  room: string;
  teacher?: string;
  eventType: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'SEMINAR' | 'EXAM';
  color?: string;
  isLocked?: boolean;
}

export interface TimetableConflict {
  id: string;
  eventA: TimetableEvent;
  eventB: TimetableEvent;
  suggestedSlot?: { startTime: string; endTime: string };
  reason: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectName: string;
  description?: string;
  deadline: string; // ISO date string or YYYY-MM-DD
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedMinutes: number;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subtopic?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  mastery: 'NEW' | 'LEARNING' | 'MASTERED';
  reviewCount?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  color?: string;
  cards: Flashcard[];
}

export type SelfReportedStress = 'GREAT' | 'GOOD' | 'OKAY' | 'STRESSED' | 'VERY_STRESSED';
export type EnergyLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type WorkloadLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface WellbeingCheckin {
  id: string;
  date: string; // YYYY-MM-DD
  stressLevel: SelfReportedStress;
  energyLevel: EnergyLevel;
  notes?: string;
  createdAt: string;
}

export interface WorkloadAssessment {
  calculatedLevel: WorkloadLevel;
  workloadScore: number; // 0 to 100
  headlineMessage: string;
  adaptiveRecommendations: {
    suggestedFocusMinutes: number;
    suggestedBreakMinutes: number;
    shouldDeferLowPriorityTasks: boolean;
    notificationTone: 'CHALLENGE' | 'STANDARD' | 'GENTLE';
    actionTip: string;
  };
}

export interface DailyScheduleSlot {
  id: string;
  timeSlot: string; // e.g. "09:00 - 10:30"
  title: string;
  type: 'CLASS' | 'ASSIGNMENT' | 'DSA' | 'ROADMAP' | 'POMODORO' | 'BREAK';
  durationMinutes: number;
  isLocked?: boolean;
  completed: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export type TabType =
  | 'overview'
  | 'omni-skill'
  | 'dsa'
  | 'academics'
  | 'aptitude'
  | 'internships'
  | 'projects'
  | 'mistakes'
  | 'courses'
  | 'productivity'
  | 'ai-mentor'
  | 'ai-planner'
  | 'linkedin'
  | 'my-day'
  | 'timetable'
  | 'assignments'
  | 'flashcards'
  | 'wellbeing';
