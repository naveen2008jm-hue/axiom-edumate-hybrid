# ⚡ Axiom EduMate Hybrid (Campus2Career AI)
### Universal Multi-Discipline AI Learning, Adaptive College Hub & Placement Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8e75ff.svg)](https://deepmind.google/technologies/gemini/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Axiom EduMate Hybrid** (branded as **Campus2Career AI**) is an all-in-one cognitive operating system designed for modern students across all higher education disciplines. It harmonizes university coursework, daily timetables, active recall, AI-synthesized curricula, career placement pipelines, and peer community collaboration into a single, high-performance, double-bezel interface.

---

## 🌟 What's New in This Release

### 🎓 1. Multi-Discipline Track System (6+ Major Verticals)
The entire platform is now multi-discipline aware. Selecting a discipline dynamically re-synthesizes the entire learning environment:
* **Engineering & Technology**: 75+ DSA pattern sheets, Core CS (OS, DBMS, Networks, System Design), SDE interview tracks, LeetCode/GitHub proxies.
* **Medical & Healthcare (MBBS / NEET-PG / USMLE)**: Clinical case recall sheets, Pharmacology invariants, Anatomy & Pathology diagnostics, residency pipelines.
* **Law & Legal Studies (CLAT / Judiciary)**: Bharatiya Nyaya Sanhita (BNS) & BSA comparative matrices, statute & judgment sheets, moot court & judicial clerkships.
* **Commerce, Finance & CA/CFA**: Ind AS 115/116 schedules, corporate taxation (MAT), ratio & DCF valuation models, articleship pipelines.
* **Competitive Exams & Civil Services (UPSC / State PSC)**: GS Papers 1–4, Indian Polity landmark cases, CSAT drills, answer writing frameworks.
* **Humanities & Social Sciences**: Sociological paradigms, political theory, UGC-NET prep, research fellowship pipelines.
* **Universal Academic & Vocational**: Interdisciplinary mental models, first-principles mastery, and self-directed roadmaps.

### 🤖 2. AI-Powered Flashcard Generation (Google Gemini 2.5)
* **Prompt-to-Deck Synthesis**: Enter any topic and focus description (or pick track-specific recommendations) to auto-generate 5–20 high-yield active-recall flashcards with subtopics and difficulty ratings.
* **Active Recall 3D Deck**: Interactive 3D flip animations, spaced repetition scoring, voice dictation input, and confetti celebrations upon completion.

### 🔐 3. User Authentication & Discipline Synthesis Flow
* **Registration & Login**: Secure account creation and authentication with discipline vertical onboarding.
* **Session Persistence & Security**: Web Crypto SHA-256 client-side password hashing and localStorage session management.
* **Discipline Environment Synthesizer**: Automatically synthesizes targeted assignments, core subjects, exam schedules, flashcards, and daily agendas upon registration.

### 🎨 4. Dual-Theme Engine & 90s Vintage Retro CRT Mode
* **Liquid Obsidian Dark Mode**: High-contrast dark surfaces with neon radial glow and double-bezel depth.
* **Warm Artisan Paper Light Mode**: Tactile, embossed paper aesthetic with warm amber and slate tones.
* **1-Click 8-Bit CRT Mode**: Vintage monochrome scanlines with custom 8-bit Web Audio synthesizer sound effects.

### 🎬 5. Interactive 13-Step Automated Product Demo Tour
* **Live Automated Walkthrough**: Press `Ctrl + Shift + D` or append `#demo` to the URL to trigger a 13-step product showcase tour highlighting timetable conflict resolution, flashcard flips, Omni-Skill generation, and interview evaluation.
* **Playback Controls**: Speed controls (0.5x, 1x, 1.5x, 2x), pause/play, step scrubbing, and live recording HUD.

### 🚀 6. Extended Cognitive & Career Feature Modules
* **Multimodal AI Doubt Solver**: Step-by-step problem breakdown from natural language prompts or uploaded diagram/code images with invariant checks.
* **AI Concept Map Generator**: Hierarchical 3-level deep interactive mind-map tree generator for visual topic decomposition.
* **AI Video Mock Interview Recorder**: WebCam recording + speech-to-text evaluation, pacing (WPM) gauge, filler word detection, and STAR/IRAC feedback.
* **Alumni Mentorship Network Finder**: Verified alumni directory filtered by discipline, booking 1-on-1 mentorship sessions and career advice.
* **Group Project Coordinator & Conflict Detector**: Milestone tracking, task assignment, and automated clash alerts with university timetable schedules.
* **Syllabus Completion Forecaster**: Velocity projection, days remaining, and revision confidence calculator.
* **Backlogs & Arrears Recovery Tracker**: Priority tagging, target re-exam date planners, and semester credit recovery.
* **Weekly Productivity Recap Card**: Dynamic weekly focus hours breakdown, top subjects, streak status, and shareable summary card.
* **Achievement Badges Vault & XP Engine**: 12+ achievement badges (Bronze, Silver, Gold, Diamond) with real-time unlock triggers.
* **Community & Social Commons Hub**: Track-segregated Discussion Forums, Peer Resource Sharing Library, and synchronized Live Study Rooms.
* **Marketing Landing Page**: Standalone high-conversion marketing overview page with live preview tabs, feature grids, discipline chips, and seamless authentication bridge.

