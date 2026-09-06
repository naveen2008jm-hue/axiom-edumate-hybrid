import React, { useState, useEffect } from 'react';
import { Toaster, toast } from './lib/toast';
import { useAppData } from './lib/storage';
import { TabType } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { QuoteBanner } from './components/layout/QuoteBanner';
import { ProfileModal } from './components/layout/ProfileModal';
import { SupabaseModal } from './components/layout/SupabaseModal';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { OmniSkillArchitect } from './components/omni_skill/OmniSkillArchitect';
import { DsaTracker } from './components/dsa/DsaTracker';
import { AcademicTracker } from './components/academics/AcademicTracker';
import { AptitudeTracker } from './components/aptitude/AptitudeTracker';
import { InternshipsTracker } from './components/career/InternshipsTracker';
import { ProjectsTracker } from './components/career/ProjectsTracker';
import { MistakesLog } from './components/career/MistakesLog';
import { CoursesTracker } from './components/career/CoursesTracker';
import { LinkedinChecklist } from './components/career/LinkedinChecklist';
import { AiMentorChat } from './components/ai/AiMentorChat';
import { AiStudyPlanner } from './components/ai/AiStudyPlanner';
import { ProductivityDashboard } from './components/productivity/ProductivityDashboard';
import { TimetableTracker } from './components/college/TimetableTracker';
import { AssignmentsTracker } from './components/college/AssignmentsTracker';
import { FlashcardsTracker } from './components/college/FlashcardsTracker';
import { WellbeingTracker } from './components/college/WellbeingTracker';
import { MyDayPlanner } from './components/college/MyDayPlanner';

