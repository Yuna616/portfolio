import { useState } from 'react';

type NodeId = 'gps' | 'imu' | 'sensor-task' | 'sensor-state' | 'display-task' | 'network-task';

const CONNECTIONS: Record<NodeId, NodeId[]> = {
  'gps':          ['sensor-task'],
  'imu':          ['sensor-task'],
  'sensor-task':  ['gps', 'imu', 'sensor-state'],
  'sensor-state': ['sensor-task', 'display-task', 'network-task'],
  'display-task': ['sensor-state'],
  'network-task': ['sensor-state'],
};

const DESCRIPTIONS: Record<NodeId, { title: string; body: string }> = {
  'gps': {
    title: 'HGLRC M100 — GPS',
    body: 'Streams NMEA sentences over UART2. TinyGPSPlus parses each frame and extracts speed (kmph), latitude/longitude, and satellite count whenever isUpdated() fires.',
  },
  'imu': {
    title: 'MPU-6050 — IMU',
    body: 'Delivers raw accelerometer values over I2C. SensorTask checks ax < −0.35 g sustained for 80 ms to latch brake_active, and |az| > 1.8 g instantly for bump_active — both held for 2 s.',
  },
  'sensor-task': {
    title: 'SensorTask — Core 0 · 20 Hz',
    body: 'Reads both sensors every 50 ms and writes results into SensorState under mutex protection. The single source of truth — all downstream consumers read from here, never the hardware directly.',
  },
  'sensor-state': {
    title: 'SensorState — Shared Memory',
    body: 'A mutex-guarded struct holding speed, position, satellite count, IMU g-values, and event latches. petSensorRead() provides a thread-safe snapshot to any task at any time.',
  },
  'display-task': {
    title: 'DisplayTask — Core 1 · 60 Hz',
    body: 'Snapshots SensorState every 16 ms and drives the TFT. Speed maps to SLEEP (0) → WALK (1–50 km/h) → RUN (51–90) → TURBO (91+). Brake triggers a skid-mark overlay.',
  },
  'network-task': {
    title: 'NetworkTask — Core 0 · 100 Hz',
    body: 'Serves GET /api/state by reading SensorState and serialising it as JSON. The companion phone app polls at 1 Hz, mapping speed and brake_active to animation state and speech lines.',
  },
};

const T = 'transition: opacity 0.22s ease, stroke-width 0.22s ease';

type StrokeFn = (sel: boolean) => string;

type DiagramPalette = {
  wire: string;
  wireDot: string;
  markerArrow: string;
  gpsStroke: StrokeFn;
  gpsFillSel: string;
  gpsT1: string;
  gpsT2: string;
  gpsT3: string;
  imuStroke: StrokeFn;
  imuFillSel: string;
  imuT1: string;
  imuT2: string;
  imuT3: string;
  stFillSel: string;
  stStroke: StrokeFn;
  stT1: string;
  stT2: string;
  stT3: string;
  ssStroke: StrokeFn;
  ssFillSel: string;
  ssT1: string;
  ssT2: string;
  ssT3: string;
  dtStroke: StrokeFn;
  dtFillSel: string;
  dtT1: string;
  dtT2: string;
  dtT3: string;
  ntStroke: StrokeFn;
  ntFillSel: string;
  ntT1: string;
  ntT2: string;
  ntT3: string;
  uart2: string;
  i2c: string;
};

