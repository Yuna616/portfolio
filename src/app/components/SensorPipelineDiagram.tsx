import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

type NodeId = 'gps' | 'imu' | 'sensor-task' | 'sensor-state' | 'display-task' | 'network-task';

const CONNECTIONS: Record<NodeId, NodeId[]> = {
  'gps':          ['sensor-task'],
  'imu':          ['sensor-task'],
  'sensor-task':  ['gps', 'imu', 'sensor-state'],
  'sensor-state': ['sensor-task', 'display-task', 'network-task'],
  'display-task': ['sensor-state'],
  'network-task': ['sensor-state'],
};

const NODE_META: Record<NodeId, { eyebrow: string; name: string; sub: string }> = {
  'gps':          { eyebrow: 'GPS', name: 'HGLRC M100', sub: 'NMEA · UART2' },
  'imu':          { eyebrow: 'IMU', name: 'MPU-6050', sub: 'accel · gyro · I2C' },
  'sensor-task':  { eyebrow: 'Core 0 · 20 Hz', name: 'SensorTask', sub: 'brake/bump · speed filter' },
  'sensor-state': { eyebrow: 'Shared memory', name: 'SensorState', sub: 'mutex snapshot' },
  'display-task': { eyebrow: 'Core 1 · 60 Hz', name: 'DisplayTask', sub: '→ TFT · SLEEP/WALK/RUN/TURBO' },
  'network-task': { eyebrow: 'Core 0 · 100 Hz', name: 'NetworkTask', sub: '→ /api/state (JSON)' },
};

const DESCRIPTIONS: Record<NodeId, { title: string; body: string }> = {
  'gps': {
    title: 'HGLRC M100 — GPS',
    body: 'Streams NMEA sentences over UART2 at the module\'s factory 1 Hz rate. TinyGPSPlus parses each frame and extracts speed — derived directly from the Doppler shift of the satellite signal, accurate to roughly 0.1 m/s — plus latitude/longitude and satellite count whenever isUpdated() fires.',
  },
  'imu': {
    title: 'MPU-6050 — IMU',
    body: 'Delivers raw accelerometer values over I2C at 20 Hz. SensorTask checks ax < −0.35 g sustained for 80 ms to latch brake_active, and |az| > 1.8 g instantly for bump_active — both held for 2 s. The same ax stream is integrated between GPS fixes to smooth the displayed speed.',
  },
  'sensor-task': {
    title: 'SensorTask — Core 0 · 20 Hz',
    body: 'Reads both sensors every 50 ms and writes results into SensorState under mutex protection. Between the GPS\'s 1 Hz fixes, it integrates IMU acceleration into a complementary filter (speed_mph_smooth); each new GPS fix re-anchors that estimate at 30% IMU / 70% GPS so drift can\'t accumulate. The single source of truth — all downstream consumers read from here, never the hardware directly.',
  },
  'sensor-state': {
    title: 'SensorState — Shared Memory',
    body: 'A mutex-guarded struct holding raw and smoothed speed (speed_mph / speed_mph_smooth), position, satellite count, IMU g-values, and event latches. petSensorRead() provides a thread-safe snapshot to any task at any time.',
  },
  'display-task': {
    title: 'DisplayTask — Core 1 · 60 Hz',
    body: 'Snapshots SensorState every 16 ms and drives the TFT, animating speed_mph_smooth so the GPS\'s 1 Hz steps read as continuous motion: SLEEP → WALK → RUN → TURBO. Brake triggers a skid-mark overlay.',
  },
  'network-task': {
    title: 'NetworkTask — Core 0 · 100 Hz',
    body: 'Serves GET /api/state by reading SensorState and serialising it as JSON — speed_mph_smooth, brake/bump flags, GPS fix. The companion phone app polls at 1 Hz, mapping speed and brake_active to animation state and speech lines.',
  },
};

