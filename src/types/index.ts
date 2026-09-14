export type ThemeMode = 'dark' | 'light';

export type Track =
  | 'engineering'
  | 'medical'
  | 'law'
  | 'commerce'
  | 'humanities'
  | 'competitive_exams'
  | 'other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  college: string;
  branch: string;
  track?: Track;
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
  category: string;
  confidenceLevel: number; // 1 to 5
  status: 'Not Started' | 'Learning' | 'Confident' | 'Mastered';
  keyTopics: {
    name: string;
    completed: boolean;
  }[];
  notes?: string;
  frequentlyAskedQuestions?: string[];
}

export type OpportunityType =
  | 'Job'
  | 'Internship'
  | 'Government Exam Form'
  | 'Entrance Exam'
  | 'Scholarship'
  | 'Fellowship';

export interface Internship {
  id: string;
  companyName: string; // Or Organization / Exam Board Name
  roleTitle: string; // Or Designation / Post / Exam Name
  opportunityType?: OpportunityType;
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

export type Opportunity = Internship;

export type PortfolioCategory =
  | 'Tech Project'
  | 'Research Paper'
  | 'Case Competition'
  | 'Clinical / Legal Audit'
  | 'Open Source / Community'
  | 'Creative Work';

export interface Project {
  id: string;
  title: string;
  category?: PortfolioCategory;
  shortDescription?: string;
  description?: string;
  techStack: string[]; // Or Key Tools / Methodologies / Statutes / Clinical Systems
  githubRepoUrl?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  starBulletPoints?: string[];
  starsCount?: number;
  lastUpdated?: string;
  status?: 'In Progress' | 'Completed' | 'Deployed' | 'Published';
}

export type ExperienceProject = Project;

// Multi-Discipline Practice Sheet Types
export interface PracticeSheetTopic {
  id: string;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  keyPattern?: string; // Or Key Invariant, Case Ratio, Landmark Section, Formula
  externalUrl?: string;
  referenceCode?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface PracticeSheetConfig {
  track: Track;
  sheetTitle: string;
  sheetSubtitle: string;
  categoryTitle: string;
  actionLabel: string; // 'Solve' | 'Practice' | 'Study Case' | 'Draft'
  categories: string[];
  statProxyName?: string;
  statProxyDescription?: string;
  externalPlatformName?: string;
  defaultTopics: PracticeSheetTopic[];
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
  mastery?: 'NEW' | 'LEARNING' | 'MASTERED';
  reviewCount?: number;
  masteryScore?: number;
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  color?: string;
  cards: Flashcard[];
  track?: Track;
  createdAt?: string;
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
  type: 'CLASS' | 'ASSIGNMENT' | 'DSA' | 'ROADMAP' | 'POMODORO' | 'BREAK' | 'EXAM';
  durationMinutes: number;
  isLocked?: boolean;
  completed: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export type AgendaSlot = DailyScheduleSlot;

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
  | 'concept-map'
  | 'doubt-solver'
  | 'mock-interview'
  | 'alumni'
  | 'group-projects'
  | 'linkedin'
  | 'my-day'
  | 'timetable'
  | 'assignments'
  | 'flashcards'
  | 'wellbeing';

// 1. Concept Map Types
export interface ConceptNode {
  id: string;
  title: string;
  description: string;
  category?: string;
  keyConcepts?: string[];
  children?: ConceptNode[];
  isExpanded?: boolean;
}

export interface ConceptMapData {
  topic: string;
  track: Track;
  summary: string;
  root: ConceptNode;
}

// 2. Doubt Solver Types
export interface DoubtSolution {
  id: string;
  question: string;
  track: Track;
  subject?: string;
  imageUrl?: string;
  conceptIdentified: string;
  keyRulesOrFormulas: string[];
  steps: {
    stepNumber: number;
    title: string;
    explanation: string;
  }[];
  commonTraps: string[];
  finalAnswer: string;
  createdAt: string;
}

// 3. Mock Interview Types
export interface InterviewQuestion {
  id: string;
  track: Track;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  hints: string[];
  keyPointsToCover: string[];
  timeLimitSeconds: number;
}

export interface InterviewCritique {
  score: number; // 0 to 100
  overallImpression: string;
  pacingPpm: string; // e.g. "135 wpm (Optimal)"
  fillerWordFrequency: 'Low' | 'Moderate' | 'High';
  fillerWordsDetected: string[];
  strengths: string[];
  areasForImprovement: string[];
  starStructureRating: 'Exemplary' | 'Good' | 'Needs Structuring';
  idealAnswerOutline: string;
}

export interface MockInterviewSession {
  id: string;
  questionId: string;
  questionText: string;
  track: Track;
  date: string;
  durationSeconds: number;
  videoBlobUrl?: string; // in-session only
  critique?: InterviewCritique;
  userSelfChecklist?: {
    coveredSTAR: boolean;
    clearTone: boolean;
    statedComplexityOrRatio: boolean;
    confidentPacing: boolean;
  };
}

// 4. Alumni Directory Types
export interface AlumnusProfile {
  id: string;
  name: string;
  avatarUrl: string;
  track: Track;
  graduationYear: number;
  college: string;
  currentRole: string;
  currentOrganization: string; // Company / Hospital / Court / Ministry
  location: string;
  targetExamOrDomain: string;
  linkedinUrl?: string;
  email: string;
  availableForMentorship: boolean;
  adviceHeadline: string;
  topicsWillingToHelp: string[];
}

// 5. Group Project Coordinator Types
export interface GroupProjectMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  isSelf?: boolean;
}

export interface GroupProjectTask {
  id: string;
  title: string;
  description?: string;
  stage: 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  assignedMemberIds: string[];
  deadlineDate: string; // YYYY-MM-DD
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedHours: number;
  clashAlert?: string;
}

export interface GroupProject {
  id: string;
  title: string;
  courseOrSubject: string;
  track: Track;
  repositoryUrl?: string;
  deadlineDate: string;
  members: GroupProjectMember[];
  tasks: GroupProjectTask[];
}

// 6. Backlog & Arrears Tracker Types
export interface BacklogItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  track: Track;
  originalSemester: number;
  credits: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Pending' | 'Registered' | 'Cleared';
  targetExamDate?: string;
  attemptCount: number;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE';
  notes?: string;
}

// 7. Sleep Debt Tracker Types
export interface SleepLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  hoursSlept: number;
  quality: 'EXCELLENT' | 'RESTED' | 'TIRED' | 'EXHAUSTED';
  targetHours: number; // default 8
}

