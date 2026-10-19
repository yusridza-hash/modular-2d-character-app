export type AssetKind = 'character' | 'background' | 'prop';
export type Expression = 'neutral' | 'happy' | 'shocked' | 'angry' | 'sad';
export interface Asset { id:string; name:string; kind:AssetKind; source?:string; expressions?:Partial<Record<Expression,string>>; }
export interface PartPose { head:number; leftArm:number; rightArm:number; leftLeg:number; rightLeg:number; }
export interface Instance { id:string; assetId:string; x:number; y:number; scale:number; rotation:number; expression:Expression; pose:PartPose; layer:number; tint:number; shadow:boolean; }
export interface ComicPanel { id:string; name:string; background?:string; objects:Instance[]; }
export const DEFAULT_POSE:PartPose={head:0,leftArm:0,rightArm:0,leftLeg:0,rightLeg:0};
export const EXPRESSIONS:Expression[]=['neutral','happy','shocked','angry','sad'];
