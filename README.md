# ⚡ Axiom EduMate Hybrid
### Universal AI Learning, Adaptive College Hub & Placement Suite

Axiom EduMate Hybrid is the unified, flagship fusion of:
1. **Axiom Omni-Skill Engine**: Universal prompt-to-curriculum decomposition, day-by-day practice checklists, and instructional schematic scenes powered by Google Gemini.
2. **EduMate Adaptive College Hub**:
   - **Timetable & Clash Detector**: Period scheduling with automated overlapping clash detection, lock protection, and free-window recommendations.
   - **Coursework & Assignments Kanban**: Priority tags (`URGENT`, `HIGH`, `MEDIUM`, `LOW`), countdown countdowns, and +40 XP celebrations.
   - **Active Recall Flashcards**: 3D interactive flip cards, spaced repetition scoring, and Gemini AI Flashcard Synthesizer.
   - **Wellbeing & Workload Adaptation**: 0–100 load index adapting Pomodoro intervals and study session suggestions.
   - **My Day Adaptive Agenda**: Reconciles college lectures, assignments due, DSA targets, and flashcard recall into a single daily checklist.
3. **Engineering Placement & Career Hub**: 75+ DSA pattern sheets, live LeetCode/GitHub stats proxy, Core CS & Semester Exam planners, Job Application Kanban, STAR portfolio, Mistakes log, and Pomodoro focus timers.
4. **Gamification & Retro Design System**: Double-bezel UI architecture, unified XP HUD, streak multiplier, 8-bit sound synthesizers, and 1-click 90s Retro CRT scanlines toggle.

---

## 🚀 Quick Start

### 1. Navigate to the Project Folder
```bash
cd d:\SIH\axiom_edumate_hybrid
```

### 2. Configure Environment Variables
Verify `.env` has your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📦 Production Build & Run

```bash
# Build Vite frontend and bundle Express server
npm run build

# Start the standalone server
npm start
```

---

## 🏗️ Project Directory Structure

```
axiom_edumate_hybrid/
├── dist/                          # Production bundle (Vite + esbuild)
├── src/
│   ├── components/
│   │   ├── college/               # 🎓 EduMate Adaptive Modules
│   │   │   ├── TimetableTracker.tsx
│   │   │   ├── AssignmentsTracker.tsx
│   │   │   ├── FlashcardsTracker.tsx
│   │   │   ├── WellbeingTracker.tsx
│   │   │   └── MyDayPlanner.tsx
│   │   ├── omni_skill/            # ⚡ Axiom Omni-Skill Architect
│   │   ├── dsa/                   # 💻 75+ DSA Patterns
│   │   ├── academics/             # 🎓 CGPA & Exam Planners
│   │   ├── career/                # 💼 Job Applications & STAR Projects
│   │   ├── ai/                    # 🤖 Gemini Mentor & Study Planner
│   │   ├── overview/              # 📊 Command Center & Live Pulse
│   │   ├── productivity/          # ⏱️ Pomodoro & Focus Analytics
│   │   └── layout/                # 🧭 Navbar, Sidebar, Modals
│   ├── data/                      # 📁 Pre-seeded syllabi & schedules
│   ├── lib/                       # ⚙️ Engines (Conflict, Wellbeing, Sound, Storage)
│   ├── types/                     # 📐 Unified TypeScript interfaces
│   ├── App.tsx                    # 🎛️ Main App & Tab Router
│   └── index.css                  # 🎨 Double-Bezel & Retro CSS
├── server.ts                      # 🚀 Express + Gemini + Vite Server
├── package.json
└── vite.config.ts
```
