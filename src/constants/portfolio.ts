export type ProjectCategory = 'all' | 'react' | 'javascript' | 'typescript';

/** Optional long-form case study fields for the /work/:slug page */
export interface ProjectCaseStudy {
  meta?: {
    platform?: string;
    role?: string;
    timeline?: string;
    location?: string;
    team?: string;
    tools?: string;
    toolsGroups?: { label: string; items: string }[];
  };
  lead?: string;
  problem?: string;
  overviewMedia?: string;
  /** Overrides the "Key points" section heading (e.g. 'Technical') */
  highlightsTitle?: string;
  highlights?: {
    title: string;
    /** Optional when the section's own diagram (e.g. point-agents) carries the explanation instead */
    body?: string;
    diagram?: string;
    /** Optional image beside body (e.g. product screenshot), paths under /public */
    asideMedia?: string;
    codeBlocks?: { label: string; code: string }[];
  }[];
  /** Demo video section, shown between "Key points" and "Field test" */
  demoVideo?: { text?: string; video: string; poster?: string };
  fabrication?: { text: string; images: string[] };
  /** Overrides the "Field test" section heading (e.g. 'User testing') */
  fieldTestTitle?: string;
  fieldTest?: { text: string; images: string[] };
  reflection?: string;
}

export interface PortfolioProject {
  id: string;
  /** URL segment for /work/:slug */
  slug: string;
  title: string;
  stack: string;
  category: Exclude<ProjectCategory, 'all'>[];
  /** Short uppercase line under the title in the modal */
  tagline: string;
  description: string;
  /** Optional live demo or production URL */
  url?: string;
  /** Optional development log / build journal (e.g. blog category) */
  devLogUrl?: string;
  /** Gallery screenshots (first is also used on the card when present) */
  images: string[];
  /** Override the hero image on the case study page independently of the gallery */
  heroImage?: string;
  caseStudy?: ProjectCaseStudy;
  /** Display period for the home timeline, e.g. 'Mar 2026 – Jun 2026' */
  period?: string;
  /** ISO 'YYYY-MM' — start of period, used for timeline sorting */
  periodStart?: string;
  /** ISO 'YYYY-MM' — end of period (or same as periodStart), used for timeline sorting */
  periodEnd?: string;
  /** Program this project was built under, e.g. 'Kookmin Global PBL Program' */
  program?: string;
  /** Set to false to keep the project's case study page but hide it from the home timeline */
  includeInTimeline?: boolean;
}

