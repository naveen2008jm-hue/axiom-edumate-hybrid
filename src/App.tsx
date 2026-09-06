import React, { useState } from 'react';
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

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#dashboard' || path === '/dashboard' || path === '/app') {
        return 'app';
      }
    }
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

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
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
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
            <AiMentorChat profile={profile} />
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
              events={timetableEvents}
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

      {/* Apple-Style Fluid Toast System */}
      <Toaster />
    </div>
  );
};
