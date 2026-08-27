import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Point (presenPoint/Point) — multi-agent coaching pipeline.
 * Agent 0 spans the top as orchestrator; agents 1, 2&3 (combined — they run together
 * during a live session), 4, and 5 sit inside a supervised scope.
 */
const AGENTS: { n: string; title: string; sub: string }[] = [
  { n: '1', title: 'Material & Quiz', sub: 'PDF / TXT → summary, weak areas' },
  { n: '2-3', title: 'Speech & Nonverbal', sub: 'WPM · fillers · gaze · posture — live, in parallel' },
  { n: '4', title: 'Q&A', sub: '5-turn AI audience' },
  { n: '5', title: 'Report', sub: 'Scores · NL feedback' },
];

/** Per-agent explanation shown below the diagram when that block is clicked. */
const AGENT_DETAIL: Record<string, { title: string; body: string; images?: string[] }> = {
  '0': {
    title: 'Agent 0 · Orchestrator',
    body: 'Orchestrates a state machine and session recovery. Shared session context keeps the pipeline coherent instead of six disconnected chat bots.',
    images: ['/Point.png'],
  },
  '1': {
    title: 'Agent 1 · Material & Quiz',
    body: 'Ingests PDF/TXT to extract summaries and weak-area cues for a quiz — or lets you skip straight to presenting with no upload at all.',
    images: ['/Point_setup.png'],
  },
  '2-3': {
    title: 'Agent 2 & 3 · Speech & Nonverbal',
    body: 'Agent 2 tracks speech in real time — WPM, filler words, and semantic off-topic signals. Agent 3 runs MediaPipe-based gaze, posture, and gesture analysis off the main thread. The two run in parallel during live coaching, so they share one combined view.',
    images: ['/Point_metrics.png', '/Point_2.png'],
  },
  '4': {
    title: 'Agent 4 · Q&A',
    body: 'Plays a five-turn AI audience for a stress-style Q&A grounded in your gaps, with adjustable pressure (Standard / Firm / Intense).',
    images: ['/Point_qa.png'],
  },
  '5': {
    title: 'Agent 5 · Report',
    body: 'Aggregates logs into composite scores and natural-language feedback.',
    images: ['/Point_3.png'],
  },
};

export function PointAgentsDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const toggle = (id: string) => setActive((prev) => (prev === id ? null : id));
  const detail = active ? AGENT_DETAIL[active] : null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-700 mb-1">Agent graph</p>
      <p className="font-mono text-xs text-neutral-700 mb-6">
        Shared session context · FeedbackQueue · Web Worker (vision path) · click a block to explore
      </p>

      {/* Orchestrator */}
      <button
        type="button"
        onClick={() => toggle('0')}
        aria-pressed={active === '0'}
        className={`w-full text-left rounded-lg border-2 px-5 py-4 transition-all duration-200 ${
          active === '0'
            ? 'border-portfolio bg-portfolio/[0.07] shadow-md scale-[1.01]'
            : 'border-portfolio/50 bg-portfolio/[0.04] hover:border-portfolio hover:bg-portfolio/[0.07]'
        }`}
      >
        <p className="font-bold text-neutral-900 text-base">Agent 0 · Orchestrator</p>
        <p className="text-sm text-neutral-800 mt-1">
          Supervises all agents below · State machine · Session recovery
        </p>
      </button>

      <div className="flex justify-center py-1" aria-hidden>
        <ChevronDown className="size-5 text-neutral-300" />
      </div>

      {/* Scoped region — Agents 1, 2&3, 4, 5 */}
      <div className="rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4 sm:p-5">
        <p className="text-center font-mono text-xs uppercase tracking-[0.15em] text-indigo-400 font-semibold mb-4">
          Scope · Agents 1–5
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map((a) => {
            const isActive = active === a.n;
            return (
              <button
                key={a.n}
                type="button"
                onClick={() => toggle(a.n)}
                aria-pressed={isActive}
                className={`text-left rounded-lg border-2 px-4 py-4 transition-all duration-200 ${
                  isActive
                    ? 'border-portfolio bg-white shadow-md scale-[1.03]'
                    : 'border-neutral-200 bg-white hover:border-portfolio/50 hover:shadow-sm'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center px-2.5 h-8 rounded-full font-mono text-sm font-bold mb-2.5 transition-colors ${
                    isActive ? 'bg-portfolio text-portfolio-foreground' : 'bg-portfolio/10 text-portfolio'
                  }`}
                >
                  {a.n}
                </span>
                <p className="font-bold text-neutral-900 text-[15px] leading-tight">{a.title}</p>
                <p className="text-xs text-neutral-700 mt-1">{a.sub}</p>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center font-mono text-xs text-neutral-700 mt-6 tracking-wide font-semibold">
        UPLOAD → QUIZ → PRESENT → COACH → Q&amp;A → REPORT
      </p>

      {/* ── Selected agent detail ── */}
      <div
        style={{
          opacity: detail ? 1 : 0,
          transform: detail ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          pointerEvents: detail ? 'auto' : 'none',
        }}
        className="mt-6 border-t border-neutral-100 pt-5"
      >
        {detail && (
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-portfolio mb-2 font-semibold">
                {detail.title}
              </p>
              <p className="text-neutral-900 text-sm leading-relaxed">{detail.body}</p>
            </div>
            {detail.images && detail.images.length > 0 && (
              <div
                className={`w-full sm:w-[50%] shrink-0 grid gap-2 ${
                  detail.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {detail.images.map((src) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 aspect-video"
                  >
                    <img src={src} alt={detail.title} className="w-full h-full object-cover object-top" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
