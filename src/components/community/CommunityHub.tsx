import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  FileText,
  Radio,
  Sparkles,
  Share2,
} from 'lucide-react';
import { DiscussionForums } from './DiscussionForums';
import { ResourceSharingHub } from './ResourceSharingHub';
import { LiveStudyRooms } from './LiveStudyRooms';
import { useTrack } from '../../context/TrackContext';

interface CommunityHubProps {
  onAwardXP?: (amount: number) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ onAwardXP }) => {
  const { config } = useTrack();
  const [activeSubTab, setActiveSubTab] = useState<'discussions' | 'resources' | 'rooms'>('discussions');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="eyebrow-badge">
                <Users className="w-3 h-3 text-indigo-400" />
                <span>PEER NETWORK & COLLABORATIVE COMMONS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {config.name} Peer Community & Social Hub
              </h2>
              <p className="text-xs text-slate-400">
                Connect with fellow {config.name} aspirants, share verified revision notes, and join synchronized study rooms.
              </p>
            </div>

            {/* Sub-tab Switcher */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
              <button
                onClick={() => setActiveSubTab('discussions')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeSubTab === 'discussions'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discussions</span>
              </button>

              <button
                onClick={() => setActiveSubTab('resources')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeSubTab === 'resources'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resource Library</span>
              </button>

              <button
                onClick={() => setActiveSubTab('rooms')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeSubTab === 'rooms'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Live Rooms</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Sub-View */}
      {activeSubTab === 'discussions' && <DiscussionForums onAwardXP={onAwardXP} />}
      {activeSubTab === 'resources' && <ResourceSharingHub onAwardXP={onAwardXP} />}
      {activeSubTab === 'rooms' && <LiveStudyRooms onAwardXP={onAwardXP} />}
    </div>
  );
};
