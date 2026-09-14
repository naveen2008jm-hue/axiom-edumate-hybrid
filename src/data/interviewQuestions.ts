import { InterviewQuestion, Track } from '../types';

export const TRACK_INTERVIEW_QUESTIONS: Record<Track, InterviewQuestion[]> = {
  engineering: [
    {
      id: 'iq-eng-1',
      track: 'engineering',
      category: 'System Design & Distributed Invariants',
      difficulty: 'Hard',
      question: 'How would you design a high-concurrency distributed rate limiter that supports sliding window rate limiting across multiple geodistributed data centers?',
      hints: [
        'Compare Token Bucket vs Leaky Bucket vs Sliding Window Log.',
        'Address Redis cluster synchronization vs local in-memory batching.',
        'Discuss clock drift (NTP) and split-brain fallback.',
      ],
      keyPointsToCover: ['Sliding Window Algorithm', 'Redis Lua script atomic execution', 'Eventual consistency trade-off', 'Circuit breaker resilience'],
      timeLimitSeconds: 180,
    },
    {
      id: 'iq-eng-2',
      track: 'engineering',
      category: 'Concurrency & OS Internals',
      difficulty: 'Medium',
      question: 'Explain the difference between a Mutex and a Binary Semaphore in an OS kernel. Can any thread unlock a Mutex, and how do you prevent Priority Inversion?',
      hints: [
        'Mention ownership lock semantics.',
        'Explain signaling mechanism in semaphores.',
        'Discuss Priority Inheritance Protocol (PIP).',
      ],
      keyPointsToCover: ['Ownership semantics', 'Signaling protocol', 'Priority Inheritance Protocol', 'Deadlock avoidance invariants'],
      timeLimitSeconds: 120,
    },
    {
      id: 'iq-eng-3',
      track: 'engineering',
      category: 'Behavioral & STAR Impact',
      difficulty: 'Medium',
      question: 'Tell me about a time you diagnosed and resolved a critical production bug or performance bottleneck under tight deadline constraints.',
      hints: [
        'Use the STAR framework (Situation, Task, Action, Result).',
        'State concrete metrics (latency reduced by X%, CPU lowered).',
        'Reflect on retrospective prevention mechanisms.',
      ],
      keyPointsToCover: ['Concrete root-cause analysis', 'Reproducible debugging method', 'Quantified production impact', 'Team post-mortem collaboration'],
      timeLimitSeconds: 150,
    },
  ],

  commerce: [
    {
      id: 'iq-com-1',
      track: 'commerce',
      category: 'Ind AS & Revenue Recognition',
      difficulty: 'Hard',
      question: 'Walk through the 5-step revenue recognition model under Ind AS 115 / IFRS 15. How do you distinguish between performance obligations satisfied over time versus at a point in time for a multi-element software contract?',
      hints: [
        'List Step 1 (Contract) to Step 5 (Recognize Revenue).',
        'Explain criteria under Paragraph 35 (enforceable right to payment, asset with no alternative use).',
        'Discuss standalone selling price allocation.',
      ],
      keyPointsToCover: ['5-Step Framework', 'Distinct Performance Obligations', 'Over-time criteria (Ind AS 115.35)', 'Contract asset vs liability balance sheet presentation'],
      timeLimitSeconds: 180,
    },
    {
      id: 'iq-com-2',
      track: 'commerce',
      category: 'Audit & Internal Financial Controls',
      difficulty: 'Medium',
      question: 'Explain the circumstances under which an auditor must issue a Qualified Opinion versus an Adverse Opinion versus a Disclaimer of Opinion under SA 705.',
      hints: [
        'Contrast "Material but not Pervasive" with "Material and Pervasive".',
        'Explain inability to obtain sufficient appropriate audit evidence.',
        'Provide an example of an adverse opinion scenario.',
      ],
      keyPointsToCover: ['Pervasiveness matrix (SA 705)', 'Misstatement vs Scope limitation', 'Impact on audit report structure', 'CARO 2020 reporting relevance'],
      timeLimitSeconds: 150,
    },
  ],

  medical: [
    {
      id: 'iq-med-1',
      track: 'medical',
      category: 'Emergency Triage & Cardiology',
      difficulty: 'Hard',
      question: 'A 58-year-old diabetic male presents to the Emergency Department with crushing substernal chest pain radiating to the jaw, diaphoresis, and BP 85/50 mmHg. Walk me through your immediate triage, investigation, and acute management protocol.',
      hints: [
        'Immediate 12-lead ECG within 10 minutes.',
        'STEMI vs NSTEMI criteria; MONA adjustments for hypotension (avoid nitrates/morphine if RV infarction suspected).',
        'Door-to-balloon time (<90 mins PCI) or thrombolysis window (<30 mins).',
      ],
      keyPointsToCover: ['Rapid ECG within 10 mins', 'Right-sided lead ECG for RV infarct', 'Dual antiplatelet + Heparin', 'Primary PCI protocol & hemodynamic stabilization'],
      timeLimitSeconds: 180,
    },
    {
      id: 'iq-med-2',
      track: 'medical',
      category: 'Pathology & Pharmacology Pearls',
      difficulty: 'Medium',
      question: 'Compare the mechanism of action, first-line indications, and high-yield black-box contraindications between ACE Inhibitors, ARBs, and ARNIs in Heart Failure with Reduced Ejection Fraction (HFrEF).',
      hints: [
        'Bradykinin breakdown inhibition causing dry cough/angioedema.',
        'Sacubitril/Valsartan neprilysin inhibition requiring 36-hour washout from ACEi.',
        'Hyperkalemia and pregnancy contraindications.',
      ],
      keyPointsToCover: ['Neprilysin inhibition mechanism', '36-hour ACEi washout window', 'Monitoring serum creatinine and potassium', 'Mortality benefit evidence (PARADIGM-HF)'],
      timeLimitSeconds: 150,
    },
  ],

  law: [
    {
      id: 'iq-law-1',
      track: 'law',
      category: 'Criminal Law & Bharatiya Nyaya Sanhita',
      difficulty: 'Hard',
      question: 'Critically analyze the distinction between Culpable Homicide and Murder under Bharatiya Nyaya Sanhita (BNS). Apply the landmark ratio of Reg v. Govinda and state the five exceptions where homicide is not murder.',
      hints: [
        'Degree of probability of causing death (knowledge vs intention vs bodily injury sufficient in ordinary course of nature).',
        'Exceptions: Grave & sudden provocation, right of private defense, public servant acting in good faith, sudden fight, consent.',
        'Cite statutory sections in BNS compared to legacy IPC 299/300.',
      ],
      keyPointsToCover: ['Mens rea thresholds', 'BNS statutory mappings', 'Reg v. Govinda 3-stage test', 'Statutory exceptions and burden of proof under BSA'],
      timeLimitSeconds: 180,
    },
    {
      id: 'iq-law-2',
      track: 'law',
      category: 'Constitutional Jurisprudence',
      difficulty: 'Medium',
      question: 'Explain the doctrine of Basic Structure as formulated in Kesavananda Bharati. How does the Supreme Court evaluate whether a constitutional amendment violates the basic structure?',
      hints: [
        'Origin from Golaknath and 24th Amendment.',
        'Illustrate core pillars: Judicial Review, Secularism, Rule of Law, Federalism.',
        'Apply the test from Minerva Mills and I.R. Coelho.',
      ],
      keyPointsToCover: ['Kesavananda Bharati 13-judge bench ratio', 'Non-exhaustive list of basic features', 'Essence of fundamental rights test (I.R. Coelho)', 'Primacy of Judicial Review (Art 32/226)'],
      timeLimitSeconds: 150,
    },
  ],

  competitive_exams: [
    {
      id: 'iq-gov-1',
      track: 'competitive_exams',
      category: 'GS-2 Polity & Governance',
      difficulty: 'Hard',
      question: '"Judicial Activism is essential to check executive inertia, but Judicial Overreach undermines the separation of powers." Critically evaluate this statement with landmark Supreme Court cases and suggest a roadmap for institutional balance.',
      hints: [
        'Define Judicial Review vs Activism vs Overreach.',
        'Cite examples: Taj Trapezium, National Anthem order, Liquor ban on highways, Vishaka Guidelines.',
        'Address doctrine of Separation of Powers (Article 50) and constructive judicial restraint.',
      ],
      keyPointsToCover: ['Constitutional backing (Art 32/142)', 'Public Interest Litigation (PIL) evolution', 'Instances of overreach vs legitimate enforcement', 'Second ARC recommendations & self-restraint norm'],
      timeLimitSeconds: 180,
    },
    {
      id: 'iq-gov-2',
      track: 'competitive_exams',
      category: 'GS-4 Ethics & Case Study',
      difficulty: 'Medium',
      question: 'You are the District Magistrate during a communal tension outbreak. A local politician demands immediate release of their arrested party workers, threatening mass disruption. How do you resolve this ethical dilemma balancing rule of law and public peace?',
      hints: [
        'Identify stakeholders (citizens, law enforcement, political leadership, media).',
        'State ethical principles (Impartiality, Courage, Public Interest, Rule of Law).',
        'Outline short-term de-escalation actions and long-term administrative safeguards.',
      ],
      keyPointsToCover: ['Stakeholder matrix', 'Ethical dilemma framing', 'Immediate administrative response (Sec 163 BNSS)', 'Long-term community reconciliation'],
      timeLimitSeconds: 150,
    },
  ],

  humanities: [
    {
      id: 'iq-hum-1',
      track: 'humanities',
      category: 'Political Theory & Philosophy',
      difficulty: 'Medium',
      question: 'Contrast Thomas Hobbes and John Locke on human nature, the state of nature, and the limits of state sovereignty. Whose framework offers a better critique of contemporary surveillance capitalism?',
      hints: [
        'Hobbes: Solitary, poor, nasty, brutish; absolute Leviathan.',
        'Locke: Natural rights (life, liberty, property); revocable fiduciary trust.',
        'Synthesize with modern privacy, algorithmic governance, and social contract.',
      ],
      keyPointsToCover: ['State of Nature characterization', 'Social contract delegation terms', 'Right to rebellion in Locke vs absolute sovereign in Hobbes', 'Application to digital autonomy'],
      timeLimitSeconds: 150,
    },
  ],

  other: [
    {
      id: 'iq-oth-1',
      track: 'other',
      category: 'First Principles & Meta-Learning',
      difficulty: 'Medium',
      question: 'Deconstruct a complex system or skill you recently mastered using First Principles Thinking and Feynman Technique. What were the core counter-intuitive invariants?',
      hints: [
        'Break down assumptions into atomic truths.',
        'Explain using simple, jargon-free language.',
        'Show how you tested understanding with boundary experiments.',
      ],
      keyPointsToCover: ['Axiomatic deconstruction', 'Elimination of dogma', 'Analogous vs First-principles synthesis', 'Measurable deliberate practice feedback loop'],
      timeLimitSeconds: 150,
    },
  ],
};

export function getInterviewQuestionsForTrack(track: Track = 'engineering'): InterviewQuestion[] {
  return TRACK_INTERVIEW_QUESTIONS[track] || TRACK_INTERVIEW_QUESTIONS.engineering;
}
