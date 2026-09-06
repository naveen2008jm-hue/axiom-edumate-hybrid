import { useState, useEffect } from 'react';
import {
  UserProfile,
  DsaTopic,
  AptitudeTopic,
  CgpaRecord,
  ExamPlanner,
  CoreSubject,
  Internship,
  Project,
  MistakeLog,
  ExternalCourse,
  StudySession,
  StudyPlan,
  LinkedInTask,
  Quote,
  OmniCourse,
  TimetableEvent,
  Assignment,
  Flashcard,
  FlashcardDeck,
  WellbeingCheckin,
  DailyScheduleSlot,
  WorkloadAssessment,
  SelfReportedStress,
  EnergyLevel,
  ThemeMode,
} from '../types';
import { DSA_SYLLABUS } from '../data/dsaSyllabus';
import { APTITUDE_TOPICS } from '../data/aptitudeTopics';
import { CORE_SUBJECTS } from '../data/coreSubjects';
import { LINKEDIN_TASKS } from '../data/linkedinTasks';
import { QUOTES } from '../data/quotes';
import { INITIAL_TIMETABLE_EVENTS } from '../data/timetableData';
import { INITIAL_ASSIGNMENTS } from '../data/assignmentsData';
import { INITIAL_FLASHCARD_DECKS } from '../data/flashcardsData';
import { assessWorkload } from './wellbeingEngine';
import { soundFx } from './sound';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  PROFILE: 'axiom_hybrid_profile',
  DSA: 'axiom_hybrid_dsa',
  APTITUDE: 'axiom_hybrid_aptitude',
  CGPA: 'axiom_hybrid_cgpa',
  EXAMS: 'axiom_hybrid_exams',
  CORE_SUBJECTS: 'axiom_hybrid_core_subjects',
  INTERNSHIPS: 'axiom_hybrid_internships',
  PROJECTS: 'axiom_hybrid_projects',
  MISTAKES: 'axiom_hybrid_mistakes',
  COURSES: 'axiom_hybrid_courses',
  SESSIONS: 'axiom_hybrid_sessions',
  PLANS: 'axiom_hybrid_plans',
  OMNI_COURSES: 'axiom_hybrid_omni_courses',
  LINKEDIN: 'axiom_hybrid_linkedin',
  QUOTES: 'axiom_hybrid_quotes',
  XP: 'axiom_hybrid_xp',
  THEME: 'axiom_hybrid_theme',
  THEME_MODE: 'axiom_hybrid_theme_mode',
  RETRO_MODE: 'axiom_hybrid_retro_mode',
  TIMETABLE: 'axiom_hybrid_timetable',
  ASSIGNMENTS: 'axiom_hybrid_assignments',
  FLASHCARDS: 'axiom_hybrid_flashcards',
  WELLBEING: 'axiom_hybrid_wellbeing',
  DAILY_AGENDA: 'axiom_hybrid_daily_agenda',
};

// Initial wellbeing check-in
const INITIAL_WELLBEING_CHECKINS: WellbeingCheckin[] = [
  {
    id: 'wb-1',
    date: new Date().toISOString().split('T')[0],
    stressLevel: 'GOOD',
    energyLevel: 'HIGH',
    notes: 'Semester rhythm steady. Prioritizing Operating Systems assignment and 75+ DSA pattern drills.',
    createdAt: new Date().toISOString(),
  },
];

// Initial intelligent daily agenda (merges classes + assignments + study)
const INITIAL_DAILY_AGENDA: DailyScheduleSlot[] = [
  {
    id: 'slot-1',
    timeSlot: '09:00 - 10:30',
    title: 'Lecture: Design & Analysis of Algorithms (Hall 302)',
    type: 'CLASS',
    durationMinutes: 90,
    isLocked: true,
    completed: true,
  },
  {
    id: 'slot-2',
    timeSlot: '11:00 - 13:00',
    title: 'Lab: Database Systems B+ Tree Performance (Lab 3)',
    type: 'CLASS',
    durationMinutes: 120,
    isLocked: true,
    completed: true,
  },
  {
    id: 'slot-3',
    timeSlot: '14:00 - 15:30',
    title: 'Assignment Sprint: Producer-Consumer Thread Pool in C++',
    type: 'ASSIGNMENT',
    durationMinutes: 90,
    priority: 'HIGH',
    completed: false,
  },
  {
    id: 'slot-4',
    timeSlot: '16:00 - 17:30',
    title: '75+ DSA Practice: Monotonic Stack & Sliding Window Patterns',
    type: 'DSA',
    durationMinutes: 90,
    priority: 'HIGH',
    completed: false,
  },
  {
    id: 'slot-5',
    timeSlot: '18:00 - 18:45',
    title: 'Flashcard Recall: OS Concurrency & Deadlock Invariants',
    type: 'ROADMAP',
    durationMinutes: 45,
    priority: 'MEDIUM',
    completed: false,
  },
];

// Default pre-seeded profile
const INITIAL_PROFILE: UserProfile = {
  id: 'usr-student-2027',
  name: 'Naveen',
  email: 'naveen.dev@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  college: 'National Institute of Technology (NIT)',
  branch: 'Computer Science & Engineering',
  graduationYear: 2027,
  githubUsername: 'naveen-dev',
  leetcodeUsername: 'naveen_code',
  targetCompanies: ['Google', 'Microsoft', 'Atlassian', 'Amazon', 'Adobe', 'Uber'],
  bio: '2nd Year B.Tech CSE | SDE Aspirant | 250+ LeetCode Solved | Building scalable systems & mastering DSA.',
  streakCount: 7,
  xpPoints: 340,
  isSupabaseSynced: false,
};

const INITIAL_CGPA_RECORDS: CgpaRecord[] = [
  { id: 'cg-1', semester: 1, sgpa: 8.85, credits: 22, academicYear: '2023-2024' },
  { id: 'cg-2', semester: 2, sgpa: 9.15, credits: 24, academicYear: '2023-2024' },
  { id: 'cg-3', semester: 3, sgpa: 8.95, credits: 23, academicYear: '2024-2025' },
  { id: 'cg-4', semester: 4, sgpa: 9.30, credits: 24, academicYear: '2024-2025' },
];