const PALETTE_DARK: DiagramPalette = {
  wire: 'rgba(255,255,255,0.18)',
  wireDot: 'rgba(255,255,255,0.18)',
  markerArrow: 'rgba(255,255,255,0.22)',
  gpsStroke: (sel) => (sel ? 'rgba(212,225,87,0.8)' : 'rgba(212,225,87,0.35)'),
  gpsFillSel: 'rgba(212,225,87,0.07)',
  gpsT1: 'rgba(212,225,87,0.45)',
  gpsT2: 'rgba(212,225,87,0.85)',
  gpsT3: 'rgba(212,225,87,0.35)',
  imuStroke: (sel) => (sel ? 'rgba(100,181,246,0.8)' : 'rgba(100,181,246,0.35)'),
  imuFillSel: 'rgba(100,181,246,0.07)',
  imuT1: 'rgba(100,181,246,0.45)',
  imuT2: 'rgba(100,181,246,0.85)',
  imuT3: 'rgba(100,181,246,0.35)',
  stFillSel: 'rgba(255,255,255,0.05)',
  stStroke: (sel) => (sel ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.28)'),
  stT1: 'rgba(255,255,255,0.3)',
  stT2: 'rgba(255,255,255,0.9)',
  stT3: 'rgba(255,255,255,0.22)',
  ssStroke: (sel) => (sel ? 'rgba(255,152,0,0.85)' : 'rgba(255,152,0,0.4)'),
  ssFillSel: 'rgba(255,152,0,0.07)',
  ssT1: 'rgba(255,152,0,0.4)',
  ssT2: 'rgba(255,152,0,0.85)',
  ssT3: 'rgba(255,152,0,0.3)',
  dtStroke: (sel) => (sel ? 'rgba(129,199,132,0.8)' : 'rgba(129,199,132,0.35)'),
  dtFillSel: 'rgba(129,199,132,0.07)',
  dtT1: 'rgba(129,199,132,0.4)',
  dtT2: 'rgba(129,199,132,0.85)',
  dtT3: 'rgba(129,199,132,0.35)',
  ntStroke: (sel) => (sel ? 'rgba(206,147,216,0.8)' : 'rgba(206,147,216,0.35)'),
  ntFillSel: 'rgba(206,147,216,0.07)',
  ntT1: 'rgba(206,147,216,0.4)',
  ntT2: 'rgba(206,147,216,0.85)',
  ntT3: 'rgba(206,147,216,0.35)',
  uart2: 'rgba(212,225,87,0.35)',
  i2c: 'rgba(100,181,246,0.35)',
};

