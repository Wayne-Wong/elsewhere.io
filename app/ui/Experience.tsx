'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronRight,
  Download,
  Heart,
  Menu,
  Orbit,
  Shuffle,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  GitBranch,
  Wallet,
  Compass,
  X,
  Flame,
  Feather,
  Anchor,
  Wind,
  Leaf,
  CircleHelp,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Cosmos from './Cosmos';
import Avatar, {
  characters,
  looks,
  charms,
  defaultAppearance,
  validAppearance,
  type Appearance,
} from './Avatar';
import LifeMap from './LifeMap';
import useAmbientScore from './useAmbientScore';
import { choiceThemes } from '../content/choice-themes';
import { chapters, constellations, events, forces } from '../content/world';
import {
  begin,
  choose,
  clock,
  ancestry,
  fork,
  validSave,
  TOTAL,
  type Save,
} from '../engine/life';

type Screen = 'landing' | 'setup' | 'play' | 'overview';
const icons = [Orbit, Sparkles, Sun, Heart, GitBranch, Compass];
const money = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
const SAVE_KEY = 'elsewhere.life.v1';
function ConstellationArt({
  index,
  selected,
}: {
  index: number;
  selected: boolean;
}) {
  const points = [
    [
      [22, 68],
      [44, 25],
      [63, 57],
      [88, 33],
    ],
    [
      [22, 31],
      [39, 65],
      [70, 20],
      [82, 72],
    ],
    [
      [20, 52],
      [42, 22],
      [76, 31],
      [80, 72],
      [45, 78],
    ],
    [
      [22, 26],
      [28, 73],
      [73, 66],
      [83, 23],
    ],
    [
      [20, 68],
      [40, 30],
      [58, 73],
      [84, 38],
    ],
    [
      [17, 75],
      [38, 58],
      [59, 38],
      [87, 21],
    ],
  ][index];
  return (
    <svg
      className={'constellation-art ' + (selected ? 'lit' : '')}
      viewBox="0 0 106 100"
      aria-hidden="true"
    >
      <path
        d={points.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth=".7"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p[0]}
            cy={p[1]}
            r={i === 1 ? 3 : 1.8}
            fill="currentColor"
          />
          <circle
            cx={p[0]}
            cy={p[1]}
            r={i === 1 ? 9 : 5}
            stroke="currentColor"
            strokeOpacity=".12"
            fill="none"
          />
        </g>
      ))}
    </svg>
  );
}
export default function Experience() {
  const [screen, setScreen] = useState<Screen>('landing'),
    [save, setSave] = useState<Save | null>(null),
    [origin, setOrigin] = useState<number[]>([-1, -1, -1, -1, -1, -1]),
    [category, setCategory] = useState(0),
    [motion, setMotion] = useState(true),
    [sound, setSound] = useState(false),
    [modal, setModal] = useState<'menu' | 'character' | 'about' | null>(null),
    [burst, setBurst] = useState(0),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(''),
    [appearance, setAppearance] = useState<Appearance>(defaultAppearance);
  const saveRef = useRef(save);
  saveRef.current = save;
  const busyRef = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [appearanceReady, setAppearanceReady] = useState(false);
  useAmbientScore(sound);
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem('elsewhere.appearance.v1') || 'null',
      );
      if (validAppearance(stored)) setAppearance(stored);
    } catch {}
    setAppearanceReady(true);
  }, []);
  useEffect(() => {
    if (appearanceReady) {
      try {
        localStorage.setItem(
          'elsewhere.appearance.v1',
          JSON.stringify(appearance),
        );
      } catch {}
    }
  }, [appearance, appearanceReady]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    setMotion(!media.matches);
    const change = () => setMotion(!media.matches);
    media.addEventListener('change', change);
    try {
      const text = localStorage.getItem(SAVE_KEY);
      if (text) {
        const stored = JSON.parse(text);
        if (validSave(stored)) setSave(stored);
        else
          setNotice(
            'Your saved life could not be loaded. You can begin another.',
          );
      }
    } catch {
      setNotice(
        'Saving is unavailable in this browser. You can still explore.',
      );
    }
    return () => {
      media.removeEventListener('change', change);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!save) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch {
      setNotice(
        'This life could not be saved on this device. Export it from the menu.',
      );
    }
  }, [save]);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(''), 6500);
    return () => clearTimeout(id);
  }, [notice]);
  useEffect(() => {
    if (screen !== 'landing') heading.current?.focus({ preventScroll: true });
  }, [screen, save?.tip, category]);
  const transition = useCallback(
    (work: () => void) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setBurst(performance.now());
      timer.current = setTimeout(
        () => {
          work();
          setBusy(false);
          busyRef.current = false;
        },
        motion ? 650 : 0,
      );
    },
    [motion],
  );
  const commit = useCallback(
    (index: number, base?: Save) => {
      const s = base || saveRef.current;
      if (!s || busyRef.current) return;
      const next = choose(s, index);
      transition(() => {
        setSave(next);
        setScreen('play');
      });
    },
    [transition],
  );
  const start = () => {
    const resolved = origin.map((x) =>
      x < 0 ? Math.floor(Math.random() * 3) : x,
    );
    setOrigin(resolved);
    const next = begin(resolved, crypto.getRandomValues(new Uint32Array(1))[0]);
    transition(() => {
      setSave(next);
      setScreen('play');
    });
  };
  const configure = () => {
    setModal(null);
    setOrigin([-1, -1, -1, -1, -1, -1]);
    setCategory(0);
    transition(() => setScreen('setup'));
  };
  const actionRef = useRef({ commit, screen, save });
  actionRef.current = { commit, screen, save };
  useEffect(() => {
    type Tool = {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    };
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (t: Tool, o: { signal: AbortSignal }) => unknown;
        };
      }
    ).modelContext;
    if (!context) return;
    const lifecycle = new AbortController();
    const tool: Tool = {
      name: 'read_elsewhere_life',
      description:
        'Read the current life, age, scene, and available choice indexes.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => {
        const a = actionRef.current,
          s = a.save,
          n = s?.nodes[s.tip];
        return {
          screen: a.screen,
          age: n ? clock(n.state.step).age : null,
          scene: events.find((e) => e.id === n?.eventId) || null,
        };
      },
    };
    const choiceTool: Tool = {
      name: 'choose_elsewhere_path',
      description:
        'Commit an available choice in the current playable scene. Advances the life.',
      inputSchema: {
        type: 'object',
        properties: {
          choiceIndex: { type: 'integer', minimum: 0, maximum: 2 },
        },
        required: ['choiceIndex'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: async (input) => {
        const i = (input as { choiceIndex?: unknown })?.choiceIndex;
        if (
          typeof i !== 'number' ||
          !Number.isInteger(i) ||
          i < 0 ||
          i > 2 ||
          actionRef.current.screen !== 'play' ||
          busyRef.current ||
          !actionRef.current.save?.nodes[actionRef.current.save.tip].eventId
        )
          throw new Error('No such available choice');
        actionRef.current.commit(i);
        await new Promise((r) => setTimeout(r, 750));
        return { tip: saveRef.current?.tip };
      },
    };
    try {
      for (const t of [tool, choiceTool])
        void Promise.resolve(
          context.registerTool(t, { signal: lifecycle.signal }),
        ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, []);
  const download = (text: string, type: string, name: string) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const exportLife = () => {
    if (save)
      download(
        JSON.stringify(save, null, 2),
        'application/json',
        'elsewhere-life.json',
      );
  };
  const exportArt = () => {
    if (!save) return;
    const path = ancestry(save);
    const xml = (s: string) =>
      s.replace(
        /[&<>"']/g,
        (c) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;',
          })[c]!,
      );
    const pts = path.map((_, i) => ({
      x: 75 + (i / Math.max(path.length - 1, 1)) * 1050,
      y: 360 + Math.sin(i * 1.4) * 100,
    }));
    const art = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#080a0d"/><text x="70" y="85" fill="#e9c27b" font-family="Georgia" font-size="28">elsewhere ✦</text><text x="70" y="180" fill="#f4efe4" font-family="Georgia" font-size="62">A constellation of becoming.</text><text x="70" y="224" fill="#a9a499" font-family="Arial" font-size="18">${path.length - 1} choices · ${path[path.length - 1].state.keepsakes.length} keepsakes · a life still full of possibility</text><path d="${pts.map((p, i) => (i ? 'L' : 'M') + p.x + ' ' + p.y).join(' ')}" stroke="#d7ae6b" stroke-width="1" fill="none"/>${pts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#f2cd8a"/>`).join('')}${path
      .slice(-3)
      .map(
        (n, i) =>
          `<text x="70" y="${570 + i * 38}" fill="#c4b79e" font-family="Georgia" font-size="22">${xml(n.label)}</text>`,
      )
      .join(
        '',
      )}<text x="70" y="750" fill="#7c796f" font-family="Arial" font-size="12" letter-spacing="3">NO RIGHT ANSWERS. JUST DIFFERENT LIVES.</text></svg>`;
    download(art, 'image/svg+xml', 'my-elsewhere-constellation.svg');
  };
  const node = save?.nodes[save.tip];
  const state = node?.state;
  const stage = clock(state?.step || 0);
  const scene = events.find((e) => e.id === node?.eventId);
  const complete = !!state && state.step >= TOTAL;
  const selectedCount = origin.filter((x) => x >= 0).length;
  const currentConstellation = constellations[category];
  const CategoryIcon = icons[category];

  return (
    <main
      className={`universe screen-${screen} ${busy ? 'in-transition' : ''} ${motion ? '' : 'still'}`}
    >
      <Cosmos mode={screen} motion={motion} burst={burst} />
      <div className="wordmark">
        elsewhere<span>✦</span>
      </div>
      <button
        className="menu-trigger"
        onClick={() => setModal('menu')}
        aria-label="Open menu"
      >
        <Menu size={19} />
      </button>
      {screen !== 'landing' && screen !== 'setup' && (
        <button className="global-new-life" disabled={busy} onClick={configure}>
          <Shuffle size={15} />
          Begin another life
        </button>
      )}
      {screen === 'landing' && (
        <>
          <section className="landing">
            <div className="eyebrow">
              <span /> A SMALL EXPLORATION OF A BIG WHAT IF
            </div>
            <h1>
              Still <em>becoming.</em>
            </h1>
            <p>
              Somewhere, you took the other path.
              <br />
              Discover the lives waiting in your choices.
            </p>
            <div className="begin-wrap">
              <button
                disabled={busy}
                className="gold-button"
                onClick={
                  save ? () => transition(() => setScreen('play')) : configure
                }
              >
                {save ? 'Continue your life' : 'Begin a life'}
                <ArrowUpRight size={18} />
              </button>
              {save ? (
                <button className="new-life-button" onClick={configure}>
                  Begin another life
                </button>
              ) : (
                <span className="micro">
                  NO RIGHT ANSWERS. JUST DIFFERENT LIVES.
                </span>
              )}
            </div>
          </section>
          <div className="memory-tag tag-one">
            <i />
            you stayed for someone
          </div>
          <div className="memory-tag tag-two">
            <i />
            you followed a feeling
          </div>
          <div className="memory-tag tag-three">
            <i />
            you began again
          </div>
          <div className="landing-foot">
            <button
              onClick={() => setSound(!sound)}
              aria-label={sound ? 'Mute ambient sound' : 'Enable ambient sound'}
            >
              {sound ? <Volume2 size={14} /> : <VolumeX size={14} />} SOUND{' '}
              {sound ? 'ON' : 'OFF'}
            </button>
            <span>CHANCE SETS THE STAGE. YOU MAKE THE CHOICES.</span>
            <span>01 — ∞</span>
          </div>
        </>
      )}
      {screen === 'setup' && (
        <section className="setup page-enter">
          <div className="setup-heading">
            <div className="eyebrow">BEFORE THE FIRST CHOICE</div>
            <h1 ref={heading} tabIndex={-1}>
              Every life begins <em>somewhere.</em>
            </h1>
            <p>Choose the stars you are born under. The rest is unwritten.</p>
          </div>
          <div className="setup-body">
            <div className="constellation-wheel">
              <div className="orbit-ring ring-one" />
              <div className="orbit-ring ring-two" />
              <div className="wheel-center">
                <span>YOUR</span>
                <strong>beginning</strong>
                <small>{selectedCount} / 6 STARS ALIGNED</small>
              </div>
              {constellations.map((c, i) => {
                const a = (i * Math.PI) / 3 - Math.PI / 2;
                return (
                  <button
                    key={c.id}
                    aria-pressed={category === i}
                    aria-label={`${c.name}${origin[i] >= 0 ? ', selected' : ''}`}
                    className={`constellation-node ${category === i ? 'active' : ''} ${origin[i] >= 0 ? 'chosen' : ''}`}
                    style={{
                      left: `${50 + 38 * Math.cos(a)}%`,
                      top: `${50 + 38 * Math.sin(a)}%`,
                    }}
                    onClick={() => setCategory(i)}
                  >
                    <ConstellationArt
                      index={i}
                      selected={category === i || origin[i] >= 0}
                    />
                    <span>
                      {c.name}
                      {origin[i] >= 0 && <Check size={10} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="constellation-panel" key={category}>
              <div className="category-number">
                <CategoryIcon size={15} />
                <span>0{category + 1} / 06</span>
              </div>
              <h2>{currentConstellation.name}</h2>
              <p className="category-question">
                {currentConstellation.question}
              </p>
              <RadioGroup
                aria-label={currentConstellation.name}
                value={origin[category] < 0 ? '' : String(origin[category])}
                onValueChange={(v) =>
                  setOrigin((prev) =>
                    prev.map((x, i) => (i === category ? Number(v) : x)),
                  )
                }
                className="origin-options"
              >
                {currentConstellation.options.map((o, i) => (
                  <label
                    key={o[0]}
                    className={`origin-option ${origin[category] === i ? 'selected' : ''}`}
                  >
                    <RadioGroupItem value={String(i)} aria-label={o[0]} />
                    <span>
                      <strong>{o[0]}</strong>
                      <small>{o[1]}</small>
                    </span>
                  </label>
                ))}
              </RadioGroup>
              <div className="setup-actions">
                <button
                  className="text-button"
                  onClick={() => {
                    setOrigin(
                      constellations.map(() => Math.floor(Math.random() * 3)),
                    );
                    setCategory(5);
                  }}
                >
                  <Shuffle size={14} />
                  Leave it to chance
                </button>
                {selectedCount === 6 ? (
                  <button
                    disabled={busy}
                    className="gold-button"
                    onClick={start}
                  >
                    Enter your life
                    <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    className="small-next"
                    disabled={origin[category] < 0}
                    onClick={() => {
                      const next = origin.findIndex(
                        (x, i) => i > category && x < 0,
                      );
                      setCategory(
                        next < 0 ? origin.findIndex((x) => x < 0) : next,
                      );
                    }}
                  >
                    Next star
                    <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="setup-note">
            These are the beginnings of a fictional life. None of them defines
            its ending.
          </p>
        </section>
      )}
      {(screen === 'play' || screen === 'overview') &&
        save &&
        node &&
        state && (
          <>
            <aside className="chapter-rail" aria-label="Life chapters">
              <span className="rail-title">THE CHAPTERS</span>
              {chapters.map((c, i) => (
                <div
                  key={c.name}
                  className={`chapter ${stage.chapter === i ? 'current' : ''} ${stage.chapter > i ? 'past' : ''}`}
                  aria-current={stage.chapter === i ? 'step' : undefined}
                >
                  <i>{stage.chapter > i ? <Check size={8} /> : null}</i>
                  <span>
                    {c.name}
                    <small>{c.range}</small>
                  </span>
                </div>
              ))}
            </aside>
            <div className="play-top">
              <span className="eyebrow">
                {screen === 'overview'
                  ? 'THE LIVES WITHIN YOUR LIFE'
                  : `CHAPTER ${String(stage.chapter + 1).padStart(2, '0')} / 09`}
              </span>
              <button
                className="text-button"
                onClick={() => {
                  setScreen((prev) =>
                    prev === 'overview' ? 'play' : 'overview',
                  );
                }}
              >
                {screen === 'overview' ? (
                  <ArrowLeft size={14} />
                ) : (
                  <GitBranch size={14} />
                )}
                <span>
                  {screen === 'overview'
                    ? 'Return to this moment'
                    : 'See your life'}
                </span>
              </button>
            </div>
            {screen === 'play' && !complete && scene && (
              <section className="play-stage" key={node.id}>
                <div className="age-marker">
                  <span className="age-line" />
                  <div className="age-star">✦</div>
                  <span className="age-label">AGE {Math.floor(stage.age)}</span>
                </div>
                <div className="scene-copy">
                  <div className="eyebrow">{scene.theme}</div>
                  <h1 ref={heading} tabIndex={-1}>
                    {scene.title}
                    <em>.</em>
                  </h1>
                  <p>{scene.scene}</p>
                </div>
                <div className="choices-zone">
                  <svg
                    className="choice-connectors"
                    viewBox="0 0 900 85"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="4"
                        markerHeight="4"
                        orient="auto"
                      >
                        <path
                          d="M0 0 L10 5 L0 10"
                          fill="none"
                          stroke="#b89a69"
                        />
                      </marker>
                    </defs>
                    <path
                      d="M450 0 C450 40 150 20 150 80 M450 0 L450 80 M450 0 C450 40 750 20 750 80"
                      stroke="currentColor"
                      fill="none"
                      markerEnd="url(#arrow)"
                    />
                  </svg>
                  <div className="choice-grid">
                    {scene.choices.map((c, i) => (
                      <button
                        key={c.label}
                        className={`choice-card choice-${c.category}`}
                        disabled={busy}
                        onClick={() => commit(i)}
                        style={
                          {
                            animationDelay: `${i * 100}ms`,
                            '--choice-rgb': choiceThemes[c.category].rgb,
                            '--choice-color': choiceThemes[c.category].color,
                          } as React.CSSProperties
                        }
                      >
                        <span className="choice-number">
                          0{i + 1}
                          <ArrowUpRight size={16} />
                        </span>
                        <span className="choice-category">
                          {(() => {
                            const Icon = {
                              courage: Flame,
                              connection: Heart,
                              comfort: Leaf,
                              curiosity: Compass,
                              commitment: Anchor,
                              freedom: Wind,
                              release: Feather,
                            }[c.category];
                            return <Icon size={14} />;
                          })()}
                          {choiceThemes[c.category].label}
                        </span>
                        <strong>{c.label}</strong>
                        <span className="choice-hint">
                          {c.effect.cash && c.effect.cash < 0
                            ? `${money(Math.abs(c.effect.cash))} from your savings`
                            : choiceThemes[c.category].hint}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="last-memory" aria-live="polite">
                  {node.parent ? (
                    <>
                      <span>THE PATH SO FAR</span>
                      <p>“{node.outcome}”</p>
                    </>
                  ) : (
                    <p className="first-note">
                      You don’t have to see the whole path to take the first
                      step.
                    </p>
                  )}
                </div>
              </section>
            )}
            {screen === 'play' && complete && (
              <section className="ending page-enter">
                <div className="eyebrow">
                  44 MOMENTS. ONE EXTRAORDINARY ORDINARY LIFE.
                </div>
                <h1 ref={heading} tabIndex={-1}>
                  Look at all the ways
                  <br />
                  <em>you became yourself.</em>
                </h1>
                <p>
                  There were beginnings you couldn’t predict and people you
                  couldn’t have planned for. This is one constellation. There
                  are others.
                </p>
                <div className="ending-actions">
                  <button
                    className="gold-button"
                    onClick={() => setScreen('overview')}
                  >
                    Explore the other paths
                    <GitBranch size={17} />
                  </button>
                  <button className="text-button" onClick={exportArt}>
                    <Download size={15} />
                    Keep your constellation
                  </button>
                </div>
                <span className="ending-note">
                  The story pauses here. Your possibilities don’t.
                </span>
              </section>
            )}
            {screen === 'overview' && (
              <LifeMap
                save={save}
                busy={busy}
                onChoose={(id, i) => commit(i, fork(save, id))}
                onReturn={() => setScreen('play')}
                onRestore={() => {
                  setSave({
                    ...save,
                    tip: save.bookmarks[save.bookmarks.length - 1],
                    bookmarks: save.bookmarks.slice(0, -1),
                  });
                  setScreen('play');
                }}
                onExport={exportArt}
              />
            )}
            <div className="life-footer">
              <button
                className="character-button"
                onClick={() => setModal('character')}
              >
                <Avatar index={state.avatar} appearance={appearance} />
                <span>
                  <strong>{state.role}</strong>
                  <small>
                    Make it yours <ChevronRight size={11} />
                  </small>
                </span>
              </button>
              <div className="compact-stats">
                <span>
                  <Wallet size={14} />
                  <strong>{money(state.cash)}</strong>
                  <small>AVAILABLE</small>
                </span>
                <span>
                  <Heart size={14} />
                  <strong>{state.forces.connection}</strong>
                  <small>CONNECTION</small>
                </span>
                <span>
                  <Sparkles size={14} />
                  <strong>{state.keepsakes.length}</strong>
                  <small>KEEPSAKES</small>
                </span>
              </div>
              <button
                className="sound-button"
                onClick={() => setSound(!sound)}
                aria-label={
                  sound ? 'Mute ambient sound' : 'Enable ambient sound'
                }
              >
                {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </button>
            </div>
          </>
        )}
      <Dialog
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent
          className={`elsewhere-dialog ${modal === 'character' ? 'character-dialog' : ''}`}
        >
          <DialogTitle>
            {modal === 'menu'
              ? 'A little space'
              : modal === 'character'
                ? 'Your life, so far'
                : 'A universe of you'}
          </DialogTitle>
          <DialogDescription>
            {modal === 'menu'
              ? 'Make yourself at home.'
              : modal === 'character'
                ? 'The things you carry. The person you are becoming.'
                : 'Elsewhere is a small exploration of a very large what if.'}
          </DialogDescription>
          {modal === 'menu' && (
            <div className="menu-content">
              <label className="setting-row">
                <span>
                  <Sparkles size={17} />
                  Cinematic motion
                </span>
                <Switch
                  checked={motion}
                  onCheckedChange={setMotion}
                  aria-label="Cinematic motion"
                />
              </label>
              <label className="setting-row">
                <span>
                  <Volume2 size={17} />
                  Between stars · original score
                </span>
                <Switch
                  checked={sound}
                  onCheckedChange={setSound}
                  aria-label="Ambient sound"
                />
              </label>
              <hr />
              {save && (
                <>
                  <button
                    onClick={() => {
                      setModal(null);
                      setScreen('play');
                    }}
                  >
                    <ArrowRight size={17} />
                    Continue this life
                  </button>
                  <button onClick={exportLife}>
                    <Download size={17} />
                    Export your saved life
                  </button>
                  <button onClick={exportArt}>
                    <Sparkles size={17} />
                    Keep your constellation
                  </button>
                </>
              )}
              <button onClick={() => importRef.current?.click()}>
                <Orbit size={17} />
                Import a saved life
              </button>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    if (f.size > 5_000_000) throw new Error();
                    const parsed = JSON.parse(await f.text());
                    if (!validSave(parsed)) throw new Error();
                    setSave(parsed);
                    setScreen('play');
                    setModal(null);
                    setNotice('Your life is ready to continue.');
                  } catch {
                    setNotice('This file is not a supported Elsewhere life.');
                  }
                  e.target.value = '';
                }}
              />
              <button className="new-life-menu" onClick={configure}>
                <Shuffle size={17} />
                Begin another life
              </button>
              <button onClick={() => setModal('about')}>
                <CircleHelp size={17} />
                About Elsewhere
              </button>
              <p className="local-note">
                Your progress stays on this device. Export a life to keep a copy
                or take it with you.
              </p>
            </div>
          )}
          {modal === 'character' && state && (
            <div>
              <div className="character-profile">
                <Avatar index={state.avatar} appearance={appearance} large />
                <div>
                  <div className="eyebrow">AGE {Math.floor(stage.age)}</div>
                  <h3>{state.role}</h3>
                  <p>{chapters[stage.chapter].name}</p>
                </div>
              </div>
              <div className="wardrobe">
                <h4>Choose your character</h4>
                <RadioGroup
                  aria-label="Character appearance"
                  value={String(appearance.character)}
                  onValueChange={(v) =>
                    setAppearance((p) => ({ ...p, character: Number(v) }))
                  }
                  className="character-picker"
                >
                  {characters.map((c, i) => (
                    <label
                      key={c.name}
                      className={appearance.character === i ? 'selected' : ''}
                    >
                      <Avatar
                        index={0}
                        appearance={{ character: i, look: 0, charm: 0 }}
                      />
                      <span>
                        <RadioGroupItem value={String(i)} aria-label={c.name} />
                        {c.name}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                <h4>A little wardrobe</h4>
                <label className="setting-row">
                  <span>Dress for the story</span>
                  <Switch
                    checked={appearance.look === -1}
                    onCheckedChange={(v) =>
                      setAppearance((p) => ({
                        ...p,
                        look: v ? -1 : state.avatar,
                      }))
                    }
                    aria-label="Outfit follows life choices"
                  />
                </label>
                <p className="wardrobe-hint">
                  {appearance.look === -1
                    ? 'Your outfit changes as your life unfolds.'
                    : 'This look stays until you choose another.'}
                </p>
                <RadioGroup
                  aria-label="Outfit"
                  value={String(appearance.look)}
                  onValueChange={(v) =>
                    setAppearance((p) => ({ ...p, look: Number(v) }))
                  }
                  className="outfit-picker"
                >
                  {looks.map((l, i) => (
                    <label
                      key={l}
                      className={appearance.look === i ? 'selected' : ''}
                    >
                      <RadioGroupItem value={String(i)} aria-label={l} />
                      {l}
                    </label>
                  ))}
                </RadioGroup>
                <h4>Your orbiting charm</h4>
                <RadioGroup
                  aria-label="Orbiting accessory"
                  value={String(appearance.charm)}
                  onValueChange={(v) =>
                    setAppearance((p) => ({ ...p, charm: Number(v) }))
                  }
                  className="charm-picker"
                >
                  {charms.map((c, i) => (
                    <label
                      key={c.name}
                      className={appearance.charm === i ? 'selected' : ''}
                    >
                      <RadioGroupItem value={String(i)} aria-label={c.name} />
                      {c.icon && <c.icon size={16} />}
                      <span>{c.name}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div className="force-list">
                {forces.map((f) => (
                  <div key={f}>
                    <span>
                      {f}
                      <b>{state.forces[f]}</b>
                    </span>
                    <div className="force-track">
                      <i style={{ width: `${state.forces[f]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="finance-detail">
                <span>
                  Money available<strong>{money(state.cash)}</strong>
                </span>
                <span>
                  Monthly income<strong>{money(state.income)}</strong>
                </span>
              </div>
              <small className="fictional-money">
                Illustrative money in a fictional setting.
              </small>
              <h4>The little things you kept</h4>
              <div className="keepsakes">
                {state.keepsakes.length ? (
                  state.keepsakes.map((k) => (
                    <span key={k}>
                      <Sparkles size={12} />
                      {k}
                    </span>
                  ))
                ) : (
                  <p>Your collection will grow as you make your way.</p>
                )}
              </div>
            </div>
          )}
          {modal === 'about' && (
            <div className="about-copy">
              <p>
                Every choice leaves another life behind. Here, you can follow
                it.
              </p>
              <p>
                Begin at thirteen, choose your way through nine chapters, and
                return to any bright point to explore what might have been.
                There is no winning life.
              </p>
              <p>
                This first edition uses authored, recombining stories. Your
                character and circumstances evolve with your choices, without
                live AI generation.
              </p>
              <p>
                Lives here are fictional. They offer possibilities, not
                predictions.
              </p>
              <button className="gold-button" onClick={() => setModal(null)}>
                Back to the stars
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice('')}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
}
