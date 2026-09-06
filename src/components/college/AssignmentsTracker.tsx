import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Edit2,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Assignment } from '../../types';

interface AssignmentsTrackerProps {
  assignments: Assignment[];
  onAddAssignment: (asg: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (id: string, updates: Partial<Assignment>) => void;
  onDeleteAssignment: (id: string) => void;
  onToggleStatus: (id: string, status: Assignment['status']) => void;
}

export const AssignmentsTracker: React.FC<AssignmentsTrackerProps> = ({
  assignments,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onToggleStatus,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Assignment['priority']>('MEDIUM');
  const [estimatedMinutes, setEstimatedMinutes] = useState(90);

  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const filteredAssignments = assignments.filter((a) => {
    if (filterPriority === 'ALL') return true;
    return a.priority === filterPriority;
  });

  const todoList = filteredAssignments.filter((a) => a.status === 'TODO');
  const inProgressList = filteredAssignments.filter((a) => a.status === 'IN_PROGRESS');
  const completedList = filteredAssignments.filter((a) => a.status === 'COMPLETED');

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setSubjectName('');
    setDescription('');
    // Default deadline in 4 days
    const d = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    setDeadline(d.toISOString().slice(0, 16));
    setPriority('MEDIUM');
    setEstimatedMinutes(90);
    setModalOpen(true);
  };

  const handleOpenEdit = (a: Assignment) => {
    setEditingId(a.id);
    setTitle(a.title);
    setSubjectName(a.subjectName);
    setDescription(a.description || '');
    setDeadline(a.deadline ? a.deadline.slice(0, 16) : '');
    setPriority(a.priority);
    setEstimatedMinutes(a.estimatedMinutes || 90);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      onUpdateAssignment(editingId, {
        title,
        subjectName,
        description,
        deadline,
        priority,
        estimatedMinutes: Number(estimatedMinutes),
      });
    } else {
      onAddAssignment({
        title,
        subjectName,
        description,
        deadline,
        priority,
        estimatedMinutes: Number(estimatedMinutes),
        status: 'TODO',
      });
    }
    setModalOpen(false);
  };

  const formatDeadlineCountdown = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: 'Overdue', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    if (days === 0) return { label: 'Due Today', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    if (days === 1) return { label: 'Due Tomorrow', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: `Due in ${days}d`, color: 'text-slate-300 bg-slate-800 border-slate-700' };
  };

  const getPriorityBadge = (p: Assignment['priority']) => {
    switch (p) {
      case 'URGENT':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'HIGH':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'MEDIUM':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'LOW':
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="eyebrow-badge">
                <FileCheck className="w-3 h-3 text-indigo-400" />
                <span>ASSIGNMENTS PIPELINE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Coursework & Submission Kanban
              </h2>
              <p className="text-xs text-slate-400">
                Track academic lab reports, project milestones, deadlines, and earn +40 XP upon completion.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View Toggle */}
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Assignment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Priority Filter:</span>
          {['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all ${
                filterPriority === p
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Pending: <strong className="text-amber-400">{todoList.length + inProgressList.length}</strong> | Completed:{' '}
          <strong className="text-emerald-400">{completedList.length}</strong>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Todo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400 uppercase font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>To Do</span>
              </div>
              <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">{todoList.length}</span>
            </div>

            <div className="space-y-3">
              {todoList.map((item) => renderCard(item))}
              {todoList.length === 0 && (
                <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No pending assignments
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-bold text-indigo-400 uppercase font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>In Progress</span>
              </div>
              <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-[10px]">
                {inProgressList.length}
              </span>
            </div>

            <div className="space-y-3">
              {inProgressList.map((item) => renderCard(item))}
              {inProgressList.length === 0 && (
                <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  Drag or move tasks here to start focus
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-bold text-emerald-400 uppercase font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Completed</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
                {completedList.length}
              </span>
            </div>

            <div className="space-y-3">
              {completedList.map((item) => renderCard(item))}
              {completedList.length === 0 && (
                <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  Completed submissions appear here
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredAssignments.map((item) => renderListItem(item))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Assignment' : 'Add New Assignment'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement Producer-Consumer in C++"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Subject / Course *</label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="URGENT">Urgent (Immediate)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Deadline Date & Time</label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Est. Effort (Minutes)</label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    min={15}
                    step={15}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Description / Instructions</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Key rubric requirements, report format, test cases..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  {editingId ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function renderCard(item: Assignment) {
    const cd = item.deadline ? formatDeadlineCountdown(item.deadline) : null;
    const isDone = item.status === 'COMPLETED';

    return (
      <div
        key={item.id}
        className={`bezel-shell p-4 space-y-3 group transition-all duration-200 ${
          isDone ? 'opacity-80' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {item.subjectName}
          </span>
          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getPriorityBadge(item.priority)}`}>
            {item.priority}
          </span>
        </div>

        <div>
          <h4 className={`text-sm font-bold text-white tracking-tight ${isDone ? 'line-through text-slate-400' : ''}`}>
            {item.title}
          </h4>
          {item.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{item.estimatedMinutes}m</span>
            {cd && !isDone && (
              <span className={`px-1.5 py-0.2 rounded border text-[10px] ${cd.color}`}>
                {cd.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {item.status !== 'COMPLETED' && (
              <button
                onClick={() => onToggleStatus(item.id, item.status === 'TODO' ? 'IN_PROGRESS' : 'COMPLETED')}
                className="px-2 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-bold transition-all"
              >
                {item.status === 'TODO' ? 'Start' : 'Finish (+40 XP)'}
              </button>
            )}
            {item.status === 'COMPLETED' && (
              <button
                onClick={() => onToggleStatus(item.id, 'IN_PROGRESS')}
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px] font-bold"
              >
                Reopen
              </button>
            )}
            <button
              onClick={() => handleOpenEdit(item)}
              className="p-1 text-slate-500 hover:text-slate-300"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteAssignment(item.id)}
              className="p-1 text-slate-500 hover:text-rose-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderListItem(item: Assignment) {
    const cd = item.deadline ? formatDeadlineCountdown(item.deadline) : null;
    const isDone = item.status === 'COMPLETED';

    return (
      <div
        key={item.id}
        className="bezel-shell p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleStatus(item.id, isDone ? 'IN_PROGRESS' : 'COMPLETED')}
            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
              isDone ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 hover:border-indigo-500 text-transparent'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">{item.subjectName}</span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${getPriorityBadge(item.priority)}`}>
                {item.priority}
              </span>
            </div>
            <h4 className={`text-xs sm:text-sm font-bold text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
              {item.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {cd && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${cd.color}`}>
              {cd.label}
            </span>
          )}
          <span className="text-xs text-slate-400 font-mono">{item.estimatedMinutes}m</span>
          <button onClick={() => handleOpenEdit(item)} className="p-1 text-slate-400 hover:text-white">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDeleteAssignment(item.id)} className="p-1 text-slate-400 hover:text-rose-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }
};