const INITIAL_EXAM_PLANNERS: ExamPlanner[] = [
  {
    id: 'ex-1',
    semester: 5,
    subjectCode: 'CS501',
    subjectName: 'Design and Analysis of Algorithms (DAA)',
    examDate: '2026-09-18',
    examTime: '09:30 AM',
    credits: 4,
    difficulty: 'Hard',
    status: 'Upcoming',
    revisionPlan: [
      { day: 'Day 1', topic: 'Asymptotic Notations & Recurrence Relations (Master Theorem)', done: true },
      { day: 'Day 2', topic: 'Divide and Conquer: Strassen, Median of Medians, Quickselect', done: true },
      { day: 'Day 3', topic: 'Greedy Algorithms: Huffman Coding, Activity Selection, Prim/Kruskal', done: false },
      { day: 'Day 4', topic: 'Dynamic Programming: Matrix Chain Multi, 0/1 Knapsack, LCS', done: false },
      { day: 'Day 5', topic: 'NP-Completeness: Reduction, 3-SAT, Vertex Cover, Clique', done: false },
    ],
  },
  {
    id: 'ex-2',
    semester: 5,
    subjectCode: 'CS502',
    subjectName: 'Database Management Systems (DBMS)',
    examDate: '2026-09-22',
    examTime: '02:00 PM',
    credits: 4,
    difficulty: 'Medium',
    status: 'Upcoming',
    revisionPlan: [
      { day: 'Day 1', topic: 'Relational Algebra & Tuple Relational Calculus', done: true },
      { day: 'Day 2', topic: 'Normalization: 1NF to BCNF and Lossless Join Decomposition', done: true },
      { day: 'Day 3', topic: 'Transaction Management: Serializability, Conflict vs View', done: false },
      { day: 'Day 4', topic: 'Concurrency Control: 2PL, Timestamp Ordering, Lock Escalation', done: false },
    ],
  },
];

const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'int-1',
    companyName: 'Google',
    roleTitle: 'Software Engineering Intern (Summer 2027)',
    location: 'Bangalore / Hyderabad',
    stipendOrCtc: '₹1,25,000 / month',
    applicationDate: '2026-08-01',
    deadline: '2026-08-30',
    duration: '2 Months (May - July)',
    status: 'Online Assessment',
    roundsInfo: [
      { roundName: 'Resume Screening', date: '2026-08-05', status: 'Cleared', notes: 'Shortlisted with ATS score 92%' },
      { roundName: 'Google Online Challenge (GOC)', date: '2026-08-20', status: 'Pending', notes: '2 DP + Graph questions' },
      { roundName: 'Technical Interview 1', date: 'TBD', status: 'Pending', notes: 'DSA & problem solving' },
    ],
    notes: 'Focus on Graph BFS/DFS, Disjoint Set Union (DSU), and 2D dynamic programming.',
    jobLink: 'https://careers.google.com/students',
  },
  {
    id: 'int-2',
    companyName: 'Microsoft',
    roleTitle: 'SDE Intern',
    location: 'Noida / Hyderabad / Remote',
    stipendOrCtc: '₹1,00,000 / month',
    applicationDate: '2026-08-05',
    deadline: '2026-09-05',
    duration: '2 Months',
    status: 'Applied',
    roundsInfo: [
      { roundName: 'Application Submission', date: '2026-08-05', status: 'Cleared', notes: 'Applied via employee referral' },
      { roundName: 'Codility OA', date: '2026-08-28', status: 'Pending', notes: '3 coding questions in 90 mins' },
    ],
    notes: 'Tree traversals and string manipulation are high probability.',
    jobLink: 'https://careers.microsoft.com',
  },
  {
    id: 'int-3',
    companyName: 'Atlassian',
    roleTitle: 'Software Engineer Intern (Platform)',
    location: 'Bengaluru (Remote-First)',
    stipendOrCtc: '₹1,20,000 / month',
    applicationDate: '2026-07-25',
    deadline: '2026-08-15',
    duration: '2 Months',
    status: 'Interviewing',
    roundsInfo: [
      { roundName: 'HackerRank OA', date: '2026-08-02', status: 'Cleared', notes: 'Solved 3/3 questions with optimal O(n)' },
      { roundName: 'Values & Technical Round 1', date: '2026-08-19', status: 'Pending', notes: 'Data structures + concurrency' },
    ],
    notes: 'Revise Atlassian values: "Open company, no bullshit", "Build with heart & balance".',
    jobLink: 'https://www.atlassian.com/company/careers',
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Distributed In-Memory Cache Engine',
    shortDescription: 'High-concurrency distributed key-value store with LRU eviction policy, TCP socket communication, and Redis-compatible protocol serialization.',
    techStack: ['Go', 'TCP/IP', 'Concurrency', 'Docker', 'Redis Protocol'],
    githubRepoUrl: 'https://github.com/naveen-dev/Distributed-Cache-Engine',
    liveDemoUrl: 'https://github.com/naveen-dev/Distributed-Cache-Engine#benchmarks',
    highlights: [
      'Engineered an in-memory key-value cache in Go delivering 45,000+ QPS under concurrent load.',
      'Implemented segmented mutex locking reducing lock contention by 65% across 16 worker threads.',
      'Constructed custom RESP parser for seamless client interoperability.',
    ],
    starsCount: 34,
    status: 'Completed',
  },
  {
    id: 'proj-2',
    title: 'Axiom Career Architect: AI Placement & Omni-Skill Hub',
    shortDescription: 'Unified full-stack preparation portal with dynamic AI course synthesis, LeetCode sync, 75+ DSA pattern sheet, and gamified progress tracking.',
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Gemini 2.5 Flash', 'Supabase', 'Recharts'],
    githubRepoUrl: 'https://github.com/naveen-dev/Axiom-Career-Architect',
    liveDemoUrl: 'https://axiom-career.app',
    highlights: [
      'Engineered dynamic AI omni-learning course generator supporting physical and conceptual taxonomies.',
      'Designed responsive dashboard with real-time stats, 8-bit sound effects, and streak gamification.',
      'Implemented robust offline-first caching and PostgreSQL sync.',
    ],
    starsCount: 52,
    status: 'Deployed',
  },
];

