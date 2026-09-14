import React, { createContext, useContext, useMemo } from 'react';
import {
  Code2,
  Stethoscope,
  Scale,
  TrendingUp,
  BookOpen,
  Award,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { Track, UserProfile } from '../types';

export interface TrackMeta {
  id: Track;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  badge: string;
  color: string;
  gradient: string;
  borderAccent: string;
  bgSubtle: string;
  description: string;
  targetExamsOrRoles: string;
  exampleSubjects: string[];
  practiceTitle: string;
  opportunitiesLabel: string;
}

export const TRACK_DEFINITIONS: Record<Track, TrackMeta> = {
  engineering: {
    id: 'engineering',
    label: 'Engineering & Technology',
    shortLabel: 'Engineering',
    icon: Code2,
    badge: 'Tech & SDE',
    color: 'text-indigo-400',
    gradient: 'from-indigo-600 via-indigo-500 to-purple-600',
    borderAccent: 'border-indigo-500/40',
    bgSubtle: 'bg-indigo-500/10',
    description: 'Computer Science, Electrical, Mechanical, SDE Interviews, System Design & Core CS.',
    targetExamsOrRoles: 'SDE 1, SWE Intern, GATE CS, Product Architect',
    exampleSubjects: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design'],
    practiceTitle: '75+ DSA Pattern Practice',
    opportunitiesLabel: 'Tech Job & Internship Pipeline',
  },
  competitive_exams: {
    id: 'competitive_exams',
    label: 'Competitive & Civil Services',
    shortLabel: 'Civil Services',
    icon: Award,
    badge: 'UPSC & PSC',
    color: 'text-cyan-400',
    gradient: 'from-cyan-600 via-teal-500 to-emerald-600',
    borderAccent: 'border-cyan-500/40',
    bgSubtle: 'bg-cyan-500/10',
    description: 'UPSC CSE (IAS/IPS/IFS), State PSC, SSC CGL, Banking, Defense & Central Civil Services.',
    targetExamsOrRoles: 'UPSC Civil Services, State PSC, RBI Grade B, SSC CGL',
    exampleSubjects: ['Indian Polity', 'Modern History', 'Geography', 'Economy', 'CSAT', 'Ethics GS-4'],
    practiceTitle: 'UPSC / PSC Practice Sheets',
    opportunitiesLabel: 'Govt Exam Forms & Vacancies',
  },
  medical: {
    id: 'medical',
    label: 'Medical & Healthcare',
    shortLabel: 'Medical',
    icon: Stethoscope,
    badge: 'NEET-PG & MBBS',
    color: 'text-rose-400',
    gradient: 'from-rose-600 via-pink-500 to-red-600',
    borderAccent: 'border-rose-500/40',
    bgSubtle: 'bg-rose-500/10',
    description: 'MBBS, BDS, NEET-PG, USMLE, PLAB, Clinical Rotations, Pharmacology & Diagnostic Case Studies.',
    targetExamsOrRoles: 'NEET-PG, INI-CET, USMLE Step 1/2, Resident Physician',
    exampleSubjects: ['Anatomy', 'Physiology', 'Pathology', 'Pharmacology', 'General Medicine', 'Surgery'],
    practiceTitle: 'Clinical Recall & Case Sheets',
    opportunitiesLabel: 'Residencies, Fellowships & Hospital Rotations',
  },
  law: {
    id: 'law',
    label: 'Law & Legal Studies',
    shortLabel: 'Law',
    icon: Scale,
    badge: 'CLAT & Judiciary',
    color: 'text-amber-400',
    gradient: 'from-amber-600 via-orange-500 to-yellow-600',
    borderAccent: 'border-amber-500/40',
    bgSubtle: 'bg-amber-500/10',
    description: 'LLB, BA LLB, LLM, CLAT-PG, State Judiciary Examination, Moot Court & Corporate Legal Advisory.',
    targetExamsOrRoles: 'Civil Judge / Judicial Magistrate, Corporate Legal Counsel, Advocate',
    exampleSubjects: ['Constitutional Law', 'Bharatiya Nyaya Sanhita', 'Contract Law', 'Evidence Law', 'Jurisprudence'],
    practiceTitle: 'Statute & Judgment Sheets',
    opportunitiesLabel: 'Judicial Clerkships & Law Firm Openings',
  },
  commerce: {
    id: 'commerce',
    label: 'Commerce, Finance & CA',
    shortLabel: 'Commerce',
    icon: TrendingUp,
    badge: 'CA, CFA & CS',
    color: 'text-emerald-400',
    gradient: 'from-emerald-600 via-green-500 to-teal-600',
    borderAccent: 'border-emerald-500/40',
    bgSubtle: 'bg-emerald-500/10',
    description: 'Chartered Accountancy (CA), CFA, CS, B.Com, Financial Analysis, Corporate Taxation & Audit.',
    targetExamsOrRoles: 'Chartered Accountant, Investment Banking Analyst, Corporate Auditor',
    exampleSubjects: ['Financial Accounting & Ind AS', 'Corporate Law', 'Direct Taxation', 'Costing', 'Auditing'],
    practiceTitle: 'Finance & Tax Practice Sheets',
    opportunitiesLabel: 'Articleships, Finance Roles & Advisory Vacancies',
  },
  humanities: {
    id: 'humanities',
    label: 'Humanities & Social Sciences',
    shortLabel: 'Humanities',
    icon: BookOpen,
    badge: 'UGC-NET & MA',
    color: 'text-purple-400',
    gradient: 'from-purple-600 via-indigo-500 to-pink-600',
    borderAccent: 'border-purple-500/40',
    bgSubtle: 'bg-purple-500/10',
    description: 'History, Political Science, Sociology, Psychology, Literature, UGC-NET & Policy Research.',
    targetExamsOrRoles: 'UGC-NET / Assistant Professor, Policy Researcher, Public Think-Tank Analyst',
    exampleSubjects: ['Political Philosophy', 'Historiography', 'Sociological Paradigms', 'Research Methodology'],
    practiceTitle: 'Critical Analysis & Essay Sheets',
    opportunitiesLabel: 'Research Fellowships & Policy Internships',
  },
  other: {
    id: 'other',
    label: 'Universal Academic & Vocational',
    shortLabel: 'Universal',
    icon: Sparkles,
    badge: 'Interdisciplinary',
    color: 'text-blue-400',
    gradient: 'from-blue-600 via-indigo-500 to-cyan-600',
    borderAccent: 'border-blue-500/40',
    bgSubtle: 'bg-blue-500/10',
    description: 'Self-directed learning, cross-domain skill acquisition, vocational training & personal projects.',
    targetExamsOrRoles: 'Interdisciplinary Specialist, Independent Scholar, Lifelong Learner',
    exampleSubjects: ['First Principles Thinking', 'Mental Models', 'Active Recall', 'Deep Work Practice'],
    practiceTitle: 'Universal Skill Practice Sheets',
    opportunitiesLabel: 'Scholarships & Career Opportunities',
  },
};

export const ALL_TRACKS: TrackMeta[] = Object.values(TRACK_DEFINITIONS);

export interface TrackConfig {
  name: string;
  shortLabel: string;
  label: string;
  subjects: { name: string }[];
  exampleSubjects: string[];
}

interface TrackContextValue {
  track: Track;
  setTrack: (track: Track) => void;
  trackMeta: TrackMeta;
  config: TrackConfig;
  allTracks: TrackMeta[];
  isEngineering: boolean;
}

const TrackContext = createContext<TrackContextValue | null>(null);

interface TrackProviderProps {
  children: React.ReactNode;
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const TrackProvider: React.FC<TrackProviderProps> = ({
  children,
  profile,
  onUpdateProfile,
}) => {
  const currentTrack: Track = profile.track || 'engineering';

  const setTrack = (nextTrack: Track) => {
    onUpdateProfile({ track: nextTrack });
  };

  const trackMeta = useMemo(() => {
    return TRACK_DEFINITIONS[currentTrack] || TRACK_DEFINITIONS.engineering;
  }, [currentTrack]);

  const config: TrackConfig = useMemo(
    () => ({
      name: trackMeta.label,
      shortLabel: trackMeta.shortLabel,
      label: trackMeta.label,
      subjects: (trackMeta.exampleSubjects || []).map((s) => ({ name: s })),
      exampleSubjects: trackMeta.exampleSubjects || [],
    }),
    [trackMeta]
  );

  const isEngineering = currentTrack === 'engineering';

  const value = useMemo(
    () => ({
      track: currentTrack,
      setTrack,
      trackMeta,
      config,
      allTracks: ALL_TRACKS,
      isEngineering,
    }),
    [currentTrack, trackMeta, config, isEngineering]
  );

  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
};

export function useTrack(): TrackContextValue {
  const context = useContext(TrackContext);
  if (!context) {
    const meta = TRACK_DEFINITIONS.engineering;
    return {
      track: 'engineering',
      setTrack: () => {},
      trackMeta: meta,
      config: {
        name: meta.label,
        shortLabel: meta.shortLabel,
        label: meta.label,
        subjects: (meta.exampleSubjects || []).map((s) => ({ name: s })),
        exampleSubjects: meta.exampleSubjects || [],
      },
      allTracks: ALL_TRACKS,
      isEngineering: true,
    };
  }
  return context;
}