---

## 🏛️ System Architecture

```
+-------------------------------------------------------------------------------+
|                                  USER CLIENT                                  |
|         React 19 + TypeScript + TailwindCSS v4 + Motion + Retro Audio         |
|  - Marketing Landing Page        - Multi-Discipline Workspace Navigation      |
|  - Double-Bezel Glass UI         - Active Recall 3D Voice Flashcards          |
|  - Timetable Clash Engine        - Gamification HUD & Badges Vault            |
+---------------------------------------+---------------------------------------+
                                        |
                                        | REST / JSON APIs
                                        v
+-------------------------------------------------------------------------------+
|                            EXPRESS NODE.JS SERVER                             |
|                        (tsx server.ts, Port 3000)                             |
|                                                                               |
|  - /api/gemini/omni-course        - Universal Prompt-to-Curriculum Generator  |
|  - /api/gemini/chat               - Track-Aware AI Exam & Career Mentor       |
|  - /api/gemini/doubt-solver       - Multimodal Visual & Text Doubt Resolution |
|  - /api/gemini/concept-map        - Hierarchical Mind Map Tree Generator      |
|  - /api/gemini/generate-flashcards- Automated Active-Recall Deck Synthesizer  |
|  - /api/gemini/interview-critique - Video/Audio Spoken Answer Critique        |
|  - /api/leetcode/:username        - Live LeetCode Profile Statistics Proxy    |
|  - /api/github/:username          - Live GitHub Repos & Commit Activity Proxy |
|  - Vite SPA Dev Middleware / Static Production File Server                    |
+-----------------------+-------------------------------+-----------------------+
                        |                               |
                        v                               v
+-------------------------------+               +-------------------------------+
|       GOOGLE GEMINI 2.5       |               |     SUPABASE / POSTGRESQL     |
|   Multimodal Generative AI    |               |   Cloud Sync & User Records   |
+-------------------------------+               +-------------------------------+
```

---

## 🏗️ Project Directory Structure

