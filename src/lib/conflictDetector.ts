// Timetable Conflict Detection and Smart Auto-Rescheduling Engine
// Ported & enhanced from EduMate for Axiom Career Hybrid

import { TimetableEvent, TimetableConflict } from '../types';

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(1439, minutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function calculateTimeOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

/**
 * Detects overlapping classes on the same day in the timetable.
 */
export function detectTimetableConflicts(events: TimetableEvent[]): TimetableConflict[] {
  const conflicts: TimetableConflict[] = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];

      if (a.dayOfWeek === b.dayOfWeek) {
        if (calculateTimeOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
          // Suggest alternative slot after class or in free window
          const bEndMins = timeToMinutes(b.endTime);
          const dur = timeToMinutes(a.endTime) - timeToMinutes(a.startTime) || 60;
          const suggestedStart = minutesToTime(bEndMins + 15);
          const suggestedEnd = minutesToTime(bEndMins + 15 + dur);

          conflicts.push({
            id: `conflict-${a.id}-${b.id}`,
            eventA: a,
            eventB: b,
            suggestedSlot: { startTime: suggestedStart, endTime: suggestedEnd },
            reason: `"${a.title}" (${a.startTime}-${a.endTime}) overlaps with "${b.title}" (${b.startTime}-${b.endTime}) in ${a.room || b.room}`,
          });
        }
      }
    }
  }

  return conflicts;
}

/**
 * Finds next available free slot within daily study window.
 */
export function findNextAvailableSlot(
  occupiedSlots: Array<{ startTime: string; endTime: string }>,
  durationMinutes: number,
  searchStartHour = 9,
  searchEndHour = 18
): { startTime: string; endTime: string } | null {
  const startLimit = searchStartHour * 60;
  const endLimit = searchEndHour * 60;

  const sorted = [...occupiedSlots]
    .map((s) => ({ start: timeToMinutes(s.startTime), end: timeToMinutes(s.endTime) }))
    .sort((a, b) => a.start - b.start);

  let currentCursor = startLimit;

  for (const slot of sorted) {
    if (slot.end <= currentCursor) continue;

    if (slot.start - currentCursor >= durationMinutes) {
      return {
        startTime: minutesToTime(currentCursor),
        endTime: minutesToTime(currentCursor + durationMinutes),
      };
    }

    currentCursor = Math.max(currentCursor, slot.end + 10);
  }

  if (endLimit - currentCursor >= durationMinutes) {
    return {
      startTime: minutesToTime(currentCursor),
      endTime: minutesToTime(currentCursor + durationMinutes),
    };
  }

  return null;
}