export function SensorPipelineDiagram() {
  const [selected, setSelected] = useState<NodeId | null>(null);
  const p: DiagramPalette = PALETTE_DARK;

  const toggle = (id: NodeId) =>
    setSelected((prev) => (prev === id ? null : id));

  const nodeOp = (id: NodeId) => {
    if (!selected) return 1;
    if (selected === id || CONNECTIONS[selected].includes(id)) return 1;
    return 0.15;
  };

  const pathOp = (from: NodeId, to: NodeId) => {
    if (!selected) return 1;
    if (selected === from || selected === to) return 1;
    return 0.08;
  };

  const dotOp = (...ids: NodeId[]) => {
    if (!selected) return 1;
    if (ids.some((id) => id === selected || CONNECTIONS[selected].includes(id))) return 1;
    return 0.08;
  };

  const sel = (id: NodeId) => selected === id;

  return (
    <div className="rounded-sm border border-white/[0.08] bg-[#0e0e0e] p-5 overflow-x-auto shadow-none">
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25 mb-1">
        Data flow
      </p>
      <p className="font-mono text-[8px] text-white/15 mb-5 tracking-wide">
        click a node to explore
      </p>

      <div className="rounded-md border-0 bg-[#0e0e0e] overflow-x-auto">
        <svg
          viewBox="0 0 670 165"
          className="w-full min-w-[520px]"
          aria-label="Sensor pipeline data flow diagram"
          style={{ fontFamily: 'ui-monospace, monospace' }}
        >
          <defs>
            <marker id="spd-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill={p.markerArrow} />
            </marker>
          </defs>

          {/* ── GPS ── */}
          <g style={{ opacity: nodeOp('gps'), cursor: 'pointer', transition: 'opacity 0.22s ease' }}>
            <rect
              x="0"
              y="12"
              width="115"
              height="50"
              rx="3"
              fill={sel('gps') ? p.gpsFillSel : 'none'}
              stroke={p.gpsStroke(sel('gps'))}
              strokeWidth={sel('gps') ? 1.5 : 1}
              style={{ transition: T }}
              pointerEvents="none"
            />
            <text x="57" y="31" textAnchor="middle" fontSize="8" fill={p.gpsT1} letterSpacing="1.5" pointerEvents="none">
              GPS
            </text>
            <text x="57" y="46" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.gpsT2} pointerEvents="none">
              HGLRC M100
            </text>
            <text x="57" y="58" textAnchor="middle" fontSize="8" fill={p.gpsT3} pointerEvents="none">
              NMEA · UART2
            </text>
            <rect
              x="0"
              y="12"
              width="115"
              height="50"
              rx="3"
              fill="transparent"
              onClick={() => toggle('gps')}
              style={{ cursor: 'pointer' }}
            />
          </g>

          {/* ── IMU ── */}
          <g style={{ opacity: nodeOp('imu'), cursor: 'pointer', transition: 'opacity 0.22s ease' }}>
            <rect
              x="0"
              y="103"
              width="115"
              height="50"
              rx="3"
              fill={sel('imu') ? p.imuFillSel : 'none'}
              stroke={p.imuStroke(sel('imu'))}
              strokeWidth={sel('imu') ? 1.5 : 1}
              style={{ transition: T }}
              pointerEvents="none"
            />
            <text x="57" y="122" textAnchor="middle" fontSize="8" fill={p.imuT1} letterSpacing="1.5" pointerEvents="none">
              IMU
            </text>
            <text x="57" y="137" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.imuT2} pointerEvents="none">
              MPU-6050
            </text>
            <text x="57" y="149" textAnchor="middle" fontSize="8" fill={p.imuT3} pointerEvents="none">
              accel · gyro · I2C
            </text>
            <rect
              x="0"
              y="103"
              width="115"
              height="50"
              rx="3"
              fill="transparent"
              onClick={() => toggle('imu')}
              style={{ cursor: 'pointer' }}
            />
          </g>

          {/* ── Path: GPS → merge ── */}
          <g
            style={{ opacity: pathOp('gps', 'sensor-task'), transition: 'opacity 0.22s ease', pointerEvents: 'none' }}
          >
            <polyline
              points="115,37 148,37 148,82 163,82"
              fill="none"
              stroke={p.wire}
              strokeWidth="1"
              markerEnd="url(#spd-arr)"
            />
            <text x="131" y="33" textAnchor="middle" fontSize="7.5" fill={p.uart2}>
              UART2
            </text>
          </g>

          {/* ── Path: IMU → merge ── */}
          <g
            style={{ opacity: pathOp('imu', 'sensor-task'), transition: 'opacity 0.22s ease', pointerEvents: 'none' }}
          >
            <polyline points="115,128 148,128 148,82" fill="none" stroke={p.wire} strokeWidth="1" />
            <text x="131" y="142" textAnchor="middle" fontSize="7.5" fill={p.i2c}>
              I2C
            </text>
          </g>

          {/* merge dot */}
          <circle
            cx="148"
            cy="82"
            r="2.5"
            fill={p.wireDot}
            style={{ opacity: dotOp('gps', 'imu', 'sensor-task'), transition: 'opacity 0.22s ease', pointerEvents: 'none' }}
          />

          {/* ── SensorTask ── */}
          <g style={{ opacity: nodeOp('sensor-task'), cursor: 'pointer', transition: 'opacity 0.22s ease' }}>
            <rect
              x="163"
              y="57"
              width="138"
              height="50"
              rx="3"
              fill={sel('sensor-task') ? p.stFillSel : 'none'}
              stroke={p.stStroke(sel('sensor-task'))}
              strokeWidth={sel('sensor-task') ? 1.5 : 1}
              style={{ transition: T }}
              pointerEvents="none"
            />
            <text x="232" y="76" textAnchor="middle" fontSize="8" fill={p.stT1} letterSpacing="1.5" pointerEvents="none">
              CORE 0 · 20 Hz
            </text>
            <text x="232" y="91" textAnchor="middle" fontSize="12" fontWeight="700" fill={p.stT2} pointerEvents="none">
              SensorTask
            </text>
            <text x="232" y="102" textAnchor="middle" fontSize="8" fill={p.stT3} pointerEvents="none">
              brake · bump detection
            </text>
            <rect
              x="163"
              y="57"
              width="138"
              height="50"
              rx="3"
              fill="transparent"
              onClick={() => toggle('sensor-task')}
              style={{ cursor: 'pointer' }}
            />
          </g>

          {/* ── Path: SensorTask → SensorState ── */}
          <g
            style={{
              opacity: pathOp('sensor-task', 'sensor-state'),
              transition: 'opacity 0.22s ease',
              pointerEvents: 'none',
            }}
          >
            <line
              x1="301"
              y1="82"
              x2="340"
              y2="82"
              stroke={p.wire}
              strokeWidth="1"
              markerEnd="url(#spd-arr)"
            />
          </g>

          {/* ── SensorState ── */}
          <g style={{ opacity: nodeOp('sensor-state'), cursor: 'pointer', transition: 'opacity 0.22s ease' }}>
            <rect
              x="340"
              y="57"
              width="138"
              height="50"
              rx="3"
              fill={sel('sensor-state') ? p.ssFillSel : 'none'}
              stroke={p.ssStroke(sel('sensor-state'))}
              strokeWidth={sel('sensor-state') ? 1.5 : 1}
              style={{ transition: T }}
              pointerEvents="none"
            />
            <text x="409" y="76" textAnchor="middle" fontSize="8" fill={p.ssT1} letterSpacing="1.5" pointerEvents="none">
              SHARED MEMORY
            </text>
            <text x="409" y="91" textAnchor="middle" fontSize="12" fontWeight="700" fill={p.ssT2} pointerEvents="none">
              SensorState
            </text>
            <text x="409" y="102" textAnchor="middle" fontSize="8" fill={p.ssT3} pointerEvents="none">
              mutex snapshot
            </text>
            <rect
              x="340"
              y="57"
              width="138"
              height="50"
              rx="3"
              fill="transparent"
              onClick={() => toggle('sensor-state')}
              style={{ cursor: 'pointer' }}
            />
          </g>

          {/* ── Path: SensorState → DisplayTask ── */}
          <g
            style={{
              opacity: pathOp('sensor-state', 'display-task'),
              transition: 'opacity 0.22s ease',
              pointerEvents: 'none',
            }}
          >
            <polyline
              points="478,82 510,82 510,37 525,37"
              fill="none"
              stroke={p.wire}
              strokeWidth="1"
              markerEnd="url(#spd-arr)"
            />
          </g>

          {/* ── Path: SensorState → NetworkTask ── */}
          <g
            style={{
              opacity: pathOp('sensor-state', 'network-task'),
              transition: 'opacity 0.22s ease',
              pointerEvents: 'none',
            }}
          >
            <polyline
              points="510,82 510,128 525,128"
              fill="none"
              stroke={p.wire}
              strokeWidth="1"
              markerEnd="url(#spd-arr)"
            />
          </g>

          {/* split dot */}
          <circle
            cx="510"
            cy="82"
            r="2.5"
            fill={p.wireDot}
            style={{
              opacity: dotOp('sensor-state', 'display-task', 'network-task'),
              transition: 'opacity 0.22s ease',
              pointerEvents: 'none',
            }}
          />

          {/* ── DisplayTask ── */}
          <g style={{ opacity: nodeOp('display-task'), cursor: 'pointer', transition: 'opacity 0.22s ease' }}>
            <rect
              x="525"
              y="12"
              width="145"
              height="50"
              rx="3"
              fill={sel('display-task') ? p.dtFillSel : 'none'}
              stroke={p.dtStroke(sel('display-task'))}
              strokeWidth={sel('display-task') ? 1.5 : 1}
              style={{ transition: T }}
              pointerEvents="none"
            />
            <text x="597" y="31" textAnchor="middle" fontSize="8" fill={p.dtT1} letterSpacing="1.5" pointerEvents="none">
              CORE 1 · 60 Hz
            </text>
            <text x="597" y="46" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.dtT2} pointerEvents="none">
              DisplayTask
            </text>
            <text x="597" y="58" textAnchor="middle" fontSize="8" fill={p.dtT3} pointerEvents="none">
              → TFT · SLEEP/WALK/RUN/TURBO
            </text>
            <rect
              x="525"
              y="12"
              width="145"
              height="50"
              rx="3"
              fill="transparent"
              onClick={() => toggle('display-task')}
              style={{ cursor: 'pointer' }}
            />
          </g>

          {/* ── NetworkTask ── */}
          <g style={{ opacity: nodeOp('network-task'), cursor: 'pointer', transition: 'opacity 0.22s ease' }}>
            <rect
              x="525"
              y="103"
              width="145"
              height="50"
              rx="3"
              fill={sel('network-task') ? p.ntFillSel : 'none'}
              stroke={p.ntStroke(sel('network-task'))}
              strokeWidth={sel('network-task') ? 1.5 : 1}
              style={{ transition: T }}
              pointerEvents="none"
            />
            <text x="597" y="122" textAnchor="middle" fontSize="8" fill={p.ntT1} letterSpacing="1.5" pointerEvents="none">
              CORE 0 · 100 Hz
            </text>
            <text x="597" y="137" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.ntT2} pointerEvents="none">
              NetworkTask
            </text>
            <text x="597" y="149" textAnchor="middle" fontSize="8" fill={p.ntT3} pointerEvents="none">
              → /api/state (JSON)
            </text>
            <rect
              x="525"
              y="103"
              width="145"
              height="50"
              rx="3"
              fill="transparent"
              onClick={() => toggle('network-task')}
              style={{ cursor: 'pointer' }}
            />
          </g>
        </svg>
      </div>

      {/* ── Description panel ── */}
      <div
        style={{
          opacity: selected ? 1 : 0,
          transform: selected ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          pointerEvents: selected ? 'auto' : 'none',
        }}
        className="mt-4 border-t border-white/[0.06] pt-4"
      >
        {selected && (
          <>
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-portfolio/60 mb-2">
              {DESCRIPTIONS[selected].title}
            </p>
            <p className="text-[#a0a0a0] text-sm leading-relaxed">
              {DESCRIPTIONS[selected].body}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
