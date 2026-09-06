import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = localStorage.getItem('axiom_supabase_url') || '';
  const anonKey = localStorage.getItem('axiom_supabase_anon_key') || '';
  if (url && anonKey) {
    return { url, anonKey };
  }
  return null;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const config = getSupabaseConfig();
  if (config) {
    try {
      supabaseClient = createClient(config.url, config.anonKey);
      return supabaseClient;
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
    }
  }
  return null;
}

export function saveSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    localStorage.setItem('axiom_supabase_url', url);
    localStorage.setItem('axiom_supabase_anon_key', anonKey);
    supabaseClient = createClient(url, anonKey);
    return true;
  } catch (e) {
    console.error('Failed to save Supabase config:', e);
    return false;
  }
}