function NodeCard({
  id,
  state,
  onClick,
}: {
  id: NodeId;
  state: 'selected' | 'connected' | 'idle' | 'dim';
  onClick: () => void;
}) {
  const m = NODE_META[id];
  const styles: Record<typeof state, string> = {
    selected: 'border-portfolio bg-portfolio/[0.06] shadow-md scale-[1.02]',
    connected: 'border-portfolio/50 bg-portfolio/[0.03]',
    idle: 'border-neutral-200 bg-white hover:border-portfolio/50 hover:shadow-sm',
    dim: 'border-neutral-100 bg-neutral-50 opacity-50',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state === 'selected'}
      className={`w-full text-left rounded-lg border-2 px-4 py-3.5 transition-all duration-200 ${styles[state]}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-600 mb-1">{m.eyebrow}</p>
      <p className="font-bold text-neutral-900 text-[15px] leading-tight">{m.name}</p>
      <p className="text-xs text-neutral-700 mt-1">{m.sub}</p>
    </button>
  );
}

/** A moving dot riding along one horizontal line segment — reads as data actively flowing through the pipeline. */
function FlowDot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 size-1.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-portfolio"
      style={{ animation: `flow-move 2.2s linear ${delay}s infinite` }}
    />
  );
}

/** One straight animated segment, positioned absolutely within its connector container via `top`/`left`/`width` (percentages of the container). */
function Line({ top, left, width, delay }: { top: string; left: string; width: string; delay?: number }) {
  return (
    <div className="absolute h-px bg-neutral-200" style={{ top, left, width }}>
      <FlowDot delay={delay} />
    </div>
  );
}

/** Static (non-animated) straight segment — used for the vertical strokes of a merge/split bracket. */
function StaticLine({ top, left, height }: { top: string; left: string; height: string }) {
  return <div className="absolute w-px bg-neutral-200" style={{ top, left, height }} />;
}

function ArrowHead({ top }: { top: string }) {
  return (
    <ChevronRight
      aria-hidden
      className="absolute right-0 size-3.5 -translate-y-1/2 text-neutral-300"
      style={{ top }}
    />
  );
}

const CONNECTOR_CLASS = 'relative w-10 shrink-0 self-stretch sm:w-14';

/** 1 → 1 straight connector, e.g. SensorTask → SensorState. */
function StraightArrow() {
  return (
    <div className={CONNECTOR_CLASS} aria-hidden>
      <Line top="50%" left="0%" width="100%" />
      <ArrowHead top="50%" />
    </div>
  );
}

/** 2 → 1 bracket connector, e.g. { GPS, IMU } → SensorTask. */
function MergeArrow() {
  return (
    <div className={CONNECTOR_CLASS} aria-hidden>
      <Line top="25%" left="0%" width="50%" delay={0} />
      <Line top="75%" left="0%" width="50%" delay={0.25} />
      <StaticLine top="25%" left="50%" height="50%" />
      <Line top="50%" left="50%" width="50%" delay={0.5} />
      <ArrowHead top="50%" />
    </div>
  );
}

/** 1 → 2 bracket connector, e.g. SensorState → { DisplayTask, NetworkTask }. */
function SplitArrow() {
  return (
    <div className={CONNECTOR_CLASS} aria-hidden>
      <Line top="50%" left="0%" width="50%" delay={0} />
      <StaticLine top="25%" left="50%" height="50%" />
      <Line top="25%" left="50%" width="50%" delay={0.25} />
      <Line top="75%" left="50%" width="50%" delay={0.5} />
      <ArrowHead top="25%" />
      <ArrowHead top="75%" />
    </div>
  );
}

export function SensorPipelineDiagram() {
  const [selected, setSelected] = useState<NodeId | null>(null);

  const toggle = (id: NodeId) => setSelected((prev) => (prev === id ? null : id));

  const stateOf = (id: NodeId): 'selected' | 'connected' | 'idle' | 'dim' => {
    if (!selected) return 'idle';
    if (selected === id) return 'selected';
    if (CONNECTIONS[selected].includes(id)) return 'connected';
    return 'dim';
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-700 mb-1">Data flow</p>
      <p className="font-mono text-xs text-neutral-700 mb-6">Click a node to explore</p>

      <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
        <div className="mx-auto flex w-max min-w-full items-stretch justify-center gap-0 py-2">
          <div className="flex w-36 shrink-0 flex-col justify-center gap-3 sm:w-40">
            <NodeCard id="gps" state={stateOf('gps')} onClick={() => toggle('gps')} />
            <NodeCard id="imu" state={stateOf('imu')} onClick={() => toggle('imu')} />
          </div>

          <MergeArrow />

          <div className="flex w-36 shrink-0 flex-col justify-center sm:w-40">
            <NodeCard id="sensor-task" state={stateOf('sensor-task')} onClick={() => toggle('sensor-task')} />
          </div>

          <StraightArrow />

          <div className="flex w-36 shrink-0 flex-col justify-center sm:w-40">
            <NodeCard id="sensor-state" state={stateOf('sensor-state')} onClick={() => toggle('sensor-state')} />
          </div>

          <SplitArrow />

          <div className="flex w-36 shrink-0 flex-col justify-center gap-3 sm:w-40">
            <NodeCard id="display-task" state={stateOf('display-task')} onClick={() => toggle('display-task')} />
            <NodeCard id="network-task" state={stateOf('network-task')} onClick={() => toggle('network-task')} />
          </div>
        </div>
      </div>

      {/* ── Description panel ── */}
      <div
        style={{
          opacity: selected ? 1 : 0,
          transform: selected ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          pointerEvents: selected ? 'auto' : 'none',
        }}
        className="mt-6 border-t border-neutral-100 pt-5"
      >
        {selected && (
          <>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-portfolio mb-2 font-semibold">
              {DESCRIPTIONS[selected].title}
            </p>
            <p className="text-neutral-900 text-sm leading-relaxed">
              {DESCRIPTIONS[selected].body}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
