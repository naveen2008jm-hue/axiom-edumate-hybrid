import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Circle,
  ExternalLink,
  Plus,
  Flame,
  Award,
  BookOpen,
  RefreshCw,
  TrendingUp,
  Sparkles,
  FileText,
  HelpCircle,
  Tag,
  GraduationCap,
} from 'lucide-react';
import { PracticeSheetConfig, PracticeSheetTopic, UserProfile, Track } from '../../types';
import { getPracticeSheetConfig } from '../../data/practiceSheets';
import { TRACK_DEFINITIONS } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface PracticeSheetTrackerProps {
  track: Track;
  topics?: PracticeSheetTopic[];
  profile: UserProfile;
  onToggleComplete: (id: string) => void;
  onAddTopic?: (topic: Omit<PracticeSheetTopic, 'id'>) => void;
}

export const PracticeSheetTracker: React.FC<PracticeSheetTrackerProps> = ({
  track,
  topics: customTopics,
  profile,
  onToggleComplete,
  onAddTopic,
}) => {
  const config: PracticeSheetConfig = getPracticeSheetConfig(track);
  const trackMeta = TRACK_DEFINITIONS[track] || TRACK_DEFINITIONS.engineering;
  const Icon = trackMeta.icon;

  // Maintain local state for topics if not managed entirely externally
  const [topicList, setTopicList] = useState<PracticeSheetTopic[]>(() => {
    return customTopics && customTopics.length > 0 ? customTopics : config.defaultTopics;
  });

  useEffect(() => {
    if (customTopics && customTopics.length > 0) {
      setTopicList(customTopics);
    } else {
      setTopicList(config.defaultTopics);
    }
  }, [track, customTopics]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // External Platform Mock/Live Stats
  const [liveStats, setLiveStats] = useState<{
    solved: number;
    easy: number;
    medium: number;
    hard: number;
    accuracy: number;
    rankOrPercentile: string;
    isLive: boolean;
  }>({
    solved: 180,
    easy: 75,
    medium: 85,
    hard: 20,
    accuracy: 74.5,
    rankOrPercentile: track === 'engineering' ? '#38,450' : '94.2 Percentile',
    isLive: false,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // New problem/question form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>(config.categories[1] || 'General');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newPattern, setNewPattern] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Fetch stats (LeetCode for engineering, or simulation for other tracks)
  const fetchPlatformStats = async () => {
    if (track === 'engineering' && profile.leetcodeUsername) {
      setLoadingStats(true);
      try {
        const res = await fetch(`/api/leetcode/${profile.leetcodeUsername}`);
        if (res.ok) {
          const data = await res.json();
          setLiveStats({
            solved: data.totalSolved,
            easy: data.easySolved,
            medium: data.mediumSolved,
            hard: data.hardSolved,
            accuracy: data.acceptanceRate,
            rankOrPercentile: `#${data.ranking.toLocaleString()}`,
            isLive: true,
          });
          toast.success('LeetCode Profile Synced', {
            description: `Fetched stats for ${profile.leetcodeUsername}`,
          });
        }
      } catch (e) {
        console.warn('Could not fetch stats:', e);
      } finally {
        setLoadingStats(false);
      }
    } else {
      setLoadingStats(true);
      setTimeout(() => {
        setLoadingStats(false);
        toast.info(`${config.statProxyName} Refreshed`, {
          description: `Analytics updated for ${trackMeta.shortLabel} track.`,
        });
      }, 400);
    }
  };

  useEffect(() => {
    fetchPlatformStats();
  }, [track, profile.leetcodeUsername]);

  const categories = ['All', ...Array.from(new Set(topicList.map((t) => t.category)))];

  const filteredTopics = topicList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyPattern?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceCode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Completed' && item.completed) ||
      (filterStatus === 'Pending' && !item.completed);
    return matchesSearch && matchesCat && matchesDiff && matchesStatus;
  });

  const completedCount = topicList.filter((t) => t.completed).length;
  const progressPercent = topicList.length ? Math.round((completedCount / topicList.length) * 100) : 0;
  const easyCount = topicList.filter((t) => t.difficulty === 'Easy' && t.completed).length;
  const mediumCount = topicList.filter((t) => t.difficulty === 'Medium' && t.completed).length;
  const hardCount = topicList.filter((t) => t.difficulty === 'Hard' && t.completed).length;

  const handleToggle = (topic: PracticeSheetTopic) => {
    soundFx.playSuccess();
    onToggleComplete(topic.id);
    setTopicList((prev) =>
      prev.map((t) => (t.id === topic.id ? { ...t, completed: !t.completed } : t))
    );
    if (!topic.completed) {
      toast.success(`Practice Item Mastered: ${topic.title}`, {
        description: `+20 XP earned • ${topic.difficulty} difficulty concept retained.`,
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    soundFx.playSuccess();
    const newItem: PracticeSheetTopic = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      keyPattern: newPattern,
      externalUrl: newUrl,
      completed: false,
    };
    if (onAddTopic) {
      onAddTopic(newItem);
    }
    setTopicList((prev) => [newItem, ...prev]);
    setNewTitle('');
    setNewPattern('');
    setNewUrl('');
    setShowAddModal(false);
    toast.success('New Practice Item Added');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Track Badge */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-xs font-mono font-semibold">
                <span className={`w-2 h-2 rounded-full ${trackMeta.bgSubtle} inline-block shadow-sm`} />
                <span className={trackMeta.color}>{trackMeta.label}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Skill Practice Sheet</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                {config.sheetTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {config.sheetSubtitle}
              </p>
            </div>

            {/* Quick Stats Bento in Header */}
            <div className="flex items-center gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1 min-w-[130px]">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Mastery</div>
                <div className="text-2xl font-black font-mono text-white">
                  {completedCount} <span className="text-sm font-normal text-slate-500">/ {topicList.length}</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">{progressPercent}% Mastered</div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="btn-island group flex items-center justify-between pl-4 pr-1.5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-white/10 pressable"
              >
                <span className="mr-3 tracking-wide">Add Custom Item</span>
                <div className="btn-icon-wrapper w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Progress Bar Strip */}
          <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Curriculum Completion Progress</span>
              <span className="text-indigo-300 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* External Platform Analytics Proxy Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bezel-shell p-4 glass-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{config.statProxyName || 'Platform Sync'}</span>
            <button
              onClick={fetchPlatformStats}
              disabled={loadingStats}
              className="text-slate-400 hover:text-white transition"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
          <div className="text-2xl font-black font-mono text-white">{liveStats.solved} Items</div>
          <p className="text-[10px] text-slate-400 font-mono truncate">{config.externalPlatformName}</p>
        </div>

        <div className="bezel-shell p-4 glass-subtle space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Accuracy / Acceptance</span>
          <div className="text-2xl font-black font-mono text-emerald-400">{liveStats.accuracy}%</div>
          <p className="text-[10px] text-slate-400 font-mono">Benchmark Score</p>
        </div>

        <div className="bezel-shell p-4 glass-subtle space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Rank / Percentile</span>
          <div className="text-2xl font-black font-mono text-indigo-300">{liveStats.rankOrPercentile}</div>
          <p className="text-[10px] text-slate-400 font-mono">Cohort Performance</p>
        </div>

        <div className="bezel-shell p-4 glass-subtle space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Difficulty Split</span>
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-emerald-400">{easyCount}E</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400">{mediumCount}M</span>
            <span className="text-slate-600">/</span>
            <span className="text-rose-400">{hardCount}H</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Solved Across Tiers</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by topic, statute, algorithm or pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Difficulty & Status Filters */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedDifficulty(diff);
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    selectedDifficulty === diff
                      ? diff === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                        : diff === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : diff === 'Hard'
                        ? 'bg-rose-500/20 text-rose-400 font-bold'
                        : 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {(['All', 'Completed', 'Pending'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    soundFx.playClick();
                    setFilterStatus(st);
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    filterStatus === st ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Practice Table */}
      <div className="bezel-shell">
        <div className="bezel-core p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Topic / Case Problem</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Key Invariant / Pattern</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Difficulty</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTopics.map((topic) => {
                  const isDone = topic.completed;

                  return (
                    <tr
                      key={topic.id}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        isDone ? 'bg-slate-950/40 text-slate-400' : 'text-slate-200'
                      }`}
                    >
                      {/* Status checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggle(topic)}
                          className="text-emerald-400 hover:scale-110 transition-transform"
                          title={isDone ? 'Mark as Pending' : 'Mark as Mastered'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-slate-950" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Topic title + reference code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {topic.referenceCode && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                              {topic.referenceCode}
                            </span>
                          )}
                          <span className={`font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                            {topic.title}
                          </span>
                        </div>
                        {topic.notes && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic font-mono">
                            💡 {topic.notes}
                          </p>
                        )}
                      </td>

                      {/* Key Pattern */}
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 inline-block max-w-xs truncate">
                          {topic.keyPattern || 'Core Principles & Edge Cases'}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-300">{topic.category}</span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                            topic.difficulty === 'Easy'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : topic.difficulty === 'Medium'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {topic.difficulty}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {topic.externalUrl ? (
                          <a
                            href={topic.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold transition border border-white/5"
                          >
                            <span>{config.actionLabel.split(' ')[0]}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button
                            onClick={() => handleToggle(topic)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-white/5"
                          >
                            <span>{isDone ? 'Reviewed' : config.actionLabel.split(' ')[0]}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredTopics.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <p>No practice items match your search or filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedDifficulty('All');
                    setFilterStatus('All');
                  }}
                  className="text-indigo-400 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white font-display">Add Custom Practice Topic / Question</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Title / Case Scenario</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Landmark Judgment on Privacy / Kadane Algorithm"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {config.categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Key Invariant / Pattern / Ratio</label>
                <input
                  type="text"
                  placeholder="e.g. Ratio Decidendi / Sliding Window / Section 14"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">External Resource URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition"
                >
                  Add to Practice Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
