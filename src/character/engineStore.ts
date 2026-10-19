import { create } from 'zustand';
import {
  CharacterDraft,
  CharacterView,
  PosePreset,
  WizardStage,
  BodyPart,
  DEFAULT_PART_META,
} from './types';
import { removeBackgroundSimple, segmentHeuristic, clampRotation } from './pipeline';
import { maybeSyncPublishedDraft } from '../lib/onPublishSync';

const LS_KEY = 'modular-2d-character-drafts';

function uid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

function loadDrafts(): CharacterDraft[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CharacterDraft[];
  } catch {
    return [];
  }
}

function persist(drafts: CharacterDraft[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.warn('Character drafts persist failed (quota?)', e);
  }
}

type EngineState = {
  drafts: CharacterDraft[];
  activeDraftId?: string;
  busy: boolean;
  message: string;
  refresh: () => void;
  createDraft: (name: string) => string;
  selectDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  renameDraft: (id: string, name: string) => void;
  setStage: (stage: WizardStage) => void;
  setActiveView: (view: CharacterView) => void;
  addAngleSource: (view: CharacterView, dataUrl: string, width: number, height: number) => void;
  runClean: (tolerance?: number) => Promise<void>;
  runSegment: () => Promise<void>;
  updatePartPivot: (part: BodyPart, pivot: [number, number]) => void;
  updatePartParent: (part: BodyPart, parent: BodyPart | null) => void;
  setPoseRotation: (part: BodyPart, rotation: number) => void;
  savePosePreset: (name: string) => void;
  loadPosePreset: (poseId: string) => void;
  addExpression: (name: string, fileDataUrl: string) => void;
  removeExpression: (id: string) => void;
  publish: () => { libraryAssetId: string; draft: CharacterDraft } | null;
  workPose: Partial<Record<BodyPart, number>>;
  setWorkPosePart: (part: BodyPart, deg: number) => void;
  resetWorkPose: () => void;
};

function patchActive(
  drafts: CharacterDraft[],
  id: string | undefined,
  fn: (d: CharacterDraft) => CharacterDraft,
): CharacterDraft[] {
  if (!id) return drafts;
  return drafts.map((d) => (d.id === id ? { ...fn(d), updatedAt: now() } : d));
}

