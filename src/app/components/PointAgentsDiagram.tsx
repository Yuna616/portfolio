/**
 * Point (presenPoint/Point) — multi-agent coaching pipeline.
 * Agent 0 spans the top as orchestrator; agents 1–5 sit inside a supervised scope (not a sequential parent→child arrow).
 */
const VIEW_W = 920;
/** Card widths and gaps (px) — group is centered in VIEW_W */
const AGENT_CARDS: { w: number; n: string; title: string; sub: string }[] = [
  { w: 136, n: '1', title: 'Material & Quiz', sub: 'PDF / TXT → summary, weak areas' },
  { w: 128, n: '2', title: 'Speech', sub: 'WPM · fillers · off-topic' },
  { w: 136, n: '3', title: 'Nonverbal', sub: 'MediaPipe · gaze · pose · hands' },
  { w: 120, n: '4', title: 'Q&A', sub: '5-turn AI audience' },
  { w: 128, n: '5', title: 'Report', sub: 'Scores · NL feedback' },
];
const GAPS = [16, 16, 20, 24];

function agentRowLayout() {
  const sumW = AGENT_CARDS.reduce((a, c) => a + c.w, 0);
  const sumG = GAPS.reduce((a, g) => a + g, 0);
  const total = sumW + sumG;
  const startX = (VIEW_W - total) / 2;
  const xs: number[] = [];
  let x = startX;
  for (let i = 0; i < AGENT_CARDS.length; i++) {
    xs.push(x);
    x += AGENT_CARDS[i].w + (i < GAPS.length ? GAPS[i] : 0);
  }
  const left = xs[0]!;
  const right = xs[xs.length - 1]! + AGENT_CARDS[AGENT_CARDS.length - 1]!.w;
  return { startX, xs, left, right, total };
}

export function PointAgentsDiagram() {
  const { xs, left, right } = agentRowLayout();
  const pad = 14;
  const scopeX = left - pad;
  const scopeW = right - left + pad * 2;

  return (
    <div className="rounded-sm border border-white/[0.08] bg-[#0e0e0e] p-4 sm:p-6 overflow-x-auto shadow-none">
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25 mb-1">
        Agent graph
      </p>
      <p className="font-mono text-[8px] text-white/15 mb-4 tracking-wide">
        Shared session context · FeedbackQueue · Web Worker (vision path)
      </p>
      <svg
        viewBox={`0 0 ${VIEW_W} 300`}
        className="w-full min-w-[600px] h-auto text-white/85"
        role="img"
        aria-label="Agent 0 orchestrator spans the full width above a supervised region containing Agents 1 through 5; Agents 2 and 3 run in parallel during real-time coaching."
      >
        <defs>
          <marker id="pa-arrow-dim" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.2)" />
          </marker>
        </defs>

        {/* Agent 0 — full-width orchestrator */}
        <rect
          x="12"
          y="8"
          width="896"
          height="52"
          rx="6"
          fill="rgba(212,225,87,0.07)"
          stroke="var(--portfolio-accent, #d4e157)"
          strokeWidth="1.25"
        />
        <text x="460" y="30" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="12" fontWeight="600" fontFamily="ui-sans-serif, system-ui">
          Agent 0 · Orchestrator
        </text>
        <text x="460" y="48" textAnchor="middle" fill="rgba(255,255,255,0.42)" fontSize="9" fontFamily="ui-monospace, monospace">
          Supervises all agents below · State machine · Session recovery
        </text>

        {/* Scoped region — centered around Agents 1–5 */}
        <rect
          x={scopeX}
          y="72"
          width={scopeW}
          height="132"
          rx="10"
          fill="rgba(212,225,87,0.02)"
          stroke="rgba(212,225,87,0.28)"
          strokeWidth="1"
          strokeDasharray="5 5"
        />
        <text x="460" y="88" textAnchor="middle" fill="rgba(212,225,87,0.45)" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="0.06em">
          Scope · Agents 1–5
        </text>

        {/* Row: A1 … A5 — horizontally centered */}
        {AGENT_CARDS.map((card, i) => {
          const x = xs[i]!;
          return (
            <g key={card.n}>
              <rect
                x={x}
                y="104"
                width={card.w}
                height="76"
                rx="4"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
              />
              <text
                x={x + card.w / 2}
                y="124"
                textAnchor="middle"
                fill="var(--portfolio-accent, #d4e157)"
                fontSize="10"
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
              >
                {`Agent ${card.n}`}
              </text>
              <text
                x={x + card.w / 2}
                y="144"
                textAnchor="middle"
                fill="rgba(255,255,255,0.88)"
                fontSize="10"
                fontWeight="600"
                fontFamily="ui-sans-serif, system-ui"
              >
                {card.title}
              </text>
              <text
                x={x + card.w / 2}
                y="164"
                textAnchor="middle"
                fill="rgba(255,255,255,0.38)"
                fontSize="8.5"
                fontFamily="ui-sans-serif, system-ui"
              >
                {card.sub}
              </text>
            </g>
          );
        })}

        {/* Sequential flow A1→…→A5 */}
        {xs.slice(0, -1).map((fromLeft, i) => {
          const w = AGENT_CARDS[i]!.w;
          const x1 = fromLeft + w;
          const x2 = xs[i + 1]!;
          return (
            <line
              key={`conn-${i}`}
              x1={x1}
              y1="142"
              x2={x2}
              y2="142"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
              markerEnd="url(#pa-arrow-dim)"
            />
          );
        })}

        <text x="460" y="200" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="8" fontFamily="ui-monospace, monospace">
          Agents 2 & 3 · parallel during real-time coaching
        </text>

        <text x="460" y="248" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="0.12em">
          UPLOAD → QUIZ → PRESENT → COACH → Q&A → REPORT
        </text>
        <line x1="48" y1="262" x2="872" y2="262" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  );
}
