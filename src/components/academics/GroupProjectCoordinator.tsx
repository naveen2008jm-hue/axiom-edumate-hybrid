import React, { useState } from 'react';
import {
  Users,
  FolderGit2,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { GroupProject, GroupProjectTask, TimetableEvent, Track } from '../../types';
import { useTrack } from '../../context/TrackContext';
import { INITIAL_GROUP_PROJECTS } from '../../data/groupProjectsData';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface GroupProjectCoordinatorProps {
  timetableEvents?: TimetableEvent[];
  onAwardXP?: (amount: number) => void;
}

export const GroupProjectCoordinator: React.FC<GroupProjectCoordinatorProps> = ({
  timetableEvents = [],
  onAwardXP,
}) => {
  const { track, trackMeta } = useTrack();
  const [projects, setProjects] = useState<GroupProject[]>(INITIAL_GROUP_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || 'grp-1');

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('m-1');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newTaskHours, setNewTaskHours] = useState(4);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeProject) return;

    // Check if the assigned member has a timetable lecture on the deadline day
    let clashAlert: string | undefined = undefined;
    if (newTaskDeadline) {
      const dayNum = new Date(newTaskDeadline).getDay() || 7;
      const memberEvents = timetableEvents.filter((ev) => ev.dayOfWeek === dayNum);
      if (memberEvents.length > 0) {
        clashAlert = `Member has ${memberEvents[0].title} (${memberEvents[0].startTime}) on this date`;
      }
    }

    const newTask: GroupProjectTask = {
      id: `gt-${Date.now()}`,
      title: newTaskTitle,
      stage: 'IN_PROGRESS',
      assignedMemberIds: [newTaskAssignee],
      deadlineDate: newTaskDeadline || '2026-09-30',
      priority: newTaskPriority,
      estimatedHours: newTaskHours,
      clashAlert,
    };

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id ? { ...proj, tasks: [...proj.tasks, newTask] } : proj
      )
    );

    setNewTaskTitle('');
    onAwardXP?.(15);
    soundFx.playSuccess();
    toast.success('Group Task Scheduled!', {
      description: clashAlert ? `Note: ${clashAlert}` : 'Assigned to team member with clear schedule.',
    });
  };

  const handleToggleTaskStage = (taskId: string) => {
    if (!activeProject) return;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        const updatedTasks = proj.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const nextStage: GroupProjectTask['stage'] =
            t.stage === 'BACKLOG'
              ? 'IN_PROGRESS'
              : t.stage === 'IN_PROGRESS'
              ? 'REVIEW'
              : t.stage === 'REVIEW'
              ? 'DONE'
              : 'BACKLOG';
          return { ...t, stage: nextStage };
        });
        return { ...proj, tasks: updatedTasks };
      })
    );
    soundFx.playClick();
  };

  const stages: Array<{ key: GroupProjectTask['stage']; label: string; badge: string }> = [
    { key: 'BACKLOG', label: 'Backlog & Ideation', badge: 'bg-slate-800 text-slate-400' },
    { key: 'IN_PROGRESS', label: 'In Progress Sprints', badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
    { key: 'REVIEW', label: 'Code / Case Review', badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
    { key: 'DONE', label: 'Completed & Shipped', badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow-badge">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>COLLABORATIVE SYNERGY</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
              {trackMeta.label}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-white font-display">
            Group Project Coordinator & Timetable Conflict Sync
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Manage multi-member academic projects, term papers, and hackathons with automated timetable conflict detection.
            Surfaces teammate lecture and lab schedules directly on task deadline assignments.
          </p>
        </div>
      </div>

      {activeProject && (
        <div className="space-y-6">
          {/* Project Details & Team Roster Bar */}
          <div className="bezel-shell">
            <div className="bezel-core p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase">
                    {activeProject.courseOrSubject}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5 font-display">{activeProject.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <span>Deadline: <strong className="text-white">{activeProject.deadlineDate}</strong></span>
                    {activeProject.repositoryUrl && (
                      <a href={activeProject.repositoryUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                        Repository / Workspace ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Team Members Roster */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Team Roster:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeProject.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-200"
                      >
                        <img src={member.avatarUrl} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-white">{member.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({member.role.split(' ')[0]})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Task Form */}
          <div className="bezel-shell">
            <div className="bezel-core p-5">
              <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">New Group Task Title</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Implement B+ Tree Serialization / Section 54 Draft"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">Assign Member</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {activeProject.members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role.slice(0, 15)})</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">Deadline Date</label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="btn-island w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition pressable"
                  >
                    Add Task (+15 XP)
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Kanban Board Sprints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stages.map((stage) => {
              const stageTasks = activeProject.tasks.filter((t) => t.stage === stage.key);
              return (
                <div key={stage.key} className="bezel-shell flex flex-col justify-between min-h-[360px]">
                  <div className="bezel-core p-4 space-y-3 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${stage.badge}`}>
                        {stage.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">{stageTasks.length}</span>
                    </div>

                    {/* Task cards list */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {stageTasks.map((task) => {
                        const assignedMember = activeProject.members.find((m) => task.assignedMemberIds.includes(m.id));
                        return (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTaskStage(task.id)}
                            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer pressable space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">
                                {task.priority}
                              </span>
                            </div>

                            {task.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
                            )}

                            {/* Timetable Clash Warning Badge if detected */}
                            {task.clashAlert && (
                              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono text-rose-300 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                                <span className="truncate">{task.clashAlert}</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
                              <div className="flex items-center gap-1.5">
                                {assignedMember && (
                                  <img src={assignedMember.avatarUrl} alt={assignedMember.name} className="w-4 h-4 rounded-full" />
                                )}
                                <span className="text-slate-300">{assignedMember?.name.split(' ')[0]}</span>
                              </div>
                              <span>{task.deadlineDate.slice(5)}</span>
                            </div>
                          </div>
                        );
                      })}

                      {stageTasks.length === 0 && (
                        <div className="p-6 text-center text-xs text-slate-600 font-mono">No tasks in this lane</div>
                      )}
                    </div>

                    <div className="pt-2 text-[10px] font-mono text-slate-500 text-center">
                      Click task card to advance stage →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
