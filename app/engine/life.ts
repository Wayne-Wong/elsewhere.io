import { chapters, events, type Force } from '../content/world';
export type State = {
  step: number;
  cash: number;
  income: number;
  expenses: number;
  role: string;
  avatar: number;
  flags: string[];
  keepsakes: string[];
  seen: string[];
  forces: Record<Force, number>;
  key: number;
};
export type Node = {
  id: string;
  parent: string | null;
  via: number | null;
  state: State;
  eventId: string | null;
  label: string;
  outcome: string;
};
export type Save = {
  version: 1;
  seed: number;
  origin: number[];
  nodes: Record<string, Node>;
  tip: string;
  bookmarks: string[];
};
export const TOTAL = chapters.reduce((n, c) => n + c.count, 0);
export function clock(step: number) {
  let offset = 0;
  for (let i = 0; i < chapters.length; i++) {
    const c = chapters[i];
    if (step < offset + c.count)
      return {
        chapter: i,
        slot: step - offset,
        age:
          Math.floor(
            (c.start + ((step - offset) * (c.end - c.start)) / c.count) * 12,
          ) / 12,
      };
    offset += c.count;
  }
  return { chapter: 8, slot: 4, age: 85 };
}
export function hash(s: string) {
  let n = 2166136261;
  for (let i = 0; i < s.length; i++)
    n = Math.imul(n ^ s.charCodeAt(i), 16777619);
  return n >>> 0;
}
export function eventFor(s: State) {
  if (s.step >= TOTAL) return null;
  const pool = events.filter(
    (e) =>
      e.chapter === clock(s.step).chapter &&
      !s.seen.includes(e.id) &&
      (!e.requires || s.flags.includes(e.requires)) &&
      !(e.requires === 'partner' && s.flags.includes('separated')),
  );
  if (!pool.length) throw new Error('No eligible scene');
  return pool
    .map((e) => ({ e, score: hash(s.key + e.id) / (e.requires ? 1.6 : 1) }))
    .sort((a, b) => a.score - b.score)[0].e;
}
export function begin(origin: number[], seed: number): Save {
  if (
    origin.length !== 6 ||
    origin.some((x) => !Number.isInteger(x) || x < 0 || x > 2)
  )
    throw new Error('Choose all six constellations');
  const state: State = {
    step: 0,
    cash: [120, 40, 90][origin[0]],
    income: 0,
    expenses: 0,
    role: 'Discovering life',
    avatar: 0,
    flags: [],
    keepsakes: [],
    seen: [],
    forces: {
      connection: [60, 48, 38][origin[4]],
      freedom: [62, 38, 48][origin[3]],
      meaning: [55, 52, 50][origin[1]],
      vitality: [72, 54, 42][origin[2]],
    },
    key: hash(seed + origin.join('')),
  };
  const first = eventFor(state)!;
  return {
    version: 1,
    seed,
    origin,
    nodes: {
      root: {
        id: 'root',
        parent: null,
        via: null,
        state,
        eventId: first.id,
        label: 'Your beginning',
        outcome:
          'You did not choose every part of your beginning. But the world is starting to ask who you will become.',
      },
    },
    tip: 'root',
    bookmarks: [],
  };
}
export function choose(save: Save, index: number): Save {
  const parent = save.nodes[save.tip];
  const e = events.find((e) => e.id === parent.eventId);
  if (!e || !Number.isInteger(index) || !e.choices[index])
    throw new Error('This choice is not available');
  const id = parent.id + '.' + index;
  if (save.nodes[id]) return { ...save, tip: id };
  const choice = e.choices[index],
    fx = choice.effect,
    s: State = structuredClone(parent.state);
  s.step++;
  s.key = hash(parent.state.key + ':' + index);
  s.seen.push(e.id);
  s.avatar =
    s.role === 'Office professional'
      ? 2
      : s.role === 'Independent maker'
        ? 3
        : s.role === 'Exploring the world'
          ? 4
          : 0;
  if (fx.force)
    s.forces[fx.force] = Math.max(
      0,
      Math.min(100, s.forces[fx.force] + (fx.amount || 6)),
    );
  s.cash = Math.max(0, s.cash + (fx.cash || 0));
  if (fx.flag && !s.flags.includes(fx.flag)) s.flags.push(fx.flag);
  if (fx.keepsake && !s.keepsakes.includes(fx.keepsake))
    s.keepsakes.push(fx.keepsake);
  if (fx.role) {
    const roles = {
      student: ['Student', 0, 0, 0],
      office: ['Office professional', 2300, 1900, 2],
      maker: ['Independent maker', 1900, 1650, 3],
      traveler: ['Exploring the world', 1600, 1500, 4],
      retired: ['A new rhythm', 1200, 1150, 5],
    } as const;
    const r = roles[fx.role];
    s.role = r[0];
    s.income = r[1];
    s.expenses = r[2];
    s.avatar = r[3];
  }
  if (fx.avatar !== undefined) s.avatar = fx.avatar;
  const elapsed = Math.max(
    0,
    Math.round((clock(s.step).age - clock(parent.state.step).age) * 12),
  );
  s.cash += Math.max(0, s.income - s.expenses) * elapsed;
  if (clock(s.step).age >= 65) s.avatar = 5;
  const next = eventFor(s);
  const node: Node = {
    id,
    parent: parent.id,
    via: index,
    state: s,
    eventId: next?.id || null,
    label: choice.label,
    outcome: choice.outcome,
  };
  return { ...save, tip: id, nodes: { ...save.nodes, [id]: node } };
}
export function ancestry(save: Save) {
  const out: Node[] = [];
  let n: Node | undefined = save.nodes[save.tip];
  while (n) {
    out.unshift(n);
    n = n.parent ? save.nodes[n.parent] : undefined;
  }
  return out;
}
export function fork(save: Save, nodeId: string) {
  if (!save.nodes[nodeId]) throw new Error('Unknown memory');
  return {
    ...save,
    tip: nodeId,
    bookmarks: [...new Set([...save.bookmarks, save.tip])],
  };
}
export function validSave(value: unknown): value is Save {
  try {
    const s = value as Save;
    if (
      s.version !== 1 ||
      !Number.isFinite(s.seed) ||
      !Array.isArray(s.origin) ||
      s.origin.length !== 6 ||
      s.origin.some((x) => !Number.isInteger(x) || x < 0 || x > 2) ||
      !s.nodes ||
      !s.nodes[s.tip] ||
      !Array.isArray(s.bookmarks) ||
      s.bookmarks.some((id) => !Object.hasOwn(s.nodes, id)) ||
      Object.keys(s.nodes).length > 10000 ||
      s.nodes.root?.state.step !== 0
    )
      return false;
    return Object.entries(s.nodes).every(
      ([id, n]) =>
        n.id === id &&
        Number.isFinite(n.state.cash) &&
        n.state.cash >= 0 &&
        Number.isFinite(n.state.key) &&
        Number.isFinite(n.state.income) &&
        Number.isFinite(n.state.expenses) &&
        Number.isInteger(n.state.avatar) &&
        n.state.avatar >= 0 &&
        n.state.avatar < 6 &&
        typeof n.state.role === 'string' &&
        Number.isInteger(n.state.step) &&
        n.state.step >= 0 &&
        n.state.step <= TOTAL &&
        ['connection', 'freedom', 'meaning', 'vitality'].every((f) => {
          const v = n.state.forces[f as Force];
          return Number.isFinite(v) && v >= 0 && v <= 100;
        }) &&
        [n.state.keepsakes, n.state.flags, n.state.seen].every(
          (a) => Array.isArray(a) && a.every((v) => typeof v === 'string'),
        ) &&
        typeof n.label === 'string' &&
        typeof n.outcome === 'string' &&
        (id === 'root'
          ? n.parent === null
          : typeof n.parent === 'string' &&
            Object.hasOwn(s.nodes, n.parent) &&
            s.nodes[n.parent].state.step === n.state.step - 1) &&
        (n.state.step === TOTAL
          ? n.eventId === null
          : events.some(
              (e) =>
                e.id === n.eventId && e.chapter === clock(n.state.step).chapter,
            )),
    );
  } catch {
    return false;
  }
}