const INITIAL_MISTAKES_LOG: MistakeLog[] = [
  {
    id: 'mst-1',
    logDate: '2026-08-10',
    contextOrCompany: 'LeetCode Weekly Contest 410 - Q3 (Dynamic Programming)',
    mistakeDescription: 'Initialized DP array with 0 instead of -1 for memoization, causing TLE on legitimate 0 return states.',
    lessonLearned: 'Always initialize memoization tables with -1 (or null) so legitimate 0 return values are recognized as solved states.',
    tags: ['DSA', 'Dynamic Programming', 'Memoization', 'Contest'],
    resolved: true,
  },
  {
    id: 'mst-2',
    logDate: '2026-08-04',
    contextOrCompany: 'Mock Interview (Operating Systems)',
    mistakeDescription: 'Confused Semaphore and Mutex ownership; stated that any thread can unlock a Mutex.',
    lessonLearned: 'A Mutex is an ownership lock (only the locker can unlock). A Binary Semaphore is a signaling mechanism.',
    tags: ['Core CS', 'Operating Systems', 'Concurrency'],
    resolved: true,
  },
];

const INITIAL_EXTERNAL_COURSES: ExternalCourse[] = [
  {
    id: 'crs-1',
    platform: 'Coursera',
    courseTitle: 'Algorithms Specialization (Stanford University)',
    credentialId: 'COURSERA-STF-ALG-89412',
    completionDate: '2026-05-15',
    certificateUrl: 'https://coursera.org/verify/SAMPLE123',
    skillsAcquired: ['Divide & Conquer', 'Master Theorem', 'Greedy Algorithms', 'Dynamic Programming', 'NP-Completeness'],
    isVerified: true,
  },
  {
    id: 'crs-2',
    platform: 'Udemy',
    courseTitle: 'Mastering System Design for FAANG SDE Interviews',
    credentialId: 'UDE-SYSD-44510',
    completionDate: '2026-07-28',
    certificateUrl: 'https://udemy.com/certificate/sample',
    skillsAcquired: ['Distributed Systems', 'Load Balancing', 'Consistent Hashing', 'Kafka', 'Database Sharding'],
    isVerified: true,
  },
];

const INITIAL_STUDY_SESSIONS: StudySession[] = [
  { id: 'ss-1', category: 'DSA', topicName: 'Graph BFS & Topological Sort', durationMinutes: 90, sessionDate: '2026-08-15', notes: 'Solved 2 Medium LeetCode problems.' },
  { id: 'ss-2', category: 'Aptitude', topicName: 'Time, Speed & Distance Drills', durationMinutes: 45, sessionDate: '2026-08-15', notes: 'Solved 15 train & relative speed questions.' },
  { id: 'ss-3', category: 'Core CS', topicName: 'DBMS Concurrency & 2PL Locks', durationMinutes: 60, sessionDate: '2026-08-14', notes: 'Reviewed strict 2PL vs rigorous 2PL.' },
  { id: 'ss-4', category: 'Omni-Skill', topicName: 'Distributed Consensus (Raft/Paxos)', durationMinutes: 60, sessionDate: '2026-08-13', notes: 'Completed Day 1 & Day 2 tasks.' },
];

const INITIAL_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'pln-1',
    topicName: 'Dynamic Programming: 1D & 2D Grid Patterns',
    totalDays: 7,
    difficulty: 'Medium-Hard',
    estimatedTotalHours: 21,
    summary: 'Master the 5 essential DP paradigms: 1D recurrence, 0/1 Knapsack, Unbounded Knapsack, LCS, and Matrix Chain Multiplication.',
    isActive: true,
    createdAt: '2026-08-12',
    days: [
      {
        day: 1,
        title: 'Day 1: 1D State Transitions & Fibonacci Variants',
        durationHours: 3,
        subtopics: ['Climbing Stairs', 'House Robber I & II', 'Frog Jump'],
        practiceProblems: ['LeetCode 70 (Climbing Stairs)', 'LeetCode 198 (House Robber)'],
        keyTakeaway: 'Express state as dp[i] = max(dp[i-1], dp[i-2] + val[i]). Optimize space to O(1).',
        completed: true,
      },
      {
        day: 2,
        title: 'Day 2: 0/1 Knapsack & Subset Sum',
        durationHours: 3,
        subtopics: ['Subset Sum Equals Target', 'Partition Equal Subset Sum'],
        practiceProblems: ['LeetCode 416 (Partition Equal Subset Sum)', 'LeetCode 494 (Target Sum)'],
        keyTakeaway: 'Process items from right to left when using 1D space optimized array.',
        completed: true,
      },
    ],
  },
];

