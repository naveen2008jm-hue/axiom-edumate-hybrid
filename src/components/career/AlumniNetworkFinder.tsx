import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Building,
  GraduationCap,
  Mail,
  CheckCircle2,
  ExternalLink,
  Filter,
  Sparkles,
  MapPin,
  MessageSquare,
  Award,
} from 'lucide-react';
import { AlumnusProfile, Track } from '../../types';
import { useTrack, TRACK_DEFINITIONS } from '../../context/TrackContext';
import { INITIAL_ALUMNI_PROFILES } from '../../data/alumniData';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface AlumniNetworkFinderProps {
  onAwardXP?: (amount: number) => void;
}

export const AlumniNetworkFinder: React.FC<AlumniNetworkFinderProps> = ({ onAwardXP }) => {
  const { track, trackMeta } = useTrack();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<Track | 'ALL'>('ALL');
  const [alumniList] = useState<AlumnusProfile[]>(INITIAL_ALUMNI_PROFILES);

  const filteredAlumni = useMemo(() => {
    return alumniList.filter((a) => {
      const matchesTrack = selectedTrackFilter === 'ALL' || a.track === selectedTrackFilter;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.currentOrganization.toLowerCase().includes(q) ||
        a.currentRole.toLowerCase().includes(q) ||
        a.college.toLowerCase().includes(q) ||
        a.targetExamOrDomain.toLowerCase().includes(q);

      return matchesTrack && matchesQuery;
    });
  }, [alumniList, selectedTrackFilter, searchQuery]);

  const handleContactAlumnus = (alumnus: AlumnusProfile) => {
    soundFx.playClick();
    const subject = encodeURIComponent(`Mentorship & Coffee Chat Request — ${trackMeta.label} Student (Axiom)`);
    const body = encodeURIComponent(
      `Hi ${alumnus.name},\n\nI came across your profile on the Axiom Alumni Network. I am a student preparing in the ${trackMeta.label} discipline targeting ${alumnus.targetExamOrDomain}.\n\nWould you be open to a 15-minute virtual coffee chat for guidance on interview prep and career milestones?\n\nBest regards,\nStudent`
    );
    window.open(`mailto:${alumnus.email}?subject=${subject}&body=${body}`, '_blank');
    onAwardXP?.(10);
    toast.success('Mentorship Outreach Drafted!', {
      description: `Opening email draft to ${alumnus.name}. +10 XP gained for career networking.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 space-y-4">
          <div className="flex items-center gap-2">
            <span className="eyebrow-badge">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>VERIFIED ALUMNI DIRECTORY</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
              {filteredAlumni.length} Seniors Online
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-white font-display">
            Multi-Discipline Alumni & Senior Mentor Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Connect with verified alumni across Google, Microsoft, PwC, AIIMS, the Supreme Court, and IAS cadres.
            Filter by target company, examination board, or discipline vertical to request 1:1 mentorship.
          </p>

          {/* Search & Track Filter Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alumni by name, company (Google, PwC, AIIMS, Supreme Court), college, or role..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Track Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={selectedTrackFilter}
                onChange={(e) => {
                  setSelectedTrackFilter(e.target.value as any);
                  soundFx.playClick();
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Disciplines (7 Tracks)</option>
                {Object.entries(TRACK_DEFINITIONS).map(([key, def]) => (
                  <option key={key} value={key}>{def.shortLabel}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alumni Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alumnus) => {
          const alumnusTrackMeta = TRACK_DEFINITIONS[alumnus.track] || TRACK_DEFINITIONS.engineering;
          const TrackIcon = alumnusTrackMeta.icon;

          return (
            <div
              key={alumnus.id}
              className="bezel-shell group hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div className="bezel-core p-6 space-y-4 h-full flex flex-col justify-between">
                {/* Top Profile Strip */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={alumnus.avatarUrl}
                        alt={alumnus.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/30 shadow-md"
                      />
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white font-display leading-tight">{alumnus.name}</h4>
                        <span className="text-xs text-indigo-400 font-semibold">{alumnus.currentRole}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${alumnusTrackMeta.bgSubtle} ${alumnusTrackMeta.color} border ${alumnusTrackMeta.borderAccent} flex-shrink-0`}>
                      {alumnusTrackMeta.shortLabel}
                    </span>
                  </div>

                  {/* Organization & College Details */}
                  <div className="space-y-1 text-xs text-slate-300 font-mono">
                    <div className="flex items-center gap-1.5 text-white font-semibold">
                      <Building className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{alumnus.currentOrganization}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{alumnus.college} (Class of {alumnus.graduationYear})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{alumnus.location}</span>
                    </div>
                  </div>

                  {/* Advice Quote Box */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Senior Advice:</span>
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{alumnus.adviceHeadline}"</p>
                  </div>

                  {/* Topics Willing to Help */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Open to Mentor on:</span>
                    <div className="flex flex-wrap gap-1">
                      {alumnus.topicsWillingToHelp.map((topic, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => handleContactAlumnus(alumnus)}
                    className="btn-island w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition pressable"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Request 1:1 Coffee Chat</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