// 8. Study Buddy Types
export interface StudyBuddyConfig {
  buddyName: string;
  buddyContact: string; // email or handle
  dailyPingTime: string; // e.g. "18:00"
  studyPactGoal: string;
  lastPingDate?: string;
  totalPingsSent: number;
}

// 9. Achievement Badges Types
export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  category: 'STREAK' | 'MASTERY' | 'AI_LEARNING' | 'WELLBEING' | 'COMMUNITY' | 'CAREER';
  tier: BadgeTier;
  iconName: string;
  xpReward: number;
  checkUnlocked: (data: any) => boolean;
}

// 10. Community & Social Module Types
export interface DiscussionReply {
  id: string;
  threadId?: string;
  authorName?: string;
  authorAvatar: string;
  authorTrack?: Track;
  content: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  author?: string;
}

export interface DiscussionThread {
  id: string;
  track: Track;
  title: string;
  content: string;
  authorName?: string;
  authorAvatar: string;
  categoryTag?: string; // e.g. "Ind AS 115", "Prelims Strategy", "System Design"
  createdAt: string;
  repliesCount: number;
  upvotes: number;
  hasUpvoted?: boolean;
  replies: DiscussionReply[];
  tags?: string[];
  author?: string;
}

export interface SharedResource {
  id: string;
  track: Track;
  subjectName?: string;
  title: string;
  description: string;
  fileType?: 'PDF' | 'DOC' | 'ZIP' | 'SHEET' | 'CODE' | string;
  fileSize: string;
  uploadedBy?: string;
  uploadedAt: string;
  downloadCount?: number;
  rating?: number; // 1 to 5
  tags: string[];
  previewContent?: string;
  fileFormat?: string;
  downloads?: number;
  author?: string;
}

export interface StudyRoomParticipant {
  id: string;
  name: string;
  avatar: string;
  track: Track;
  currentTask: string;
  isFocused: boolean;
  focusMinutesToday: number;
}

export interface StudyRoom {
  id: string;
  roomCode?: string;
  roomName?: string;
  track: Track;
  timerMode?: 'POMODORO' | 'SHORT_BREAK' | 'LONG_BREAK';
  remainingSeconds?: number;
  isRunning?: boolean;
  isLive?: boolean;
  participants?: StudyRoomParticipant[];
  name?: string;
  topic?: string;
  timerRemainingMinutes?: number;
  participantsCount?: number;
  maxParticipants?: number;
  avatars?: string[];
  hostName?: string;
  pomodoroMinutes?: number;
}