// Default Axiom Omni-Courses
const INITIAL_OMNI_COURSES: OmniCourse[] = [
  {
    id: 'omni-1',
    topicName: 'Swimming Butterfly Stroke',
    category: 'Physical',
    title: 'Mastering the Butterfly Stroke',
    summary: 'A step-by-step kinetic breakdown from undulating dolphin kick to explosive recovery.',
    createdAt: '2026-08-10',
    isActive: true,
    days: [
      {
        day: 1,
        title: 'Dolphin Kick & Core Undulation',
        summary: 'Initiate the rhythmic wave from chest to hips without overbending knees.',
        tasks: [
          'Perform 4x25m streamline dolphin kicks on stomach with kickboard',
          'Practice 3x25m dolphin kicks on back focusing on hip lift',
          'Execute 5 minutes of vertical kicking in deep water',
        ],
        completedTasks: [true, true, true],
        videoPrompt: 'Swimmer performing dolphin kick in pristine water, 2D flat vector animation, minimalist fitness app aesthetic, bone-white background, thick black outlines, 8fps stepping animation',
        imageStatus: 'done',
      },
      {
        day: 2,
        title: 'Keyhole Arm Pull & High Elbow Catch',
        summary: 'Master the sweeping hourglass motion and powerful acceleration past the hips.',
        tasks: [
          'Dry-land standing pull simulation with resistance band (3x15 reps)',
          'Single-arm butterfly drill with alternating sides (4x50m)',
          'Focus on pressing chest down during hand entry',
        ],
        completedTasks: [true, false, false],
        videoPrompt: 'Overhead view of keyhole arm stroke mechanics, 2D minimalist vector animation, bone-white background, crisp diagrammatic lines',
        imageStatus: 'done',
      },
      {
        day: 3,
        title: 'Breathing Timing & Full Stroke Integration',
        summary: 'Synchronize breath during peak pull before chin drops as arms sweep forward.',
        tasks: [
          'Perform 6x25m full stroke with breathing every 2nd stroke',
          'Maintain low head position during breath without lifting chest vertically',
          'Complete 200m relaxed cooldown',
        ],
        completedTasks: [false, false, false],
        videoPrompt: 'Side angle of breathing sync in butterfly stroke, 2D flat vector, high contrast retro',
        imageStatus: 'done',
      },
    ],
  },
  {
    id: 'omni-2',
    topicName: 'Distributed Systems & Consensus',
    category: 'Conceptual',
    title: 'Mastering Distributed Consensus (Raft & Paxos)',
    summary: 'From leader election to replicated state machines and network partition tolerance.',
    createdAt: '2026-08-12',
    isActive: false,
    days: [
      {
        day: 1,
        title: 'The Consensus Problem & State Machine Replication',
        summary: 'Understand why simple replication fails under network latency and Byzantine vs fail-stop nodes.',
        tasks: [
          'Review CAP Theorem trade-offs (Consistency vs Availability under Partition)',
          'Diagram the Replicated Log Architecture on paper',
          'List 3 real-world distributed state machines (etcd, ZooKeeper, CockroachDB)',
        ],
        completedTasks: [true, true, false],
        videoPrompt: 'Distributed nodes exchanging log entries across a network partition, 2D blueprint schematic, chalkboard aesthetic, minimalist technical drawing, flat vector, 8fps',
        imageStatus: 'done',
      },
      {
        day: 2,
        title: 'Raft Protocol: Leader Election & Heartbeats',
        summary: 'Explore Term numbers, randomized election timeouts, and majority quorum votes.',
        tasks: [
          'Trace leader election walkthrough step-by-step',
          'Write a pseudocode state machine for Candidate, Follower, and Leader states',
          'Test election timeout edge cases with 5-node cluster diagram',
        ],
        completedTasks: [false, false, false],
        videoPrompt: 'Raft election term transition and vote request RPCs, technical schematic blueprint vector, 8fps retro',
        imageStatus: 'done',
      },
    ],
  },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (key === STORAGE_KEYS.PROFILE && parsed && (
      parsed.name === 'Bhagyashree Sharma' ||
      parsed.name === 'bhagyaShree' ||
      parsed.name?.toLowerCase().includes('bhagya') ||
      !parsed.name
    )) {
      parsed.name = 'Naveen';
      parsed.email = 'naveen.dev@example.com';
      parsed.githubUsername = 'naveen-dev';
      parsed.leetcodeUsername = 'naveen_code';
      localStorage.setItem(key, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return fallback;
  }
}

export function useAppData() {
  const [profile, setProfileState] = useState<UserProfile>(() => readStorage(STORAGE_KEYS.PROFILE, INITIAL_PROFILE));
  const [dsaList, setDsaListState] = useState<DsaTopic[]>(() => readStorage(STORAGE_KEYS.DSA, DSA_SYLLABUS));
  const [aptitudeList, setAptitudeListState] = useState<AptitudeTopic[]>(() => readStorage(STORAGE_KEYS.APTITUDE, APTITUDE_TOPICS));
  const [cgpaRecords, setCgpaRecordsState] = useState<CgpaRecord[]>(() => readStorage(STORAGE_KEYS.CGPA, INITIAL_CGPA_RECORDS));
  const [examPlanners, setExamPlannersState] = useState<ExamPlanner[]>(() => readStorage(STORAGE_KEYS.EXAMS, INITIAL_EXAM_PLANNERS));
  const [coreSubjects, setCoreSubjectsState] = useState<CoreSubject[]>(() => readStorage(STORAGE_KEYS.CORE_SUBJECTS, CORE_SUBJECTS));
  const [internships, setInternshipsState] = useState<Internship[]>(() => readStorage(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS));
  const [projects, setProjectsState] = useState<Project[]>(() => readStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS));
  const [mistakesLog, setMistakesLogState] = useState<MistakeLog[]>(() => readStorage(STORAGE_KEYS.MISTAKES, INITIAL_MISTAKES_LOG));
  const [externalCourses, setExternalCoursesState] = useState<ExternalCourse[]>(() => readStorage(STORAGE_KEYS.COURSES, INITIAL_EXTERNAL_COURSES));
  const [studySessions, setStudySessionsState] = useState<StudySession[]>(() => readStorage(STORAGE_KEYS.SESSIONS, INITIAL_STUDY_SESSIONS));
  const [studyPlans, setStudyPlansState] = useState<StudyPlan[]>(() => readStorage(STORAGE_KEYS.PLANS, INITIAL_STUDY_PLANS));
  const [omniCourses, setOmniCoursesState] = useState<OmniCourse[]>(() => readStorage(STORAGE_KEYS.OMNI_COURSES, INITIAL_OMNI_COURSES));
  const [linkedinTasks, setLinkedinTasksState] = useState<LinkedInTask[]>(() => readStorage(STORAGE_KEYS.LINKEDIN, LINKEDIN_TASKS));
  const [quotes, setQuotesState] = useState<Quote[]>(() => readStorage(STORAGE_KEYS.QUOTES, QUOTES));
  const [xpPoints, setXpPointsState] = useState<number>(() => readStorage(STORAGE_KEYS.XP, 420));
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const fromStorage = readStorage<ThemeMode | null>(STORAGE_KEYS.THEME, null);
    if (fromStorage === 'light' || fromStorage === 'dark') return fromStorage;
    if (typeof document !== 'undefined') {
      const docAttr = document.documentElement.getAttribute('data-theme') as ThemeMode;
      if (docAttr === 'light' || docAttr === 'dark') return docAttr;
    }
    return 'dark';
  });
  const [retroMode, setRetroModeState] = useState<boolean>(() => readStorage(STORAGE_KEYS.RETRO_MODE, false));
  const [timetableEvents, setTimetableEventsState] = useState<TimetableEvent[]>(() => readStorage(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE_EVENTS));
  const [assignments, setAssignmentsState] = useState<Assignment[]>(() => readStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS));
  const [flashcardDecks, setFlashcardDecksState] = useState<FlashcardDeck[]>(() => readStorage(STORAGE_KEYS.FLASHCARDS, INITIAL_FLASHCARD_DECKS));
  const [wellbeingCheckins, setWellbeingCheckinsState] = useState<WellbeingCheckin[]>(() => readStorage(STORAGE_KEYS.WELLBEING, INITIAL_WELLBEING_CHECKINS));
  const [dailyAgenda, setDailyAgendaState] = useState<DailyScheduleSlot[]>(() => readStorage(STORAGE_KEYS.DAILY_AGENDA, INITIAL_DAILY_AGENDA));

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Sound + XP award helper
  const awardXP = (amount: number = 10) => {
    setXpPointsState((prev) => {
      const next = prev + amount;
      localStorage.setItem(STORAGE_KEYS.XP, JSON.stringify(next));
      return next;
    });
    soundFx.playBlip();
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(newTheme));
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    if (newTheme === 'light' && retroMode) {
      setRetroModeState(false);
      localStorage.setItem(STORAGE_KEYS.RETRO_MODE, JSON.stringify(false));
    }
    soundFx.playClick();
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(next));
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', next);
      }
      if (next === 'light' && retroMode) {
        setRetroModeState(false);
        localStorage.setItem(STORAGE_KEYS.RETRO_MODE, JSON.stringify(false));
      }
      soundFx.playClick();
      return next;
    });
  };

  const toggleRetroMode = () => {
    setRetroModeState((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.RETRO_MODE, JSON.stringify(next));
      soundFx.playClick();
      return next;
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next));
      return next;
    });
  };

  const toggleDsaComplete = (id: string) => {
    setDsaListState((prev) => {
      const item = prev.find((x) => x.id === id);
      const isCompleting = item ? !item.completed : false;
      if (isCompleting) {
        awardXP(15);
      } else {
        soundFx.playClick();
      }
      const next = prev.map((it) =>
        it.id === id ? { ...it, completed: !it.completed, completedAt: !it.completed ? new Date().toISOString() : undefined } : it
      );
      localStorage.setItem(STORAGE_KEYS.DSA, JSON.stringify(next));
      return next;
    });
  };

  const addDsaTopic = (topic: Omit<DsaTopic, 'id'>) => {
    const newTopic: DsaTopic = { ...topic, id: `dsa-${Date.now()}` };
    setDsaListState((prev) => {
      const next = [newTopic, ...prev];
      localStorage.setItem(STORAGE_KEYS.DSA, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const toggleAptitudeComplete = (id: string) => {
    setAptitudeListState((prev) => {
      const item = prev.find((x) => x.id === id);
      const isCompleting = item ? !item.completed : false;
      if (isCompleting) awardXP(10);
      const next = prev.map((it) =>
        it.id === id ? { ...it, completed: !it.completed, completedDate: !it.completed ? new Date().toISOString().split('T')[0] : undefined } : it
      );
      localStorage.setItem(STORAGE_KEYS.APTITUDE, JSON.stringify(next));
      return next;
    });
  };

  const updateAptitudePractice = (id: string, count: number) => {
    setAptitudeListState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, practiceSolved: count } : item));
      localStorage.setItem(STORAGE_KEYS.APTITUDE, JSON.stringify(next));
      return next;
    });
  };

  const addCgpaRecord = (rec: Omit<CgpaRecord, 'id'>) => {
    const newRec: CgpaRecord = { ...rec, id: `cg-${Date.now()}` };
    setCgpaRecordsState((prev) => {
      const filtered = prev.filter((r) => r.semester !== rec.semester);
      const next = [...filtered, newRec].sort((a, b) => a.semester - b.semester);
      localStorage.setItem(STORAGE_KEYS.CGPA, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const deleteCgpaRecord = (id: string) => {
    setCgpaRecordsState((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.CGPA, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const addExamPlanner = (exam: Omit<ExamPlanner, 'id'>) => {
    const newExam: ExamPlanner = { ...exam, id: `ex-${Date.now()}` };
    setExamPlannersState((prev) => {
      const next = [...prev, newExam].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const toggleRevisionItem = (examId: string, dayIndex: number) => {
    setExamPlannersState((prev) => {
      const next = prev.map((exam) => {
        if (exam.id !== examId) return exam;
        const newPlan = exam.revisionPlan.map((step, idx) => {
          if (idx === dayIndex) {
            if (!step.done) awardXP(10);
            return { ...step, done: !step.done };
          }
          return step;
        });
        return { ...exam, revisionPlan: newPlan };
      });
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(next));
      return next;
    });
  };

  const updateCoreSubject = (id: string, updates: Partial<CoreSubject>) => {
    setCoreSubjectsState((prev) => {
      const next = prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub));
      localStorage.setItem(STORAGE_KEYS.CORE_SUBJECTS, JSON.stringify(next));
      return next;
    });
  };

  const toggleCoreTopic = (subjectId: string, topicIndex: number) => {
    setCoreSubjectsState((prev) => {
      const next = prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedTopics = sub.keyTopics.map((t, idx) => {
          if (idx === topicIndex) {
            if (!t.completed) awardXP(10);
            return { ...t, completed: !t.completed };
          }
          return t;
        });
        return { ...sub, keyTopics: updatedTopics };
      });
      localStorage.setItem(STORAGE_KEYS.CORE_SUBJECTS, JSON.stringify(next));
      return next;
    });
  };

  const addInternship = (internship: Omit<Internship, 'id'>) => {
    const newInt: Internship = { ...internship, id: `int-${Date.now()}` };
    setInternshipsState((prev) => {
      const next = [newInt, ...prev];
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const updateInternship = (id: string, updates: Partial<Internship>) => {
    setInternshipsState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(next));
      return next;
    });
  };

  const deleteInternship = (id: string) => {
    setInternshipsState((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProj: Project = { ...project, id: `proj-${Date.now()}` };
    setProjectsState((prev) => {
      const next = [newProj, ...prev];
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjectsState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjectsState((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const addMistakeLog = (mistake: Omit<MistakeLog, 'id'>) => {
    const newMistake: MistakeLog = { ...mistake, id: `mst-${Date.now()}` };
    setMistakesLogState((prev) => {
      const next = [newMistake, ...prev];
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const toggleMistakeResolved = (id: string) => {
    setMistakesLogState((prev) => {
      const next = prev.map((m) => {
        if (m.id === id) {
          if (!m.resolved) awardXP(15);
          return { ...m, resolved: !m.resolved };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(next));
      return next;
    });
  };

  const deleteMistake = (id: string) => {
    setMistakesLogState((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const addExternalCourse = (course: Omit<ExternalCourse, 'id'>) => {
    const newCourse: ExternalCourse = { ...course, id: `crs-${Date.now()}` };
    setExternalCoursesState((prev) => {
      const next = [newCourse, ...prev];
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const deleteExternalCourse = (id: string) => {
    setExternalCoursesState((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = { ...session, id: `ss-${Date.now()}` };
    setStudySessionsState((prev) => {
      const next = [newSession, ...prev];
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(next));
      return next;
    });
    awardXP(Math.round(session.durationMinutes / 3));
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const addStudyPlan = (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => {
    const newPlan: StudyPlan = {
      ...plan,
      id: `pln-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStudyPlansState((prev) => {
      const next = [newPlan, ...prev];
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(next));
      return next;
    });
    soundFx.playLevelUp();
  };

  const toggleStudyPlanDay = (planId: string, dayIndex: number) => {
    setStudyPlansState((prev) => {
      const next = prev.map((plan) => {
        if (plan.id !== planId) return plan;
        const newDays = plan.days.map((d, idx) => {
          if (idx === dayIndex) {
            if (!d.completed) awardXP(20);
            return { ...d, completed: !d.completed };
          }
          return d;
        });
        return { ...plan, days: newDays };
      });
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(next));
      return next;
    });
  };

  const deleteStudyPlan = (planId: string) => {
    setStudyPlansState((prev) => {
      const next = prev.filter((p) => p.id !== planId);
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  // Axiom Omni-Skill Course Management
  const addOmniCourse = (course: Omit<OmniCourse, 'id' | 'createdAt'>) => {
    const newCourse: OmniCourse = {
      ...course,
      id: `omni-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
      days: course.days.map((d) => ({
        ...d,
        completedTasks: d.completedTasks || d.tasks.map(() => false),
      })),
    };

    setOmniCoursesState((prev) => {
      // deactivate other courses
      const updated = prev.map((c) => ({ ...c, isActive: false }));
      const next = [newCourse, ...updated];
      localStorage.setItem(STORAGE_KEYS.OMNI_COURSES, JSON.stringify(next));
      return next;
    });
    soundFx.playLevelUp();
  };

  const setActiveOmniCourse = (courseId: string) => {
    setOmniCoursesState((prev) => {
      const next = prev.map((c) => ({ ...c, isActive: c.id === courseId }));
      localStorage.setItem(STORAGE_KEYS.OMNI_COURSES, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const toggleOmniTask = (courseId: string, dayNumber: number, taskIndex: number) => {
    setOmniCoursesState((prev) => {
      const next = prev.map((course) => {
        if (course.id !== courseId) return course;
        const updatedDays = course.days.map((day) => {
          if (day.day !== dayNumber) return day;
          const currentStatus = day.completedTasks || day.tasks.map(() => false);
          const nextStatus = [...currentStatus];
          nextStatus[taskIndex] = !nextStatus[taskIndex];
          if (nextStatus[taskIndex]) {
            awardXP(10);
          } else {
            soundFx.playClick();
          }
          return { ...day, completedTasks: nextStatus };
        });
        return { ...course, days: updatedDays };
      });
      localStorage.setItem(STORAGE_KEYS.OMNI_COURSES, JSON.stringify(next));
      return next;
    });
  };

  const deleteOmniCourse = (courseId: string) => {
    setOmniCoursesState((prev) => {
      const next = prev.filter((c) => c.id !== courseId);
      if (next.length > 0 && !next.some((c) => c.isActive)) {
        next[0].isActive = true;
      }
      localStorage.setItem(STORAGE_KEYS.OMNI_COURSES, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const toggleLinkedInTask = (id: string) => {
    setLinkedinTasksState((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          if (!t.isCompleted) awardXP(10);
          return { ...t, isCompleted: !t.isCompleted };
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEYS.LINKEDIN, JSON.stringify(next));
      return next;
    });
  };

  const toggleQuoteFavorite = (id: string) => {
    setQuotesState((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, favorite: !q.favorite } : q));
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const calculateCGPA = (): { runningCgpa: number; totalCredits: number } => {
    if (cgpaRecords.length === 0) return { runningCgpa: 0, totalCredits: 0 };
    let totalWeighted = 0;
    let totalCredits = 0;
    for (const rec of cgpaRecords) {
      totalWeighted += rec.sgpa * rec.credits;
      totalCredits += rec.credits;
    }
    const runningCgpa = totalCredits > 0 ? Number((totalWeighted / totalCredits).toFixed(2)) : 0;
    return { runningCgpa, totalCredits };
  };

  // --- Timetable Handlers ---
  const addTimetableEvent = (event: Omit<TimetableEvent, 'id'>) => {
    const newEvent: TimetableEvent = { ...event, id: `tt-${Date.now()}` };
    setTimetableEventsState((prev) => {
      const next = [...prev, newEvent];
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(next));
      return next;
    });
    awardXP(15);
    soundFx.playLevelUp();
  };

  const updateTimetableEvent = (id: string, updates: Partial<TimetableEvent>) => {
    setTimetableEventsState((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const deleteTimetableEvent = (id: string) => {
    setTimetableEventsState((prev) => {
      const next = prev.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const duplicateDaySchedule = (fromDay: number, toDay: number) => {
    setTimetableEventsState((prev) => {
      const sources = prev.filter((e) => e.dayOfWeek === fromDay);
      const targetExisting = prev.filter((e) => e.dayOfWeek !== toDay);
      const duplicated: TimetableEvent[] = sources.map((e, idx) => ({
        ...e,
        id: `tt-dup-${Date.now()}-${idx}`,
        dayOfWeek: toDay,
      }));
      const next = [...targetExisting, ...duplicated];
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(next));
      return next;
    });
    awardXP(10);
    soundFx.playLevelUp();
  };

  // --- Assignment Handlers ---
  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = { ...asg, id: `asg-${Date.now()}` };
    setAssignmentsState((prev) => {
      const next = [newAsg, ...prev];
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(next));
      return next;
    });
    awardXP(15);
    soundFx.playLevelUp();
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignmentsState((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const deleteAssignment = (id: string) => {
    setAssignmentsState((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const toggleAssignmentStatus = (id: string, status: Assignment['status']) => {
    setAssignmentsState((prev) => {
      const next = prev.map((a) => {
        if (a.id === id) {
          const isDone = status === 'COMPLETED';
          if (isDone && a.status !== 'COMPLETED') {
            awardXP(40);
            confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
          }
          return {
            ...a,
            status,
            completedAt: isDone ? new Date().toISOString() : undefined,
          };
        }
        return a;
      });
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(next));
      return next;
    });
    soundFx.playBlip();
  };

  // --- Flashcard Handlers ---
  const addFlashcardDeck = (deck: Omit<FlashcardDeck, 'id'>) => {
    const newDeck: FlashcardDeck = { ...deck, id: `deck-${Date.now()}` };
    setFlashcardDecksState((prev) => {
      const next = [...prev, newDeck];
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(next));
      return next;
    });
    awardXP(20);
    soundFx.playLevelUp();
  };

  const deleteFlashcardDeck = (deckId: string) => {
    setFlashcardDecksState((prev) => {
      const next = prev.filter((d) => d.id !== deckId);
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(next));
      return next;
    });
    soundFx.playClick();
  };

  const updateCardMastery = (deckId: string, cardId: string, mastery: Flashcard['mastery']) => {
    setFlashcardDecksState((prev) => {
      const next = prev.map((deck) => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.map((c) => {
            if (c.id === cardId) {
              const prevReview = c.reviewCount || 0;
              return { ...c, mastery, reviewCount: prevReview + 1 };
            }
            return c;
          });
          return { ...deck, cards: updatedCards };
        }
        return deck;
      });
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(next));
      return next;
    });
    awardXP(mastery === 'MASTERED' ? 15 : 5);
    soundFx.playBlip();
  };

  const addCardToDeck = (deckId: string, card: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = { ...card, id: `fc-${Date.now()}` };
    setFlashcardDecksState((prev) => {
      const next = prev.map((deck) => {
        if (deck.id === deckId) {
          return { ...deck, cards: [...deck.cards, newCard] };
        }
        return deck;
      });
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(next));
      return next;
    });
    awardXP(10);
    soundFx.playClick();
  };

  // --- Wellbeing Handlers ---
  const recordWellbeingCheckin = (stress: SelfReportedStress, energy: EnergyLevel, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newCheckin: WellbeingCheckin = {
      id: `wb-${Date.now()}`,
      date: today,
      stressLevel: stress,
      energyLevel: energy,
      notes,
      createdAt: new Date().toISOString(),
    };
    setWellbeingCheckinsState((prev) => {
      const filtered = prev.filter((c) => c.date !== today);
      const next = [newCheckin, ...filtered];
      localStorage.setItem(STORAGE_KEYS.WELLBEING, JSON.stringify(next));
      return next;
    });
    awardXP(25);
    soundFx.playLevelUp();
  };

  // Dynamically compute current workload assessment
  const getWorkloadAssessment = (): WorkloadAssessment => {
    const today = new Date().toISOString().split('T')[0];
    const latestCheckin = wellbeingCheckins.find((c) => c.date === today) || wellbeingCheckins[0];
    const pendingAsgs = assignments.filter((a) => a.status !== 'COMPLETED');
    const urgentAsgs = pendingAsgs.filter((a) => a.priority === 'URGENT' || a.priority === 'HIGH');

    let nearestDays: number | null = null;
    const now = Date.now();
    examPlanners.forEach((ex) => {
      const exTime = new Date(ex.examDate).getTime();
      const diff = Math.ceil((exTime - now) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && (nearestDays === null || diff < nearestDays)) {
        nearestDays = diff;
      }
    });

    const dayOfWeek = new Date().getDay() === 0 ? 7 : new Date().getDay();
    const todayClasses = timetableEvents.filter((e) => e.dayOfWeek === dayOfWeek);
    const classHours = todayClasses.reduce((acc, e) => {
      const [sh, sm] = e.startTime.split(':').map(Number);
      const [eh, em] = e.endTime.split(':').map(Number);
      return acc + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
    }, 0);

    return assessWorkload({
      pendingAssignmentCount: pendingAsgs.length,
      urgentAssignmentCount: urgentAsgs.length,
      daysUntilNearestExam: nearestDays,
      scheduledClassHoursToday: classHours,
      dsaDailyTargetCount: 2,
      selfReportedStress: latestCheckin?.stressLevel,
      selfReportedEnergy: latestCheckin?.energyLevel,
    });
  };

  // --- Daily Agenda Handlers ---
  const toggleAgendaSlotComplete = (slotId: string) => {
    setDailyAgendaState((prev) => {
      const next = prev.map((s) => {
        if (s.id === slotId) {
          const completed = !s.completed;
          if (completed) awardXP(15);
          return { ...s, completed };
        }
        return s;
      });
      localStorage.setItem(STORAGE_KEYS.DAILY_AGENDA, JSON.stringify(next));
      return next;
    });
    soundFx.playBlip();
  };

  const refreshDailyAgenda = () => {
    const dayOfWeek = new Date().getDay() === 0 ? 7 : new Date().getDay();
    const todayClasses = timetableEvents.filter((e) => e.dayOfWeek === dayOfWeek);
    const pendingAsgs = assignments.filter((a) => a.status !== 'COMPLETED').slice(0, 2);

    const generated: DailyScheduleSlot[] = [];

    // 1. Classes
    todayClasses.forEach((c) => {
      generated.push({
        id: `slot-cls-${c.id}`,
        timeSlot: `${c.startTime} - ${c.endTime}`,
        title: `${c.eventType}: ${c.title} (${c.room})`,
        type: 'CLASS',
        durationMinutes: 90,
        isLocked: true,
        completed: false,
      });
    });

    // 2. Pending Assignments
    pendingAsgs.forEach((a, idx) => {
      const startHour = 15 + idx * 2;
      generated.push({
        id: `slot-asg-${a.id}`,
        timeSlot: `${startHour}:00 - ${startHour + 1}:30`,
        title: `Assignment Sprint: ${a.title}`,
        type: 'ASSIGNMENT',
        durationMinutes: a.estimatedMinutes || 90,
        priority: a.priority as any,
        completed: false,
      });
    });

    // 3. Technical Mastery & Recall
    generated.push({
      id: `slot-dsa-${Date.now()}`,
      timeSlot: '19:30 - 20:30',
      title: '75+ DSA Pattern Practice (Target: 2 Problems)',
      type: 'DSA',
      durationMinutes: 60,
      priority: 'HIGH',
      completed: false,
    });

    generated.push({
      id: `slot-fc-${Date.now()}`,
      timeSlot: '21:00 - 21:30',
      title: 'Active Recall Flashcard Review (Core CS)',
      type: 'ROADMAP',
      durationMinutes: 30,
      priority: 'MEDIUM',
      completed: false,
    });

    setDailyAgendaState(generated);
    localStorage.setItem(STORAGE_KEYS.DAILY_AGENDA, JSON.stringify(generated));
    awardXP(10);
    soundFx.playLevelUp();
  };

  const resetToSampleData = () => {
    setProfileState(INITIAL_PROFILE);
    setDsaListState(DSA_SYLLABUS);
    setAptitudeListState(APTITUDE_TOPICS);
    setCgpaRecordsState(INITIAL_CGPA_RECORDS);
    setExamPlannersState(INITIAL_EXAM_PLANNERS);
    setCoreSubjectsState(CORE_SUBJECTS);
    setInternshipsState(INITIAL_INTERNSHIPS);
    setProjectsState(INITIAL_PROJECTS);
    setMistakesLogState(INITIAL_MISTAKES_LOG);
    setExternalCoursesState(INITIAL_EXTERNAL_COURSES);
    setStudySessionsState(INITIAL_STUDY_SESSIONS);
    setStudyPlansState(INITIAL_STUDY_PLANS);
    setOmniCoursesState(INITIAL_OMNI_COURSES);
    setLinkedinTasksState(LINKEDIN_TASKS);
    setQuotesState(QUOTES);
    setXpPointsState(420);
    setTimetableEventsState(INITIAL_TIMETABLE_EVENTS);
    setAssignmentsState(INITIAL_ASSIGNMENTS);
    setFlashcardDecksState(INITIAL_FLASHCARD_DECKS);
    setWellbeingCheckinsState(INITIAL_WELLBEING_CHECKINS);
    setDailyAgendaState(INITIAL_DAILY_AGENDA);

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(STORAGE_KEYS.DSA, JSON.stringify(DSA_SYLLABUS));
    localStorage.setItem(STORAGE_KEYS.APTITUDE, JSON.stringify(APTITUDE_TOPICS));
    localStorage.setItem(STORAGE_KEYS.CGPA, JSON.stringify(INITIAL_CGPA_RECORDS));
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAM_PLANNERS));
    localStorage.setItem(STORAGE_KEYS.CORE_SUBJECTS, JSON.stringify(CORE_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(INITIAL_INTERNSHIPS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(INITIAL_MISTAKES_LOG));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_EXTERNAL_COURSES));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_STUDY_SESSIONS));
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(INITIAL_STUDY_PLANS));
    localStorage.setItem(STORAGE_KEYS.OMNI_COURSES, JSON.stringify(INITIAL_OMNI_COURSES));
    localStorage.setItem(STORAGE_KEYS.LINKEDIN, JSON.stringify(LINKEDIN_TASKS));
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(QUOTES));
    localStorage.setItem(STORAGE_KEYS.XP, JSON.stringify(420));
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(INITIAL_TIMETABLE_EVENTS));
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(INITIAL_FLASHCARD_DECKS));
    localStorage.setItem(STORAGE_KEYS.WELLBEING, JSON.stringify(INITIAL_WELLBEING_CHECKINS));
    localStorage.setItem(STORAGE_KEYS.DAILY_AGENDA, JSON.stringify(INITIAL_DAILY_AGENDA));
  };

  const exportDataJSON = () => {
    const fullData = {
      profile,
      xpPoints,
      dsaList,
      aptitudeList,
      cgpaRecords,
      examPlanners,
      coreSubjects,
      internships,
      projects,
      mistakesLog,
      externalCourses,
      studySessions,
      studyPlans,
      omniCourses,
      linkedinTasks,
      timetableEvents,
      assignments,
      flashcardDecks,
      wellbeingCheckins,
      dailyAgenda,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Axiom-Career-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    profile,
    updateProfile,
    xpPoints,
    awardXP,
    theme,
    setTheme,
    toggleTheme,
    retroMode,
    toggleRetroMode,
    dsaList,
    toggleDsaComplete,
    addDsaTopic,
    aptitudeList,
    toggleAptitudeComplete,
    updateAptitudePractice,
    cgpaRecords,
    addCgpaRecord,
    deleteCgpaRecord,
    calculateCGPA,
    examPlanners,
    addExamPlanner,
    toggleRevisionItem,
    coreSubjects,
    updateCoreSubject,
    toggleCoreTopic,
    internships,
    addInternship,
    updateInternship,
    deleteInternship,
    projects,
    addProject,
    updateProject,
    deleteProject,
    mistakesLog,
    addMistakeLog,
    toggleMistakeResolved,
    deleteMistake,
    externalCourses,
    addExternalCourse,
    deleteExternalCourse,
    studySessions,
    addStudySession,
    studyPlans,
    addStudyPlan,
    toggleStudyPlanDay,
    deleteStudyPlan,
    omniCourses,
    addOmniCourse,
    setActiveOmniCourse,
    toggleOmniTask,
    deleteOmniCourse,
    linkedinTasks,
    toggleLinkedInTask,
    quotes,
    toggleQuoteFavorite,
    resetToSampleData,
    exportDataJSON,
    // EduMate additions
    timetableEvents,
    addTimetableEvent,
    updateTimetableEvent,
    deleteTimetableEvent,
    duplicateDaySchedule,
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentStatus,
    flashcardDecks,
    addFlashcardDeck,
    deleteFlashcardDeck,
    updateCardMastery,
    addCardToDeck,
    wellbeingCheckins,
    recordWellbeingCheckin,
    getWorkloadAssessment,
    dailyAgenda,
    toggleAgendaSlotComplete,
    refreshDailyAgenda,
  };
}
