/**
 * Axiom EduMate / Campus2Career AI — Discipline Environment Synthesizer
 *
 * Automatically calibrates and populates the user's entire learning environment
 * (target goals, core subjects, AI mentor persona, practice sheets, flashcard decks,
 * and high-yield academic assignments) based on their chosen academic vertical.
 */

import { Track, UserProfile, Assignment, FlashcardDeck, ExamPlanner, AgendaSlot } from '../types';
import { TRACK_DEFINITIONS } from '../context/TrackContext';
import { getCoreSubjectsForTrack, getExamPlannersForTrack } from '../data/coreSubjects';

export interface SynthesizedEnvironment {
  profileUpdates: Partial<UserProfile>;
  assignments: Assignment[];
  flashcardDecks: FlashcardDeck[];
  examPlanners: ExamPlanner[];
  dailyAgenda: AgendaSlot[];
}

export function getTrackTargetGoals(track: Track): { targetCompanies: string[]; bio: string; targetRole: string } {
  switch (track) {
    case 'medical':
      return {
        targetCompanies: ['AIIMS New Delhi', 'PGIMER Chandigarh', 'CMC Vellore', 'JIPMER', 'USMLE Clinical Residency'],
        targetRole: 'Resident Physician / NEET-PG Top Ranker',
        bio: 'Clinical Intern & Medical Scholar | Preparing for NEET-PG & USMLE | Focused on Internal Medicine, Pathology & High-Yield Diagnostics.',
      };
    case 'law':
      return {
        targetCompanies: ['Supreme Court of India', 'Trilegal', 'Shardul Amarchand Mangaldas', 'AZB & Partners', 'Judicial Services'],
        targetRole: 'Judicial Magistrate / Senior Corporate Legal Counsel',
        bio: 'Law Scholar | Judiciary & Corporate Law Aspirant | Specializing in Constitutional Law, Criminal Jurisprudence & Dispute Resolution.',
      };
    case 'commerce':
      return {
        targetCompanies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Goldman Sachs', 'Morgan Stanley', 'McKinsey'],
        targetRole: 'Chartered Accountant / Investment Banking Analyst',
        bio: 'CA Finalist & Financial Analyst | Mastering Ind AS, Direct & Indirect Taxation, Corporate Audit and Valuation Models.',
      };
    case 'competitive_exams':
      return {
        targetCompanies: ['UPSC Civil Services (IAS/IPS)', 'RBI Grade B', 'State Public Service Commission', 'NITI Aayog', 'CAG of India'],
        targetRole: 'Civil Services Officer (IAS/IPS) / Public Administrator',
        bio: 'Civil Services Aspirant | Focused on GS Papers 1-4, Current Affairs Synthesis, Answer Writing Mastery & Public Policy.',
      };
    case 'humanities':
      return {
        targetCompanies: ['UNESCO Fellowships', 'ICSSR Policy Research', 'Centre for Policy Research', 'Academic Think Tanks'],
        targetRole: 'Policy Analyst / Academic Researcher / UGC-NET Scholar',
        bio: 'Humanities & Social Sciences Researcher | Specializing in Political Theory, Historiography, Public Governance & Qualitative Research.',
      };
    case 'other':
      return {
        targetCompanies: ['Global Fellowship Program', 'Innovation Labs', 'Deep Work Institute'],
        targetRole: 'Interdisciplinary Specialist & Independent Scholar',
        bio: 'Lifelong Learner & Cross-Disciplinary Innovator | Mastering First-Principles Thinking, Cognitive Systems & Practical Problem Solving.',
      };
    case 'engineering':
    default:
      return {
        targetCompanies: ['Google', 'Microsoft', 'Atlassian', 'Amazon', 'Adobe', 'Uber'],
        targetRole: 'Software Development Engineer (SDE 1) / Systems Architect',
        bio: '2nd Year B.Tech CSE | SDE Aspirant | 250+ LeetCode Solved | Building scalable distributed systems & mastering DSA.',
      };
  }
}