export const PROJECTS: PortfolioProject[] = [
  {
    id: '1',
    slug: 'carpybara',
    title: 'Carpybara',
    stack: 'In-vehicle ioT device · Firmware develop',
    category: ['typescript', 'javascript'],
    tagline: 'A small friend riding along with you in your car.',
    description:
      'Driving can turn into a stretch of sameness: same lanes, same silence, same wait. Carpybara is a small dashboard companion whose motion tracks your speed—there to make those minutes feel less empty, not to shout for attention.',
    url: 'https://carpybara.com/',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EC%9E%90%EB%8F%99%EC%B0%A8%20%EC%86%8D%EB%8F%84%20%EA%B8%B0%EB%B0%98%20IoT%20%EC%9E%A5%EC%8B%9D%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/carpybara.png', '/Carpybara_video.mov', '/carpybara_2.png', '/carpybara_3.jpg','/carpybara_5.jpg','/run (1).gif','/carpybara_6.jpg'],
    heroImage: '/run (1).gif',
    period: 'Mar 2026 – Jun 2026',
    periodStart: '2026-03',
    periodEnd: '2026-06',
    program: 'Kookmin Global PBL Program',
    caseStudy: {
      meta: {
        platform: 'In-vehicle embedded device · Companion UI',
        role: 'Firmware development · Embedded Systems Engineer',
        timeline: 'Ongoing',
        location: 'Irvine, CA',
        team: '4-person core team',
        toolsGroups: [
          { label: 'Firmware & Embedded', items: 'ESP32-S3 (Waveshare ESP32-S3-Zero) · FreeRTOS · PlatformIO · C/C++ · Arduino' },
          { label: 'Sensors', items: 'GPS — HGLRC Mini M100 · IMU — MPU-6050 (GY-521 Module)' },
          { label: 'Tools', items: 'Git · Linux · VS Code · PlatformIO · OnShape 3D Printer' },
        ],
      },
      problem:
        'Driving can turn into a stretch of sameness—same lanes, same silence, same wait. Carpybara is a small device mounted on the dashboard that tracks the car\'s speed and turns it into motion, so those minutes feel a little less empty.',
      overviewMedia: '/run (1).gif',
      highlights: [
        {
          title: 'System diagram',
          diagram: 'sensor-pipeline',
          body: 'GPS and IMU readings feed into a shared state on the ESP32-S3, which the display and the companion app then read from independently. GPS gives an accurate but slow (1 Hz) speed reading, the IMU fills the gaps in between so the on-screen motion stays smooth.',
        },
        {
          title: 'Hardware spec',
          body: 'The core is a Waveshare ESP32-S3-Zero, paired with an HGLRC Mini M100 GPS module for speed and an MPU-6050 IMU for motion sensing. A small display renders the pet animation, and everything sits inside a compact 3D-printed enclosure sized to mount on a dashboard.',
          asideMedia: '/carpybara_11.png',
        },
        {
          title: 'Firmware design',
          body: 'The firmware moved from a single-threaded Arduino loop() to a FreeRTOS design split across three tasks on both ESP32-S3 cores—one for sensors, one for rendering, one for networking—so a slow network call or sensor read never stalls the on-screen animation.',
          codeBlocks: [
            {
              label: 'tasks.cpp — Three tasks, two cores',
              code: `static void sensorTask(void*) {
  for (;;) {
    PetSensor::write(
      gps.speed.mph(),
      detectBrake(),
      detectBump()
    );
    vTaskDelay(pdMS_TO_TICKS(50)); // 20 Hz
  }
}

static void displayTask(void*) {
  for (;;) {
    SensorState s;
    PetSensor::petSensorRead(&s); // mutex snapshot
    petAnimSetSpeed(s.speed_mph_smooth);
    petAnimDraw();
    vTaskDelay(pdMS_TO_TICKS(16)); // ~60 fps
  }
}

static void networkTask(void*) {
  for (;;) {
    petWebTick(); // may block — Core 0 only
    vTaskDelay(pdMS_TO_TICKS(10)); // 100 Hz
  }
}`,
            },
          ],
        },
      ],
      demoVideo: {
        text: 'Carpybara moving through its animation states as speed changes, mounted on a dashboard.',
        video: '/Carpybara_video.mov',
        poster: '/carpybara.png',
      },
      fabrication: {
        text: 'To move Carpybara from breadboard to a device that could actually sit inside a car, we visited UCI FabWorks for a hands-on fabrication session—3D-printing an enclosure for the ESP32-S3, display, and sensors, and hand-soldering the GPS and IMU leads into place.',
        images: ['/carpybara_3.jpg','/carpybara_7.png','/carpybara_6.png','/carpybara_4.jpg'],
      },
      fieldTest: {
        text: 'To validate the experience in a real cabin, I visited the Rivian showroom at Irvine Spectrum Center and tested the device in an actual vehicle. I also brought Carpybara to a range of local people around Irvine and had them try it hands-on, to see how it landed outside the lab.',
        images: ['/carpybara_2.png', '/carpybara_5.jpg', '/carpybara_8.png', '/carpybara_9.png', '/carpybara_10.png'],
      },
      reflection:
        'Building a hardware device and getting it to a point where it can actually be used in the real world were both harder than they look on paper. Tuning the circuit and firmware is only the start—mounting, environment, and durability are the kinds of details you only really learn once you take the thing out of the lab. Carpybara was a sharp reminder of that gap.',
    },
  },
  {
    id: '2',
    slug: 'pcb-agent',
    title: 'PCB Agent',
    stack: 'Chrome extension · EasyEDA · GPT-4o · beginner-first explanations',
    category: ['javascript', 'typescript'],
    tagline: 'Even with no prior knowledge—you can design a PCB.',
    description:
      'One idea sits at the center of this project: explanations that beginners can actually use. Electrical rules, warnings, and fix suggestions are meant to read as actionable language—not CAD jargon—and the AI coach, checklists, and quick prompts all serve that same goal. The spark was practical: Carpybara needed production boards while none of us had PCB experience; feedback only experts can parse felt useless. Technically, PCB Agent is a Chrome MV3 extension beside EasyEDA: it reads the schematic, runs GPT-4o-backed rule checks, and keeps the coach in the same panel. I shipped it solo—MAIN-world reader, MutationObserver pipeline, five-tab UI, three-agent service worker, optional FastAPI backend (`pcb-schematic-api/`). The README documents EasyEDA Standard/Pro, OSHWLab, LCEDA targets and load-unpacked setup.',
    url: 'https://github.com/Yuna616/PCB_Agent',
    images: [
      '/PCB_2.png',
      '/PCB_1.png','/pcb_demo_1.mp4'
    ],
    heroImage: '/PCB_2.png',
    /** Kept as a case study (still reachable via its own URL) but left off the home timeline. */
    includeInTimeline: false,
    caseStudy: {
      meta: {
        platform: 'Chrome MV3 extension · EasyEDA',
        timeline: 'Ongoing',
        team: 'Built solo',
        toolsGroups: [
          {
            label: 'Extension & EasyEDA',
            items:
              'Chrome MV3 · vanilla JS · service worker · MAIN-world reader · MutationObserver · schematic IPC bridge',
          },
          { label: 'AI', items: 'OpenAI GPT-4o · JSON ERC · coach + document agents' },
        ],
      },
      lead:
        'If the UI stops at expert vocabulary, it failed. PCB Agent’s first success metric is simple: can a beginner tell what to change next—stated at eye level, not in shorthand.',
      problem:
        'When you’re new to PCBs, the tool may be open but the feedback still isn’t. Terms like nets, decoupling, and Gerber thrown without context do not turn into action. When Carpybara needed production boards, our team was in the same boat—so the design premise was blunt: if you cannot understand the explanation, it is not a feature.\n\nEven inside EasyEDA, validation and help often drift away from the canvas. PCB Agent keeps violations, rationale, and gentler “how to fix it” copy in the same panel while you draw.',
      overviewMedia: '/PCB_1.png',
      highlights: [
        {
          title: 'Reading EasyEDA from the inside',
          body:
            'Isolated content scripts cannot see EasyEDA’s internal JS objects—so `easyeda-reader.js` runs in the page’s MAIN world and pulls structured state from `window.EasyEDA.core`, `window.EASYEDAPRO`, or Redux-style stores before falling back to canvas presence checks. A `MutationObserver` watches the editor surface; combined with a hash of components + nets, unchanged canvases skip redundant work so auto-ERC does not spam the API.\n\n`contentScript.js` hosts the five-tab panel (DRC, AI Coach, Docs, checklist, quick prompts). `messageBridge.js` keeps IPC predictable between the page, panel, and background worker—the extension stays responsive even when GPT calls take seconds.',
          codeBlocks: [
            {
              label: 'Architecture (from repo README)',
              code: `Chrome Browser
│
├─ EasyEDA Tab
│   ├─ easyeda-reader.js   ← MAIN world: globals + MutationObserver
│   ├─ contentScript.js    ← 5-tab UI, debounced auto-ERC pipeline
│   ├─ messageBridge.js    ← content ↔ background IPC
│   └─ panel.css           ← Dark theme (IBM Plex)
│
├─ Popup — OpenAI API key storage
│
└─ background.js            ← Service worker: 3-agent pipeline
    ├─ analyze_documents   → structured project JSON
    ├─ chat                → GPT-4o with schematic + doc context
    └─ run_drc             → 10-rule ERC (JSON, temp 0.1)

Optional: pcb-schematic-api/ (FastAPI) — /generate, /erc, /parts/search, /bom/jlcpcb`,
            },
          ],
        },
        {
          title: 'Live ERC: ten rules, two debounces',
          body:
            'Beginners should not have to decode acronyms to know what to change—the ten ERC categories return Error / Warning / Info levels each tied to concrete fix copy (what is wrong, why it matters, what to try next).\n\nWhen the schematic changes, a 1.5 s debounce gates circuit scans; eight seconds after the last edit, a full AI ERC runs automatically and refreshes the DRC tab. Violations span floating pins, missing bypass caps per VCC, GND symbols, input polarity protection, connector ESD, I²C/RST pull-ups, net naming, power rail symbols, MCU reset RC networks, and crystal load caps.\n\nThe panel badge shows live counts (or a pass checkmark); a status bar pulses green while monitoring, yellow on change, blue during analysis. Users can still force “Scan circuit” or “Run AI ERC” when they want immediate feedback.',
          codeBlocks: [
            {
              label: 'background.js — three handlers (conceptual)',
              code: `// Pseudocode shape of the MV3 worker routing
async function onMessage(msg) {
  switch (msg.type) {
    case "analyze_documents":
      return await analyzeDocuments(msg.files); // structured JSON
    case "chat":
      return await coachChat(msg.thread, msg.schematicContext, msg.docs);
    case "run_drc":
      return await runElectricalRules(msg.schematicSnapshot, {
        model: "gpt-4o",
        response_format: { type: "json_object" },
        temperature: 0.1,
      });
  }
}`,
            },
          ],
        },
      ],
      reflection:
        'PCB design is a seriously difficult discipline—one that doesn’t yield easily to a weekend tutorial. That steep curve is exactly why I leaned on AI: not to skip learning, but to make each step legible. Feedback lands where you are drawing, in language you can act on, so understanding compounds instead of stalling. Hard domains stay hard; with the right tooling they still reward patience—and you can climb them one careful iteration at a time.',
    },
  },
  {
    id: '3',
    slug: 'point',
    title: 'Point',
    stack: 'React · TypeScript · Multi-agent coaching · Supabase',
    category: ['react', 'typescript'],
    tagline: 'An AI agent that helps you level up your presentation skills.',
    description:
      'Practicing a presentation alone is hard. Point is a presentation coaching system I built around real rehearsal: bring your material, work through a short quiz, then deliver your talk — while your voice and video are analyzed by an AI pipeline in real time.',
    url: 'https://pointpresent.com',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EB%B0%9C%ED%91%9C%20%EB%8F%84%EC%9A%B0%EB%AF%B8%20ai%20agent%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/Point.png', '/Point_2.png', '/Point_4.png', '/Point_3.png'],
    period: 'Mar 2026 – Jun 2026',
    periodStart: '2026-03',
    periodEnd: '2026-06',
    program: 'Kookmin Global PBL Program',
    caseStudy: {
      meta: {
        platform: 'Web app · Vercel · Supabase',
        role: 'Creator · Full-stack · AI agents & multimodal UX',
        timeline: 'Ongoing',
        location: 'Irvine, CA',
        team: '2-person core team',
        toolsGroups: [
          { label: 'Frontend', items: 'React 18 · TypeScript · Zustand · Tailwind CSS · Vite' },
          { label: 'AI & sensing', items: 'OpenAI GPT-4o / GPT-4o-mini · Web Speech API · MediaPipe (FaceMesh, Pose, Hands)' },
          { label: 'Backend & data', items: 'Supabase — Auth · PostgreSQL · Storage' },
          { label: 'Infra', items: 'Vercel deployment' },
        ],
      },
      overviewMedia: '/Point.png',
      highlightsTitle: 'Technical',
      highlights: [
        {
          title: 'Six agents, one session graph',
          diagram: 'point-agents',
        },
      ],
      demoVideo: {
        video: '/point_demo.mp4',
        poster: '/Point.png',
      },
      fieldTestTitle: 'User testing',
      fieldTest: {
        text:
          'I visited the UCI ANTrepreneur Center and tested Point with someone who works there as an actual presentation coach, walking through the app together and getting hands-on feedback. I also brought it to a campus poster session and gathered feedback from a range of students trying it firsthand.',
        images: ['/Point_6.jpg', '/Point_5.jpg'],
      },
      reflection:
        'Building a stable multi-agent pipeline was one of the hardest parts of this project — coordination, timing, and shared context compound quickly. I plan to keep improving it so that people who actually have to present can do so more easily and with less pressure.',
    },
  },
];

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Optional long-form case study content for the /experience/:slug page — same visual language as a project's ProjectCaseStudy */
export interface ExperienceCaseStudy {
  /** Full-width hero image or video (.mp4/.mov/.webm/.ogg) shown at the top of the /experience/:slug page, paths under /public */
  heroMedia?: string;
  meta?: {
    /** Array renders as a bulleted list instead of a single "·"-joined line */
    role?: string | string[];
    timeline?: string;
    team?: string;
    toolsGroups?: { label: string; items: string }[];
  };
  lead?: string;
  problem?: string;
  /** Overrides the "Key points" section heading (e.g. 'Technical') */
  highlightsTitle?: string;
  highlights?: {
    title: string;
    body?: string;
    /** Rendered as a bulleted list instead of prose paragraphs when set */
    items?: string[];
    diagram?: string;
    codeBlocks?: { label: string; code: string }[];
    /** Optional image beside body (e.g. hardware photo, reference diagram), paths under /public — ignored when codeBlocks is set */
    asideMedia?: string;
  }[];
  /** Demo recordings, shown between "Key points" and the next section */
  demoVideos?: { text?: string; video: string }[];
  /** A second technical section, title overridable (e.g. 'Pipeline & control server') */
  secondaryTitle?: string;
  secondary?: { text: string; items?: string[] };
  /** Testing/evaluation methodology, title overridable (e.g. 'Verification') */
  verificationTitle?: string;
  verification?: { text: string; items?: string[] };
  reflection?: string;
}