import { LandingPage } from './components/landing/LandingPage';
import { DEMO_STEPS, DEMO_STEP_DURATION } from './components/demo/demoSteps';
import { DEMO_CLASH_EVENT } from './components/demo/demoSeedData';
import { DemoTourOverlay } from './components/demo/DemoTourOverlay';
import { soundFx } from './lib/sound';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#dashboard' || path === '/dashboard' || path === '/app' || hash === '#demo' || path === '/demo') {
        return 'app';
      }
    }
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // Automated Product Demo Tour State
  const [isDemoActive, setIsDemoActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#demo' || window.location.pathname === '/demo' || window.location.search.includes('demo=true');
    }
    return false;
  });
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(true);
  const [demoProgressPercent, setDemoProgressPercent] = useState<number>(0);
  const [demoSpeedMultiplier, setDemoSpeedMultiplier] = useState<number>(1);
  const [demoClashActive, setDemoClashActive] = useState<boolean>(false);

  const {
    profile,
    updateProfile,
    xpPoints,
    awardXP,
    theme,
    setTheme,
    toggleTheme,
    retroMode,
    toggleRetroMode,
    dsaList,
    toggleDsaComplete,
    addDsaTopic,
    aptitudeList,
    toggleAptitudeComplete,
    updateAptitudePractice,
    cgpaRecords,
    addCgpaRecord,
    deleteCgpaRecord,
    calculateCGPA,
    examPlanners,
    addExamPlanner,
    toggleRevisionItem,
    coreSubjects,
    updateCoreSubject,
    toggleCoreTopic,
    internships,
    addInternship,
    updateInternship,
    deleteInternship,
    projects,
    addProject,
    updateProject,
    deleteProject,
    mistakesLog,
    addMistakeLog,
    toggleMistakeResolved,
    deleteMistake,
    externalCourses,
    addExternalCourse,
    deleteExternalCourse,
    studySessions,
    addStudySession,
    studyPlans,
    addStudyPlan,
    toggleStudyPlanDay,
    deleteStudyPlan,
    omniCourses,
    addOmniCourse,
    setActiveOmniCourse,
    toggleOmniTask,
    deleteOmniCourse,
    linkedinTasks,
    toggleLinkedInTask,
    quotes,
    toggleQuoteFavorite,
    resetToSampleData,
    exportDataJSON,
    timetableEvents,
    addTimetableEvent,
    updateTimetableEvent,
    deleteTimetableEvent,
    duplicateDaySchedule,
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentStatus,
    flashcardDecks,
    addFlashcardDeck,
    deleteFlashcardDeck,
    updateCardMastery,
    addCardToDeck,
    wellbeingCheckins,
    recordWellbeingCheckin,
    getWorkloadAssessment,
    dailyAgenda,
    toggleAgendaSlotComplete,
    refreshDailyAgenda,
  } = useAppData();

  const { runningCgpa } = calculateCGPA();

  // Demo Mode Controller Actions
  const handleStartDemo = () => {
    setViewMode('app');
    setIsDemoActive(true);
    setDemoStepIndex(0);
    setDemoProgressPercent(0);
    setIsDemoPlaying(true);
    if (typeof document !== 'undefined') {
      document.body.classList.add('demo-active');
    }
    if (typeof window !== 'undefined') {
      window.location.hash = '#demo';
    }
    soundFx.playLevelUp();
    toast.info('🎬 Demo Tour Launched', {
      description: 'Auto-showcasing all 13 core features in sequence.',
    });
  };

  const handleExitDemo = () => {
    setIsDemoActive(false);
    setDemoClashActive(false);
    if (typeof document !== 'undefined') {
      document.body.classList.remove('demo-active');
    }
    if (typeof window !== 'undefined' && window.location.hash === '#demo') {
      window.location.hash = '#dashboard';
    }
    toast('Demo Tour Exited');
  };

  const handleNextDemoStep = () => {
    if (demoStepIndex < DEMO_STEPS.length - 1) {
      setDemoStepIndex((prev) => prev + 1);
      setDemoProgressPercent(0);
    } else {
      handleExitDemo();
    }
  };

  const handlePrevDemoStep = () => {
    if (demoStepIndex > 0) {
      setDemoStepIndex((prev) => prev - 1);
      setDemoProgressPercent(0);
    }
  };

  // Keyboard shortcut: Ctrl+Shift+D or Meta+Shift+D
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        if (isDemoActive) {
          handleExitDemo();
        } else {
          handleStartDemo();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [isDemoActive]);

  // Demo Step Timer Loop
  useEffect(() => {
    if (!isDemoActive || !isDemoPlaying) return;

    const intervalMs = 50;
    const effectiveStepDuration = DEMO_STEP_DURATION / demoSpeedMultiplier;
    const increment = (intervalMs / effectiveStepDuration) * 100;

    const timer = setInterval(() => {
      setDemoProgressPercent((prev) => {
        if (prev + increment >= 100) {
          if (demoStepIndex < DEMO_STEPS.length - 1) {
            setDemoStepIndex((s) => s + 1);
            return 0;
          } else {
            setIsDemoActive(false);
            if (typeof document !== 'undefined') {
              document.body.classList.remove('demo-active');
            }
            toast.success('🎬 Tour Completed', {
              description: 'Axiom EduMate Hybrid is ready for high-performance student execution.',
            });
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isDemoActive, isDemoPlaying, demoStepIndex, demoSpeedMultiplier]);

  // Scripted Step Visual Actions
  useEffect(() => {
    if (!isDemoActive) return;

    const currentStep = DEMO_STEPS[demoStepIndex];
    if (!currentStep) return;

    // Switch tab
    setActiveTab(currentStep.tab);

    // Smooth scroll to top of content
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Step 4: Schedule clash
    if (currentStep.action === 'timetable-clash') {
      setDemoClashActive(true);
    } else {
      setDemoClashActive(false);
    }

    // Step 2: Dark / Light mode dual toggle showcase
    if (currentStep.action === 'theme-toggle') {
      const t1 = setTimeout(() => {
        setTheme('light');
        toast.info('Warm Artisan Paper Light Mode', { description: 'Dual-bezel relief & tactile contrast' });
      }, 1800 / demoSpeedMultiplier);
      const t2 = setTimeout(() => {
        setTheme('dark');
        toast.info('Liquid Obsidian Dark Mode', { description: 'Deep neon contrast and glow depth' });
      }, 4200 / demoSpeedMultiplier);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // Step 11: Job Kanban + STAR Portfolio
    if (currentStep.action === 'career-kanban') {
      setActiveTab('internships');
      const t = setTimeout(() => {
        setActiveTab('projects');
      }, 2800 / demoSpeedMultiplier);
      return () => clearTimeout(t);
    }

    // Step 13: Gamification & Retro CRT
    if (currentStep.action === 'gamification-crt') {
      awardXP(50);
      soundFx.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981'],
      });
      const t1 = setTimeout(() => {
        if (!retroMode) toggleRetroMode();
      }, 2000 / demoSpeedMultiplier);
      const t2 = setTimeout(() => {
        if (retroMode) toggleRetroMode();
      }, 4500 / demoSpeedMultiplier);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isDemoActive, demoStepIndex, demoSpeedMultiplier]);

  if (viewMode === 'landing') {
    return (
      <div className={`min-h-[100dvh] bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative ${retroMode ? 'retro-mode' : ''}`}>
        <LandingPage
          onEnterApp={() => {
            setViewMode('app');
            if (typeof window !== 'undefined') window.location.hash = '#dashboard';
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
          onStartDemo={handleStartDemo}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <div className={`min-h-[100dvh] flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative ${retroMode ? 'retro-mode' : ''}`}>
      {/* Ambient Radial Mesh Layer */}
      <div className="ambient-mesh" />

      {/* Optional CRT Scanlines in Retro Mode */}
      {retroMode && <div className="fixed inset-0 z-40 retro-scanlines" />}

      {/* Top Floating Island Navbar */}
      <Navbar
        profile={profile}
        xpPoints={xpPoints}
        theme={theme}
        onToggleTheme={toggleTheme}
        retroMode={retroMode}
        onToggleRetro={toggleRetroMode}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenSupabase={() => setSupabaseModalOpen(true)}
        onExportData={exportDataJSON}
        onResetData={resetToSampleData}
        isDemoActive={isDemoActive}
        onStartDemo={isDemoActive ? handleExitDemo : handleStartDemo}
        onNavigateLanding={() => {
          setViewMode('landing');
          if (typeof window !== 'undefined') window.location.hash = '#landing';
        }}
      />

      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto relative z-10 pt-2">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          omniCoursesCount={omniCourses.length}
          onNavigateLanding={() => {
            setViewMode('landing');
            if (typeof window !== 'undefined') window.location.hash = '#landing';
          }}
        />

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6 ${isDemoActive ? 'demo-recording-mode pb-36' : ''}`}>
          {/* Daily Inspirational Quote Banner */}
          <QuoteBanner quotes={quotes} onToggleFavorite={toggleQuoteFavorite} />

          {/* Active Tab Router */}
          {activeTab === 'overview' && (
            <OverviewDashboard
              profile={profile}
              xpPoints={xpPoints}
              dsaList={dsaList}
              omniCourses={omniCourses}
              internships={internships}
              examPlanners={examPlanners}
              runningCgpa={runningCgpa}
              onTabChange={setActiveTab}
              onToggleOmniTask={toggleOmniTask}
              timetableEvents={timetableEvents}
              assignments={assignments}
              workload={getWorkloadAssessment()}
            />
          )}

          {activeTab === 'omni-skill' && (
            <OmniSkillArchitect
              courses={omniCourses}
              onAddCourse={addOmniCourse}
              onSetActiveCourse={setActiveOmniCourse}
              onToggleTask={toggleOmniTask}
              onDeleteCourse={deleteOmniCourse}
            />
          )}

          {activeTab === 'dsa' && (
            <DsaTracker
              dsaList={dsaList}
              profile={profile}
              onToggleComplete={toggleDsaComplete}
              onAddTopic={addDsaTopic}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicTracker
              cgpaRecords={cgpaRecords}
              examPlanners={examPlanners}
              coreSubjects={coreSubjects}
              onAddCgpa={addCgpaRecord}
              onDeleteCgpa={deleteCgpaRecord}
              onAddExam={addExamPlanner}
              onToggleRevision={toggleRevisionItem}
              onUpdateCoreSubject={updateCoreSubject}
              onToggleCoreTopic={toggleCoreTopic}
              calculateCGPA={calculateCGPA}
            />
          )}

          {activeTab === 'aptitude' && (
            <AptitudeTracker
              aptitudeList={aptitudeList}
              onToggleComplete={toggleAptitudeComplete}
              onUpdatePractice={updateAptitudePractice}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipsTracker
              internships={internships}
              onAddInternship={addInternship}
              onUpdateInternship={updateInternship}
              onDeleteInternship={deleteInternship}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTracker
              projects={projects}
              profile={profile}
              onAddProject={addProject}
              onUpdateProject={updateProject}
              onDeleteProject={deleteProject}
            />
          )}

          {activeTab === 'mistakes' && (
            <MistakesLog
              mistakes={mistakesLog}
              onAddMistake={addMistakeLog}
              onToggleResolved={toggleMistakeResolved}
              onDeleteMistake={deleteMistake}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesTracker
              externalCourses={externalCourses}
              onAddCourse={addExternalCourse}
              onDeleteCourse={deleteExternalCourse}
            />
          )}

          {activeTab === 'linkedin' && (
            <LinkedinChecklist
              tasks={linkedinTasks}
              onToggleTask={toggleLinkedInTask}
            />
          )}

          {activeTab === 'ai-mentor' && (
            <AiMentorChat profile={profile} demoMode={isDemoActive} />
          )}

          {activeTab === 'ai-planner' && (
            <AiStudyPlanner
              studyPlans={studyPlans}
              onAddPlan={addStudyPlan}
              onToggleDay={toggleStudyPlanDay}
              onDeletePlan={deleteStudyPlan}
            />
          )}

          {activeTab === 'productivity' && (
            <ProductivityDashboard
              studySessions={studySessions}
              onAddSession={addStudySession}
            />
          )}

          {activeTab === 'my-day' && (
            <MyDayPlanner
              slots={dailyAgenda}
              workload={getWorkloadAssessment()}
              onToggleSlot={toggleAgendaSlotComplete}
              onRefreshAgenda={refreshDailyAgenda}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableTracker
              events={demoClashActive ? [DEMO_CLASH_EVENT, ...timetableEvents] : timetableEvents}
              onAddEvent={addTimetableEvent}
              onUpdateEvent={updateTimetableEvent}
              onDeleteEvent={deleteTimetableEvent}
              onDuplicateDay={duplicateDaySchedule}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsTracker
              assignments={assignments}
              onAddAssignment={addAssignment}
              onUpdateAssignment={updateAssignment}
              onDeleteAssignment={deleteAssignment}
              onToggleStatus={toggleAssignmentStatus}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsTracker
              decks={flashcardDecks}
              onAddDeck={addFlashcardDeck}
              onDeleteDeck={deleteFlashcardDeck}
              onUpdateCardMastery={updateCardMastery}
              onAddCardToDeck={addCardToDeck}
              demoMode={isDemoActive}
            />
          )}

          {activeTab === 'wellbeing' && (
            <WellbeingTracker
              checkins={wellbeingCheckins}
              workload={getWorkloadAssessment()}
              onRecordCheckin={recordWellbeingCheckin}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onSave={(newProfile) => {
          updateProfile(newProfile);
          toast.success('Profile Saved', { description: 'Updated target companies and career preferences.' });
        }}
      />

      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />

      {/* Automated Product Demo Mode Broadcast Overlay */}
      {isDemoActive && DEMO_STEPS[demoStepIndex] && (
        <DemoTourOverlay
          currentStep={DEMO_STEPS[demoStepIndex]}
          totalSteps={DEMO_STEPS.length}
          stepIndex={demoStepIndex}
          isPlaying={isDemoPlaying}
          stepProgressPercent={demoProgressPercent}
          speedMultiplier={demoSpeedMultiplier}
          onTogglePlay={() => setIsDemoPlaying(!isDemoPlaying)}
          onNextStep={handleNextDemoStep}
          onPrevStep={handlePrevDemoStep}
          onSelectSpeed={(speed) => setDemoSpeedMultiplier(speed)}
          onExitDemo={handleExitDemo}
        />
      )}

      {/* Apple-Style Fluid Toast System */}
      <Toaster />
    </div>
  );
};
