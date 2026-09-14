import React, { useState } from 'react';
import {
  Users,
  Plus,
  Play,
  Clock,
  Sparkles,
  Shield,
  Radio,
  ArrowRight,
  LogOut,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { StudyRoom } from '../../types';
import { INITIAL_STUDY_ROOMS } from '../../data/communityData';
import { useTrack } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface LiveStudyRoomsProps {
  onAwardXP?: (amount: number) => void;
}

export const LiveStudyRooms: React.FC<LiveStudyRoomsProps> = ({ onAwardXP }) => {
  const { track, config } = useTrack();
  const [rooms, setRooms] = useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // New room form state
  const [roomName, setRoomName] = useState('');
  const [roomTopic, setRoomTopic] = useState('');
  const [roomDuration, setRoomDuration] = useState('25');

  const visibleRooms = rooms.filter(
    (r) => r.track === track || r.track === 'engineering' || r.track === 'other'
  );

  const handleJoinRoom = (room: StudyRoom) => {
    setActiveRoom(room);
    onAwardXP?.(10);
    soundFx.playSuccess();
    toast.success(`Joined Room: ${room.name}`, {
      description: `Synchronized to live Pomodoro focus sprint with ${room.participantsCount} peers. +10 XP awarded.`,
    });
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    toast.info('Exited Study Room');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !roomTopic.trim()) return;

    const newRoom: StudyRoom = {
      id: `room-${Date.now()}`,
      track,
      name: roomName,
      topic: roomTopic,
      hostName: 'You (Active Host)',
      participantsCount: 1,
      maxParticipants: 12,
      pomodoroMinutes: parseInt(roomDuration) || 25,
      timerRemainingMinutes: parseInt(roomDuration) || 25,
      avatars: ['👑', '⚡'],
      isLive: true,
    };

    setRooms([newRoom, ...rooms]);
    setIsCreating(false);
    setActiveRoom(newRoom);
    setRoomName('');
    setRoomTopic('');

    onAwardXP?.(20);
    soundFx.playLevelUp();
    toast.success('Live Virtual Study Room Launched! (+20 XP)', {
      description: 'Peers can now join your synchronized focus room.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bezel-shell p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="eyebrow-badge">
            <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>SYNCHRONIZED PEER FOCUS ROOMS</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Live Virtual Study Rooms ({config.name})
          </h3>
          <p className="text-xs text-slate-400">
            Co-work in quiet sprints with peers across the country. Sync Pomodoro timers and stay accountable.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Host New Study Room (+20 XP)</span>
        </button>
      </div>

      {/* Create Room Modal */}
      {isCreating && (
        <div className="bezel-shell p-6 bg-slate-900 border border-pink-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Launch Virtual Study Room</span>
            </h3>
            <button onClick={() => setIsCreating(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. UPSC Prelims Deep Focus"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Focus Topic / Subject</label>
                <input
                  type="text"
                  value={roomTopic}
                  onChange={(e) => setRoomTopic(e.target.value)}
                  placeholder="e.g. Modern Indian History & Polity"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Pomodoro Interval</label>
              <select
                value={roomDuration}
                onChange={(e) => setRoomDuration(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="25">25 Minutes (Standard Pomodoro)</option>
                <option value="50">50 Minutes (Deep Work Sprint)</option>
                <option value="90">90 Minutes (Ultradian Cycle)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-pink-600/30 transition-all"
            >
              Open Room Lobby (+20 XP)
            </button>
          </form>
        </div>
      )}

      {/* Active Room In-Session View */}
      {activeRoom && (
        <div className="bezel-shell p-6 bg-gradient-to-b from-indigo-950/60 via-slate-950 to-slate-900 border-2 border-indigo-500/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{activeRoom.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    LIVE SESSION
                  </span>
                </div>
                <p className="text-xs text-slate-300">Topic: {activeRoom.topic}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundMuted(!soundMuted)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave Room</span>
              </button>
            </div>
          </div>

          {/* Room Live Timer & Avatars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Sync Timer HUD */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                Synchronized Sprint Timer
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight">
                {activeRoom.timerRemainingMinutes}:42
              </div>
              <div className="text-xs font-mono text-indigo-300">
                Quiet Focus in progress • Distractions muted
              </div>
            </div>

            {/* Peer Avatars in Room */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  Active Peers in Room ({activeRoom.participantsCount} / {activeRoom.maxParticipants})
                </span>
                <span className="font-mono text-emerald-400">● All muted</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {activeRoom.avatars.map((av, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-1"
                  >
                    <div className="text-2xl">{av}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-full">
                      {idx === 0 ? activeRoom.hostName : `Peer #${idx + 1}`}
                    </div>
                  </div>
                ))}
                {/* Empty seat */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 flex flex-col items-center justify-center space-y-1 text-slate-600">
                  <Users className="w-5 h-5" />
                  <span className="text-[10px] font-mono">Open Seat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Study Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleRooms.map((room) => (
          <div
            key={room.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
                    Live Sprint
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {room.pomodoroMinutes}m Focus
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white tracking-tight leading-snug">{room.name}</h4>
                <p className="text-xs text-indigo-300 font-mono mt-1">{room.topic}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center -space-x-1.5 overflow-hidden">
                  {room.avatars.map((av, idx) => (
                    <div
                      key={idx}
                      className="inline-block h-6 w-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs"
                    >
                      {av}
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {room.participantsCount}/{room.maxParticipants} peers
                </span>
              </div>
            </div>

            <button
              onClick={() => handleJoinRoom(room)}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-transparent text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <span>Join Study Room (+10 XP)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
