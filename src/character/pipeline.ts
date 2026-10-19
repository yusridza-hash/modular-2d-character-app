/** Client-side image helpers for Phase 2 (no server CV required for MVP). */

import type { BodyPart, CharacterPart, PartMeta } from './types';
import { DEFAULT_PART_META, PART_COLORS } from './types';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Remove near-uniform background by sampling corners (MVP clean). */
export async function removeBackgroundSimple(
  sourceDataUrl: string,
  tolerance = 42,
): Promise<{ cleanDataUrl: string; width: number; height: number }> {
  const img = await loadImage(sourceDataUrl);
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;

  const samples: number[][] = [];
  const pts = [
    [2, 2], [w - 3, 2], [2, h - 3], [w - 3, h - 3],
    [w / 2, 2], [2, h / 2],
  ];
  for (const [x, y] of pts) {
    const i = (Math.floor(y) * w + Math.floor(x)) * 4;
    samples.push([d[i], d[i + 1], d[i + 2]]);
  }
  const avg = samples.reduce(
    (a, s) => [a[0] + s[0] / samples.length, a[1] + s[1] / samples.length, a[2] + s[2] / samples.length],
    [0, 0, 0],
  );

  for (let i = 0; i < d.length; i += 4) {
    const dr = d[i] - avg[0];
    const dg = d[i + 1] - avg[1];
    const db = d[i + 2] - avg[2];
    if (Math.sqrt(dr * dr + dg * dg + db * db) < tolerance) {
      d[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return { cleanDataUrl: canvas.toDataURL('image/png'), width: w, height: h };
}

/** Heuristic body bands → rough part crops from clean image (MVP segment). */
export async function segmentHeuristic(
  cleanDataUrl: string,
): Promise<CharacterPart[]> {
  const img = await loadImage(cleanDataUrl);
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  // Approximate humanoid vertical regions (normalized)
  const regions: { part: BodyPart; x0: number; y0: number; x1: number; y1: number }[] = [
    { part: 'head', x0: 0.28, y0: 0.02, x1: 0.72, y1: 0.22 },
    { part: 'body', x0: 0.30, y0: 0.20, x1: 0.70, y1: 0.52 },
    { part: 'upper_arm_l', x0: 0.05, y0: 0.22, x1: 0.34, y1: 0.48 },
    { part: 'upper_arm_r', x0: 0.66, y0: 0.22, x1: 0.95, y1: 0.48 },
    { part: 'lower_arm_l', x0: 0.02, y0: 0.45, x1: 0.30, y1: 0.68 },
    { part: 'lower_arm_r', x0: 0.70, y0: 0.45, x1: 0.98, y1: 0.68 },
    { part: 'upper_leg_l', x0: 0.28, y0: 0.50, x1: 0.50, y1: 0.75 },
    { part: 'upper_leg_r', x0: 0.50, y0: 0.50, x1: 0.72, y1: 0.75 },
    { part: 'lower_leg_l', x0: 0.28, y0: 0.72, x1: 0.50, y1: 0.98 },
    { part: 'lower_leg_r', x0: 0.50, y0: 0.72, x1: 0.72, y1: 0.98 },
  ];

  const parts: CharacterPart[] = [];
  for (const r of regions) {
    const x = Math.floor(r.x0 * w);
    const y = Math.floor(r.y0 * h);
    const cw = Math.max(1, Math.floor((r.x1 - r.x0) * w));
    const ch = Math.max(1, Math.floor((r.y1 - r.y0) * h));
    const partCanvas = document.createElement('canvas');
    partCanvas.width = cw;
    partCanvas.height = ch;
    const pctx = partCanvas.getContext('2d')!;
    pctx.drawImage(canvas, x, y, cw, ch, 0, 0, cw, ch);
    // Keep only non-transparent from source region
    const id = pctx.getImageData(0, 0, cw, ch);
    let hasPixel = false;
    for (let i = 3; i < id.data.length; i += 4) {
      if (id.data[i] > 20) hasPixel = true;
    }
    if (!hasPixel) continue;
    const meta: PartMeta = {
      ...DEFAULT_PART_META[r.part],
      bbox: { x, y, w: cw, h: ch },
    };
    parts.push({
      part: r.part,
      fileDataUrl: partCanvas.toDataURL('image/png'),
      meta,
    });
  }
  return parts;
}

export function clampRotation(
  part: BodyPart,
  deg: number,
  meta?: PartMeta,
): number {
  const c = meta?.constraints ?? DEFAULT_PART_META[part]?.constraints;
  if (!c) return deg;
  return Math.min(c.max_deg, Math.max(c.min_deg, deg));
}

export function partLabelColor(part: BodyPart): string {
  return PART_COLORS[part] ?? '#888';
}
