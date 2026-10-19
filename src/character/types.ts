/** Character Engine types — Phase 1–4 */

export type CharacterView =
  | 'front'
  | 'side_left'
  | 'side_right'
  | 'back'
  | 'three_quarter_left'
  | 'three_quarter_right';

export type BodyPart =
  | 'head'
  | 'hair_front'
  | 'hair_back'
  | 'body'
  | 'upper_arm_l'
  | 'lower_arm_l'
  | 'upper_arm_r'
  | 'lower_arm_r'
  | 'upper_leg_l'
  | 'lower_leg_l'
  | 'upper_leg_r'
  | 'lower_leg_r'
  | 'accessory';

export type WizardStage =
  | 'import'
  | 'clean'
  | 'segment'
  | 'repair'
  | 'rig'
  | 'expressions'
  | 'publish';

export type DraftStatus = 'draft' | 'published';

export const BODY_PARTS: BodyPart[] = [
  'head', 'hair_back', 'hair_front', 'body',
  'upper_arm_l', 'lower_arm_l', 'upper_arm_r', 'lower_arm_r',
  'upper_leg_l', 'lower_leg_l', 'upper_leg_r', 'lower_leg_r',
];

export const VIEWS: CharacterView[] = [
  'front', 'side_left', 'side_right', 'back', 'three_quarter_left', 'three_quarter_right',
];

export const WIZARD_STAGES: WizardStage[] = [
  'import', 'clean', 'segment', 'repair', 'rig', 'expressions', 'publish',
];

export interface PartMeta {
  pivot: [number, number];
  parent_part: BodyPart | null;
  layer: number;
  constraints?: { min_deg: number; max_deg: number };
  bbox?: { x: number; y: number; w: number; h: number };
}

export interface CharacterPart {
  part: BodyPart;
  /** data URL PNG transparent */
  fileDataUrl: string;
  meta: PartMeta;
}

export interface CharacterAngle {
  view: CharacterView;
  sourceDataUrl: string;
  cleanDataUrl?: string;
  /** full-size mask: each pixel body-part index or 0 empty — stored as data URL of labeled canvas optional */
  width: number;
  height: number;
  status: 'uploaded' | 'cleaned' | 'segmented' | 'ready' | 'error';
  parts: CharacterPart[];
  /** optional paint layer data URL for segment brush work */
  segmentPaintDataUrl?: string;
}

export interface ExpressionPreset {
  id: string;
  name: string;
  /** whole-face or overlay data URL */
  fileDataUrl: string;
  isDefault?: boolean;
}

export interface PosePreset {
  id: string;
  name: string;
  view: CharacterView;
  /** part -> rotation degrees */
  parts: Partial<Record<BodyPart, { rotation: number; x?: number; y?: number }>>;
}

export interface CharacterDraft {
  id: string;
  name: string;
  tags: string[];
  status: DraftStatus;
  stage: WizardStage;
  referenceHeightPx: number;
  angles: Partial<Record<CharacterView, CharacterAngle>>;
  activeView: CharacterView;
  expressions: ExpressionPreset[];
  poses: PosePreset[];
  /** published library asset id when published */
  libraryAssetId?: string;
  updatedAt: string;
  createdAt: string;
}

export const DEFAULT_PART_META: Record<BodyPart, PartMeta> = {
  head: { pivot: [0.5, 0.92], parent_part: 'body', layer: 20, constraints: { min_deg: -30, max_deg: 30 } },
  hair_front: { pivot: [0.5, 0.2], parent_part: 'head', layer: 22 },
  hair_back: { pivot: [0.5, 0.2], parent_part: 'head', layer: 8 },
  body: { pivot: [0.5, 0.15], parent_part: null, layer: 10 },
  upper_arm_l: { pivot: [0.75, 0.12], parent_part: 'body', layer: 12, constraints: { min_deg: -60, max_deg: 120 } },
  lower_arm_l: { pivot: [0.5, 0.08], parent_part: 'upper_arm_l', layer: 13, constraints: { min_deg: 0, max_deg: 145 } },
  upper_arm_r: { pivot: [0.25, 0.12], parent_part: 'body', layer: 12, constraints: { min_deg: -120, max_deg: 60 } },
  lower_arm_r: { pivot: [0.5, 0.08], parent_part: 'upper_arm_r', layer: 13, constraints: { min_deg: 0, max_deg: 145 } },
  upper_leg_l: { pivot: [0.5, 0.08], parent_part: 'body', layer: 9, constraints: { min_deg: -40, max_deg: 80 } },
  lower_leg_l: { pivot: [0.5, 0.08], parent_part: 'upper_leg_l', layer: 8, constraints: { min_deg: 0, max_deg: 140 } },
  upper_leg_r: { pivot: [0.5, 0.08], parent_part: 'body', layer: 9, constraints: { min_deg: -80, max_deg: 40 } },
  lower_leg_r: { pivot: [0.5, 0.08], parent_part: 'upper_leg_r', layer: 8, constraints: { min_deg: 0, max_deg: 140 } },
  accessory: { pivot: [0.5, 0.5], parent_part: 'body', layer: 15 },
};

export const PART_COLORS: Record<BodyPart, string> = {
  head: '#e8bc97',
  hair_front: '#3d2b1f',
  hair_back: '#2a1c14',
  body: '#527aa0',
  upper_arm_l: '#6a9bc2',
  lower_arm_l: '#8bb8d9',
  upper_arm_r: '#6a9bc2',
  lower_arm_r: '#8bb8d9',
  upper_leg_l: '#33445c',
  lower_leg_l: '#44566e',
  upper_leg_r: '#33445c',
  lower_leg_r: '#44566e',
  accessory: '#c4a35a',
};
