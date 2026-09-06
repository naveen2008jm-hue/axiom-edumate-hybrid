import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Copy,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  User,
  Zap,
} from 'lucide-react';
import { TimetableEvent } from '../../types';
import { detectTimetableConflicts } from '../../lib/conflictDetector';

interface TimetableTrackerProps {
  events: TimetableEvent[];
  onAddEvent: (event: Omit<TimetableEvent, 'id'>) => void;
  onUpdateEvent: (id: string, updates: Partial<TimetableEvent>) => void;
  onDeleteEvent: (id: string) => void;
  onDuplicateDay: (fromDay: number, toDay: number) => void;
}

const DAYS = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat' },
  { id: 7, name: 'Sunday', short: 'Sun' },
];

export const TimetableTracker: React.FC<TimetableTrackerProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onDuplicateDay,
}) => {
  const [activeDay, setActiveDay] = useState<number>(() => {
    const current = new Date().getDay();
    return current === 0 ? 7 : current;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [room, setRoom] = useState('Hall 302');
  const [teacher, setTeacher] = useState('');
  const [eventType, setEventType] = useState<TimetableEvent['eventType']>('LECTURE');
  const [color, setColor] = useState('#6366f1');
  const [isLocked, setIsLocked] = useState(false);

  // Duplicate states
  const [fromDay, setFromDay] = useState(1);
  const [toDay, setToDay] = useState(2);

  // Conflicts calculation
  const conflicts = detectTimetableConflicts(events);
  const dayConflicts = conflicts.filter((c) => c.eventA.dayOfWeek === activeDay);

  const dayEvents = events
    .filter((e) => e.dayOfWeek === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setSubjectCode('');
    setStartTime('09:00');
    setEndTime('10:30');
    setRoom('Hall 302');
    setTeacher('');
    setEventType('LECTURE');
    setColor('#6366f1');
    setIsLocked(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (event: TimetableEvent) => {
    setEditingId(event.id);
    setTitle(event.title);
    setSubjectCode(event.subjectCode || '');
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setRoom(event.room);
    setTeacher(event.teacher || '');
    setEventType(event.eventType);
    setColor(event.color || '#6366f1');
    setIsLocked(!!event.isLocked);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      onUpdateEvent(editingId, {
        title,
        subjectCode,
        startTime,
        endTime,
        room,
        teacher,
        eventType,
        color,
        isLocked,
      });
    } else {
      onAddEvent({
        title,
        subjectCode,
        dayOfWeek: activeDay,
        startTime,
        endTime,
        room,
        teacher,
        eventType,
        color,
        isLocked,
      });
    }
    setModalOpen(false);
  };

  const handleDuplicate = (e: React.FormEvent) => {
    e.preventDefault();
    onDuplicateDay(fromDay, toDay);
    setDuplicateModalOpen(false);
    setActiveDay(toDay);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="eyebrow-badge">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>COLLEGE SCHEDULE MATRIX</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Academic Timetable & Clash Detector
              </h2>
              <p className="text-xs text-slate-400">
                Automated conflict detection, room routing, and protected schedule slots.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setFromDay(activeDay);
                  setToDay(activeDay === 5 ? 1 : activeDay + 1);
                  setDuplicateModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-white/5 transition-all"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>Duplicate Day</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class Slot</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Conflict Warning Banner */}
      {dayConflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{dayConflicts.length} Schedule Conflict Detected on this Day!</span>
          </div>
          {dayConflicts.map((c) => (
            <div key={c.id} className="pl-6 text-[11px] text-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>• {c.reason}</span>
              {c.suggestedSlot && (
                <span className="font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                  Suggested free window: {c.suggestedSlot.startTime} - {c.suggestedSlot.endTime}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DAYS.map((day) => {
          const count = events.filter((e) => e.dayOfWeek === day.id).length;
          const isActive = activeDay === day.id;
          const hasDayConflict = conflicts.some((c) => c.eventA.dayOfWeek === day.id);

          return (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <span>{day.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
              {hasDayConflict && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
            </button>
          );
        })}
      </div>

      {/* Day Schedule Timeline */}
      <div className="space-y-3">
        {dayEvents.length === 0 ? (
          <div className="bezel-shell p-12 text-center space-y-3 bg-slate-900/40">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No classes scheduled for {DAYS.find((d) => d.id === activeDay)?.name}</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Enjoy your study break or add lectures, labs, and tutorials to keep your daily planner in sync.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-slate-800 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30"
            >
              Add First Class
            </button>
          </div>
        ) : (
          dayEvents.map((item) => {
            const hasConflict = dayConflicts.some(
              (c) => c.eventA.id === item.id || c.eventB.id === item.id
            );

            return (
              <div
                key={item.id}
                className={`bezel-shell group transition-all duration-200 ${
                  hasConflict ? 'border-amber-500/50 bg-amber-950/10' : ''
                }`}
              >
                <div className="bezel-core p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Column: Time & Color Indicator */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className="w-2.5 self-stretch sm:self-auto sm:h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color || '#6366f1' }}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-300">
                          {item.startTime} – {item.endTime}
                        </span>
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {item.eventType}
                        </span>
                        {item.subjectCode && (
                          <span className="text-[10px] font-mono font-semibold text-slate-400">
                            [{item.subjectCode}]
                          </span>
                        )}
                        {item.isLocked && (
                          <span title="Locked Slot — AI won't reschedule">
                            <Lock className="w-3 h-3 text-emerald-400" />
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {item.room}
                        </span>
                        {item.teacher && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-500" />
                            {item.teacher}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onUpdateEvent(item.id, { isLocked: !item.isLocked })}
                      title={item.isLocked ? 'Unlock Slot' : 'Lock Slot against auto-moves'}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {item.isLocked ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-500" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteEvent(item.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Timetable Slot' : `Add Class for ${DAYS.find((d) => d.id === activeDay)?.name}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Subject / Course Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design & Analysis of Algorithms"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="e.g. CS501"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LECTURE">Lecture</option>
                    <option value="LAB">Laboratory</option>
                    <option value="TUTORIAL">Tutorial</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="EXAM">Exam / Quiz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Hall 302"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Teacher / Instructor</label>
                  <input
                    type="text"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    placeholder="e.g. Dr. Raman"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLocked}
                    onChange={(e) => setIsLocked(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <span>Lock slot (Strictly protect against auto-reschedule)</span>
                </label>
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
                  {editingId ? 'Update Slot' : 'Add Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duplicate Day Modal */}
      {duplicateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Duplicate Schedule</h3>
            <p className="text-xs text-slate-400">
              Copy all scheduled periods from one day to another to quickly mirror schedules.
            </p>

            <form onSubmit={handleDuplicate} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Source Day</label>
                <select
                  value={fromDay}
                  onChange={(e) => setFromDay(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  {DAYS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({events.filter((e) => e.dayOfWeek === d.id).length} classes)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Target Day</label>
                <select
                  value={toDay}
                  onChange={(e) => setToDay(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  {DAYS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDuplicateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Copy Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
