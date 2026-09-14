import { Track } from '../types';

export interface TrackRadarCategory {
  title: string;
  code: string;
  weightagePercent: number;
  status: 'Mastered' | 'On Track' | 'Needs Practice' | 'Critical';
  solvedCount: number;
  totalCount: number;
  keyHighlights: string[];
}

export interface TrackRadarConfig {
  track: Track;
  radarTitle: string;
  radarSubtitle: string;
  badgeLabel: string;
  platformSyncName: string;
  platformSyncSubtitle: string;
  totalTargetMetric: string;
  categories: TrackRadarCategory[];
  highYieldTips: string[];
}

export const TRACK_RADAR_CONFIGS: Record<Track, TrackRadarConfig> = {
  engineering: {
    track: 'engineering',
    radarTitle: '75+ Blind DSA Patterns Radar',
    radarSubtitle: 'Algorithmic pattern taxonomy & LeetCode / GitHub live commit sync',
    badgeLabel: 'SDE Technical Benchmark',
    platformSyncName: 'LeetCode & GitHub Sync',
    platformSyncSubtitle: 'Live contest ratings, commit heatmaps & acceptance percentages',
    totalTargetMetric: '75 Patterns',
    categories: [
      {
        title: 'Two Pointers & Sliding Window',
        code: 'ENG-TP',
        weightagePercent: 25,
        status: 'Mastered',
        solvedCount: 12,
        totalCount: 12,
        keyHighlights: ['Longest Substring Without Repeating', 'Minimum Window Substring', '3Sum Optimal'],
      },
      {
        title: 'Dynamic Programming & Recurrence',
        code: 'ENG-DP',
        weightagePercent: 30,
        status: 'On Track',
        solvedCount: 15,
        totalCount: 22,
        keyHighlights: ['0/1 Knapsack', 'Longest Common Subsequence', 'Matrix Chain Multiplication'],
      },
      {
        title: 'Graph BFS/DFS & Disjoint Sets',
        code: 'ENG-GR',
        weightagePercent: 25,
        status: 'Needs Practice',
        solvedCount: 8,
        totalCount: 16,
        keyHighlights: ['Topological Sort', 'Dijkstra Shortest Path', 'DSU Cycle Detection'],
      },
      {
        title: 'Monotonic Stack & Heap Invariants',
        code: 'ENG-ST',
        weightagePercent: 20,
        status: 'On Track',
        solvedCount: 9,
        totalCount: 14,
        keyHighlights: ['Next Greater Element', 'Largest Rectangle in Histogram', 'Task Scheduler'],
      },
    ],
    highYieldTips: [
      'Focus on pattern recognition rather than memorizing exact problem statements.',
      'Always state Time and Space complexity constraints before writing code.',
      'Test empty, single-element, and maximum constraint boundary inputs.',
    ],
  },

  commerce: {
    track: 'commerce',
    radarTitle: 'CA / CFA Financial Standards & Case Radar',
    radarSubtitle: 'Ind AS / IFRS compliance, statutory audit & corporate tax valuation radar',
    badgeLabel: 'Chartered Accounting & Financial Advisory',
    platformSyncName: 'ICAI & MCA Compliance Portal Sync',
    platformSyncSubtitle: 'Live standard notifications, audit circulars & MCA compliance filings',
    totalTargetMetric: '45 Core Standards',
    categories: [
      {
        title: 'Ind AS 115 & 116 Revenue & Leases',
        code: 'COM-REV',
        weightagePercent: 30,
        status: 'On Track',
        solvedCount: 14,
        totalCount: 18,
        keyHighlights: ['5-Step Revenue Model', 'ROU Asset Amortization', 'Variable Consideration Caps'],
      },
      {
        title: 'Direct & Corporate Taxation (Sec 115BAA/54)',
        code: 'COM-TAX',
        weightagePercent: 25,
        status: 'Mastered',
        solvedCount: 15,
        totalCount: 15,
        keyHighlights: ['Capital Gains Deductions', 'MAT Computations', 'Transfer Pricing Safe Harbors'],
      },
      {
        title: 'Auditing Standards & Reporting (SA 700 series)',
        code: 'COM-AUD',
        weightagePercent: 25,
        status: 'On Track',
        solvedCount: 10,
        totalCount: 14,
        keyHighlights: ['Qualified vs Adverse Opinions', 'CARO 2020 Clauses', 'Materiality Benchmarks'],
      },
      {
        title: 'Strategic Cost Management & DCF Valuation',
        code: 'COM-VAL',
        weightagePercent: 20,
        status: 'Needs Practice',
        solvedCount: 6,
        totalCount: 12,
        keyHighlights: ['WACC & Terminal Value', 'Target Costing', 'Activity-Based Management'],
      },
    ],
    highYieldTips: [
      'Quote exact Ind AS Paragraphs and SA standard numbers in analytical answers.',
      'Show clear working notes for every tax deduction computation step.',
      'Highlight internal financial control vulnerabilities in audit simulation cases.',
    ],
  },

  medical: {
    track: 'medical',
    radarTitle: 'Clinical Diagnostic & Residency Vignette Radar',
    radarSubtitle: 'High-yield pathology, emergency triage, and pharmacology recall radar',
    badgeLabel: 'NEET-PG / USMLE Clinical Mastery',
    platformSyncName: 'Marrow / USMLE Question Bank Sync',
    platformSyncSubtitle: 'Live clinical vignette accuracy, percentile ranking & timed grand tests',
    totalTargetMetric: '60 High-Yield Clinical Systems',
    categories: [
      {
        title: 'Emergency Cardiology & ACLS Protocols',
        code: 'MED-CARD',
        weightagePercent: 25,
        status: 'Mastered',
        solvedCount: 18,
        totalCount: 20,
        keyHighlights: ['STEMI Door-to-Balloon PCI', 'Aortic Dissection Stanford Types', 'ACLS Tachycardia Algorithms'],
      },
      {
        title: 'High-Yield Pharmacology Invariants',
        code: 'MED-PHARM',
        weightagePercent: 30,
        status: 'On Track',
        solvedCount: 16,
        totalCount: 22,
        keyHighlights: ['Autonomic Receptors', 'Antimicrobial Resistance Mechanisms', 'Antidote Protocols'],
      },
      {
        title: 'Systemic Pathology & Triad Diagnostics',
        code: 'MED-PATH',
        weightagePercent: 25,
        status: 'On Track',
        solvedCount: 12,
        totalCount: 16,
        keyHighlights: ['Charcot Triad', 'Beck Triad', 'Glomerulonephritis Biopsy Findings'],
      },
      {
        title: 'General Surgery & Trauma Resuscitation',
        code: 'MED-SURG',
        weightagePercent: 20,
        status: 'Needs Practice',
        solvedCount: 7,
        totalCount: 14,
        keyHighlights: ['ATLS ABCDE Resuscitation', 'Acute Abdomen Differential', 'Burn Parkland Formula'],
      },
    ],
    highYieldTips: [
      'Always start vignette analysis with age, gender, and acute onset timing.',
      'Differentiate first-line investigation from gold-standard confirmatory test.',
      'Review classic radiological signs (Steeple sign, Thumbprint sign, Hampton hump).',
    ],
  },

  law: {
    track: 'law',
    radarTitle: 'Judicial Services & Bare Act Precedent Radar',
    radarSubtitle: 'BNS/BNSS/BSA statutory mappings, constitutional writs & IRAC briefing radar',
    badgeLabel: 'Judicial Services & Bar Benchmark',
    platformSyncName: 'LiveLaw & Supreme Court Registry Sync',
    platformSyncSubtitle: 'Live constitutional bench rulings, cause lists & landmark ratio updates',
    totalTargetMetric: '50 Landmark Doctrines',
    categories: [
      {
        title: 'Bharatiya Nyaya Sanhita & Criminal Law',
        code: 'LAW-BNS',
        weightagePercent: 30,
        status: 'Mastered',
        solvedCount: 16,
        totalCount: 18,
        keyHighlights: ['Culpable Homicide vs Murder', 'Private Defense Bounds', 'Organized Crime Sections'],
      },
      {
        title: 'Constitutional Jurisprudence & Writs (Art 32/226)',
        code: 'LAW-CONST',
        weightagePercent: 30,
        status: 'On Track',
        solvedCount: 14,
        totalCount: 18,
        keyHighlights: ['Basic Structure Doctrine', 'Arbitrariness Test (Art 14)', 'Proportionality Standard'],
      },
      {
        title: 'Bharatiya Sakshya Adhiniyam & Evidence',
        code: 'LAW-BSA',
        weightagePercent: 20,
        status: 'Needs Practice',
        solvedCount: 8,
        totalCount: 14,
        keyHighlights: ['Electronic Evidence Hash Sec 63', 'Dying Declaration Invariants', 'Estoppel Rule'],
      },
      {
        title: 'Contracts, Specific Relief & Arbitration',
        code: 'LAW-CORP',
        weightagePercent: 20,
        status: 'On Track',
        solvedCount: 10,
        totalCount: 14,
        keyHighlights: ['Frustration Sec 56', 'Injunction Principles', 'Arbitral Award Enforcement'],
      },
    ],
    highYieldTips: [
      'Structure every substantive problem response using IRAC (Issue, Rule, Analysis, Conclusion).',
      'Cite recent 2024-2026 Supreme Court Constitutional Bench rulings to differentiate your answers.',
      'Contrast newly enacted BNS provisions with legacy IPC case precedents.',
    ],
  },

  competitive_exams: {
    track: 'competitive_exams',
    radarTitle: 'UPSC & Civil Services Examination Radar',
    radarSubtitle: 'GS Papers 1-4 syllabus weightage, current affairs linkage & CSAT radar',
    badgeLabel: 'Civil Services / PSC Examination',
    platformSyncName: 'UPSC / PIB & NITI Aayog Portal Sync',
    platformSyncSubtitle: 'Live PIB press releases, gazette notifications & daily test series accuracy',
    totalTargetMetric: '50 Mains Themes',
    categories: [
      {
        title: 'GS-2 Polity, Governance & Federalism',
        code: 'GOV-GS2',
        weightagePercent: 30,
        status: 'Mastered',
        solvedCount: 15,
        totalCount: 16,
        keyHighlights: ['Judicial Review vs Activism', 'Inter-State River Disputes', 'Electoral Reforms'],
      },
      {
        title: 'GS-3 Macroeconomics & Infrastructure',
        code: 'GOV-GS3',
        weightagePercent: 25,
        status: 'On Track',
        solvedCount: 12,
        totalCount: 16,
        keyHighlights: ['Monetary Policy Transmission', 'Green Energy Transition', 'Inclusive Growth Models'],
      },
      {
        title: 'GS-4 Ethics, Integrity & Case Studies',
        code: 'GOV-GS4',
        weightagePercent: 25,
        status: 'On Track',
        solvedCount: 10,
        totalCount: 14,
        keyHighlights: ['Deontology vs Utilitarianism', 'Conflict of Interest Scenarios', 'Emotional Intelligence'],
      },
      {
        title: 'CSAT Speed, Reasoning & Data Interpretation',
        code: 'GOV-CSAT',
        weightagePercent: 20,
        status: 'Needs Practice',
        solvedCount: 7,
        totalCount: 12,
        keyHighlights: ['Permutations & Combinations', 'Reading Comprehension Elimination', 'Logical Syllogisms'],
      },
    ],
    highYieldTips: [
      'Include schematic flowcharts and constitutional article references in every 15-mark answer.',
      'End answers with actionable, positive policy roadmaps quoting NITI Aayog / 2nd ARC.',
      'Practice eliminating 2 extreme options immediately in CSAT reading comprehension passages.',
    ],
  },

  humanities: {
    track: 'humanities',
    radarTitle: 'Humanities & Academic Research Radar',
    radarSubtitle: 'Theoretical paradigms, qualitative methodology & UGC-NET radar',
    badgeLabel: 'Social Sciences & Policy Research',
    platformSyncName: 'JSTOR & UGC Research Portal Sync',
    platformSyncSubtitle: 'Peer-reviewed citation metrics, preprint archives & NET Paper 1/2 analytics',
    totalTargetMetric: '40 Research Paradigms',
    categories: [
      {
        title: 'Political Theory & Philosophy',
        code: 'HUM-POL',
        weightagePercent: 30,
        status: 'On Track',
        solvedCount: 11,
        totalCount: 15,
        keyHighlights: ['Social Contract Debates', 'Theories of Justice (Rawls vs Nozick)', 'Post-colonialism'],
      },
      {
        title: 'Sociological Paradigms & Social Stratification',
        code: 'HUM-SOC',
        weightagePercent: 30,
        status: 'Mastered',
        solvedCount: 13,
        totalCount: 14,
        keyHighlights: ['Structural Functionalism', 'Intersectionality', 'Agrarian Transformation'],
      },
      {
        title: 'Qualitative & Quantitative Research Methods',
        code: 'HUM-METH',
        weightagePercent: 25,
        status: 'On Track',
        solvedCount: 9,
        totalCount: 12,
        keyHighlights: ['Grounded Theory', 'Ethnographic Fieldwork', 'Discourse Analysis'],
      },
      {
        title: 'International Relations & Global Geopolitics',
        code: 'HUM-IR',
        weightagePercent: 15,
        status: 'Needs Practice',
        solvedCount: 5,
        totalCount: 10,
        keyHighlights: ['Realism vs Constructivism', 'Global South Geopolitics', 'Multilateral Treaties'],
      },
    ],
    highYieldTips: [
      'Compare competing ideological viewpoints dialectically before proposing a synthesis.',
      'Ground empirical case studies in explicit philosophical foundations.',
    ],
  },

  other: {
    track: 'other',
    radarTitle: 'Universal First-Principles & Systems Radar',
    radarSubtitle: 'Mental models, rapid skill acquisition & deliberate practice radar',
    badgeLabel: 'Interdisciplinary Mastery',
    platformSyncName: 'Omni-Skill Universal Sync',
    platformSyncSubtitle: 'Skill acquisition velocities, retrieval metrics & Feynman mastery logs',
    totalTargetMetric: '30 Mental Models',
    categories: [
      {
        title: 'First Principles & Axiomatic Logic',
        code: 'OTH-AXIOM',
        weightagePercent: 35,
        status: 'Mastered',
        solvedCount: 12,
        totalCount: 12,
        keyHighlights: ['Feynman Technique', 'Second-Order Thinking', 'Inversion Thinking'],
      },
      {
        title: 'Deliberate Practice & Spaced Repetition',
        code: 'OTH-PRACT',
        weightagePercent: 35,
        status: 'On Track',
        solvedCount: 10,
        totalCount: 12,
        keyHighlights: ['Immediate Feedback Loops', 'Interleaving Drills', 'Cognitive Load Pacing'],
      },
      {
        title: 'Systems Dynamics & Synthesis',
        code: 'OTH-SYS',
        weightagePercent: 30,
        status: 'On Track',
        solvedCount: 7,
        totalCount: 10,
        keyHighlights: ['Feedback Loops', 'Bottleneck Identification', 'Antifragility'],
      },
    ],
    highYieldTips: [
      'Deconstruct complex systems to atomic assumptions.',
      'Measure practice intervals with timer discipline.',
    ],
  },
};

export function getTrackRadarConfig(track: Track = 'engineering'): TrackRadarConfig {
  return TRACK_RADAR_CONFIGS[track] || TRACK_RADAR_CONFIGS.engineering;
}
