import {
  TimetableEvent,
  ChatMessage,
  FlashcardDeck,
  OmniCourse,
  Assignment,
} from '../../types';

// Intentional clash on Monday for Demo Step 4
export const DEMO_CLASH_EVENT: TimetableEvent = {
  id: 'tt-clash-demo',
  title: 'Operating Systems Kernel Concurrency Lab',
  subjectCode: 'CS504L',
  dayOfWeek: 1, // Monday
  startTime: '10:00',
  endTime: '11:45',
  room: 'Hall 302',
  teacher: 'Prof. R. Deshmukh',
  eventType: 'LAB',
  color: '#ec4899',
  isLocked: false,
};

// Rich seed chat for Step 10
export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-0',
    role: 'model',
    content: `👋 Hello **Naveen**! I am your **Axiom Placement & Technical Mentor**.\n\nI have analyzed your target companies (**Google, Microsoft, Atlassian**) and your solved DSA patterns.\n\nHere is your immediate action plan:\n1. **Sliding Window & Monotonic Queue**: Crucial for Google OA.\n2. **Low-Level Concurrency**: Key focus for Atlassian's platform team.\n3. **STAR Stories**: Quantify your Distributed Cache benchmarks.`,
    timestamp: '10:30 AM',
  },
  {
    id: 'msg-1',
    role: 'user',
    content: 'How should I structure my STAR story for the Distributed In-Memory Cache project when asked about concurrency bottlenecks?',
    timestamp: '10:32 AM',
  },
  {
    id: 'msg-2',
    role: 'model',
    content: `Here is the optimal **STAR framework** formulation for your Go cache:\n\n* **Situation**: In my distributed in-memory cache, concurrent reads and writes across 16 worker threads led to a 65% lock contention bottleneck on global mutexes.\n* **Task**: Redesign synchronization to achieve 45,000+ QPS without risking race conditions or dirty reads.\n* **Action**: Re-architected storage into 32 segmented mutex partitions using FNV-1a hashing, and wrote lock-free read paths with atomic pointers.\n* **Result**: Reduced thread wait times by 72% and benchmarked 48,200 QPS with sub-millisecond p99 latency.\n\nRecruiters love hearing concrete partition numbers and latency percentiles!`,
    timestamp: '10:33 AM',
  },
];

// Rich flashcards seed for Step 6
export const DEMO_ACTIVE_CARD = {
  id: 'fc-demo-1',
  front: 'What are the 4 Coffman Conditions required for a Deadlock to occur?',
  back: '1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (process holds resource while requesting another)\n3. No Preemption (resources cannot be forcibly confiscated)\n4. Circular Wait (closed loop chain of processes each waiting for next)',
  subtopic: 'Operating Systems & Concurrency',
  difficulty: 'HARD' as const,
  mastery: 'LEARNING' as const,
  reviewCount: 4,
};
