import React, { useState, useEffect } from 'react';
import { Toaster, toast } from './lib/toast';
import { useAppData } from './lib/storage';
import { TabType, Track } from './types';
import { TrackProvider } from './context/TrackContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { QuoteBanner } from './components/layout/QuoteBanner';
import { ProfileModal } from './components/layout/ProfileModal';
import { SupabaseModal } from './components/layout/SupabaseModal';
import { TrackOnboardingModal } from './components/layout/TrackOnboardingModal';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { OmniSkillArchitect } from './components/omni_skill/OmniSkillArchitect';
import { PracticeSheetTracker } from './components/practice/PracticeSheetTracker';
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

import { DoubtSolverModal } from './components/ai/DoubtSolverModal';
import { ConceptMapGenerator } from './components/ai/ConceptMapGenerator';
import { MockInterviewRecorder } from './components/career/MockInterviewRecorder';
import { AlumniNetworkFinder } from './components/career/AlumniNetworkFinder';
import { GroupProjectCoordinator } from './components/academics/GroupProjectCoordinator';

import { LandingPage } from './components/landing/LandingPage';
import { DEMO_STEPS, DEMO_STEP_DURATION } from './components/demo/demoSteps';
import { DEMO_CLASH_EVENT } from './components/demo/demoSeedData';
import { DemoTourOverlay } from './components/demo/DemoTourOverlay';
import { AuthModal } from './components/auth/AuthModal';
import { getCurrentSession, logoutUser, AuthUser } from './lib/auth';
import { TRACK_DEFINITIONS } from './context/TrackContext';
import { soundFx } from './lib/sound';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentSession());
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

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
  const [trackOnboardingOpen, setTrackOnboardingOpen] = useState(false);

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
    loadUserProfile,
    applyDisciplineSynthesis,
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

  // Authentication Handlers
  const handleAuthSuccess = (user: AuthUser, isNewSignup: boolean) => {
    setCurrentUser(user);
    if (isNewSignup) {
      applyDisciplineSynthesis(user.track, {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        avatarUrl: user.avatarUrl,
      });
      awardXP(50);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      const meta = TRACK_DEFINITIONS[user.track] || TRACK_DEFINITIONS.engineering;
      toast.success(`🎉 Welcome to Axiom, ${user.name.split(' ')[0]}!`, {
        description: `Your ${meta.label} environment is synthesized and ready! +50 XP awarded.`,
      });
    } else {
      loadUserProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        track: user.track,
        college: user.college,
        branch: user.branch,
        avatarUrl: user.avatarUrl,
      });
      const meta = TRACK_DEFINITIONS[user.track] || TRACK_DEFINITIONS.engineering;
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`, {
        description: `Active discipline: ${meta.shortLabel} Vertical.`,
      });
    }

    setAuthModalOpen(false);
    setViewMode('app');
    setActiveTab('overview');
    if (typeof window !== 'undefined') {
      window.location.hash = '#dashboard';
    }
  };

  const handleLogout = () => {
    soundFx.playClick();
    logoutUser();
    setCurrentUser(null);
    setViewMode('landing');
    if (typeof window !== 'undefined') {
      window.location.hash = '#landing';
    }
    toast.info('Signed Out', {
      description: 'Your local session has been closed safely.',
    });
  };

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
      description: 'Auto-showcasing core features across discipline verticals in sequence.',
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

  // Automated Demo Step Timer
  useEffect(() => {
    if (!isDemoActive || !isDemoPlaying) return;

    const currentStep = DEMO_STEPS[demoStepIndex];
    if (!currentStep) return;

    if (currentStep.tab && currentStep.tab !== activeTab) {
      setActiveTab(currentStep.tab);
    }

    if (currentStep.id === 'step-clash-fix') {
      setDemoClashActive(true);
    } else {
      setDemoClashActive(false);
    }

    const stepDuration = (DEMO_STEP_DURATION[currentStep.id] || 4500) / demoSpeedMultiplier;
    const intervalTickMs = 50;
    const increment = (intervalTickMs / stepDuration) * 100;

    const interval = setInterval(() => {
      setDemoProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleNextDemoStep();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTickMs);

    return () => clearInterval(interval);
  }, [isDemoActive, isDemoPlaying, demoStepIndex, demoSpeedMultiplier]);

  // Check if first-time user needs track selection
  useEffect(() => {
    if (viewMode === 'app' && !profile.track) {
      const timer = setTimeout(() => {
        setTrackOnboardingOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [viewMode, profile.track]);

  if (viewMode === 'landing') {
    return (
      <div className={retroMode ? 'retro-mode' : ''}>
        <LandingPage
          onEnterApp={() => {
            if (currentUser) {
              setViewMode('app');
              if (typeof window !== 'undefined') window.location.hash = '#dashboard';
            } else {
              setAuthModalMode('signup');
              setAuthModalOpen(true);
            }
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
          onStartDemo={handleStartDemo}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode);
            setAuthModalOpen(true);
          }}
          isAuthenticated={Boolean(currentUser)}
        />
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          allowClose={true}
        />
        <Toaster />
      </div>
    );
  }

  const currentTrack: Track = profile.track || 'engineering';

  return (
    <TrackProvider profile={profile} onUpdateProfile={updateProfile}>
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
          onLogout={handleLogout}
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
            onOpenTrackSelector={() => setTrackOnboardingOpen(true)}
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

            {/* Track-Gated Skill Practice Sheets (DSA for engineering, or multi-discipline practice sheets) */}
            {activeTab === 'dsa' && (
              <PracticeSheetTracker
                track={currentTrack}
                profile={profile}
                onToggleComplete={toggleDsaComplete}
                onAddTopic={(newTopic) => {
                  addDsaTopic({
                    category: (newTopic.category as any) || 'Arrays',
                    title: newTopic.title,
                    difficulty: newTopic.difficulty,
                    keyPattern: newTopic.keyPattern,
                    leetcodeUrl: newTopic.externalUrl,
                    completed: false,
                  });
                }}
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

            {/* Opportunities Kanban */}
            {activeTab === 'internships' && (
              <InternshipsTracker
                internships={internships}
                onAddInternship={addInternship}
                onUpdateInternship={updateInternship}
                onDeleteInternship={deleteInternship}
              />
            )}

            {/* Experience Portfolio */}
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

            {/* AI Exam & Career Mentor */}
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
                xp={xpPoints}
                streak={profile.streakCount || 7}
              />
            )}

            {/* AI Doubt Solver */}
            {activeTab === 'doubt-solver' && (
              <DoubtSolverModal onAwardXP={awardXP} />
            )}

            {/* AI Concept Map Generator */}
            {activeTab === 'concept-map' && (
              <ConceptMapGenerator onAwardXP={awardXP} />
            )}

            {/* AI Video Mock Interview Recorder */}
            {activeTab === 'mock-interview' && (
              <MockInterviewRecorder onAwardXP={awardXP} />
            )}

            {/* Alumni Mentorship Finder */}
            {activeTab === 'alumni' && (
              <AlumniNetworkFinder onAwardXP={awardXP} />
            )}

            {/* Group Projects Coordinator */}
            {activeTab === 'group-projects' && (
              <GroupProjectCoordinator
                timetableEvents={timetableEvents}
                onAwardXP={awardXP}
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
                onAwardXP={awardXP}
              />
            )}

            {activeTab === 'wellbeing' && (
              <WellbeingTracker
                checkins={wellbeingCheckins}
                workload={getWorkloadAssessment()}
                onRecordCheckin={recordWellbeingCheckin}
                onAwardXP={awardXP}
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
            if (newProfile.track && newProfile.track !== profile.track) {
              applyDisciplineSynthesis(newProfile.track, newProfile);
            } else {
              updateProfile(newProfile);
            }
            toast.success('Profile Saved', { description: 'Updated target goals and track preferences.' });
          }}
          onOpenTrackOnboarding={() => setTrackOnboardingOpen(true)}
          onLogout={handleLogout}
        />

        <TrackOnboardingModal
          isOpen={trackOnboardingOpen}
          currentTrack={profile.track || 'engineering'}
          onSelectTrack={(newTrack) => {
            applyDisciplineSynthesis(newTrack);
            awardXP(50);
          }}
          onClose={() => setTrackOnboardingOpen(false)}
          isChangeMode={!!profile.track}
        />

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          allowClose={true}
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

        {/* Fluid Toast System */}
        <Toaster />
      </div>
    </TrackProvider>
  );
};