export const useCharacterEngine = create<EngineState>((set, get) => ({
  drafts: loadDrafts(),
  activeDraftId: undefined,
  busy: false,
  message: 'Character Engine ready',
  workPose: {},

  refresh: () => set({ drafts: loadDrafts() }),

  createDraft: (name) => {
    const id = uid();
    const draft: CharacterDraft = {
      id,
      name: name || 'New Character',
      tags: [],
      status: 'draft',
      stage: 'import',
      referenceHeightPx: 1600,
      angles: {},
      activeView: 'front',
      expressions: [{ id: uid(), name: 'neutral', fileDataUrl: '', isDefault: true }],
      poses: [],
      createdAt: now(),
      updatedAt: now(),
    };
    const drafts = [...get().drafts, draft];
    persist(drafts);
    set({ drafts, activeDraftId: id, message: 'Draft created' });
    return id;
  },

  selectDraft: (id) => set({ activeDraftId: id, workPose: {}, message: 'Draft selected' }),

  deleteDraft: (id) => {
    const drafts = get().drafts.filter((d) => d.id !== id);
    persist(drafts);
    set({
      drafts,
      activeDraftId: get().activeDraftId === id ? undefined : get().activeDraftId,
      message: 'Draft deleted',
    });
  },

  renameDraft: (id, name) => {
    const drafts = patchActive(get().drafts, id, (d) => ({ ...d, name }));
    persist(drafts);
    set({ drafts });
  },

  setStage: (stage) => {
    const drafts = patchActive(get().drafts, get().activeDraftId, (d) => ({ ...d, stage }));
    persist(drafts);
    set({ drafts });
  },

  setActiveView: (view) => {
    const drafts = patchActive(get().drafts, get().activeDraftId, (d) => ({ ...d, activeView: view }));
    persist(drafts);
    set({ drafts });
  },

  addAngleSource: (view, dataUrl, width, height) => {
    const drafts = patchActive(get().drafts, get().activeDraftId, (d) => ({
      ...d,
      angles: {
        ...d.angles,
        [view]: {
          view,
          sourceDataUrl: dataUrl,
          width,
          height,
          status: 'uploaded',
          parts: d.angles[view]?.parts ?? [],
        },
      },
      activeView: view,
    }));
    persist(drafts);
    set({ drafts, message: `Uploaded ${view}` });
  },

  runClean: async (tolerance = 42) => {
    const { activeDraftId, drafts } = get();
    const d = drafts.find((x) => x.id === activeDraftId);
    if (!d) return;
    const angle = d.angles[d.activeView];
    if (!angle?.sourceDataUrl) {
      set({ message: 'No source image for active view' });
      return;
    }
    set({ busy: true, message: 'Removing background…' });
    try {
      const { cleanDataUrl, width, height } = await removeBackgroundSimple(angle.sourceDataUrl, tolerance);
      const next = patchActive(get().drafts, activeDraftId, (dr) => ({
        ...dr,
        angles: {
          ...dr.angles,
          [dr.activeView]: {
            ...dr.angles[dr.activeView]!,
            cleanDataUrl,
            width,
            height,
            status: 'cleaned',
          },
        },
        stage: 'clean',
      }));
      persist(next);
      set({ drafts: next, busy: false, message: 'Background removal done (MVP).' });
    } catch (e) {
      set({ busy: false, message: 'Clean failed: ' + String(e) });
    }
  },

  runSegment: async () => {
    const { activeDraftId, drafts } = get();
    const d = drafts.find((x) => x.id === activeDraftId);
    if (!d) return;
    const angle = d.angles[d.activeView];
    const src = angle?.cleanDataUrl || angle?.sourceDataUrl;
    if (!src) {
      set({ message: 'Clean or source image required' });
      return;
    }
    set({ busy: true, message: 'Segmenting…' });
    try {
      const parts = await segmentHeuristic(src);
      const next = patchActive(get().drafts, activeDraftId, (dr) => ({
        ...dr,
        angles: {
          ...dr.angles,
          [dr.activeView]: {
            ...dr.angles[dr.activeView]!,
            parts,
            status: 'segmented',
          },
        },
        stage: 'segment',
      }));
      persist(next);
      set({ drafts: next, busy: false, message: `Segmented ${parts.length} parts.` });
    } catch (e) {
      set({ busy: false, message: 'Segment failed: ' + String(e) });
    }
  },

  updatePartPivot: (part, pivot) => {
    const drafts = patchActive(get().drafts, get().activeDraftId, (d) => {
      const angle = d.angles[d.activeView];
      if (!angle) return d;
      return {
        ...d,
        angles: {
          ...d.angles,
          [d.activeView]: {
            ...angle,
            parts: angle.parts.map((p) =>
              p.part === part ? { ...p, meta: { ...p.meta, pivot } } : p,
            ),
          },
        },
      };
    });
    persist(drafts);
    set({ drafts });
  },

  updatePartParent: (part, parent) => {
    const drafts = patchActive(get().drafts, get().activeDraftId, (d) => {
      const angle = d.angles[d.activeView];
      if (!angle) return d;
      return {
        ...d,
        angles: {
          ...d.angles,
          [d.activeView]: {
            ...angle,
            parts: angle.parts.map((p) =>
              p.part === part ? { ...p, meta: { ...p.meta, parent_part: parent } } : p,
            ),
          },
        },
      };
    });
    persist(drafts);
    set({ drafts });
  },

  setPoseRotation: () => {},

  setWorkPosePart: (part, deg) => {
    const d = get().drafts.find((x) => x.id === get().activeDraftId);
    const angle = d?.angles[d.activeView];
    const meta = angle?.parts.find((p) => p.part === part)?.meta ?? DEFAULT_PART_META[part];
    set({ workPose: { ...get().workPose, [part]: clampRotation(part, deg, meta) } });
  },

  resetWorkPose: () => set({ workPose: {} }),

  savePosePreset: (name) => {
    const work = get().workPose;
    const parts: PosePreset['parts'] = {};
    (Object.keys(work) as BodyPart[]).forEach((k) => {
      parts[k] = { rotation: work[k] ?? 0 };
    });
    const drafts = patchActive(get().drafts, get().activeDraftId, (d) => ({
      ...d,
      poses: [
        ...d.poses,
        { id: uid(), name: name || `Pose ${d.poses.length + 1}`, view: d.activeView, parts },
      ],
    }));
    persist(drafts);
    set({ drafts, message: 'Pose preset saved' });
  },

  loadPosePreset: (poseId) => {
    const d = get().drafts.find((x) => x.id === get().activeDraftId);
    const pose = d?.poses.find((p) => p.id === poseId);
    if (!pose) return;
    const work: Partial<Record<BodyPart, number>> = {};
    Object.entries(pose.parts).forEach(([k, v]) => {
      work[k as BodyPart] = v?.rotation ?? 0;
    });
    set({ workPose: work, message: `Loaded pose ${pose.name}` });
  },

  addExpression: (name, fileDataUrl) => {
    const drafts = patchActive(get().drafts, get().activeDraftId, (d) => ({
      ...d,
      expressions: [
        ...d.expressions.filter((e) => e.name !== name),
        { id: uid(), name, fileDataUrl, isDefault: name === 'neutral' },
      ],
    }));
    persist(drafts);
    set({ drafts, message: `Expression “${name}” added` });
  },

  removeExpression: (id) => {
    const drafts = patchActive(get().drafts, get().activeDraftId, (d) => ({
      ...d,
      expressions: d.expressions.filter((e) => e.id !== id),
    }));
    persist(drafts);
    set({ drafts });
  },

  publish: () => {
    const { activeDraftId, drafts } = get();
    const d = drafts.find((x) => x.id === activeDraftId);
    if (!d) return null;
    const front = d.angles.front;
    if (!front?.parts?.length) {
      set({ message: 'Publish blocked: front view needs segmented parts' });
      return null;
    }
    const libraryAssetId = d.libraryAssetId || uid();
    const next = patchActive(drafts, activeDraftId, (dr) => ({
      ...dr,
      status: 'published',
      stage: 'publish',
      libraryAssetId,
    }));
    persist(next);
    const published = next.find((x) => x.id === activeDraftId)!;
    set({ drafts: next, message: 'Published locally… syncing Supabase if configured' });
    void maybeSyncPublishedDraft(published).then((msg) => set({ message: msg }));
    return { libraryAssetId, draft: published };
  },
}));

export function activeDraft(state: EngineState): CharacterDraft | undefined {
  return state.drafts.find((d) => d.id === state.activeDraftId);
}

export { WIZARD_STAGES } from './types';
