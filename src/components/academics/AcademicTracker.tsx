import React, { useState } from 'react';
import {
  GraduationCap,
  Calculator,
  Calendar,
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Star,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { CgpaRecord, ExamPlanner, CoreSubject } from '../../types';

interface AcademicTrackerProps {
  cgpaRecords: CgpaRecord[];
  examPlanners: ExamPlanner[];
  coreSubjects: CoreSubject[];
  onAddCgpa: (rec: Omit<CgpaRecord, 'id'>) => void;
  onDeleteCgpa: (id: string) => void;
  onAddExam: (exam: Omit<ExamPlanner, 'id'>) => void;
  onToggleRevision: (examId: string, dayIdx: number) => void;
  onUpdateCoreSubject: (id: string, updates: Partial<CoreSubject>) => void;
  onToggleCoreTopic: (subjectId: string, topicIdx: number) => void;
  calculateCGPA: () => { runningCgpa: number; totalCredits: number };
}

export const AcademicTracker: React.FC<AcademicTrackerProps> = ({
  cgpaRecords,
  examPlanners,
  coreSubjects,
  onAddCgpa,
  onDeleteCgpa,
  onAddExam,
  onToggleRevision,
  onUpdateCoreSubject,
  onToggleCoreTopic,
  calculateCGPA,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cgpa' | 'exams' | 'core-cs'>('core-cs');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(coreSubjects[0]?.id || null);

  // New CGPA form
  const [newSem, setNewSem] = useState(cgpaRecords.length + 1);
  const [newSgpa, setNewSgpa] = useState('9.0');
  const [newCredits, setNewCredits] = useState('24');

  // New Exam form
  const [examSubject, setExamSubject] = useState('');
  const [examCode, setExamCode] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examDifficulty, setExamDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const { runningCgpa, totalCredits } = calculateCGPA();

  const handleAddCgpa = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCgpa({
      semester: Number(newSem),
      sgpa: Number(newSgpa),
      credits: Number(newCredits),
    });
    setNewSem(newSem + 1);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject || !examDate) return;
    onAddExam({
      semester: 5,
      subjectName: examSubject,
      subjectCode: examCode || 'CS500',
      examDate,
      difficulty: examDifficulty,
      status: 'Upcoming',
      revisionPlan: [
        { day: 'Day 1', topic: 'Core Definitions & Foundations', done: false },
        { day: 'Day 2', topic: 'Theory & Formula Proofs', done: false },
        { day: 'Day 3', topic: 'Previous Year Exam Question Solves', done: false },
        { day: 'Day 4', topic: 'Numerical Problems & Edge Cases', done: false },
        { day: 'Day 5', topic: 'Final Rapid Summary & Mock Revision', done: false },
      ],
    });
    setExamSubject('');
    setExamCode('');
    setExamDate('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('core-cs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'core-cs'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Core CS Subject Mastery
          </button>
          <button
            onClick={() => setActiveSubTab('exams')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'exams'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Semester Exam Planner
          </button>
          <button
            onClick={() => setActiveSubTab('cgpa')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'cgpa'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            CGPA & Academics Calculator
          </button>
        </div>

        {/* Running CGPA badge */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-400">Cumulative CGPA:</span>
          <span className="text-emerald-400 font-bold">{runningCgpa}</span>
        </div>
      </div>

      {/* 1. Core CS Subjects View */}
      {activeSubTab === 'core-cs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreSubjects.map((sub) => {
              const completedCount = sub.keyTopics.filter((t) => t.completed).length;
              const percent = sub.keyTopics.length ? Math.round((completedCount / sub.keyTopics.length) * 100) : 0;
              const isExpanded = expandedSubjectId === sub.id;

              return (
                <div
                  key={sub.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isExpanded
                      ? 'bg-slate-900 border-indigo-500/50 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {sub.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{sub.subjectName}</h3>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => onUpdateCoreSubject(sub.id, { confidenceLevel: star })}
                          className={`w-3.5 h-3.5 cursor-pointer ${
                            star <= sub.confidenceLevel ? 'fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Key Topics</span>
                      <span className="text-indigo-400 font-bold">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedSubjectId(isExpanded ? null : sub.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    <span>{isExpanded ? 'Hide Details & FAQs' : 'Review Topics & FAQs'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Expanded Subject Drilldown */}
          {expandedSubjectId && (() => {
            const subject = coreSubjects.find((s) => s.id === expandedSubjectId);
            if (!subject) return null;

            return (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>{subject.subjectName} — Deep Dive Checklist</span>
                  </h3>
                  {subject.notes && <p className="text-xs text-slate-400 mt-1">{subject.notes}</p>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Topics Checklist */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono font-semibold text-slate-400 uppercase">
                      Interview High-Yield Topics (+10 XP)
                    </div>
                    <div className="space-y-2">
                      {subject.keyTopics.map((topic, tIdx) => (
                        <div
                          key={tIdx}
                          onClick={() => onToggleCoreTopic(subject.id, tIdx)}
                          className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                            topic.completed
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                              : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <button className="mt-0.5 text-emerald-400">
                            {topic.completed ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-slate-950" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                          <span className={`text-xs ${topic.completed ? 'line-through text-slate-500' : ''}`}>
                            {topic.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Frequently Asked Questions */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono font-semibold text-slate-400 uppercase">
                      Standard Product Interview Questions
                    </div>
                    <div className="space-y-2">
                      {subject.frequentlyAskedQuestions?.map((faq, fIdx) => (
                        <div key={fIdx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                          <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <span>{faq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 2. Semester Exam Planner */}
      {activeSubTab === 'exams' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Exam Form */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Upcoming Semester Exam</span>
              </h3>
              <form onSubmit={handleAddExam} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Subject Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Operating Systems"
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="CS504"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Exam Date</label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Difficulty</label>
                    <select
                      value={examDifficulty}
                      onChange={(e) => setExamDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition mt-2"
                >
                  Create 5-Day Revision Plan
                </button>
              </form>
            </div>

            {/* Exam Cards */}
            <div className="lg:col-span-2 space-y-4">
              {examPlanners.map((exam) => {
                const completedSteps = exam.revisionPlan.filter((r) => r.done).length;
                const progress = exam.revisionPlan.length
                  ? Math.round((completedSteps / exam.revisionPlan.length) * 100)
                  : 0;

                return (
                  <div key={exam.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-400">{exam.subjectCode}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {exam.examDate}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{exam.subjectName}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                        {progress}% Revised
                      </span>
                    </div>

                    {/* 5-Day Revision Checklist */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      {exam.revisionPlan.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => onToggleRevision(exam.id, sIdx)}
                          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition text-xs ${
                            step.done
                              ? 'bg-emerald-500/5 text-slate-400'
                              : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <button className="text-emerald-400">
                            {step.done ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-slate-900" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                          <span className="font-mono text-[10px] text-slate-500 w-12">{step.day}</span>
                          <span className={`flex-1 truncate ${step.done ? 'line-through' : ''}`}>{step.topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. CGPA & Academic Calculator */}
      {activeSubTab === 'cgpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-400" />
              <span>Add Semester Grade</span>
            </h3>
            <form onSubmit={handleAddCgpa} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Semester Number</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={newSem}
                  onChange={(e) => setNewSem(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Semester SGPA (0 - 10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={newSgpa}
                  onChange={(e) => setNewSgpa(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Semester Credits</label>
                <input
                  type="number"
                  min="10"
                  max="35"
                  value={newCredits}
                  onChange={(e) => setNewCredits(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition mt-2"
              >
                Record SGPA
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Semester Breakdown</h3>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span>Total Credits: <strong className="text-white">{totalCredits}</strong></span>
                <span>Cumulative CGPA: <strong className="text-emerald-400">{runningCgpa}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cgpaRecords.map((rec) => (
                <div key={rec.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative group">
                  <button
                    onClick={() => onDeleteCgpa(rec.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-[10px] font-mono font-bold text-indigo-400">SEMESTER {rec.semester}</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">{rec.sgpa}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{rec.credits} Credits</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