```
axiom_edumate_hybrid/
├── dist/                                  # Production bundle (Vite + esbuild CJS server)
├── src/
│   ├── components/
│   │   ├── academics/                     # 🎓 Academic & Exam Planning
│   │   │   ├── AcademicTracker.tsx        # CGPA Calculator, Semester & Core Exams
│   │   │   ├── BacklogTracker.tsx         # Arrears & Re-exam Target Clearance
│   │   │   ├── GroupProjectCoordinator.tsx# Group Milestones & Schedule Conflict Detector
│   │   │   └── SyllabusForecaster.tsx     # Velocity & Completion Date Projection
│   │   ├── ai/                            # 🤖 Generative AI Intelligence Tools
│   │   │   ├── AiMentorChat.tsx           # Track-Aware AI Exam & Career Mentor
│   │   │   ├── AiStudyPlanner.tsx         # Multi-Day Structured Study Plan Synthesizer
│   │   │   ├── ConceptMapGenerator.tsx    # Interactive 3-Level Deep Mind Map Tree
│   │   │   └── DoubtSolverModal.tsx       # Multimodal Image + Text Step-by-Step Solver
│   │   ├── aptitude/                      # 🧮 Quantitative, Reasoning & Verbal Formulas
│   │   │   └── AptitudeTracker.tsx
│   │   ├── auth/                          # 🔐 Authentication & Discipline Selection
│   │   │   └── AuthModal.tsx              # Signup/Login Modal with Track Synthesis
│   │   ├── career/                        # 💼 Career, Portfolio & Placement Modules
│   │   │   ├── AlumniNetworkFinder.tsx    # Verified Alumni Directory & Mentorship
│   │   │   ├── CoursesTracker.tsx         # External Certificates & Verification Vault
│   │   │   ├── InternshipsTracker.tsx     # Opportunities Pipeline Kanban
│   │   │   ├── LinkedinChecklist.tsx      # Personal Branding & Outreach Tasks
│   │   │   ├── MistakesLog.tsx            # Bug & Interview Failure Post-Mortem Log
│   │   │   ├── MockInterviewRecorder.tsx  # WebCam Video Mock Interview & Speech Analyzer
│   │   │   ├── ProjectsTracker.tsx        # STAR Framework Experience Portfolio
│   │   │   └── TrackRadarTracker.tsx      # Skills Competency Radar
│   │   ├── college/                       # 🏫 EduMate Adaptive College Hub
│   │   │   ├── AssignmentsTracker.tsx     # Priority Kanban with XP Celebrations
│   │   │   ├── FlashcardsTracker.tsx      # Active Recall 3D Cards & AI Deck Generator
│   │   │   ├── MyDayPlanner.tsx           # Daily Agenda reconciling Classes & Tasks
│   │   │   ├── TimetableTracker.tsx       # Overlap & Clash Detection Calendar
│   │   │   └── WellbeingTracker.tsx       # Sleep Debt, Mood & Workload Adaptation
│   │   ├── community/                     # 👥 Peer Network & Social Commons Hub
│   │   │   ├── CommunityHub.tsx           # Hub Container & Discipline Switcher
│   │   │   ├── DiscussionForums.tsx       # Upvoteable Topic Q&A Threads
│   │   │   ├── LiveStudyRooms.tsx         # Synchronized Focus Rooms & Pomodoro
│   │   │   └── ResourceSharingHub.tsx     # Verified Notes & Blueprint Library
│   │   ├── demo/                          # 🎬 Automated 13-Step Showcase Tour
│   │   │   ├── demoSeedData.ts            # Tour Datasets & Simulated Clashes
│   │   │   ├── demoSteps.ts               # Step Definitions & Timing Constants
│   │   │   ├── DemoTourController.tsx     # Playback Engine & Timers
│   │   │   └── DemoTourOverlay.tsx        # Broadcasting HUD & Recording Overlay
│   │   ├── dsa/                           # 💻 75+ DSA Pattern Practice
│   │   │   └── DsaTracker.tsx
│   │   ├── landing/                       # 🌐 High-Conversion Marketing Page
│   │   │   └── LandingPage.tsx
│   │   ├── layout/                        # 🧭 Shell Layout & Navigation
│   │   │   ├── Navbar.tsx                 # Top Floating Island, Audio & Theme Switchers
│   │   │   ├── ProfileModal.tsx           # Profile Details & Target Goal Preferences
│   │   │   ├── QuoteBanner.tsx            # Daily Inspirational Quote Banner
│   │   │   ├── Sidebar.tsx                # Collapsible Category Navigation Tree
│   │   │   ├── SupabaseModal.tsx          # Cloud Database Sync Settings
│   │   │   └── TrackOnboardingModal.tsx   # Discipline Switcher & Synthesis Modal
│   │   ├── omni_skill/                    # ⚡ Axiom Omni-Skill Engine
│   │   │   └── OmniSkillArchitect.tsx     # Universal Prompt-to-Curriculum Generator
│   │   ├── overview/                      # 📊 Command Center & Live Pulse Dashboard
│   │   │   └── OverviewDashboard.tsx
│   │   ├── practice/                      # 📝 Multi-Discipline Practice Sheets
│   │   │   └── PracticeSheetTracker.tsx
│   │   └── productivity/                  # ⏱️ Focus & Gamification Analytics
│   │       ├── BadgesVault.tsx            # 12+ Unlockable Achievement Badges
│   │       ├── ProductivityDashboard.tsx  # Pomodoro Timer & Weekly Focus Charts
│   │       └── WeeklyRecapCard.tsx        # Shareable Weekly Productivity Summary
│   ├── context/
│   │   └── TrackContext.tsx               # Discipline State & Vertical Configuration
│   ├── data/                              # 📁 Pre-seeded Syllabi, Quotes & Datasets
│   │   ├── practiceSheets/                # Multi-Discipline Practice Topics
│   │   │   ├── engineeringPractice.ts     # 75+ DSA Patterns
│   │   │   ├── medicalPractice.ts         # Clinical Recall Cases
│   │   │   ├── lawPractice.ts             # Statute & Judgment Sheets
│   │   │   ├── commercePractice.ts        # Finance & Tax Drills
│   │   │   ├── competitiveExamsPractice.ts# UPSC / PSC General Studies
│   │   │   ├── humanitiesPractice.ts      # Sociological & Policy Essays
│   │   │   └── index.ts
│   │   ├── alumniData.ts                  # Verified Alumni Mentors Data
│   │   ├── aptitudeTopics.ts              # Quantitative & Reasoning Question Bank
│   │   ├── assignmentsData.ts             # Default Coursework Assignments
│   │   ├── badgeDefinitions.ts            # Gamification Badge Rules & Tiers
│   │   ├── communityData.ts               # Sample Forums, Resources & Study Rooms
│   │   ├── coreSubjects.ts                # Discipline Core Syllabi & Topics
│   │   ├── dsaSyllabus.ts                 # Full Blind 75 / NeetCode Pattern Syllabi
│   │   ├── flashcardsData.ts              # Pre-seeded Active Recall Decks
│   │   ├── groupProjectsData.ts           # Group Projects & Backlog Datasets
│   │   ├── interviewQuestions.ts          # Mock Interview Question Bank
│   │   ├── linkedinTasks.ts               # Networking & Profile Growth Checklist
│   │   ├── quotes.ts                      # Curated Academic & Leadership Quotes
│   │   ├── timetableData.ts               # College Lecture Schedules
│   │   └── trackRadarData.ts              # Skills Radar Datasets
│   ├── lib/                               # ⚙️ Core Engines & Utilities
│   │   ├── auth.ts                        # Session Management & SHA-256 Hashing
│   │   ├── badgeEngine.ts                 # Achievement Evaluation Logic
│   │   ├── conflictDetector.ts            # Schedule Overlap Detection Algorithm
│   │   ├── environmentSynthesizer.ts      # Automated Track Environment Generator
│   │   ├── imageGen.ts                    # Dynamic Visual Card Synthesis
│   │   ├── sound.ts                       # Web Audio 8-Bit Chiptune Synthesizer
│   │   ├── storage.ts                     # LocalStorage Persistence Layer
│   │   ├── supabase.ts                    # Supabase Client Wrapper
│   │   ├── toast.tsx                      # Fluid Toast Notification System
│   │   ├── utils.ts                       # Formatters & Class Helpers
│   │   └── wellbeingEngine.ts             # Workload & Burnout Calculator
│   ├── types/
│   │   └── index.ts                       # Unified TypeScript Type Definitions
│   ├── App.tsx                            # Root App Controller & Tab Router
│   ├── index.css                          # Double-Bezel Design Tokens & Retro Styles
│   └── main.tsx                           # React 19 Entry Point
├── server.ts                              # Express Backend + Gemini API Gateway + Proxies
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Google Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/naveen2008jm-hue/axiom-edumate-hybrid.git

# Navigate to the workspace
cd axiom-edumate-hybrid

# Install required dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Google Gemini Generative AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (Default: 3000)
PORT=3000
```

