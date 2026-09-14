import { GroupProject, BacklogItem, SleepLogEntry, StudyBuddyConfig, Track } from '../types';

export const INITIAL_GROUP_PROJECTS: GroupProject[] = [
  {
    id: 'grp-1',
    title: 'Distributed In-Memory Cache Engine with Raft Consensus',
    courseOrSubject: 'Distributed Systems & Operating Systems',
    track: 'engineering',
    repositoryUrl: 'https://github.com/axiom-team/distributed-cache',
    deadlineDate: '2026-09-28',
    members: [
      { id: 'm-1', name: 'Naveen (Lead)', role: 'Core Architecture & Go Engine', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', isSelf: true },
      { id: 'm-2', name: 'Arjun K.', role: 'TCP Protocol & Benchmarks', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { id: 'm-3', name: 'Priya M.', role: 'Testing & Docker Clustering', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    ],
    tasks: [
      {
        id: 'gt-1',
        title: 'Implement Segmented Mutex Locking in Go',
        description: 'Reduce lock contention across 16 worker goroutines to achieve 45k+ QPS.',
        stage: 'DONE',
        assignedMemberIds: ['m-1'],
        deadlineDate: '2026-09-10',
        priority: 'HIGH',
        estimatedHours: 6,
      },
      {
        id: 'gt-2',
        title: 'Draft RESP Client Parser and Serialization Protocol',
        description: 'Support Redis-compatible GET, SET, and EXPIRE commands over raw TCP sockets.',
        stage: 'IN_PROGRESS',
        assignedMemberIds: ['m-1', 'm-2'],
        deadlineDate: '2026-09-18',
        priority: 'HIGH',
        estimatedHours: 8,
        clashAlert: 'Arjun has lecture clash on Fri 11:00 AM (Algorithms Lab)',
      },
      {
        id: 'gt-3',
        title: 'Configure 3-Node Raft Cluster Simulation in Docker Compose',
        description: 'Test network partition failover and leader election timeouts.',
        stage: 'BACKLOG',
        assignedMemberIds: ['m-2', 'm-3'],
        deadlineDate: '2026-09-24',
        priority: 'MEDIUM',
        estimatedHours: 10,
      },
      {
        id: 'gt-4',
        title: 'Benchmark QPS Latency & Jitter Percentiles (p95/p99)',
        description: 'Execute wrk / vegeta load tests against concurrent GET requests.',
        stage: 'BACKLOG',
        assignedMemberIds: ['m-3'],
        deadlineDate: '2026-09-26',
        priority: 'LOW',
        estimatedHours: 4,
      },
    ],
  },
  {
    id: 'grp-2',
    title: 'Ind AS 115 Multi-Element Construction Contract Audit Simulation',
    courseOrSubject: 'Financial Accounting & Ind AS',
    track: 'commerce',
    deadlineDate: '2026-09-30',
    members: [
      { id: 'm-4', name: 'Naveen (Lead)', role: 'Revenue Allocation Models', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', isSelf: true },
      { id: 'm-5', name: 'Ritu S.', role: 'Variable Consideration Risk Assessment', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
    ],
    tasks: [
      {
        id: 'gt-5',
        title: 'Step 3: Estimate Variable Consideration Penalty Constraints',
        stage: 'IN_PROGRESS',
        assignedMemberIds: ['m-4', 'm-5'],
        deadlineDate: '2026-09-20',
        priority: 'HIGH',
        estimatedHours: 5,
      },
    ],
  },
];

export const INITIAL_BACKLOG_ITEMS: BacklogItem[] = [
  {
    id: 'bkl-1',
    subjectCode: 'MA201',
    subjectName: 'Linear Algebra & Transform Calculus',
    track: 'engineering',
    originalSemester: 2,
    credits: 4,
    difficulty: 'Hard',
    status: 'Registered',
    targetExamDate: '2026-10-14',
    attemptCount: 1,
    priority: 'CRITICAL',
    notes: 'Focus on Eigenvalues/Eigenvectors diagonalization and Laplace Transform boundary value solves.',
  },
  {
    id: 'bkl-2',
    subjectCode: 'EC204',
    subjectName: 'Digital Logic & Microprocessors',
    track: 'engineering',
    originalSemester: 3,
    credits: 3,
    difficulty: 'Medium',
    status: 'Pending',
    targetExamDate: '2026-11-05',
    attemptCount: 1,
    priority: 'HIGH',
    notes: 'Revise Karnaugh Maps minimization and 8086 timing state diagrams.',
  },
];

export const INITIAL_SLEEP_LOGS: SleepLogEntry[] = [
  { id: 'slp-1', date: '2026-09-01', hoursSlept: 7.5, quality: 'RESTED', targetHours: 8 },
  { id: 'slp-2', date: '2026-09-02', hoursSlept: 6.0, quality: 'TIRED', targetHours: 8 },
  { id: 'slp-3', date: '2026-09-03', hoursSlept: 5.5, quality: 'TIRED', targetHours: 8 },
  { id: 'slp-4', date: '2026-09-04', hoursSlept: 8.0, quality: 'EXCELLENT', targetHours: 8 },
  { id: 'slp-5', date: '2026-09-05', hoursSlept: 6.5, quality: 'RESTED', targetHours: 8 },
  { id: 'slp-6', date: '2026-09-06', hoursSlept: 7.0, quality: 'RESTED', targetHours: 8 },
];

export const INITIAL_STUDY_BUDDY: StudyBuddyConfig = {
  buddyName: 'Arjun K.',
  buddyContact: 'arjun.code@axiom.edu',
  dailyPingTime: '18:30',
  studyPactGoal: 'Daily 2 hrs DSA / Practice Sheet + 1 Core Subject Topic Drill',
  lastPingDate: '2026-09-05',
  totalPingsSent: 12,
};
