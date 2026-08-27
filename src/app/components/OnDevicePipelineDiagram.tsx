import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

type NodeId = 'capture' | 'vision-npu' | 'llm-npu' | 'server' | 'browser';

const NODE_META: Record<NodeId, { eyebrow: string; name: string; sub: string }> = {
  'capture':    { eyebrow: 'USB Webcam · GStreamer', name: 'Camera Capture', sub: 'V4L2 · VPU H.264 decode' },
  'vision-npu': { eyebrow: 'Hexagon NPU · Core 0', name: 'Vision Pipeline', sub: '4 models · QNN EP · gaze calibration' },
  'llm-npu':    { eyebrow: 'Hexagon NPU · Core 1', name: 'LLM Judgment', sub: 'Qwen3-4B · QAIRT Genie' },
  'server':     { eyebrow: 'Rust/Axum · :8080', name: 'Control Server', sub: 'REST · stream · recordings' },
  'browser':    { eyebrow: 'Browser', name: 'Monitoring UI', sub: 'live view · logs' },
};

const DESCRIPTIONS: Record<NodeId, string> = {
  'capture':
    'Captures from a standard USB webcam over V4L2 — a DeviceMonitor auto-detects the /dev/videoN device and its supported modes, so swapping cameras needs no config changes. A GStreamer pipeline then decodes H.264 in hardware via the board\'s VPU (v4l2h264dec) whenever available, falling back automatically to a software decodebin path when it isn\'t.',
  'vision-npu':
    'Four quantized models run entirely on NPU core 0 via ONNX Runtime\'s QNN execution provider: face_det_lite (w8a16) → facemap_3dmm (w8a8) → PureGaze for gaze, alongside RF-DETR Nano (FP16) for person detection feeding a pure-Rust port of ByteTrack for multi-person tracking. CPU fallback is blocked, so every stage stays NPU-bound.\n\nGaze calibration runs per session on top of this: a 50-frame baseline (extended if its MAD exceeds 8° to avoid a contaminated baseline), an absolute-angle gate (yaw 39° / pitch 30°), and EMA smoothing (α = 0.4) with a 3-frame dwell + 3° hysteresis to suppress jitter — output as per-person gaze/behavior features, aggregated to JSON.',
  'llm-npu':
    'Qwen3-4B (w4a16 quantized) runs in-process via QAIRT Genie on NPU core 1 — isolated from the vision core so a judgment call never blocks the vision loop\'s real-time frame rate, and vice versa. It consumes the aggregated features core 0 produces without ever stalling core 0\'s next frame.',
  'server':
    'A Rust/Axum hub the pipeline posts frames, detection records, and judgments to. Frames are delivered latest-wins (loss-tolerant) to stay lightweight; detection records are kept in a ~18k-entry ring buffer for reliability — different delivery guarantees for different data. Also serves per-session recording playback.',
  'browser':
    'The frontend long-polls the control server for live frames and detection records, and plays back recorded sessions for review.',
};

function StepArrow() {
  return (
    <div className="flex shrink-0 items-center justify-center px-1 sm:px-2" aria-hidden>
      <ChevronRight className="size-5 text-neutral-300" />
    </div>
  );
}

function NodeCard({
  id,
  selected,
  onClick,
}: {
  id: NodeId;
  selected: boolean;
  onClick: () => void;
}) {
  const m = NODE_META[id];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left rounded-lg border-2 px-4 py-3.5 transition-all duration-200 ${
        selected
          ? 'border-portfolio bg-portfolio/[0.06] shadow-md scale-[1.02]'
          : 'border-neutral-200 bg-white hover:border-portfolio/50 hover:shadow-sm'
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600 mb-1">{m.eyebrow}</p>
      <p className="font-bold text-neutral-900 text-[15px] leading-tight">{m.name}</p>
      <p className="text-xs text-neutral-700 mt-1">{m.sub}</p>
    </button>
  );
}

export function OnDevicePipelineDiagram() {
  const [selected, setSelected] = useState<NodeId | null>('vision-npu');
  const toggle = (id: NodeId) => setSelected((prev) => (prev === id ? null : id));

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-700 mb-1">System pipeline</p>
      <p className="font-mono text-xs text-neutral-700 mb-6">Click a step to explore</p>

      <div className="overflow-x-auto">
        <div className="flex items-center min-w-[720px] sm:min-w-0">
          {/* Capture */}
          <div className="w-40 shrink-0">
            <NodeCard id="capture" selected={selected === 'capture'} onClick={() => toggle('capture')} />
          </div>

          <StepArrow />

          {/* Hexagon NPU — two cores side by side, running in parallel */}
          <div className="shrink-0 rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/40 px-3 sm:px-4 py-3">
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.15em] text-indigo-400 font-semibold mb-2.5">
              Hexagon NPU · ∥ parallel cores
            </p>
            <div className="flex items-center gap-2">
              <div className="w-40">
                <NodeCard id="vision-npu" selected={selected === 'vision-npu'} onClick={() => toggle('vision-npu')} />
              </div>
              <ChevronRight className="size-4 text-indigo-300 shrink-0" aria-hidden />
              <div className="w-40">
                <NodeCard id="llm-npu" selected={selected === 'llm-npu'} onClick={() => toggle('llm-npu')} />
              </div>
            </div>
            <p className="text-center font-mono text-[10px] text-indigo-400/80 mt-2.5">
              neither core blocks the other
            </p>
          </div>

          <StepArrow />

          {/* Server */}
          <div className="w-40 shrink-0">
            <NodeCard id="server" selected={selected === 'server'} onClick={() => toggle('server')} />
          </div>

          <StepArrow />

          {/* Browser */}
          <div className="w-40 shrink-0">
            <NodeCard id="browser" selected={selected === 'browser'} onClick={() => toggle('browser')} />
          </div>
        </div>
      </div>

      {/* ── Selected step detail ── */}
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
              {NODE_META[selected].name}
            </p>
            {DESCRIPTIONS[selected].split('\n\n').map((para, i) => (
              <p key={i} className="text-neutral-900 text-sm leading-relaxed mb-2 last:mb-0">
                {para}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