### 3. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Exploring the App
1. **Landing Page**: View the marketing overview, feature grid, and live preview tabs.
2. **Sign Up / Sign In**: Click **"Get Started"** or **"Sign In"** in the top bar. Choose your academic discipline (Engineering, Medical, Law, Commerce, Civil Services, or Humanities) to automatically synthesize a customized environment.
3. **1-Click Demo Mode**: Click **"Start Demo Tour"** or press `Ctrl + Shift + D` (or visit `http://localhost:3000/#demo`) to run the automated 13-step product showcase.

---

## 📦 Production Build & Deployment

```bash
# Type check the codebase
npm run lint

# Build the Vite frontend and bundle Express server
npm run build

# Start the standalone production server
npm start
```
The server will bind to `http://0.0.0.0:3000` and serve both static assets and API routes.

---

## 🔌 API Reference & Gemini Endpoints

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Health check endpoint returning status and Gemini API connectivity. |
| `/api/gemini/omni-course` | `POST` | Deconstructs any prompt into a structured multi-day curriculum with visual prompts. |
| `/api/gemini/chat` | `POST` | Discipline-aware AI exam and career mentor conversation endpoint. |
| `/api/gemini/doubt-solver` | `POST` | Multimodal visual/text problem solver providing step-by-step invariant derivations. |
| `/api/gemini/concept-map` | `POST` | Generates a 3-level hierarchical JSON tree for interactive mind map exploration. |
| `/api/gemini/generate-flashcards` | `POST` | Generates 5–20 high-yield active recall flashcards with subtopic and difficulty tags. |
| `/api/gemini/interview-critique` | `POST` | Analyzes spoken interview transcripts for WPM pacing, filler words, and STAR structure. |
| `/api/leetcode/:username` | `GET` | Live proxy fetching public LeetCode problem tallies, ranking, and submission calendar. |
| `/api/github/:username` | `GET` | Live proxy fetching public GitHub repositories, stars, and commit activity. |

---

## 🎨 Design System & Accessibility

* **Double-Bezel UI Architecture**: Machined, outer bevel shells with recessed core content plates creating optical hierarchy and depth.
* **Audio Feedback**: Built-in 8-bit chiptune sound synthesizer created with Web Audio API (`soundFx.playClick()`, `soundFx.playLevelUp()`, `soundFx.playFlip()`).
* **Spaced Repetition & Gamification**: Streak multipliers, XP awards on assignment/card completion, and celebratory confetti particles (`canvas-confetti`).
* **Responsive Layouts**: Fully responsive mobile/tablet/desktop layouts with collapsible sidebar navigation and sticky floating island headers.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
