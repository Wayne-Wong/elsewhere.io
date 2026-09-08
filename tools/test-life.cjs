const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const assert = require('node:assert/strict');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = new Module(file);
  module.filename = file;
  module.paths = Module._nodeModulePaths(path.dirname(file));
  const original = module.require.bind(module);
  module.require = (name) =>
    name.startsWith('.')
      ? load(path.resolve(path.dirname(file), name + '.ts'))
      : original(name);
  module._compile(code, file);
  cache.set(file, module.exports);
  return module.exports;
}
const engine = load('app/engine/life.ts');
const content = load('app/content/world.ts');
const { choiceThemes, eventChoiceThemes } = load(
  'app/content/choice-themes.ts',
);
assert.deepEqual(
  Object.keys(eventChoiceThemes).sort(),
  content.events.map((e) => e.id).sort(),
);
for (const event of content.events) {
  assert.equal(event.choices.length, 3);
  event.choices.forEach((choice, i) => {
    assert(choiceThemes[choice.category], `${event.id}: missing theme`);
    assert.equal(choice.category, eventChoiceThemes[event.id][i]);
  });
}
const { scoreBar } = load('app/ui/useAmbientScore.ts');
for (let bar = 0; bar < 16; bar++) {
  const notes = scoreBar(bar);
  assert.equal(notes.length, 10);
  assert.deepEqual(notes, scoreBar(bar + 16));
  assert(
    notes.every(
      (n) =>
        n.midi >= 48 &&
        n.midi <= 79 &&
        n.beat >= 0 &&
        n.beat < 6 &&
        n.duration > 0 &&
        n.velocity > 0 &&
        n.velocity < 0.1,
    ),
  );
}
console.log(
  'Passed: all 58 events explicitly themed; original 16-bar score loops with valid note timing.',
);
assert.equal(engine.TOTAL, 44);
assert.equal(
  new Set(content.events.map((e) => e.id)).size,
  content.events.length,
);
const covered = new Set();
let lives = 0;
for (let combo = 0; combo < 729; combo++) {
  const origin = Array.from(
    { length: 6 },
    (_, i) => Math.floor(combo / 3 ** i) % 3,
  );
  for (let strategy = 0; strategy < 3; strategy++) {
    let save = engine.begin(origin, combo * 13 + strategy);
    for (let step = 0; step < 44; step++) {
      const before = save.nodes[save.tip];
      covered.add(before.eventId);
      const e = content.events.find((e) => e.id === before.eventId);
      assert(e);
      assert(!e.requires || before.state.flags.includes(e.requires));
      save = engine.choose(save, (step + strategy) % 3);
      const after = save.nodes[save.tip];
      assert.equal(after.state.step, step + 1);
      assert(after.state.cash >= 0);
      assert(
        engine.clock(after.state.step).age >=
          engine.clock(before.state.step).age,
      );
    }
    assert.equal(save.nodes[save.tip].eventId, null);
    assert(engine.validSave(save));
    assert.equal(engine.ancestry(save).length, 45);
    lives++;
  }
}
let save = engine.begin([0, 1, 2, 0, 1, 2], 42);
const original = engine.choose(save, 0);
const alternative = engine.choose(engine.fork(original, 'root'), 1);
assert(alternative.nodes[original.tip]);
assert.deepEqual(
  engine.choose({ ...alternative, tip: 'root' }, 0).nodes[original.tip],
  original.nodes[original.tip],
);
assert.throws(() => engine.choose(save, 9));
assert.equal(engine.validSave({ version: 1 }), false);
const malformed = structuredClone(original);
malformed.nodes[original.tip].parent = original.tip;
assert.equal(engine.validSave(malformed), false);
const duplicate = engine.begin([0, 1, 2, 0, 1, 2], 42);
assert.deepEqual(save, duplicate);
console.log(
  `Passed: ${lives} complete lives, all 729 origins, ${covered.size}/${content.events.length} events reached, deterministic replay, preserved forks, invalid input and cycle rejection.`,
);