export function generateTrackAssignments(track: Track): Assignment[] {
  const today = new Date();
  const addDays = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().slice(0, 16);

  switch (track) {
    case 'medical':
      return [
        {
          id: `asg-med-1`,
          title: 'Acute Coronary Syndrome Clinical Case Report',
          subjectName: 'General Medicine & Cardiology',
          description: 'Document diagnostic workup: STEMI vs NSTEMI ECG criteria, troponin-I kinetics, and dual antiplatelet regimen guidelines.',
          deadline: addDays(4),
          priority: 'URGENT',
          estimatedMinutes: 90,
          status: 'IN_PROGRESS',
        },
        {
          id: `asg-med-2`,
          title: 'Antibiotic Stewardship in Sepsis Protocol',
          subjectName: 'Pharmacology & Microbiology',
          description: 'Construct empiric antimicrobial escalation algorithm considering hospital-acquired MRSA and pseudomonal resistance profiles.',
          deadline: addDays(7),
          priority: 'HIGH',
          estimatedMinutes: 75,
          status: 'TODO',
        },
        {
          id: `asg-med-3`,
          title: 'Histopathological Grading of Glomerulonephritis',
          subjectName: 'Pathology & Renal Medicine',
          description: 'Review light microscopy and immunofluorescence biopsy findings for IgA nephropathy vs Membranous nephropathy.',
          deadline: addDays(11),
          priority: 'MEDIUM',
          estimatedMinutes: 60,
          status: 'TODO',
        },
      ];

    case 'law':
      return [
        {
          id: `asg-law-1`,
          title: 'Constitutional Writ Petition (Article 32 / 226) Drafting',
          subjectName: 'Constitutional Law',
          description: 'Draft a complete Mandamus petition challenging administrative arbitrariness with relevant Supreme Court precedents.',
          deadline: addDays(3),
          priority: 'URGENT',
          estimatedMinutes: 120,
          status: 'IN_PROGRESS',
        },
        {
          id: `asg-law-2`,
          title: 'Comparative Analysis: IPC vs Bharatiya Nyaya Sanhita 2023',
          subjectName: 'Criminal Jurisprudence',
          description: 'Examine procedural shifts in electronic evidence admissibility, custody rules, and modified offense thresholds.',
          deadline: addDays(6),
          priority: 'HIGH',
          estimatedMinutes: 90,
          status: 'TODO',
        },
        {
          id: `asg-law-3`,
          title: 'Cross-Border Merger Due Diligence Memorandum',
          subjectName: 'Corporate & Competition Law',
          description: 'Analyze antitrust threshold notifications, minority shareholder squeeze-out rights, and FEMA compliance checklists.',
          deadline: addDays(10),
          priority: 'MEDIUM',
          estimatedMinutes: 80,
          status: 'TODO',
        },
      ];

    case 'commerce':
      return [
        {
          id: `asg-com-1`,
          title: 'Ind AS 115 Five-Step Revenue Recognition Case Study',
          subjectName: 'Financial Reporting & Accounting',
          description: 'Evaluate multi-element bundled software contract revenue allocation using stand-alone selling price methods.',
          deadline: addDays(4),
          priority: 'URGENT',
          estimatedMinutes: 90,
          status: 'IN_PROGRESS',
        },
        {
          id: `asg-com-2`,
          title: 'Corporate Direct Tax & Transfer Pricing Audit Working Paper',
          subjectName: 'Direct Taxation & Tax Audit',
          description: 'Perform Comparable Uncontrolled Price (CUP) benchmarking and calculate MAT credit entitlement under Sec 115JB.',
          deadline: addDays(7),
          priority: 'HIGH',
          estimatedMinutes: 100,
          status: 'TODO',
        },
        {
          id: `asg-com-3`,
          title: 'Discounted Cash Flow (DCF) Valuation Model for Tech IPO',
          subjectName: 'Strategic Financial Management',
          description: 'Build 5-year forecast with WACC sensitivity table and terminal value multiple sensitivity scenarios.',
          deadline: addDays(12),
          priority: 'MEDIUM',
          estimatedMinutes: 85,
          status: 'TODO',
        },
      ];

    case 'competitive_exams':
      return [
        {
          id: `asg-upsc-1`,
          title: 'GS Paper 2: Cooperative Federalism & Fiscal Devolution Critique',
          subjectName: 'Indian Polity & Governance',
          description: 'Write a 250-word structured mains answer examining Finance Commission recommendations and state revenue autonomy.',
          deadline: addDays(3),
          priority: 'URGENT',
          estimatedMinutes: 60,
          status: 'IN_PROGRESS',
        },
        {
          id: `asg-upsc-2`,
          title: 'Economic Survey Trends: Inflation Dynamics & Monetary Transmission',
          subjectName: 'Indian Economy & Macroeconomics',
          description: 'Synthesize food inflation driver indices and RBI policy repo rate impact on private capital expenditure.',
          deadline: addDays(6),
          priority: 'HIGH',
          estimatedMinutes: 80,
          status: 'TODO',
        },
        {
          id: `asg-upsc-3`,
          title: 'GS-4 Ethics Case Study: Conflict of Interest in Public Procurement',
          subjectName: 'Ethics, Integrity & Aptitude',
          description: 'Structure multi-stakeholder ethical dilemma analysis: duty vs personal loyalty with corrective safeguards.',
          deadline: addDays(9),
          priority: 'MEDIUM',
          estimatedMinutes: 70,
          status: 'TODO',
        },
      ];

    case 'humanities':
      return [
        {
          id: `asg-hum-1`,
          title: 'Post-Colonial Historiographical Critique of Agrarian Settlements',
          subjectName: 'Modern History & Historiography',
          description: 'Analyze permanent settlement records in Bengal using Subaltern Studies paradigm vs colonial administrative reports.',
          deadline: addDays(5),
          priority: 'HIGH',
          estimatedMinutes: 90,
          status: 'IN_PROGRESS',
        },
        {
          id: `asg-hum-2`,
          title: 'Qualitative Sociology Field Research Design Matrix',
          subjectName: 'Sociological Research Methodology',
          description: 'Design semi-structured interview protocol with triangulation and reflexivity safeguards for urban migration study.',
          deadline: addDays(9),
          priority: 'MEDIUM',
          estimatedMinutes: 75,
          status: 'TODO',
        },
      ];

    case 'other':
      return [
        {
          id: `asg-oth-1`,
          title: 'First-Principles Problem Decomposition Matrix',
          subjectName: 'Applied Cognitive Systems',
          description: 'Deconstruct complex multi-variable domain bottlenecks into fundamental physical and logical axioms.',
          deadline: addDays(4),
          priority: 'HIGH',
          estimatedMinutes: 60,
          status: 'IN_PROGRESS',
        },
      ];

    case 'engineering':
    default:
      return [
        {
          id: `asg-eng-1`,
          title: 'Thread Pool & Producer-Consumer in C++',
          subjectName: 'Operating Systems',
          description: 'Implement a bounded buffer multi-threaded producer-consumer queue with condition variables and mutex locks without busy-waiting.',
          deadline: addDays(4),
          priority: 'URGENT',
          estimatedMinutes: 120,
          status: 'IN_PROGRESS',
        },
        {
          id: `asg-eng-2`,
          title: 'B+ Tree Indexing & Query Optimization Report',
          subjectName: 'Database Management Systems',
          description: 'Analyze query explain plans comparing sequential scans vs clustered B+ Tree index scans on 1M rows dataset.',
          deadline: addDays(7),
          priority: 'HIGH',
          estimatedMinutes: 90,
          status: 'TODO',
        },
        {
          id: `asg-eng-3`,
          title: 'Dynamic Programming LCS & Sequence Alignment',
          subjectName: 'Design & Analysis of Algorithms',
          description: 'Implement bottom-up tabular LCS with backtracking reconstructor and space optimization to O(min(m,n)).',
          deadline: addDays(11),
          priority: 'MEDIUM',
          estimatedMinutes: 75,
          status: 'TODO',
        },
      ];
  }
}

