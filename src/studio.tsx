import { useEffect, useRef, useState, type DragEvent } from 'react';
import { Stage, Layer, Rect, Group, Circle, Line, Text, Image as KonvaImage } from 'react-konva';
import { useStudio, currentPanel, selectedInstance, expressionColor } from './store';
import { Asset, EXPRESSIONS, Instance, PartPose } from './types';
import CharacterWizard from './wizard/CharacterWizard';
import AuthBar from './components/AuthBar';

const W = 960;
const H = 540;

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function useImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement>();
  useEffect(() => {
    if (!src) {
      setImg(undefined);
      return;
    }
    const i = new window.Image();
    i.onload = () => setImg(i);
    i.src = src;
    return () => {
      i.onload = null;
    };
  }, [src]);
  return img;
}

function SampleCharacter({
  o,
  name,
  selected,
  onPick,
  onMove,
}: {
  o: Instance;
  name: string;
  selected: boolean;
  onPick: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const color = name === 'Unma' ? '#b67c67' : name === 'Bako' ? '#73906e' : '#527aa0';
  const expr = expressionColor(o.expression);
  const p = o.pose;
  return (
    <Group
      x={o.x}
      y={o.y}
      scaleX={o.scale}
      scaleY={o.scale}
      rotation={o.rotation}
      draggable
      onClick={onPick}
      onTap={onPick}
      onDragEnd={(e) => onMove(e.target.x(), e.target.y())}
    >
      {o.shadow && <Circle x={0} y={0} radius={37} scaleY={0.17} fill="#132027" opacity={0.24} />}
      <Group x={-13} y={-67} rotation={p.leftLeg}>
        <Rect x={-7} y={0} width={13} height={64} cornerRadius={7} fill="#33445c" />
      </Group>
      <Group x={13} y={-67} rotation={p.rightLeg}>
        <Rect x={-6} y={0} width={13} height={64} cornerRadius={7} fill="#33445c" />
      </Group>
      <Rect x={-22} y={-119} width={44} height={57} cornerRadius={10} fill={color} />
      <Group x={-19} y={-111} rotation={p.leftArm}>
        <Rect x={-12} y={0} width={14} height={60} cornerRadius={8} fill={color} />
      </Group>
      <Group x={19} y={-111} rotation={p.rightArm}>
        <Rect x={-2} y={0} width={14} height={60} cornerRadius={8} fill={color} />
      </Group>
      <Group x={0} y={-143} rotation={p.head}>
        <Circle radius={24} fill="#e8bc97" />
        <Circle x={-9} y={-3} radius={3} fill={expr} />
        <Circle x={9} y={-3} radius={3} fill={expr} />
        {o.expression === 'shocked' ? (
          <Circle x={0} y={11} radius={6} fill="#543d39" />
        ) : (
          <Line
            points={[-8, 11, 0, o.expression === 'happy' ? 18 : 13, 8, 11]}
            stroke={o.expression === 'angry' ? '#a44242' : '#543d39'}
            strokeWidth={3}
            tension={0.5}
          />
        )}
      </Group>
      {selected && (
        <Rect x={-38} y={-171} width={76} height={175} stroke="#66d8d1" dash={[5, 3]} strokeWidth={1.5} />
      )}
      <Text text={name} x={-50} y={8} width={100} align="center" fontSize={13} fill="#26303f" />
    </Group>
  );
}

function Placed({
  o,
  asset,
  selected,
  onPick,
  onMove,
}: {
  o: Instance;
  asset?: Asset;
  selected: boolean;
  onPick: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const img = useImage(asset?.source);
  const face = useImage(asset?.expressions?.[o.expression]);

  if (img && asset?.kind === 'character') {
    return (
      <Group
        x={o.x}
        y={o.y}
        scaleX={o.scale}
        scaleY={o.scale}
        draggable
        onClick={onPick}
        onTap={onPick}
        onDragEnd={(e) => onMove(e.target.x(), e.target.y())}
      >
        {o.shadow && <Circle radius={35} scaleY={0.18} fill="#000" opacity={0.2} />}
        <KonvaImage image={img} x={-65} y={-140} width={130} height={140} />
        {face && <KonvaImage image={face} x={-40} y={-150} width={80} height={70} />}
        {selected && <Rect x={-65} y={-140} width={130} height={140} stroke="#66d8d1" dash={[5, 4]} />}
      </Group>
    );
  }
  if (img) {
    return (
      <Group
        x={o.x}
        y={o.y}
        scaleX={o.scale}
        scaleY={o.scale}
        draggable
        onClick={onPick}
        onTap={onPick}
        onDragEnd={(e) => onMove(e.target.x(), e.target.y())}
      >
        {o.shadow && <Circle radius={35} scaleY={0.18} fill="#000" opacity={0.2} />}
        <KonvaImage image={img} x={-65} y={-140} width={130} height={140} />
        {selected && <Rect x={-65} y={-140} width={130} height={140} stroke="#66d8d1" dash={[5, 4]} />}
      </Group>
    );
  }
  if (asset?.kind === 'prop') {
    return (
      <Group x={o.x} y={o.y} draggable onClick={onPick} onDragEnd={(e) => onMove(e.target.x(), e.target.y())}>
        <Rect x={-25} y={-80} width={50} height={80} cornerRadius={6} fill="#577f5b" />
        <Text text={asset.name} x={-48} y={4} width={96} align="center" fill="#26303f" />
      </Group>
    );
  }
  return (
    <SampleCharacter
      o={o}
      name={asset?.name.split(' ')[0] || 'Character'}
      selected={selected}
      onPick={onPick}
      onMove={onMove}
    />
  );
}

export default function Studio() {
  const s = useStudio();
  const panel = currentPanel(s);
  const selected = selectedInstance(s);
  const asset = s.assets.find((a) => a.id === selected?.assetId);
  const bg = useImage(panel.background);
  const stageRef = useRef<{ toDataURL: (o: { pixelRatio: number }) => string } | null>(null);
  const [notice, setNotice] = useState('Ready · Supabase + Character Engine');
  const [mode, setMode] = useState<'object' | 'pose'>('object');
  const [wizardOpen, setWizardOpen] = useState(false);

  async function addFiles(files: FileList | null, kind: 'character' | 'background' | 'prop') {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const src = await fileToDataURL(file);
      const newAsset: Asset = { id: crypto.randomUUID(), name: file.name, kind, source: src };
      s.addAsset(newAsset);
      if (kind === 'background') s.setBackground(src);
    }
    setNotice('Image imported');
  }

  function drop(e: DragEvent) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/asset-id');
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * W;
    const y = ((e.clientY - bounds.top) / bounds.height) * H;
    const found = s.assets.find((a) => a.id === id);
    if (found?.kind === 'background' && found.source) s.setBackground(found.source);
    else if (id) s.drop(id, x, y);
  }

  function downloadProject() {
    const manifest = { format: 'modular-2d-comic-project', version: 1, assets: s.assets, panels: s.panels };
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modular-comic-project.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Project downloaded');
  }

  async function importProject(file?: File) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (
        data.format !== 'modular-2d-comic-project' ||
        data.version !== 1 ||
        !Array.isArray(data.assets) ||
        !Array.isArray(data.panels) ||
        !data.panels.length
      )
        throw new Error('Invalid project format');
      s.loadProject(data.assets, data.panels);
      setNotice('Project restored');
    } catch (err) {
      setNotice('Import failed: ' + String(err));
    }
  }

  function exportPNG() {
    const url = stageRef.current?.toDataURL({ pixelRatio: 2 });
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = panel.name.replace(/\s+/g, '-') + '.png';
    a.click();
    setNotice('PNG exported');
  }

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        e.shiftKey ? s.redo() : s.undo();
      }
      if (e.key === 'Delete' && s.selected) s.remove();
    };
    document.addEventListener('keydown', cb);
    return () => document.removeEventListener('keydown', cb);
  }, [s]);

  return (
    <main className="app">
      {wizardOpen && (
        <CharacterWizard
          onClose={() => setWizardOpen(false)}
          onPublished={({ libraryAssetId, name, thumb, expressions }) => {
            const exprMap: NonNullable<Asset['expressions']> = {};
            for (const ex of expressions) {
              if (ex.fileDataUrl) {
                exprMap[ex.name as keyof typeof exprMap] = ex.fileDataUrl;
              }
            }
            s.addAsset({
              id: libraryAssetId,
              name: name + ' (published)',
              kind: 'character',
              source: thumb,
              expressions: exprMap,
            });
            setWizardOpen(false);
            setNotice(`Published “${name}” → Library`);
          }}
        />
      )}
      <header className="top">
        <strong>◈ Modular 2D Studio</strong>
        <span>Project / {panel.name}</span>
        <div className="toolbar">
          <AuthBar />
          <button type="button" className="primary" onClick={() => setWizardOpen(true)}>
            Character Wizard
          </button>
          <button type="button" onClick={() => s.undo()}>
            ↶ Undo
          </button>
          <button type="button" onClick={() => s.redo()}>
            ↷ Redo
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('comic-prototype', JSON.stringify(s.panels));
              setNotice('Layout saved locally');
            }}
          >
            Save
          </button>
          <button type="button" onClick={downloadProject}>
            Download Project
          </button>
          <label className="filebutton inlinefile">
            Import Project
            <input
              type="file"
              accept="application/json,.json"
              onChange={(e) => void importProject(e.target.files?.[0])}
            />
          </label>
          <button type="button" className="primary" onClick={exportPNG}>
            Export PNG
          </button>
        </div>
      </header>
      <section className="workspace">
        <aside className="library">
          <h3>Asset Library</h3>
          <p className="muted">Drag onto canvas · Character Wizard · Supabase sync when signed in</p>
          <div className="assetList">
            {s.assets
              .filter((a) => a.kind !== 'background')
              .map((a) => (
                <div
                  key={a.id}
                  className="asset"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/asset-id', a.id)}
                >
                  <div className="thumb">
                    {a.source ? <img src={a.source} alt="" /> : a.kind === 'character' ? '♟' : '♣'}
                  </div>
                  <span>{a.name}</span>
                  <button type="button" title="Add to panel" onClick={() => s.drop(a.id, 480, 300)}>
                    ＋
                  </button>
                </div>
              ))}
          </div>
          <button type="button" className="filebutton" onClick={() => setWizardOpen(true)}>
            Open Character Wizard (Phase 1–4)
          </button>
          <label className="filebutton">
            Quick import character
            <input type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files, 'character')} />
          </label>
          <label className="filebutton">
            Import Prop
            <input type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files, 'prop')} />
          </label>
          <label className="filebutton">
            Set Background
            <input type="file" accept="image/*" onChange={(e) => addFiles(e.target.files, 'background')} />
          </label>
        </aside>
        <div className="center">
          <div className="canvas-tools">
            <button type="button" className={mode === 'object' ? 'active' : ''} onClick={() => setMode('object')}>
              Object Mode
            </button>
            <button type="button" className={mode === 'pose' ? 'active' : ''} onClick={() => setMode('pose')}>
              Pose Mode
            </button>
            <span>960 × 540</span>
          </div>
          <div className="canvaswrap" onDragOver={(e) => e.preventDefault()} onDrop={drop}>
            <Stage
              width={W}
              height={H}
              ref={stageRef as never}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) s.select(undefined);
              }}
            >
              <Layer>
                <Rect width={W} height={H} fill="#e5dfd1" />
                {bg && <KonvaImage image={bg} width={W} height={H} />}
                <Line points={[0, 455, W, 455]} stroke="#83a89d" dash={[8, 6]} opacity={0.6} />
                {panel.objects
                  .slice()
                  .sort((a, b) => a.layer - b.layer)
                  .map((o) => (
                    <Placed
                      key={o.id}
                      o={o}
                      asset={s.assets.find((a) => a.id === o.assetId)}
                      selected={s.selected === o.id}
                      onPick={() => s.select(o.id)}
                      onMove={(x, y) => s.update(o.id, { x, y })}
                    />
                  ))}
              </Layer>
            </Stage>
          </div>
          <div className="bottom">
            <div className="paneltop">
              <strong>Comic Panels</strong>
              <button type="button" onClick={() => s.addPanel()}>
                ＋ Add panel
              </button>
              <button
                type="button"
                onClick={() => {
                  const raw = localStorage.getItem('comic-prototype');
                  if (raw) {
                    s.load(JSON.parse(raw));
                    setNotice('Layout loaded');
                  }
                }}
              >
                Load layout
              </button>
            </div>
            <div className="panelstrip">
              {s.panels.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={p.id === s.active ? 'active' : ''}
                  onClick={() => s.selectPanel(p.id)}
                >
                  {p.name}
                  <small>{p.objects.length} objects</small>
                </button>
              ))}
            </div>
          </div>
        </div>
        <aside className="inspector">
          <h3>Inspector</h3>
          {selected ? (
            <>
              <strong>{asset?.name}</strong>
              <label>Expression</label>
              <div className="expressions">
                {EXPRESSIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    className={selected.expression === e ? 'active' : ''}
                    onClick={() => s.update(selected.id, { expression: e })}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <label>Scale {selected.scale.toFixed(2)}</label>
              <input
                type="range"
                min={0.3}
                max={2.5}
                step={0.05}
                value={selected.scale}
                onChange={(e) => s.update(selected.id, { scale: Number(e.target.value) })}
              />
              <label>Auto contact shadow</label>
              <input
                type="checkbox"
                checked={selected.shadow}
                onChange={(e) => s.update(selected.id, { shadow: e.target.checked })}
              />
              {mode === 'pose' && asset?.kind === 'character' && (
                <>
                  <h4>Joint Rotation</h4>
                  {(Object.keys(selected.pose) as (keyof PartPose)[]).map((part) => (
                    <div key={part}>
                      <label>
                        {part} {selected.pose[part]}°
                      </label>
                      <input
                        type="range"
                        min={-120}
                        max={120}
                        value={selected.pose[part]}
                        onChange={(e) =>
                          s.update(selected.id, {
                            pose: { ...selected.pose, [part]: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                  ))}
                </>
              )}
              <button type="button" className="danger" onClick={() => s.remove()}>
                Remove instance
              </button>
            </>
          ) : (
            <p className="muted">Select a character or prop. Use Character Wizard to build modular rigs.</p>
          )}
          <div className="status">{notice}</div>
        </aside>
      </section>
    </main>
  );
}
