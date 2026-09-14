import React, { useState } from 'react';
import {
  FileText,
  Download,
  Upload,
  Search,
  CheckCircle2,
  Sparkles,
  Tag,
  Eye,
  FileCode,
  BookOpen,
} from 'lucide-react';
import { SharedResource } from '../../types';
import { INITIAL_SHARED_RESOURCES } from '../../data/communityData';
import { useTrack } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface ResourceSharingHubProps {
  onAwardXP?: (amount: number) => void;
}

export const ResourceSharingHub: React.FC<ResourceSharingHubProps> = ({ onAwardXP }) => {
  const { track, config } = useTrack();
  const [resources, setResources] = useState<SharedResource[]>(INITIAL_SHARED_RESOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadFormat, setUploadFormat] = useState<SharedResource['fileFormat']>('PDF');
  const [uploadTags, setUploadTags] = useState('');

  const visibleResources = resources.filter((res) => {
    const matchesTrack = res.track === track || res.track === 'engineering';
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFormat = selectedFormat === 'ALL' || res.fileFormat === selectedFormat;
    return matchesTrack && matchesSearch && matchesFormat;
  });

  const handleDownload = (resId: string, title: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, downloads: r.downloads + 1 } : r))
    );
    onAwardXP?.(5);
    soundFx.playSuccess();
    toast.success(`Accessing Resource: ${title}`, {
      description: 'Document fetched from decentralized peer repository. +5 XP awarded.',
    });
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadDesc.trim()) return;

    const newRes: SharedResource = {
      id: `res-${Date.now()}`,
      track,
      title: uploadTitle,
      description: uploadDesc,
      fileFormat: uploadFormat,
      fileSize: '1.8 MB',
      author: 'You (Peer Contributor)',
      uploadedAt: 'Today',
      downloads: 0,
      tags: uploadTags ? uploadTags.split(',').map((s) => s.trim()) : [config.name, 'Notes'],
    };

    setResources([newRes, ...resources]);
    setIsUploading(false);
    setUploadTitle('');
    setUploadDesc('');
    setUploadTags('');

    onAwardXP?.(20);
    soundFx.playLevelUp();
    toast.success('Resource Shared with Peers! (+20 XP)', {
      description: 'Your notes and materials are now indexed for fellow students.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bezel-shell p-4 bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${config.name} notes & past papers...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsUploading(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Resource (+20 XP)</span>
          </button>
        </div>
      </div>

      {/* Format Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'PDF', 'MARKDOWN', 'NOTES', 'CHEATSHEET'].map((fmt) => (
          <button
            key={fmt}
            onClick={() => setSelectedFormat(fmt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
              selectedFormat === fmt
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <div className="bezel-shell p-6 bg-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Contribute Resource to {config.name} Library</span>
            </h3>
            <button onClick={() => setIsUploading(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Document / Resource Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Constitutional Law Landmark Judgments Digest (2020-2025)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">File Format</label>
                <select
                  value={uploadFormat}
                  onChange={(e) => setUploadFormat(e.target.value as SharedResource['fileFormat'])}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="MARKDOWN">Markdown (.md)</option>
                  <option value="NOTES">Handwritten / Digitized Notes</option>
                  <option value="CHEATSHEET">Formula / Quick Cheatsheet</option>
                  <option value="CODE">Source Code / Notebook</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="CaseLaw, ExamNotes, QuickReview"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Summary / Key Takeaways</label>
              <textarea
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="Briefly describe the contents, modules covered, and revision advice..."
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
            >
              Upload & Publish to Repository (+20 XP)
            </button>
          </form>
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleResources.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {res.fileFormat} • {res.fileSize}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{res.uploadedAt}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white tracking-tight leading-snug">{res.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">{res.description}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {res.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-500 font-mono">
                By <strong className="text-slate-300">{res.author}</strong>
              </div>

              <button
                onClick={() => handleDownload(res.id, res.title)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-600 hover:text-white text-indigo-400 border border-indigo-500/30 hover:border-transparent text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{res.downloads} downloads</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