export function generateTrackFlashcardDecks(track: Track): FlashcardDeck[] {
  const meta = TRACK_DEFINITIONS[track] || TRACK_DEFINITIONS.engineering;

  switch (track) {
    case 'medical':
      return [
        {
          id: 'deck-med-1',
          title: 'Cardiovascular Pharmacology & Autonomic Drugs',
          subject: 'Pharmacology',
          track: 'medical',
          color: 'from-rose-600 to-red-700',
          createdAt: new Date().toISOString(),
          cards: [
            {
              id: 'c-med-1',
              front: 'Mechanism of action of Beta-1 selective antagonists in heart failure?',
              back: 'Reduces myocardial oxygen demand, inhibits chronic sympathetic neurohormonal toxicity, and prevents adverse ventricular remodeling (e.g. Bisoprolol, Carvedilol).',
              difficulty: 'MEDIUM',
              masteryScore: 2,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Autonomic System',
            },
            {
              id: 'c-med-2',
              front: 'Classic triad of Acute Cardiac Tamponade (Beck\'s Triad)?',
              back: '1. Hypotension with narrowed pulse pressure\n2. Distended jugular veins (elevated JVP)\n3. Muffled / distant heart sounds.',
              difficulty: 'EASY',
              masteryScore: 3,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Clinical Diagnostics',
            },
            {
              id: 'c-med-3',
              front: 'First-line medication for Acute Anaphylactic Shock?',
              back: 'Intramuscular Epinephrine (Adrenaline) 1:1000 dilution (0.3 - 0.5 mg) in the anterolateral thigh.',
              difficulty: 'EASY',
              masteryScore: 3,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Emergency Medicine',
            },
          ],
        },
      ];

    case 'law':
      return [
        {
          id: 'deck-law-1',
          title: 'Constitutional Law Doctrines & Judicial Review',
          subject: 'Constitutional Law',
          track: 'law',
          color: 'from-amber-600 to-orange-700',
          createdAt: new Date().toISOString(),
          cards: [
            {
              id: 'c-law-1',
              front: 'What is the Doctrine of Basic Structure (Kesavananda Bharati case)?',
              back: 'Parliament has wide amending power under Article 368, but cannot alter or destroy the foundational pillars/basic features of the Constitution (democracy, rule of law, separation of powers, judicial review).',
              difficulty: 'EASY',
              masteryScore: 3,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Constitutional Doctrines',
            },
            {
              id: 'c-law-2',
              front: 'Doctrine of Severability (Article 13(1)) meaning?',
              back: 'If a statute offends fundamental rights, only the unconstitutional provisions are declared void, provided the remaining valid portion can operate independently.',
              difficulty: 'MEDIUM',
              masteryScore: 2,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Fundamental Rights',
            },
          ],
        },
      ];

    case 'commerce':
      return [
        {
          id: 'deck-com-1',
          title: 'Ind AS & Corporate Taxation Core High-Yields',
          subject: 'Accounting & Taxation',
          track: 'commerce',
          color: 'from-emerald-600 to-teal-700',
          createdAt: new Date().toISOString(),
          cards: [
            {
              id: 'c-com-1',
              front: 'Ind AS 115: What are the 5 steps for Revenue Recognition?',
              back: '1. Identify contract with customer\n2. Identify performance obligations\n3. Determine transaction price\n4. Allocate price to performance obligations\n5. Recognize revenue when/as obligations are satisfied.',
              difficulty: 'EASY',
              masteryScore: 3,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Financial Reporting',
            },
            {
              id: 'c-com-2',
              front: 'Section 115BAA corporate tax rate and key conditions?',
              back: 'Concessional base tax rate of 22% (effective 25.17% with 10% surcharge and 4% cess) provided the company foregoes specified deductions (Sec 10AA, 35AD, additional depreciation).',
              difficulty: 'MEDIUM',
              masteryScore: 2,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Direct Taxation',
            },
          ],
        },
      ];

    case 'competitive_exams':
      return [
        {
          id: 'deck-upsc-1',
          title: 'UPSC Mains GS-2: Polity & Statutory Bodies',
          subject: 'Indian Polity',
          track: 'competitive_exams',
          color: 'from-cyan-600 to-teal-700',
          createdAt: new Date().toISOString(),
          cards: [
            {
              id: 'c-upsc-1',
              front: 'Article 280: Mandate and Key Composition of Finance Commission?',
              back: 'Quasi-judicial body constituted by the President every 5th year. Recommends vertical & horizontal tax devolution between Union and States, and grants-in-aid under Article 275.',
              difficulty: 'EASY',
              masteryScore: 3,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Constitutional Bodies',
            },
            {
              id: 'c-upsc-2',
              front: 'S.R. Bommai vs Union of India (1994) significance for Article 356?',
              back: 'Proclamation of President\'s Rule is subject to judicial review. Secularism is part of the basic structure. Dissolution of State Assembly is valid only after Parliamentary approval.',
              difficulty: 'MEDIUM',
              masteryScore: 2,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Judicial Precedents',
            },
          ],
        },
      ];

    case 'humanities':
    case 'other':
    case 'engineering':
    default:
      return [
        {
          id: 'deck-eng-1',
          title: 'Core Systems: OS Concurrency & Deadlocks',
          subject: 'Operating Systems',
          track: 'engineering',
          color: 'from-indigo-600 to-purple-700',
          createdAt: new Date().toISOString(),
          cards: [
            {
              id: 'c-eng-1',
              front: 'What are the four Coffman conditions required for Deadlock to occur?',
              back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait.\n(All 4 must hold simultaneously).',
              difficulty: 'EASY',
              masteryScore: 3,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Process Synchronization',
            },
            {
              id: 'c-eng-2',
              front: 'Difference between Mutex and Binary Semaphore?',
              back: 'A Mutex has ownership (only the lock-acquiring thread can release it). A Semaphore is a signaling primitive (any thread can post/signal).',
              difficulty: 'MEDIUM',
              masteryScore: 2,
              lastReviewed: new Date().toISOString(),
              subtopic: 'Concurrency Primitives',
            },
          ],
        },
      ];
  }
}

