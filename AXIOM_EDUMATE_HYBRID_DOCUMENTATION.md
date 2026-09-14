# ⚡ Axiom EduMate Hybrid — Comprehensive Project Documentation

> **Universal AI Omni-Learning, Adaptive College Hub & Placement Operating System**  
> **Version:** 1.0.0 | **Author / Team:** Axiom Engineering Team | **License:** Private / Proprietary  
> **Repository Root:** `d:/SIH/axiom_edumate_hybrid`

---

## 📑 Table of Contents
1. [Executive Summary & Project Scope](#1-executive-summary--project-scope)
2. [Problem Statement & Core Objectives](#2-problem-statement--core-objectives)
3. [System Architecture & Workflow](#3-system-architecture--workflow)
4. [Core Modules & Detailed Features](#4-core-modules--detailed-features)
   - [4.1 Command Center & Gamification Pulse](#41-command-center--gamification-pulse)
   - [4.2 Omni-Skill AI Curriculum Architect](#42-omni-skill-ai-curriculum-architect)
   - [4.3 EduMate Adaptive College Hub](#43-edumate-adaptive-college-hub)
   - [4.4 Engineering Placement & Career Suite](#44-engineering-placement--career-suite)
   - [4.5 Academics, Aptitude & Cognitive Practice](#45-academics-aptitude--cognitive-practice)
   - [4.6 Productivity, Pomodoro & Badges Vault](#46-productivity-pomodoro--badges-vault)
5. [Technical Specifications & Tech Stack](#5-technical-specifications--tech-stack)
6. [API Endpoints & Gemini AI Integrations](#6-api-endpoints--gemini-ai-integrations)
7. [Database Schema (Supabase SQL)](#7-database-schema-supabase-sql)
8. [Design System & Audio Engine](#8-design-system--audio-engine)
9. [Installation, Setup & Deployment Guide](#9-installation-setup--deployment-guide)
10. [Challenges, Risks & Solutions](#10-challenges-risks--solutions)
11. [Synchronized 13-Step Demo Tour](#11-synchronized-13-step-demo-tour)

---

## 1. Executive Summary & Project Scope

**Axiom EduMate Hybrid** is a next-generation unified learning and career operating system built specifically for engineering and technology students. It bridges the gap between university coursework, algorithmic placement preparation, and cognitive wellbeing.

### Key Scope:
* **Academic Harmony:** Eliminates scheduling overlaps, automates assignment tracking, and manages semester CGPA targets.
* **Algorithmic Mastery:** Houses 75+ curated Data Structures & Algorithms patterns with active revision indicators and LeetCode/GitHub proxy tracking.
* **Generative AI Learning:** Powered by Google Gemini 2.5, breaking down arbitrary subjects into structured daily curricula with interactive schematic diagrams.
* **Burnout Protection:** Uses an algorithmic Workload & Wellbeing Index (0–100) to adjust study intervals dynamically.

---

## 2. Problem Statement & Core Objectives

### The Problem
Engineering students juggle fragmented workflows across multiple disconnected tools:
1. University portals for timetables and homework deadlines.
2. LeetCode/HackerRank for technical interview preparation.
3. YouTube and scattered documentation for mastering new technologies.
4. Separate timers and spreadsheets for tracking job applications and resumes.
*Result: Cognitive overload, missed deadlines, irregular interview prep, and high burnout rates.*

### Core Objectives
* **Unified Single Pane of Glass:** A single high-performance dashboard that synchronizes academic lectures, assignments, DSA routines, and career milestones.
* **Autonomous Skill Deconstruction:** Provide instant, personalized curricula for any topic on demand with AI.
* **Clash-Free Scheduling:** Real-time overlap and conflict detection for university timetables.
* **Sustainable Gamification:** Maintain engagement through XP streaks, 8-bit sound effects, badge vaults, and vintage retro CRT aesthetics without distracting from core productivity.

---

## 3. System Architecture & Workflow

```
+-------------------------------------------------------------------+
|                           USER BROWSER                            |
|  (React 19 + TypeScript + TailwindCSS v4 + Motion + Retro CSS)    |
+---------------------------------+---------------------------------+
                                  |
                                  | REST / JSON APIs
                                  v
+-------------------------------------------------------------------+
|                        EXPRESS BACKEND                            |
|             (Node.js / tsx runtime, Port 3000)                    |
|                                                                   |
|  - Gemini API Gateway & Prompt Pipeline                           |
|  - LeetCode / GitHub Profile Stats Scraper Proxy                  |
|  - Vite Middleware (HMR in Dev / Static Bundle in Prod)           |
+-------------------+-----------------------------+-----------------+
                    |                             |
                    v                             v
+-----------------------------+     +-------------------------------+
|     GOOGLE GEMINI 2.5       |     |     SUPABASE / POSTGRESQL     |
|   - Curriculum Synthesizer  |     |   - User Profiles & Streaks   |
|   - AI Flashcard Generator  |     |   - Timetable & Conflicts     |
|   - Mock Interview Evaluator|     |   - Assignments & Kanban Data |
|   - Doubt Resolution Engine |     |   - Job Applications Pipeline |
+-----------------------------+     +-------------------------------+
```

---

## 4. Core Modules & Detailed Features

### 4.1 Command Center & Gamification Pulse
* **Live Pulse Metrics:** Displays active study streaks, total XP, weekly focus hours, and LeetCode/GitHub problem tallies.
* **Dynamic XP Multiplier:** Daily streaks multiply earned XP (+40 XP base for task completions).
* **Confetti Celebration:** Uses `canvas-confetti` when unlocking achievements or completing daily agendas.

### 4.2 Omni-Skill AI Curriculum Architect
* **Prompt-to-Curriculum:** Generates multi-week roadmaps broken into day-by-day drills from simple user prompts.
* **Generative Technical Diagrams:** Creates schematic diagrams representing system architectures and conceptual trees.
* **Interactive Checkpoints:** Day-by-day progress tracking with built-in revision reminders.

### 4.3 EduMate Adaptive College Hub
* **Timetable Tracker & Clash Detector:**
  * Period scheduling with automated collision flagging.
  * Detects overlapping lecture and lab slots.
  * Free-window recommendations for study or interview preparation.
* **Coursework Kanban:**
  * Urgency classifications: `URGENT` (<24h), `HIGH` (<3d), `MEDIUM`, `LOW`.
  * Real-time countdowns and drag-and-drop column organization.
* **3D Active Recall Flashcards:**
  * 3D card-flip animations with keyboard shortcuts (`Space` to flip, `1-4` for confidence).
  * Spaced repetition engine prioritizing weak cards.
  * AI Flashcard Synthesizer creating custom decks from raw notes or topic names.
* **Wellbeing & Workload Engine:**
  * Calculates real-time 0–100 load index from pending assignments, exam proximity, and study hours.
  * Dynamically reconfigures Pomodoro work-to-rest ratios (e.g., 25/5 min vs 50/10 min).
* **My Day AI Agenda:**
  * Chronologically merges university periods, pending assignments, DSA targets, and flashcard reviews into one executable daily checklist.

### 4.4 Engineering Placement & Career Suite
* **75+ Core DSA Pattern Matrix:**
  * Covers Sliding Window, Two Pointers, Dynamic Programming, Graphs, Backtracking, etc.
  * Direct LeetCode problem links, difficulty tags, and spaced repetition revision dates.
* **AI Mock Interview Recorder & Mentor:**
  * Simulates technical interview rounds with real-time feedback.
  * Context-aware code evaluations and syntax-highlighted explanations.
* **STAR Portfolio Builder:**
  * Formats project experiences into Situation, Task, Action, Result structured blocks.
* **Job Application Pipeline:**
  * Kanban workflow: `Wishlist` -> `Applied` -> `OA` -> `Technical Interview` -> `HR Round` -> `Offer`.
* **Alumni Network Finder:**
  * Search college alumni across Tier-1 tech firms with quick referral outreach templates.

### 4.5 Academics, Aptitude & Cognitive Practice
* **CGPA & Target Calculator:** Projects required semester grades to achieve target graduation GPA.
* **Semester Exam Planner:** Countdown timers, syllabus checklists, and credit-weighted revision schedules.
* **Aptitude & Practice Zone:** Timed quantitative, logical, and verbal reasoning drills.
* **Concept Map Generator & Doubt Solver:** Visual concept trees and instant conversational AI step-by-step problem solver.

### 4.6 Productivity, Pomodoro & Badges Vault
* **Pomodoro Focus Timer:** Customizable work and break intervals with animated progress dials.
* **Ambient Soundscapes:** Built-in generative audio synthesis for focus soundscapes (Rain, White Noise, Lofi drones).
* **Badges Vault:** 20+ unlockable achievement badges (e.g., "Night Owl Coder", "DSA Master", "Streak Titan").

---

## 5. Technical Specifications & Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`react`, `react-dom`) | Modern component architecture with hooks |
| **Language** | TypeScript 5.8+ | End-to-end type safety |
| **Build Tooling** | Vite 6 + esbuild | Fast Hot Module Replacement and production bundling |
| **Styling** | TailwindCSS v4 + Vanilla CSS | Double-bezel UI architecture and dark/light tokens |
| **Animations & UI** | Motion (`motion`), Sonner, Recharts | Fluid layout transitions, toast notifications, charts |
| **AI Integration** | `@google/genai` (Gemini 2.5) | Low-latency LLM responses and structured JSON parsing |
| **Database** | Supabase (`@supabase/supabase-js`) | PostgreSQL backend with row-level security |
| **Server Framework** | Express 4 + tsx | Node.js backend proxy handling AI pipelines and stats |
| **Audio** | Web Audio API | Custom 8-bit sound synthesizers without external audio assets |

---

## 6. API Endpoints & Gemini AI Integrations

The backend (`server.ts`) provides several dedicated REST API routes:

| Route | Method | Purpose |
| :--- | :--- | :--- |
| `/api/ai/omni-skill` | `POST` | Generates complete day-by-day learning curriculum from topic prompt. |
| `/api/ai/flashcards` | `POST` | Synthesizes 5–15 structured flashcards from text or topic name. |
| `/api/ai/doubt-solve` | `POST` | Resolves student doubts with step-by-step explanations and code blocks. |
| `/api/ai/concept-map` | `POST` | Returns hierarchical node-and-edge graphs for visual concept mapping. |
| `/api/ai/mock-interview` | `POST` | Evaluates student interview responses against technical rubrics. |
| `/api/stats/leetcode/:username` | `GET` | Proxies live LeetCode stats (solved count, ranking, submission history). |
| `/api/stats/github/:username` | `GET` | Fetches public GitHub repositories and commit contributions. |

---

## 7. Database Schema (Supabase SQL)

The PostgreSQL schema (`supabase-schema.sql`) includes:

```sql
-- Profiles & Gamification
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  xp INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  workload_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timetable & Clash Engine
CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  room TEXT,
  is_locked BOOLEAN DEFAULT FALSE
);

-- Assignments & Tasks
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT CHECK (priority IN ('URGENT', 'HIGH', 'MEDIUM', 'LOW')),
  status TEXT CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')) DEFAULT 'TODO'
);

-- Job Applications Kanban
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  stage TEXT CHECK (stage IN ('WISHLIST', 'APPLIED', 'OA', 'INTERVIEW', 'HR', 'OFFER')),
  applied_date DATE DEFAULT CURRENT_DATE,
  notes TEXT
);
```

---

## 8. Design System & Audio Engine

### Visual Aesthetic Modes
1. **Liquid Obsidian (Dark Mode):** Deep black `#090a0f` surfaces with neon cyans (`#00f0ff`), purples (`#b026ff`), and emerald highlights.
2. **Warm Artisan Paper (Light Mode):** High-readability cream `#fcfbf7` background with double-bezel borders and dark charcoal typography.
3. **90s Retro CRT Scanlines:** Overlay filter with scanline shaders, phosphor glow, and terminal aesthetics.

### Web Audio Synthesizer
* Custom procedural 8-bit audio generation (no `.mp3` dependencies):
  * **Beep / Click:** Frequency chirp (440Hz -> 880Hz, 40ms).
  * **Success / XP Gain:** Arpeggiated major chord triad (523Hz -> 659Hz -> 784Hz).
  * **Badge Unlock / Victory:** Multi-oscillator fan-fare with reverb decay.

---

## 9. Installation, Setup & Deployment Guide

### Prerequisites
* Node.js v18+ / v20+
* npm or yarn
* Google Gemini API Key

### Step 1: Clone and Install
```bash
cd d:\SIH\axiom_edumate_hybrid
npm install
```

### Step 2: Environment Configuration
Create or edit `.env` in the root directory:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_key_here
PORT=3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Start Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your web browser.

### Step 4: Production Build
```bash
npm run build
npm start
```

---

## 10. Challenges, Risks & Solutions

| Challenge / Risk | Impact | Implemented Solution |
| :--- | :--- | :--- |
| **Timetable Collisions** | Students double-booking periods and interview slots. | Implemented automated conflict detection algorithm that recalculates clashes on every slot mutation. |
| **Cognitive Burnout** | Heavy exam workload leading to study fatigue. | Integrated 0–100 Wellbeing Load Index that dynamically scales Pomodoro focus intervals and suggests active rest. |
| **API Rate Limits** | Gemini API throttling on rapid client requests. | Implemented backend caching and structured fallback JSON templates in `server.ts`. |
| **Offline Availability** | Students studying in low-connectivity areas. | LocalStorage sync with automatic dirty-state reconciliation once reconnected to Supabase. |

---

## 11. Synchronized 13-Step Demo Tour

The built-in interactive tour (`http://localhost:3000/#demo`) automates full product walkthroughs:

1. **Step 01:** Command Center & Live Pulse Dashboard
2. **Step 02:** Dual Theme Architecture (Obsidian vs Artisan Light)
3. **Step 03:** Omni-Skill AI Curriculum Architect
4. **Step 04:** College Timetable & Clash Detector
5. **Step 05:** Coursework & Assignments Kanban
6. **Step 06:** 3D Active Recall Flashcards
7. **Step 07:** Wellbeing & Workload Adaptation Engine
8. **Step 08:** My Day: AI-Synthesized Daily Agenda
9. **Step 09:** 75+ Core DSA Pattern Tracker
10. **Step 10:** AI Placement & Technical Interview Mentor
11. **Step 11:** Job Application Pipeline & STAR Portfolio
12. **Step 12:** Focus Pomodoro & Productivity Analytics
13. **Step 13:** Gamification Flow & 8-Bit Retro CRT Mode

---

*Document generated automatically for Axiom EduMate Hybrid.*
