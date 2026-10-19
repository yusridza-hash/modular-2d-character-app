/** Sync Character Engine draft metadata + files to Supabase (when configured + logged in). */

import type { CharacterDraft, CharacterView, BodyPart } from '../character/types';
import { getSupabase, getSessionUser } from './supabase';

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, b64] = dataUrl.split(',');
  const mime = /data:(.*?);/.exec(header)?.[1] || 'image/png';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

async function uploadDataUrl(
  bucket: string,
  path: string,
  dataUrl: string,
): Promise<string | null> {
  const sb = getSupabase();
  if (!sb || !dataUrl.startsWith('data:')) return null;
  const blob = dataUrlToBlob(dataUrl);
  const { error } = await sb.storage.from(bucket).upload(path, blob, {
    upsert: true,
    contentType: blob.type || 'image/png',
  });
  if (error) {
    console.warn('Storage upload failed', path, error.message);
    return null;
  }
  return path;
}

/** Upsert character row + angles/parts/expressions/poses. Returns remote character id. */
export async function syncDraftToSupabase(draft: CharacterDraft): Promise<{
  ok: boolean;
  characterId?: string;
  error?: string;
}> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: 'Supabase not configured (set VITE_SUPABASE_URL / ANON_KEY)' };

  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not signed in — use Auth panel first' };

  const characterId = draft.id;

  const { error: charErr } = await sb.from('characters').upsert(
    {
      id: characterId,
      owner_id: user.id,
      name: draft.name,
      reference_height_px: draft.referenceHeightPx,
      status: draft.status === 'published' ? 'published' : 'draft',
      wizard_stage: draft.stage,
      updated_at: new Date().toISOString(),
      deleted_at: null,
    },
    { onConflict: 'id' },
  );
  if (charErr) return { ok: false, error: charErr.message };

  const views = Object.keys(draft.angles) as CharacterView[];
  for (const view of views) {
    const angle = draft.angles[view]!;
    const sourcePath = `${user.id}/${characterId}/${view}/source.png`;
    const cleanPath = `${user.id}/${characterId}/${view}/clean.png`;

    let source_path = angle.sourceDataUrl?.startsWith('data:')
      ? (await uploadDataUrl('character-sources', sourcePath, angle.sourceDataUrl)) || sourcePath
      : angle.sourceDataUrl || '';
    let clean_path: string | null = null;
    if (angle.cleanDataUrl?.startsWith('data:')) {
      clean_path = (await uploadDataUrl('character-assets', cleanPath, angle.cleanDataUrl)) || cleanPath;
    }

    const { data: angleRow, error: angErr } = await sb
      .from('character_angles')
      .upsert(
        {
          character_id: characterId,
          view,
          source_path,
          clean_path,
          width: angle.width,
          height: angle.height,
          status: angle.status === 'uploaded' ? 'uploaded' : angle.status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'character_id,view' },
      )
      .select('id')
      .single();

    if (angErr) {
      console.warn('angle upsert', view, angErr.message);
      continue;
    }

    const angleId = angleRow?.id as string;
    for (const part of angle.parts) {
      const partPath = `${user.id}/${characterId}/${view}/parts/${part.part}.png`;
      let file_path = partPath;
      if (part.fileDataUrl?.startsWith('data:')) {
        file_path =
          (await uploadDataUrl('character-assets', partPath, part.fileDataUrl)) || partPath;
      }
      await sb.from('character_parts').upsert(
        {
          character_id: characterId,
          angle_id: angleId,
          part: part.part as BodyPart,
          file_path,
          meta: part.meta,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'angle_id,part' },
      );
    }
  }

  for (const ex of draft.expressions) {
    if (!ex.fileDataUrl) continue;
    const path = `${user.id}/${characterId}/expressions/${ex.name}.png`;
    let file_path = path;
    if (ex.fileDataUrl.startsWith('data:')) {
      file_path = (await uploadDataUrl('character-assets', path, ex.fileDataUrl)) || path;
    }
    await sb.from('character_expressions').upsert(
      {
        character_id: characterId,
        name: ex.name,
        file_path,
        is_default: Boolean(ex.isDefault),
      },
      { onConflict: 'character_id,name' },
    );
  }

  for (const pose of draft.poses) {
    await sb.from('character_poses').upsert(
      {
        character_id: characterId,
        name: pose.name,
        view: pose.view,
        parts: pose.parts,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'character_id,name,view' },
    );
  }

  return { ok: true, characterId };
}

export async function listRemoteCharacters(): Promise<
  { id: string; name: string; status: string; updated_at: string }[]
> {
  const sb = getSupabase();
  const user = await getSessionUser();
  if (!sb || !user) return [];
  const { data, error } = await sb
    .from('characters')
    .select('id,name,status,updated_at')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });
  if (error) {
    console.warn(error.message);
    return [];
  }
  return data || [];
}
