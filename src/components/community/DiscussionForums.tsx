import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  MessageCircle,
  Tag,
  Search,
  CheckCircle2,
  Sparkles,
  User,
  Send,
  Lock,
} from 'lucide-react';
import { DiscussionThread, DiscussionReply } from '../../types';
import { INITIAL_DISCUSSION_THREADS } from '../../data/communityData';
import { useTrack } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface DiscussionForumsProps {
  onAwardXP?: (amount: number) => void;
}

export const DiscussionForums: React.FC<DiscussionForumsProps> = ({ onAwardXP }) => {
  const { track, config } = useTrack();
  const [threads, setThreads] = useState<DiscussionThread[]>(INITIAL_DISCUSSION_THREADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New Thread form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');

  // Reply form state
  const [replyContent, setReplyContent] = useState('');

  // Filter threads by track and search
  const visibleThreads = threads.filter((th) => {
    const matchesTrack = th.track === track || th.track === 'engineering'; // Show general + active track
    const matchesSearch =
      th.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      th.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      th.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'ALL' || th.tags.includes(selectedTag);
    return matchesTrack && matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(threads.flatMap((t) => t.tags)));

  const handleUpvote = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
    if (selectedThread?.id === threadId) {
      setSelectedThread((prev) => (prev ? { ...prev, upvotes: prev.upvotes + 1 } : null));
    }
    onAwardXP?.(5);
    soundFx.playSuccess();
    toast.success('Thread Upvoted! (+5 XP)');
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newThreadObj: DiscussionThread = {
      id: `th-${Date.now()}`,
      track,
      title: newTitle,
      author: 'You (Active Peer)',
      authorAvatar: '👤',
      createdAt: 'Just now',
      content: newContent,
      tags: newTag ? newTag.split(',').map((s) => s.trim()) : [config.name, 'Discussion'],
      upvotes: 1,
      repliesCount: 0,
      replies: [],
    };

    setThreads([newThreadObj, ...threads]);
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
    setNewTag('');

    onAwardXP?.(25);
    soundFx.playLevelUp();
    toast.success('Discussion Thread Published! (+25 XP)', {
      description: 'Your question is now visible to active students in your vertical.',
    });
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedThread) return;

    const newReply: DiscussionReply = {
      id: `rep-${Date.now()}`,
      author: 'You (Active Peer)',
      authorAvatar: '👤',
      createdAt: 'Just now',
      content: replyContent,
      upvotes: 0,
    };

    const updated = {
      ...selectedThread,
      repliesCount: selectedThread.repliesCount + 1,
      replies: [...selectedThread.replies, newReply],
    };

    setSelectedThread(updated);
    setThreads((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setReplyContent('');

    onAwardXP?.(15);
    soundFx.playSuccess();
    toast.success('Reply Posted! (+15 XP)');
  };

  return (
    <div className="space-y-6">
      {/* Controls & Search Bar */}
      <div className="bezel-shell p-4 bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${config.name} discussions...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Discussion Thread (+25 XP)</span>
          </button>
        </div>
      </div>

      {/* Tag Pills */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-[10px] font-mono uppercase text-slate-500 mr-2">Filter Topics:</span>
        <button
          onClick={() => setSelectedTag('ALL')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            selectedTag === 'ALL'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              selectedTag === t
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            #{t}
          </button>
        ))}
      </div>

      {/* New Thread Modal */}
      {isCreating && (
        <div className="bezel-shell p-6 bg-slate-900 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Start New Discussion in {config.name} Track</span>
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateThread} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Thread Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Best resources for Corporate Tax Assessment / Case Law references?"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Details / Problem Statement</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Provide context, formulas, case law, or exam details..."
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tax, CaseStudy, Exam2026"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              Publish Thread (+25 XP)
            </button>
          </form>
        </div>
      )}

      {/* Main Grid: Thread List vs Active Thread Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Thread Cards List */}
        <div className={`${selectedThread ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          {visibleThreads.length === 0 ? (
            <div className="bezel-shell p-10 text-center space-y-2 bg-slate-900/40">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No discussions found matching criteria.</p>
              <p className="text-xs text-slate-500">Be the first to create a thread in {config.name}!</p>
            </div>
          ) : (
            visibleThreads.map((thread) => {
              const isSelected = selectedThread?.id === thread.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/40'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                        {thread.authorAvatar || '👤'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{thread.author}</div>
                        <div className="text-[10px] font-mono text-slate-500">{thread.createdAt}</div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleUpvote(thread.id, e)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/50 flex items-center gap-1.5 text-xs text-slate-300 hover:text-indigo-300 transition-all shrink-0"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span className="font-mono font-bold">{thread.upvotes}</span>
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">{thread.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {thread.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {thread.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-950 text-indigo-300 border border-slate-800"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <MessageCircle className="w-3 h-3 text-indigo-400" />
                      <span>{thread.repliesCount} replies</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Thread Reading & Reply View */}
        {selectedThread && (
          <div className="lg:col-span-7 bezel-shell p-6 bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                  {selectedThread.authorAvatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedThread.author}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{selectedThread.createdAt}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedThread(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                {selectedThread.title}
              </h3>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {selectedThread.content}
              </p>
            </div>

            {/* Replies List */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase font-mono text-slate-400 flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Responses ({selectedThread.replies.length})</span>
              </div>

              {selectedThread.replies.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No responses yet. Share your insight below!</p>
              ) : (
                selectedThread.replies.map((rep) => (
                  <div key={rep.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{rep.authorAvatar}</span>
                        <span className="font-bold text-slate-200">{rep.author}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{rep.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-6">{rep.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Post Reply Form */}
            <form onSubmit={handleAddReply} className="space-y-2.5 pt-3 border-t border-slate-800">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your constructive response or solution..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3 h-3" />
                <span>Post Response (+15 XP)</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
