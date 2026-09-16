import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  ArrowRight,
  Zap,
  Image as ImageIcon,
  Flame,
  Clock,
  Play,
  Share2,
  Trash2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { OmniCourse, OmniDayPlan } from '../../types';
import { getPollinationsImageUrl } from '../../lib/imageGen';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';
import { architectOmniCourse } from '../../services/aiService';

interface OmniSkillArchitectProps {
  courses: OmniCourse[];
  onAddCourse: (course: Omit<OmniCourse, 'id' | 'createdAt'>) => void;
  onSetActiveCourse: (id: string) => void;
  onToggleTask: (courseId: string, dayNumber: number, taskIndex: number) => void;
  onDeleteCourse: (id: string) => void;
}

const SAMPLE_PROMPTS = [
  'Swimming Butterfly Stroke',
  'Distributed Systems Consensus (Raft)',
  'Gymnastic Handstand & Shoulder Prep',
  'Redis Architecture & LRU Cache Engine',
  'Quantum Computing Qubits & Teleportation',
  'Guitar Fingerstyle Acoustic Technique',
];

export const OmniSkillArchitect: React.FC<OmniSkillArchitectProps> = ({
  courses,
  onAddCourse,
  onSetActiveCourse,
  onToggleTask,
  onDeleteCourse,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const activeCourse = courses.find((c) => c.isActive) || courses[0];

  const handleGenerate = async (topicToGen?: string) => {
    const topic = topicToGen || topicInput;
    if (!topic.trim()) return;

    soundFx.playClick();
    setLoading(true);
    setError(null);

    const generatePromise = async () => {
      const data = await architectOmniCourse(topic);
      onAddCourse({
        topicName: topic,
        category: data.category || 'Conceptual',
        title: data.title || `Mastering ${topic}`,
        summary: data.summary,
        days: data.days || [],
        isActive: true,
      });

      setTopicInput('');
      setActiveDayIndex(0);
      soundFx.playLevelUp();
      return data;
    };

    try {
      await toast.promise(generatePromise(), {
        loading: `Synthesizing ${topic} curriculum via Google Gemini...`,
        success: (data) => `Curriculum ready: ${data.title || topic}!`,
        error: (err) => err?.message || 'Error generating curriculum.',
      });
    } catch (err: any) {
      console.error('Curriculum generation failed:', err);
      setError(err.message || 'Error generating course plan.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseProgress = (course?: OmniCourse) => {
    if (!course || !course.days.length) return 0;
    let totalTasks = 0;
    let completedTasks = 0;

    course.days.forEach((day) => {
      totalTasks += day.tasks.length;
      const done = day.completedTasks ? day.completedTasks.filter(Boolean).length : 0;
      completedTasks += done;
    });

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const handleTaskToggle = (courseId: string, dayNumber: number, taskIndex: number, currentDone: boolean) => {
    soundFx.playSuccess();
    onToggleTask(courseId, dayNumber, taskIndex);
    if (!currentDone) {
      toast.success('+10 XP Drill Completed', { description: 'Progress saved to your curriculum track.' });
    }
  };

  const handleSelectCourse = (course: OmniCourse) => {
    soundFx.playClick();
    onSetActiveCourse(course.id);
    toast.info('Active Track Switched', { description: course.title });
  };

  const handleDelete = (course: OmniCourse) => {
    soundFx.playClick();
    onDeleteCourse(course.id);
    toast('Curriculum Removed', { description: course.title });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header / Hero Section with Double-Bezel Shell */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-indigo-950/50 via-slate-950 to-purple-950/40">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="eyebrow-badge">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>UNIVERSAL OMNI-SKILL ARCHITECT</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
              What do you want to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                master today?
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Deconstruct any human endeavor — from physical athletic motions (Butterfly Stroke, Muscle-up) to abstract distributed systems (Raft, Paxos, Redis Engine) — into structured step-by-step schematics with AI synthesis.
            </p>

            {/* Omni Search Input with Button-in-Button */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter any skill or concept (e.g., Butterfly Stroke, Raft Consensus, Redis Internals)..."
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-colors shadow-inner"
                />
              </div>

              <button
                onClick={() => handleGenerate()}
                disabled={loading || !topicInput.trim()}
                className="btn-island group flex items-center justify-between pl-5 pr-2 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-white/10 disabled:opacity-50 flex-shrink-0 pressable"
              >
                <span className="mr-3 tracking-wide">{loading ? 'Synthesizing...' : 'Architect Curriculum'}</span>
                <div className="btn-icon-wrapper w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </div>
              </button>
            </div>

            {/* Fast Prompt Chips */}
            <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider mr-1">
                Quick Prompts:
              </span>
              {SAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleGenerate(prompt)}
                  disabled={loading}
                  className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/40 text-slate-300 hover:text-white text-[11px] font-medium transition-colors pressable"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main Course Area */}
      {activeCourse ? (
        <div className="space-y-6">
          {/* Active Course Banner with Double-Bezel */}
          <div className="bezel-shell">
            <div className="bezel-core p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      activeCourse.category === 'Physical'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {activeCourse.category} Mastery
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {activeCourse.days.length} Day Schedule
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">{activeCourse.title}</h3>
                {activeCourse.summary && <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{activeCourse.summary}</p>}
              </div>

              {/* Overall Progress Gauge */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-indigo-400">
                    {calculateCourseProgress(activeCourse)}%
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Curriculum Progress</div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center p-2 shadow-inner">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateCourseProgress(activeCourse)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {activeCourse.days.map((day, idx) => {
              const completedTasksCount = day.completedTasks ? day.completedTasks.filter(Boolean).length : 0;
              const isDayDone = day.tasks.length > 0 && completedTasksCount === day.tasks.length;
              const isSelected = activeDayIndex === idx;

              return (
                <button
                  key={day.day}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveDayIndex(idx);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left pressable min-w-[160px] ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900/80 border-white/5 text-slate-300 hover:bg-slate-800/80 hover:border-white/10'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isDayDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    D{day.day}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate font-display">Day {day.day}</div>
                    <div className={`text-[10px] font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {completedTasksCount}/{day.tasks.length} tasks
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Day Detail Card */}
          {activeCourse.days[activeDayIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Tasks & Summary */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bezel-shell">
                  <div className="bezel-core p-6 space-y-6">
                    <div>
                      <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        Day {activeCourse.days[activeDayIndex].day} Objective
                      </div>
                      <h4 className="text-xl font-bold text-white mt-1 font-display">
                        {activeCourse.days[activeDayIndex].title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {activeCourse.days[activeDayIndex].summary}
                      </p>
                    </div>

                    {/* Daily Tasks Checkbox List */}
                    <div className="space-y-3">
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Actionable Practice Drills (+10 XP)
                      </div>
                      <div className="space-y-2.5">
                        {activeCourse.days[activeDayIndex].tasks.map((taskText, tIdx) => {
                          const isDone =
                            activeCourse.days[activeDayIndex].completedTasks?.[tIdx] || false;

                          return (
                            <div
                              key={tIdx}
                              onClick={() =>
                                handleTaskToggle(
                                  activeCourse.id,
                                  activeCourse.days[activeDayIndex].day,
                                  tIdx,
                                  isDone
                                )
                              }
                              className={`flex items-start gap-3.5 p-3.5 rounded-2xl border cursor-pointer pressable text-xs sm:text-sm ${
                                isDone
                                  ? 'bg-emerald-500/10 border-emerald-500/25 text-slate-400'
                                  : 'bg-slate-900/70 border-white/5 hover:border-indigo-500/30 text-slate-200'
                              }`}
                            >
                              <button className="mt-0.5 flex-shrink-0 text-emerald-400">
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-600" />
                                )}
                              </button>
                              <div className="flex-1 leading-relaxed font-medium">
                                <span className={isDone ? 'line-through text-slate-500' : ''}>
                                  {taskText}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded-full">
                                +10 XP
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Generative Visual Diagram & Video Prompt */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bezel-shell">
                  <div className="bezel-core p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                        <ImageIcon className="w-4 h-4 text-purple-400" />
                        <span>Instructional Schematic</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
                        AI Visual Model
                      </span>
                    </div>

                    {/* Image Display */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-white/10 aspect-video group shadow-inner">
                      <img
                        src={getPollinationsImageUrl(
                          activeCourse.days[activeDayIndex].videoPrompt,
                          activeCourse.category,
                          activeCourse.days[activeDayIndex].day * 73
                        )}
                        alt={activeCourse.days[activeDayIndex].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70 pointer-events-none" />
                      <div className="absolute bottom-2.5 left-3 right-3 text-[10px] text-slate-300 line-clamp-1 font-mono">
                        {activeCourse.days[activeDayIndex].videoPrompt}
                      </div>
                    </div>

                    {/* Video Prompt Specification */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-xs space-y-1.5">
                      <div className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Play className="w-3 h-3 text-indigo-400" />
                        <span>Scene Generative Specification:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                        {activeCourse.days[activeDayIndex].videoPrompt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saved Courses Gallery */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Saved Omni-Curriculums</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">{courses.length} courses</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => {
                const progress = calculateCourseProgress(course);
                const isSelected = course.id === activeCourse.id;

                return (
                  <div
                    key={course.id}
                    className={`bezel-shell ${isSelected ? 'ring-2 ring-indigo-500/50' : ''}`}
                  >
                    <div className="bezel-core p-5 flex flex-col justify-between gap-4 h-full">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              course.category === 'Physical'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            }`}
                          >
                            {course.category}
                          </span>
                          <button
                            onClick={() => handleDelete(course)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition pressable"
                            title="Delete Curriculum"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h5 className="font-bold text-sm text-white line-clamp-1 font-display">{course.title}</h5>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.summary || course.topicName}</p>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">{course.days.length} Days</span>
                          <span className="text-indigo-400 font-bold">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                        </div>

                        <button
                          onClick={() => handleSelectCourse(course)}
                          className={`w-full py-2.5 rounded-xl text-xs font-semibold pressable ${
                            isSelected
                              ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/40'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5'
                          }`}
                        >
                          {isSelected ? 'Currently Selected' : 'View Curriculum'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bezel-shell">
          <div className="bezel-core p-12 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white font-display">No courses generated yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Type any skill or concept into the Omni-Search bar above to architect your custom AI curriculum!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
