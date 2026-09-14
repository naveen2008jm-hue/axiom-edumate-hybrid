/**
 * Axiom EduMate / Campus2Career AI — Authentication & Session Manager
 *
 * NOTE FOR PRODUCTION DEPLOYMENT:
 * This module implements a robust local client-side persistence and Web Crypto SHA-256
 * hashing layer for sandbox/offline execution. In production, swap the `registerUser`
 * and `loginUser` implementations with backend JWT auth tokens (e.g., Supabase Auth,
 * NextAuth, or OAuth 2.0 PKCE / Argon2id backend hashing).
 */

import { Track, UserProfile } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  track: Track;
  college?: string;
  branch?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

const STORAGE_KEYS = {
  USERS_REGISTRY: 'axiom_auth_users_v2',
  CURRENT_SESSION: 'axiom_auth_session_v2',
};

/**
 * Hash passwords using standard Web Crypto SHA-256
 * Never store plaintext passwords in client storage.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(password.trim());
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('Web Crypto hashing failed, falling back to algorithmic hash', e);
    }
  }

  // Fallback deterministic numeric shift hash if subtle crypto is unavailable
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256-fb-${Math.abs(hash).toString(16)}`;
}

/**
 * Default pre-seeded users for demo testing across discipline tracks
 */
const DEFAULT_DEMO_USERS: AuthUser[] = [
  {
    id: 'usr-student-2027',
    name: 'Naveen JM',
    email: 'naveen@axiom.edu',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // 'admin123'
    track: 'engineering',
    college: 'National Institute of Technology',
    branch: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'usr-medical-demo',
    name: 'Dr. Priya Sharma',
    email: 'priya.med@axiom.edu',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    track: 'medical',
    college: 'AIIMS New Delhi',
    branch: 'MBBS Clinical Rotations',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813689-5660b5ff86a1?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'usr-commerce-demo',
    name: 'Arjun Mehta',
    email: 'arjun.ca@axiom.edu',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    track: 'commerce',
    college: 'Shri Ram College of Commerce (SRCC)',
    branch: 'Commerce & CA Final',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01T09:30:00Z',
  },
  {
    id: 'usr-law-demo',
    name: 'Adv. Ananya Iyer',
    email: 'ananya.law@axiom.edu',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    track: 'law',
    college: 'National Law School of India (NLSIU)',
    branch: 'BA LLB (Hons) Judiciary Prep',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 'usr-upsc-demo',
    name: 'Vikramaditya Roy',
    email: 'vikram.upsc@axiom.edu',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    track: 'competitive_exams',
    college: 'Delhi University',
    branch: 'Civil Services IAS Preparation',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-03-20T11:20:00Z',
  },
];

/**
 * Read registered users registry from storage
 */
export function getRegisteredUsers(): AuthUser[] {
  if (typeof window === 'undefined') return DEFAULT_DEMO_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_REGISTRY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(DEFAULT_DEMO_USERS));
      return DEFAULT_DEMO_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DEMO_USERS;
  } catch {
    return DEFAULT_DEMO_USERS;
  }
}

/**
 * Save registered users registry
 */
function saveRegisteredUsers(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users registry', e);
  }
}

/**
 * Get current active session user
 */
export function getCurrentSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Save current active session
 */
export function setCurrentSession(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  } catch (e) {
    console.error('Failed to update current session', e);
  }
}

/**
 * Register a new user with chosen academic discipline
 */
export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  track: Track;
  college?: string;
  branch?: string;
}): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const name = params.name.trim();
  const email = params.email.trim().toLowerCase();
  const password = params.password.trim();
  const track = params.track || 'engineering';

  if (!name || name.length < 2) {
    return { success: false, error: 'Please enter your full name or student username.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email);
  if (existing) {
    return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
  }

  const passwordHash = await hashPassword(password);
  const newUser: AuthUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    email,
    passwordHash,
    track,
    college: params.college || `${name.split(' ')[0]}'s Academy`,
    branch: params.branch || getDefaultBranchForTrack(track),
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveRegisteredUsers(users);
  setCurrentSession(newUser);

  return { success: true, user: newUser };
}

/**
 * Authenticate existing user by email and password
 */
export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const email = params.email.trim().toLowerCase();
  const password = params.password.trim();

  if (!email) {
    return { success: false, error: 'Please enter your email address.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  const users = getRegisteredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email);

  if (!user) {
    return { success: false, error: 'No account found with this email. Please check your spelling or sign up.' };
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return { success: false, error: 'Incorrect password. Please try again or use password recovery.' };
  }

  const updatedUser: AuthUser = {
    ...user,
    lastLoginAt: new Date().toISOString(),
  };

  const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
  saveRegisteredUsers(updatedUsers);
  setCurrentSession(updatedUser);

  return { success: true, user: updatedUser };
}

/**
 * End current session
 */
export function logoutUser(): void {
  setCurrentSession(null);
}

/**
 * Update active user's academic track discipline in registry and session
 */
export function updateAuthUserTrack(userId: string, track: Track): void {
  const users = getRegisteredUsers();
  const updatedUsers = users.map((u) => (u.id === userId ? { ...u, track } : u));
  saveRegisteredUsers(updatedUsers);

  const current = getCurrentSession();
  if (current && current.id === userId) {
    setCurrentSession({ ...current, track });
  }
}

/**
 * Helper to get default branch title for a given track
 */
export function getDefaultBranchForTrack(track: Track): string {
  switch (track) {
    case 'engineering':
      return 'Computer Science & Engineering';
    case 'medical':
      return 'MBBS / Clinical Sciences';
    case 'law':
      return 'Constitutional & Corporate Law';
    case 'commerce':
      return 'Accounting, Taxation & Finance';
    case 'competitive_exams':
      return 'General Studies & Public Administration';
    case 'humanities':
      return 'Social Sciences & Political Philosophy';
    case 'other':
    default:
      return 'Interdisciplinary Studies';
  }
}