export interface ExperienceItem {
  /** URL segment for /experience/:slug */
  slug: string;
  role: string;
  company: string;
  period: string;
  /** ISO 'YYYY-MM' — start of period, used for timeline sorting */
  periodStart: string;
  /** ISO 'YYYY-MM' — end of period, used for timeline sorting */
  periodEnd: string;
  location: string;
  url?: string;
  description?: string;
  /** Short lead paragraph shown at the top of the /experience/:slug page */
  summary?: string;
  bullets?: string[];
  team?: boolean;
  tags: string[];
  /** If set, the timeline card's "Detail" button opens this URL (new tab) instead of /experience/:slug */
  detailUrl?: string;
  /** Overrides summary+bullets with just this one line in the home timeline card preview */
  previewText?: string;
  /** Photo strip shown in the home timeline card preview, paths under /public */
  images?: string[];
  /** Square icon shown on the home timeline card (falls back to initials), path under /public */
  icon?: string;
  /** Optional rich case study — when set, /experience/:slug renders the full project-style layout instead of the plain summary/bullets view */
  caseStudy?: ExperienceCaseStudy;
}

export const EXPERIENCE: ExperienceItem[] = [

  {
    slug: 'on-device-ai-cheating-detection-system',
    role: 'On-Device AI Cheating Detection System',
    company: 'Embedded Systems Engineer',
    period: 'Jun 2026 – Present',
    periodStart: '2026-06',
    periodEnd: '2026-08',
    location: 'Irvine, CA',
    team: true,
    summary:
      'A fully on-device edge AI system that detects exam cheating from a single webcam feed. Vision inference and LLM judgment run on separate cores of a dual Hexagon NPU, so the board operates in real time with no cloud dependency.',
    bullets: [
      'Architected a dual-NPU pipeline on a Radxa Airbox Q900 (Qualcomm QCS9075) — vision inference pinned to Hexagon NPU core 0, Qwen3-4B (w4a16 quantized) judgment pinned to core 1 via QAIRT Genie — with CPU fallback blocked so the whole pipeline stays NPU-bound and LLM judgment never blocks real-time vision inference.',
      'Benchmarked 4 gaze-estimation models by cross-dataset MAE on MPIIFaceGaze (45k samples, 15 subjects); the top scorer (PureGaze, 7.10°) regressed to 6 false positives on real evaluation clips. Traced it to camera-angle conditions the benchmark didn\'t capture and redesigned calibration — MAD-gated baseline collection, an absolute-angle gate, and EMA + hysteresis smoothing — cutting false positives 6 → 2 while holding recall at 1.0 (10/10).',
      'Deployed 4 quantized vision models (face detection, 3D landmark mapping, gaze estimation, person detection) fully on NPU via ONNX Runtime\'s QNN execution provider, and ported ByteTrack from Python to dependency-free Rust for multi-person tracking.',
      'Built the GStreamer camera pipeline (V4L2 capture, hardware H.264 decode via the board\'s VPU with software fallback, auto device detection) and a Rust/Axum control server serving live frames and detection records, then validated end-to-end with a confusion-matrix accuracy harness across 8 cheating clips and 2 normal cases.',
    ],
    tags: ['Qualcomm QCS9075', 'Dual-NPU', 'Rust', 'ONNX Runtime QNN EP', 'Gaze Calibration'],
    previewText:
      'A dual-NPU edge AI system on Radxa Airbox (Qualcomm QCS9075), isolating vision inference (NPU0) and LLM judgment (NPU1) for cloud-independent, real-time execution.',
    images: ['/ondevice_1.webp', '/ondevice_demo1.mp4'],
    icon: '/ondevice_3.jpg',
    caseStudy: {
      heroMedia: '/ondevice_demo1.mp4',
      meta: {
        timeline: 'Jun 2026 – Present',
        team: '4-person team project',
        toolsGroups: [
          { label: 'Hardware', items: 'Radxa Airbox Q900 — Qualcomm QCS9075, 2× Hexagon NPU cores' },
          { label: 'Runtime & models', items: 'Rust (Axum, ort/ONNX Runtime QNN EP, GStreamer) · Qualcomm QAIRT · Python (eval harness)' },
          { label: 'Quantization', items: 'w8a16 / w8a8 / FP16 / w4a16' },
          { label: 'Platform', items: 'Linux aarch64' },
        ],
      },
      problem:
        'Exam proctoring needs to catch cheating in real time. Sending video to a server for every check is not practical though: the bandwidth cost adds up fast, it raises privacy concerns, and the round-trip latency is too slow for live monitoring anyway. This project tackles that by moving detection on-device, so cheating can be caught in real time even fully offline.',
      highlightsTitle: 'Technical',
      highlights: [
        {
          title: 'System architecture',
          diagram: 'on-device-pipeline',
          items: [
            'The core design decision was splitting the work across the board\'s two Hexagon NPU cores. Vision inference runs on core 0 and LLM judgment runs on core 1, completely independently, so no matter how long a judgment call takes, the vision loop keeps its frame rate steady, and the same holds true the other way around.',
            'Models reach the NPU through Qualcomm\'s QAIRT stack. ONNX Runtime\'s QNN execution provider hands each model off to the Qualcomm AI Engine Direct API, which schedules it directly onto the Hexagon NPU\'s HTP, HMX, and HVX cores instead of falling back to the GPU or CPU.',
            'Video decoding and encoding are handled separately through the VPU. If the NPU had to take on that work too, it would eat into the compute budget needed for vision inference and LLM judgment, so offloading it to the VPU, a dedicated hardware unit for decode/encode, keeps the NPU free for the actual inference work. It\'s also considerably faster than software decoding.',
          ],
          asideMedia: '/ondevice_2.webp',
        },
        {
          title: 'Hardware',
          body:
            'A Radxa Airbox Q900, a fanless box cooled by a heatsink and built around the Qualcomm QCS9075, is the entire runtime. It has dual antennas for wireless, USB, Ethernet, HDMI, and SIM ports on the I/O panel, and no moving parts, which matters for something meant to sit on a desk running continuously through an exam.',
          asideMedia: '/ondevice_1.webp',
        },
      ],
      demoVideos: [
        {
          text: 'A user taking a mock exam while the vision pipeline tracks their gaze and movement in real time; those detections feed the LLM, which judges whether the behavior counts as cheating.',
          video: '/ondevice_demo1.mp4',
        },
        {
          text: 'The web monitoring UI: a proctor can browse the full exam history and clip straight to just the moments flagged as cheating.',
          video: '/ondevice_demo2.mp4',
        },
      ],
      reflection:
        'Working on this project deepened my understanding of embedded systems considerably. Scheduling work directly across NPU cores and working with the QNN stack gave me a hands-on feel for what it actually means to design under tight resource constraints. Problems that would normally just get offloaded to the cloud had to be solved on-device instead, which pushed me to learn far more than I would have otherwise. Going through this process also convinced me that the on-device AI market is only going to grow from here. I see this project as a small example of that broader shift.',
    },
  },
  {
    slug: 'teaching-assistant-computer-networks',
    role: 'Teaching Assistant',
    company: 'Paid TA for a Computer Networks Course',
    icon: '/kmu.webp',
    period: 'Mar 2025 – Jul 2025',
    periodStart: '2025-03',
    periodEnd: '2025-07',
    location: 'Seoul, Korea',
    summary:
      'Paid TA for a Computer Networks course, mentoring 30+ undergraduates through weekly office hours.',
    bullets: [
      'Mentored 30+ undergraduates in a Computer Networks course by simplifying complex technical concepts (TCP/IP, routing, network security) during weekly office hours to support academic performance.',
      'Completed an in-depth networking study alongside the professor, going beyond the course curriculum.',
    ],
    tags: ['Computer Networks', 'TCP/IP', 'Routing', 'Network Security', 'Mentoring'],
    detailUrl: 'https://pepper-alpaca-8cd.notion.site/25-6bc43417d64a82de8205818beab9bfab',
  },
];

