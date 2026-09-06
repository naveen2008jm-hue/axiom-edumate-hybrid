import React, { useState } from 'react';
import { X, Database, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const existingConfig = getSupabaseConfig();
  const [url, setUrl] = useState(existingConfig?.url || '');
  const [anonKey, setAnonKey] = useState(existingConfig?.anonKey || '');
  const [status, setStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !anonKey) {
      setStatus('Please enter both Supabase URL and Anon Key');
      return;
    }
    const success = saveSupabaseConfig(url, anonKey);
    if (success) {
      setStatus('Successfully connected! Cloud sync active.');
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      setStatus('Failed to connect to Supabase project.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Supabase Cloud Sync</h2>
              <p className="text-xs text-slate-400">Sync streaks, courses & DSA across devices</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            Offline-first: Your data is always saved locally in real-time. Supabase syncs your milestones to the cloud.
          </span>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Supabase Project URL</label>
            <input
              type="url"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Supabase Anon Key</label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsIn..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              required
            />
          </div>

          {status && (
            <p className="text-xs font-medium text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              {status}
            </p>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition"
            >
              Save & Sync
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