export function generateTrackDailyAgenda(track: Track): AgendaSlot[] {
  const meta = TRACK_DEFINITIONS[track] || TRACK_DEFINITIONS.engineering;

  switch (track) {
    case 'medical':
      return [
        {
          id: 'slot-med-1',
          timeSlot: '08:30 - 10:00',
          title: 'Clinical Ward Case Rounds & Diagnostic Discussions',
          type: 'EXAM',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
        {
          id: 'slot-med-2',
          timeSlot: '11:00 - 12:30',
          title: 'Pharmacology High-Yield Flashcard Recall',
          type: 'ROADMAP',
          durationMinutes: 90,
          priority: 'MEDIUM',
          completed: false,
        },
        {
          id: 'slot-med-3',
          timeSlot: '16:00 - 17:30',
          title: 'NEET-PG / USMLE Clinical Case Practice Sheet',
          type: 'DSA',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
      ];

    case 'law':
      return [
        {
          id: 'slot-law-1',
          timeSlot: '09:00 - 10:30',
          title: 'Constitutional Law Writ Briefing & Case Precedents',
          type: 'EXAM',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
        {
          id: 'slot-law-2',
          timeSlot: '14:00 - 15:30',
          title: 'Statute & Judgment Practice Sheet Revision',
          type: 'DSA',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
      ];

    case 'commerce':
      return [
        {
          id: 'slot-com-1',
          timeSlot: '09:00 - 10:30',
          title: 'Ind AS 115 Revenue Accounting & Tax Audit Practice',
          type: 'EXAM',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
        {
          id: 'slot-com-2',
          timeSlot: '14:30 - 16:00',
          title: 'Finance & Tax Practice Sheet Session',
          type: 'DSA',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
      ];

    case 'competitive_exams':
      return [
        {
          id: 'slot-upsc-1',
          timeSlot: '08:00 - 09:30',
          title: 'The Hindu / Indian Express Editorial & Policy Synthesis',
          type: 'ROADMAP',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
        {
          id: 'slot-upsc-2',
          timeSlot: '11:00 - 12:30',
          title: 'GS Paper 2 Mains Answer Writing & Peer Review',
          type: 'DSA',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
      ];

    case 'humanities':
    case 'other':
    case 'engineering':
    default:
      return [
        {
          id: 'slot-eng-1',
          timeSlot: '09:00 - 10:30',
          title: 'Operating Systems & System Architecture Deep Dive',
          type: 'EXAM',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
        {
          id: 'slot-eng-2',
          timeSlot: '14:00 - 15:30',
          title: '75+ DSA Practice: Monotonic Stack & Sliding Window',
          type: 'DSA',
          durationMinutes: 90,
          priority: 'HIGH',
          completed: false,
        },
      ];
  }
}

/**
 * Synthesize complete environment bundle for a discipline track
 */
export function synthesizeEnvironmentForTrack(
  track: Track,
  baseProfile?: Partial<UserProfile>
): SynthesizedEnvironment {
  const meta = TRACK_DEFINITIONS[track] || TRACK_DEFINITIONS.engineering;
  const targetGoals = getTrackTargetGoals(track);

  const profileUpdates: Partial<UserProfile> = {
    track,
    branch: baseProfile?.branch || meta.label,
    targetCompanies: targetGoals.targetCompanies,
    targetRole: targetGoals.targetRole,
    bio: baseProfile?.bio || targetGoals.bio,
    streakCount: baseProfile?.streakCount ?? 7,
    xpPoints: baseProfile?.xpPoints ?? 420,
  };

  const assignments = generateTrackAssignments(track);
  const flashcardDecks = generateTrackFlashcardDecks(track);
  const examPlanners = getExamPlannersForTrack(track);
  const dailyAgenda = generateTrackDailyAgenda(track);

  return {
    profileUpdates,
    assignments,
    flashcardDecks,
    examPlanners,
    dailyAgenda,
  };
}
