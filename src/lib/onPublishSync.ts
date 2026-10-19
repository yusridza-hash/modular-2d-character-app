import type { CharacterDraft } from '../character/types';
import { syncDraftToSupabase } from './characterSync';
import { isSupabaseConfigured } from './supabase';

/** Call after local publish; no-op if Supabase/env/session missing. */
export async function maybeSyncPublishedDraft(draft: CharacterDraft): Promise<string> {
  if (!isSupabaseConfigured) return 'Published locally (Supabase not configured)';
  const res = await syncDraftToSupabase(draft);
  if (!res.ok) return `Published locally; Supabase sync failed: ${res.error}`;
  return `Published + synced to Supabase (${res.characterId})`;
}
