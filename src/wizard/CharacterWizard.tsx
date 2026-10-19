import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Stage, Layer, Image as KonvaImage, Group, Circle, Text, Rect } from 'react-konva';
import { useCharacterEngine, activeDraft, WIZARD_STAGES } from '../character/engineStore';
import {
  BodyPart,
  CharacterView,
  VIEWS,
  WIZARD_STAGES as STAGES,
  BODY_PARTS,
  DEFAULT_PART_META,
} from '../character/types';
import { loadImage } from '../character/pipeline';

function useHtmlImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement>();
  useMemo(() => {
    if (!src) {
      setImg(undefined);
      return;
    }
    let cancelled = false;
    loadImage(src).then((i) => {
      if (!cancelled) setImg(i);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);
  return img;
}

const STAGE_LABEL: Record<string, string> = {
  import: '1 · Import',
  clean: '2 · Clean',
  segment: '3 · Segment',
  repair: '4 · Repair',
  rig: '5 · Rig',
  expressions: '6 · Expressions',
  publish: '7 · Publish',
};

export default function CharacterWizard({
  onClose,
  onPublished,
}: {
  onClose: () => void;
  onPublished: (payload: {
    libraryAssetId: string;
    name: string;
    draftId: string;
    thumb?: string;
    expressions: { name: string; fileDataUrl: string }[];
  }) => void;
}) {
  const eng = useCharacterEngine();
  const draft = activeDraft(eng);
  const [newName, setNewName] = useState('Arlo');
  const [tolerance, setTolerance] = useState(42);
  const [exprName, setExprName] = useState('happy');
  const fileRef = useRef<HTMLInputElement>(null);

  const angle = draft?.angles[draft.activeView];
  const previewSrc = angle?.cleanDataUrl || angle?.sourceDataUrl;
  const previewImg = useHtmlImage(previewSrc);

  async function onUpload(view: CharacterView, files: FileList | null) {
    if (!files?.[0] || !draft) return;
    const file = files[0];
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    });
    const img = await loadImage(dataUrl);
    eng.addAngleSource(view, dataUrl, img.naturalWidth, img.naturalHeight);
  }

  async function onExprFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    });
    eng.addExpression(exprName || file.name, dataUrl);
  }

  function goPublish() {
    const result = eng.publish();
    if (!result) return;
    const { libraryAssetId, draft: d } = result;
    const thumb =
      d.angles.front?.cleanDataUrl ||
      d.angles.front?.sourceDataUrl ||
      d.angles[d.activeView]?.sourceDataUrl;
    onPublished({
      libraryAssetId,
      name: d.name,
      draftId: d.id,
      thumb,
      expressions: d.expressions.map((x) => ({
        name: x.name,
        fileDataUrl: x.fileDataUrl,
      })),
    });
  }

  return (
    <div className="wizard-overlay">
      <div className="wizard">
        <header className="wizard-top">
          <strong>Character Preparation Wizard</strong>
          <span className="muted">Phase 1–4 · static comic only</span>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="wizard-rail">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              className={draft?.stage === s ? 'active' : ''}
              disabled={!draft}
              onClick={() => eng.setStage(s)}
            >
              {STAGE_LABEL[s]}
            </button>
          ))}
        </div>

        <div className="wizard-body">
          <aside className="wizard-side">
            <h4>Drafts</h4>
            <div className="draft-list">
              {eng.drafts.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={d.id === eng.activeDraftId ? 'active' : ''}
                  onClick={() => eng.selectDraft(d.id)}
                >
                  {d.name}
                  <small>
                    {d.status} · {d.stage}
                  </small>
                </button>
              ))}
            </div>
            <div className="row">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" />
              <button type="button" className="primary" onClick={() => eng.createDraft(newName)}>
                New
              </button>
            </div>
            {draft && (
              <>
                <label>Rename</label>
                <input
                  value={draft.name}
                  onChange={(e) => eng.renameDraft(draft.id, e.target.value)}
                />
                <button type="button" className="danger" onClick={() => eng.deleteDraft(draft.id)}>
                  Delete draft
                </button>
              </>
            )}
            <p className="tip">{eng.message}</p>
            {eng.busy && <p className="muted">Working…</p>}
          </aside>

          <section className="wizard-main">
            {!draft && <p className="muted">Create or select a character draft to begin.</p>}

            {draft && draft.stage === 'import' && (
              <div>
                <h3>Import multi-angle sources</h3>
                <p className="muted">Preserve originals. Tag each view. Minimum: front (+ side recommended).</p>
                <div className="view-grid">
                  {VIEWS.map((v) => (
                    <label key={v} className="view-card">
                      <strong>{v}</strong>
                      {draft.angles[v] ? (
                        <img src={draft.angles[v]!.sourceDataUrl} alt={v} />
                      ) : (
                        <span className="muted">No image</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void onUpload(v, e.target.files)}
                      />
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  className="primary"
                  disabled={!draft.angles.front}
                  onClick={() => eng.setStage('clean')}
                >
                  Next: Clean
                </button>
              </div>
            )}

            {draft && draft.stage === 'clean' && (
              <div>
                <h3>Clean — background removal</h3>
                <div className="row">
                  <label>
                    Active view{' '}
                    <select
                      value={draft.activeView}
                      onChange={(e) => eng.setActiveView(e.target.value as CharacterView)}
                    >
                      {VIEWS.filter((v) => draft.angles[v]).map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Tolerance {tolerance}
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={tolerance}
                      onChange={(e) => setTolerance(Number(e.target.value))}
                    />
                  </label>
                  <button type="button" className="primary" disabled={eng.busy} onClick={() => void eng.runClean(tolerance)}>
                    Run clean
                  </button>
                </div>
                <div className="compare">
                  {angle?.sourceDataUrl && (
                    <div>
                      <span>Source</span>
                      <img src={angle.sourceDataUrl} alt="source" />
                    </div>
                  )}
                  {angle?.cleanDataUrl && (
                    <div>
                      <span>Clean</span>
                      <img src={angle.cleanDataUrl} alt="clean" className="checker" />
                    </div>
                  )}
                </div>
                <p className="tip">
                  MVP uses corner-color sampling (client-side). For production, swap pipeline for BiRefNet/RemBG worker — same draft fields.
                </p>
                <button type="button" onClick={() => eng.setStage('segment')} disabled={!angle?.cleanDataUrl && !angle?.sourceDataUrl}>
                  Next: Segment
                </button>
              </div>
            )}

            {draft && draft.stage === 'segment' && (
              <div>
                <h3>Segment — body parts</h3>
                <button type="button" className="primary" disabled={eng.busy} onClick={() => void eng.runSegment()}>
                  Run heuristic segment
                </button>
                <div className="part-grid">
                  {(angle?.parts ?? []).map((p) => (
                    <div key={p.part} className="part-card">
                      <img src={p.fileDataUrl} alt={p.part} className="checker" />
                      <span>{p.part}</span>
                    </div>
                  ))}
                </div>
                <p className="tip">Heuristic bands only — repair pivots next. Manual paint tools can extend this step later.</p>
                <button type="button" onClick={() => eng.setStage('repair')} disabled={!angle?.parts?.length}>
                  Next: Repair
                </button>
              </div>
            )}

            {draft && draft.stage === 'repair' && (
              <div>
                <h3>Repair — pivots & hierarchy</h3>
                <table className="meta-table">
                  <thead>
                    <tr>
                      <th>Part</th>
                      <th>Pivot X</th>
                      <th>Pivot Y</th>
                      <th>Parent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(angle?.parts ?? []).map((p) => (
                      <tr key={p.part}>
                        <td>{p.part}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={1}
                            step={0.01}
                            value={p.meta.pivot[0]}
                            onChange={(e) =>
                              eng.updatePartPivot(p.part, [Number(e.target.value), p.meta.pivot[1]])
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={1}
                            step={0.01}
                            value={p.meta.pivot[1]}
                            onChange={(e) =>
                              eng.updatePartPivot(p.part, [p.meta.pivot[0], Number(e.target.value)])
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={p.meta.parent_part ?? ''}
                            onChange={(e) =>
                              eng.updatePartParent(
                                p.part,
                                (e.target.value || null) as BodyPart | null,
                              )
                            }
                          >
                            <option value="">(root)</option>
                            {BODY_PARTS.filter((b) => b !== p.part).map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={() => eng.setStage('rig')}>
                  Next: Rig / Pose
                </button>
              </div>
            )}

            {draft && draft.stage === 'rig' && (
              <div className="rig-layout">
                <div>
                  <h3>Rig — FK pose test</h3>
                  <RigPreview
                    parts={angle?.parts ?? []}
                    workPose={eng.workPose}
                    previewImg={previewImg}
                  />
                </div>
                <div>
                  <h4>Joints</h4>
                  {(['head', 'upper_arm_l', 'lower_arm_l', 'upper_arm_r', 'lower_arm_r', 'upper_leg_l', 'lower_leg_l', 'upper_leg_r', 'lower_leg_r'] as BodyPart[]).map(
                    (part) => (
                      <div key={part}>
                        <label>
                          {part} {eng.workPose[part] ?? 0}°
                        </label>
                        <input
                          type="range"
                          min={-120}
                          max={145}
                          value={eng.workPose[part] ?? 0}
                          onChange={(e) => eng.setWorkPosePart(part, Number(e.target.value))}
                        />
                      </div>
                    ),
                  )}
                  <div className="row">
                    <button type="button" onClick={() => eng.resetWorkPose()}>
                      Reset pose
                    </button>
                    <button type="button" className="primary" onClick={() => eng.savePosePreset(`Pose ${draft.poses.length + 1}`)}>
                      Save pose preset
                    </button>
                  </div>
                  <ul className="pose-list">
                    {draft.poses.map((p) => (
                      <li key={p.id}>
                        <button type="button" onClick={() => eng.loadPosePreset(p.id)}>
                          Load {p.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => eng.setStage('expressions')}>
                    Next: Expressions
                  </button>
                </div>
              </div>
            )}

            {draft && draft.stage === 'expressions' && (
              <div>
                <h3>Expression packs</h3>
                <p className="muted">Upload whole-face variants (≥5 target). Swap does not move limbs.</p>
                <div className="row">
                  <input value={exprName} onChange={(e) => setExprName(e.target.value)} placeholder="preset name" />
                  <label className="filebutton inlinefile">
                    Upload face
                    <input type="file" accept="image/*" onChange={(e) => void onExprFile(e)} />
                  </label>
                </div>
                <div className="part-grid">
                  {draft.expressions.map((ex) => (
                    <div key={ex.id} className="part-card">
                      {ex.fileDataUrl ? (
                        <img src={ex.fileDataUrl} alt={ex.name} />
                      ) : (
                        <span className="muted">placeholder</span>
                      )}
                      <span>{ex.name}</span>
                      <button type="button" onClick={() => eng.removeExpression(ex.id)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => eng.setStage('publish')}>
                  Next: Publish
                </button>
              </div>
            )}

            {draft && draft.stage === 'publish' && (
              <div>
                <h3>Validate & publish</h3>
                <ul className="checklist">
                  <li>Front source: {draft.angles.front ? 'yes' : 'missing'}</li>
                  <li>Parts: {draft.angles.front?.parts?.length ?? 0}</li>
                  <li>Poses: {draft.poses.length}</li>
                  <li>Expressions: {draft.expressions.length}</li>
                  <li>Status: {draft.status}</li>
                </ul>
                <button type="button" className="primary" onClick={goPublish}>
                  Publish to Library
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function RigPreview({
  parts,
  workPose,
  previewImg,
}: {
  parts: { part: BodyPart; fileDataUrl: string; meta: typeof DEFAULT_PART_META['body'] }[];
  workPose: Partial<Record<BodyPart, number>>;
  previewImg?: HTMLImageElement;
}) {
  const [partImgs, setPartImgs] = useState<Partial<Record<BodyPart, HTMLImageElement>>>({});
  useMemo(() => {
    let cancelled = false;
    (async () => {
      const map: Partial<Record<BodyPart, HTMLImageElement>> = {};
      for (const p of parts) {
        try {
          map[p.part] = await loadImage(p.fileDataUrl);
        } catch {
          /* skip */
        }
      }
      if (!cancelled) setPartImgs(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [parts]);

  const W = 320;
  const H = 420;

  // Simple stacked preview with rotations (not full hierarchy matrix — readable MVP)
  const order = [...parts].sort((a, b) => a.meta.layer - b.meta.layer);

  return (
    <div className="rig-stage">
      <Stage width={W} height={H}>
        <Layer>
          <Rect width={W} height={H} fill="#1a222b" />
          {previewImg && (
            <KonvaImage
              image={previewImg}
              x={40}
              y={20}
              width={240}
              height={360}
              opacity={0.15}
            />
          )}
          {order.map((p) => {
            const im = partImgs[p.part];
            if (!im) return null;
            const bbox = p.meta.bbox;
            const scale = 240 / (previewImg?.naturalWidth || 240);
            const x = 40 + (bbox?.x ?? 0) * scale;
            const y = 20 + (bbox?.y ?? 0) * scale;
            const pw = (bbox?.w ?? im.naturalWidth) * scale;
            const ph = (bbox?.h ?? im.naturalHeight) * scale;
            const px = p.meta.pivot[0] * pw;
            const py = p.meta.pivot[1] * ph;
            const rot = workPose[p.part] ?? 0;
            return (
              <Group key={p.part} x={x + px} y={y + py} rotation={rot}>
                <KonvaImage image={im} x={-px} y={-py} width={pw} height={ph} />
                <Circle radius={3} fill="#66d8d1" />
              </Group>
            );
          })}
          <Text text="FK preview (pivot = cyan)" x={8} y={H - 18} fontSize={11} fill="#8aa" />
        </Layer>
      </Stage>
    </div>
  );
}
