'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  GitBranch,
  Sparkles,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { chapters, events } from '../content/world';
import { choiceThemes } from '../content/choice-themes';
import { ancestry, clock, type Save } from '../engine/life';

export default function LifeMap({
  save,
  busy,
  onChoose,
  onReturn,
  onRestore,
  onExport,
}: {
  save: Save;
  busy: boolean;
  onChoose: (nodeId: string, index: number) => void;
  onReturn: () => void;
  onRestore: () => void;
  onExport: () => void;
}) {
  const path = ancestry(save),
    current = save.nodes[save.tip];
  const [view, setView] = useState('chapters'),
    [chapter, setChapter] = useState(clock(current.state.step).chapter),
    [selected, setSelected] = useState(save.tip);
  const focused = save.nodes[selected] || current,
    event = events.find((e) => e.id === focused.eventId),
    taken = path.find((n) => n.parent === focused.id);
  const chapterNodes = path.filter(
    (n) => clock(n.state.step).chapter === chapter,
  );
  const available = chapters
    .map((_, i) => i)
    .filter((i) => path.some((n) => clock(n.state.step).chapter === i));
  const selectChapter = (i: number) => {
    const nodes = path.filter((n) => clock(n.state.step).chapter === i);
    if (!nodes.length) return;
    setChapter(i);
    setSelected(nodes[0].id);
    setView('decisions');
  };
  return (
    <section className="overview page-enter life-atlas">
      <div className="overview-heading">
        <h1>
          The paths <em>you took.</em>
        </h1>
        <p>Find a chapter. Revisit a decision. Try a different way.</p>
      </div>
      <div className="atlas-toolbar">
        <Tabs value={view} onValueChange={(v) => setView(String(v))}>
          <TabsList aria-label="Life map detail">
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="decisions">Decisions</TabsTrigger>
          </TabsList>
        </Tabs>
        <span>
          {path.length - 1} choices ·{' '}
          {Object.keys(save.nodes).length - path.length} alternate moments
        </span>
      </div>
      {view === 'chapters' ? (
        <div className="chapter-map" aria-label="Your life by chapter">
          {chapters.map((c, i) => {
            const nodes = path.filter((n) => clock(n.state.step).chapter === i),
              count = nodes.filter(
                (n) => !!path.find((child) => child.parent === n.id),
              ).length;
            return (
              <button
                key={c.name}
                disabled={!nodes.length}
                onClick={() => selectChapter(i)}
                className={`chapter-constellation ${i === clock(current.state.step).chapter ? 'now' : ''}`}
              >
                <span className="chapter-orbit">
                  <Sparkles size={21} />
                </span>
                <span className="chapter-map-copy">
                  <small>AGES {c.range}</small>
                  <strong>{c.name}</strong>
                  <span>
                    {nodes.length
                      ? `${count} ${count === 1 ? 'choice' : 'choices'}${i === clock(current.state.step).chapter ? ' · you are here' : ''}`
                      : 'Still unwritten'}
                  </span>
                </span>
                {nodes.length && <ArrowUpRight size={15} />}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="chapter-navigation">
            <button
              aria-label="Previous visited chapter"
              disabled={chapter === available[0]}
              onClick={() =>
                selectChapter(available[available.indexOf(chapter) - 1])
              }
            >
              <ArrowLeft size={17} />
            </button>
            <div>
              <strong>{chapters[chapter].name}</strong>
              <span>Ages {chapters[chapter].range} · chronological order</span>
            </div>
            <button
              aria-label="Next visited chapter"
              disabled={chapter === available[available.length - 1]}
              onClick={() =>
                selectChapter(available[available.indexOf(chapter) + 1])
              }
            >
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="moments-grid" aria-label="Decisions in this chapter">
            {chapterNodes.map((n) => {
              const scene = events.find((e) => e.id === n.eventId),
                child = path.find((p) => p.parent === n.id);
              return (
                <button
                  key={n.id}
                  className={`moment-tile ${focused.id === n.id ? 'selected' : ''}`}
                  onClick={() => setSelected(n.id)}
                >
                  <span className="moment-age">
                    <i />
                    AGE {Math.floor(clock(n.state.step).age)}
                    {n.id === save.tip && <small>NOW</small>}
                  </span>
                  <strong>{scene?.title || 'A life reflected'}</strong>
                  <span>
                    {child
                      ? child.label
                      : n.eventId
                        ? 'Your next choice awaits'
                        : 'The story pauses here'}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
      {view === 'decisions' && (
        <div className="memory-inspector">
          <div>
            <div className="eyebrow">
              AGE {Math.floor(clock(focused.state.step).age)} ·{' '}
              {taken ? 'THE CHOICE YOU MADE' : 'THIS MOMENT'}
            </div>
            <h2>{event?.title || 'The life you made'}</h2>
            <p>{event?.scene || focused.outcome}</p>
            {taken && (
              <div className="remembered-choice">
                <strong>
                  <Check size={14} />
                  {taken.label}
                </strong>
                <p>{taken.outcome}</p>
                <span>
                  {taken.state.cash !== focused.state.cash
                    ? `Savings ${taken.state.cash > focused.state.cash ? '+' : ''}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(taken.state.cash - focused.state.cash)} · `
                    : ''}
                  {taken.state.role !== focused.state.role
                    ? taken.state.role
                    : `${taken.state.keepsakes.length} keepsakes carried forward`}
                </span>
              </div>
            )}
          </div>
          <div className="alternate-choices">
            <span className="atlas-prompt">
              {taken ? 'Where could this have led?' : 'Choose where to go next'}
            </span>
            {event?.choices.map((c, i) => (
              <button
                key={c.label}
                disabled={busy}
                className={taken?.via === i ? 'taken-choice' : ''}
                onClick={() => onChoose(focused.id, i)}
              >
                <span>
                  <small style={{ color: choiceThemes[c.category].color }}>
                    {choiceThemes[c.category].label}
                    {taken?.via === i ? ' · your path' : ''}
                  </small>
                  {c.label}
                </span>
                {taken?.via === i ? (
                  <Check size={16} />
                ) : (
                  <GitBranch size={16} />
                )}
              </button>
            )) || (
              <button onClick={onExport}>
                Keep your constellation
                <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="atlas-bottom">
        <button className="gold-button" onClick={onReturn}>
          Continue at age {Math.floor(clock(current.state.step).age)}
          <ArrowRight size={17} />
        </button>
        {save.bookmarks.length > 0 && (
          <button className="text-button" onClick={onRestore}>
            <ArrowLeft size={15} />
            Return to previous life
          </button>
        )}
      </div>
    </section>
  );
}