export function getExperienceBySlug(slug: string): ExperienceItem | undefined {
  return EXPERIENCE.find((e) => e.slug === slug);
}

export interface EducationActivity {
  title: string;
  bullets: string[];
  /** Display text, e.g. 'Mar 2026 – Aug 2026' */
  period?: string;
}

export interface EducationItem {
  /** Unique id — kept even though there's no detail page, for stable React keys etc. */
  slug: string;
  school: string;
  degree: string;
  location: string;
  /** Display text, e.g. 'Mar 2023 – Aug 2027 (Expected)' */
  period: string;
  /** ISO 'YYYY-MM' — used for timeline sorting (when this "first appeared") */
  periodStart: string;
  /** ISO 'YYYY-MM' — used for timeline sorting */
  periodEnd: string;
  gpa?: string;
  /** Square logo shown on the timeline card, path under /public */
  icon?: string;
  /** Full course list — the short `previewCourses` list is what actually renders */
  courses?: string[];
  /** Short highlight list shown in the home timeline card preview — falls back to `courses` */
  previewCourses?: string[];
  /** Clubs & societies, each with its own bullet points */
  activities?: EducationActivity[];
  /** Honors & awards, one line each */
  honors?: string[];
}

export const EDUCATION: EducationItem[] = [
  {
    slug: 'kookmin-university',
    school: 'Kookmin University',
    degree: 'Bachelor of Software Engineering',
    location: 'Seoul, Korea',
    period: 'Mar 2023 – Aug 2027 (Expected)',
    periodStart: '2023-03',
    periodEnd: '2027-08',
    gpa: '4.19 / 4.5',
    icon: '/kmu.webp',
    courses: [
      'Operating Systems',
      'Computer Architecture',
      'System Software',
      'Cloud Computing',
      'Database',
      'C++ Programming',
      'Data Science',
      'Computer Network',
      'File Processing',
      'Algorithms',
      'Object-Oriented Analysis & Design',
      'Digital Logic Design',
    ],
    previewCourses: [
      'Operating Systems',
      'Computer Architecture',
      'System Software',
      'Digital Logic Design',
      'C++ Programming',
    ],
    activities: [
      {
        title: 'KMU Global PBL',
        period: 'Mar 2026 – Aug 2026',
        bullets: [
          'Selected for a competitive global PBL program in Irvine focused on real-world product development.',
          'Developed embedded software and full-stack services, delivering end-to-end systems.',
          'Built AI-powered applications using LLM-driven development (Claude, Cursor) in a startup-style environment.',
        ],
      },
    ],
    honors: [
      'Software Specialization Merit Scholarship — Awarded for outstanding academic performance (Spring & Fall 2024)',
    ],
  },
];

export function getEducationBySlug(slug: string): EducationItem | undefined {
  return EDUCATION.find((e) => e.slug === slug);
}

export type CourseCategory = 'embedded' | 'ai' | 'algorithms' | 'networks' | 'web' | 'math';

export interface CourseItem {
  id: string;
  name: string;
  category: CourseCategory;
  semester: string;
  grade?: string;
  description: string;
  topics: string[];
  tools?: string[];
}

export const GPA = { value: 4.02, scale: 4.5 };

export const COURSES: CourseItem[] = [
  {
    id: 'os',
    name: 'Operating Systems',
    category: 'networks',
    semester: '2024-1',
    description: 'Core concepts covering process management, memory, and file systems with hands-on Linux implementation.',
    topics: [
      'Process and thread lifecycle management',
      'CPU scheduling algorithms (FCFS, SJF, Round Robin, priority)',
      'Synchronization: mutex, semaphore, monitor',
      'Deadlock detection and prevention strategies',
      'Virtual memory and page replacement algorithms',
      'File system internals and I/O management',
    ],
    tools: ['C', 'Linux', 'POSIX'],
  },
  {
    id: 'ca',
    name: 'Computer Architecture',
    category: 'embedded',
    semester: '2023-2',
    description: 'Digital computer organization from logic gates to CPU pipeline design and memory hierarchy.',
    topics: [
      'Instruction Set Architecture (ISA) design',
      'MIPS assembly language programming',
      '5-stage CPU pipeline design',
      'Hazard detection and data forwarding',
      'Cache memory design and replacement policies',
      'Memory hierarchy and performance analysis',
    ],
    tools: ['MIPS Assembly', 'Logisim', 'C'],
  },
  {
    id: 'lcd',
    name: 'Logic Circuit Design',
    category: 'embedded',
    semester: '2023-1',
    description: 'Combinational and sequential logic circuit design using Boolean algebra and hardware description language.',
    topics: [
      'Boolean algebra and Karnaugh maps',
      'Combinational circuits: MUX, decoder, adder, comparator',
      'Sequential circuits: flip-flops, registers, counters',
      'Finite state machines (Mealy / Moore)',
      'Verilog HDL design and simulation',
      'FPGA implementation and verification',
    ],
    tools: ['Verilog', 'Xilinx Vivado', 'FPGA'],
  },
  {
    id: 'mpa',
    name: 'Microprocessor Applications',
    category: 'embedded',
    semester: '2024-2',
    description: 'ARM Cortex-M based microprocessor programming, from assembly language to peripheral interfacing.',
    topics: [
      'ARM Cortex-M architecture and register set',
      'Assembly language programming',
      'Memory map and addressing modes',
      'Timer/counter, PWM, and ADC interfacing',
      'UART / SPI / I2C peripheral communication',
      'Interrupt handling and vector table configuration',
    ],
    tools: ['STM32', 'Keil MDK', 'ARM Assembly', 'C'],
  },
  {
    id: 'ooad',
    name: 'Object-Oriented Analysis & Design',
    category: 'web',
    semester: '2024-1',
    description: 'Systematic software design using OOP principles, UML modeling, and industry-standard design patterns.',
    topics: [
      'OOP principles: encapsulation, inheritance, polymorphism, abstraction',
      'UML diagrams: class, sequence, activity, use case',
      'Design patterns: Creational, Structural, Behavioral (GoF)',
      'SOLID principles and clean architecture',
      'Requirement analysis and system modeling',
      'Agile and iterative development workflow',
    ],
    tools: ['Java', 'UML', 'Figma', 'Git'],
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    category: 'networks',
    semester: '2025-1',
    description: 'TCP/IP protocol stack, routing algorithms, network security, and an introduction to quantum cryptography.',
    topics: [
      'OSI 7-layer model',
      'TCP / IP and UDP protocol internals',
      'HTTP / HTTPS, DNS, DHCP, SMTP',
      'Routing algorithms: OSPF, BGP, distance-vector',
      'Symmetric-key encryption and PKI infrastructure',
      "Grover's algorithm and post-quantum cryptography",
    ],
    tools: ['Wireshark', 'Python', 'Socket Programming'],
  },
  {
    id: 'cg',
    name: 'Computer Graphics',
    category: 'algorithms',
    semester: '2025-1',
    description: '2D/3D rendering pipeline, geometric transformations, shading models, and real-time rendering techniques.',
    topics: [
      '2D / 3D coordinate transformations and projection',
      'Rendering pipeline and rasterization',
      'Lighting models: Phong, Blinn-Phong',
      'Texture mapping and UV coordinates',
      'Hidden surface removal (z-buffer)',
      'OpenGL shader programming (GLSL)',
    ],
    tools: ['OpenGL', 'GLSL', 'C++', 'WebGL'],
  },
  {
    id: 'la',
    name: 'Linear Algebra',
    category: 'math',
    semester: '2023-1',
    description: 'Vector spaces, matrix operations, and eigenvalue decomposition — the mathematical backbone of AI and graphics.',
    topics: [
      'Vectors, vector spaces, and subspaces',
      'Matrix operations, inverse, and transpose',
      'Gaussian elimination and LU decomposition',
      'Eigenvalues and eigenvectors',
      'Singular value decomposition (SVD)',
      'Principal component analysis (PCA)',
    ],
    tools: ['Python', 'NumPy', 'MATLAB'],
  },
  {
    id: 'cpp',
    name: 'C++ Programming',
    category: 'algorithms',
    semester: '2022-2',
    description: 'Advanced C++ covering OOP, templates, STL, memory management, and modern C++ features.',
    topics: [
      'Classes, inheritance, polymorphism, and virtual functions',
      'Templates and generic programming',
      'STL containers and algorithms (vector, map, set, sort)',
      'Dynamic memory management and RAII',
      'Smart pointers (unique_ptr, shared_ptr)',
      'Modern C++ (C++11/14/17): move semantics, lambdas, auto',
    ],
    tools: ['C++', 'GCC', 'CMake', 'Valgrind'],
  },
];

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      '하드웨어에 가까운 제품을 다룰 때도 사용자 관점을 잃지 않고, 프로토타입을 빠르게 맞춰 줍니다.',
    name: '협업자',
    role: '프로젝트 피드백 — 실명으로 교체 가능',
  },
  {
    quote:
      '발표 도구를 만들면서도 톤과 정보 구조를 정돈하려는 태도가 인상적이었습니다.',
    name: '발표 모임 동료',
    role: '사용 피드백',
  },
  {
    quote:
      '차량·웹·에이전트처럼 영역이 달라도 일관된 스토리로 연결해 설명합니다.',
    name: '멘토',
    role: '성장 방향 논의',
  },
];
