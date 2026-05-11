export type ProjectCategory = 'all' | 'react' | 'javascript' | 'typescript';

/** Optional long-form case study fields for the /work/:slug page */
export interface ProjectCaseStudy {
  meta?: {
    platform?: string;
    role?: string;
    timeline?: string;
    team?: string;
    tools?: string;
    toolsGroups?: { label: string; items: string }[];
  };
  lead?: string;
  problem?: string;
  overviewMedia?: string;
  highlights?: {
    title: string;
    body: string;
    diagram?: string;
    /** Optional image beside body (e.g. product screenshot), paths under /public */
    asideMedia?: string;
    codeBlocks?: { label: string; code: string }[];
  }[];
  fabrication?: { text: string; images: string[] };
  fieldTest?: { text: string; image: string };
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
}

export const PROJECTS: PortfolioProject[] = [
  {
    id: '1',
    slug: 'carpybara',
    title: 'Carpybara',
    stack: 'In-vehicle device · Speed-driven UI',
    category: ['typescript', 'javascript'],
    tagline: 'A small friend riding along with you in your car.',
    description:
      'Driving can turn into a stretch of sameness: same lanes, same silence, same wait. Carpybara is a small dashboard companion whose motion tracks your speed—there to make those minutes feel less empty, not to shout for attention. I led firmware development and drove product direction as PM/PO: embedded bring-up, reliable sensing pipelines, and the scope and milestone decisions that kept the in-cabin experience on track.',
    url: 'https://carpybara.com/',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EC%9E%90%EB%8F%99%EC%B0%A8%20%EC%86%8D%EB%8F%84%20%EA%B8%B0%EB%B0%98%20IoT%20%EC%9E%A5%EC%8B%9D%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/carpybara.png', '/Carpybara_video.mov', '/carpybara_2.png', '/carpybara_3.jpg','/run (1).gif'],
    heroImage: '/run (1).gif',
    caseStudy: {
      meta: {
        platform: 'In-vehicle embedded device · Companion UI',
        role: 'Firmware development · PM / PO',
        timeline: 'Ongoing',
        team: '4-person core team',
        toolsGroups: [
          { label: 'Firmware & Embedded', items: 'ESP32 · FreeRTOS · PlatformIO · C/C++ · Arduino' },
          { label: 'Sensors', items: 'GPS — HGLRC Mini M100 · IMU — MPU-6050 (GY-521 Module)' },
          { label: 'Tools', items: 'Git · Linux · VS Code · PlatformIO ' },
        ],
      },
      lead:
        'The road is often boring; the cabin does not have to be. Carpybara sits where you already look—a quiet co-pilot whose mood moves with your speed—so the drive feels a little less like clock-watching and a little more like good company.',
      problem:
        'Drivers need information at a glance without cognitive overload. Heavy dashboards compete for attention; a companion layer must stay subtle, readable in sunlight, and responsive to real vehicle state.',
      overviewMedia: '/run (1).gif',
      highlights: [
        {
          title: 'Why FreeRTOS',
          body: 'FreeRTOS replaced the original single-threaded Arduino loop() architecture, where networking, sensor reads, and rendering blocked each other and caused unstable frame rates. The system was redesigned into three independent tasks across both ESP32-S3 cores: NetworkTask for HTTP/DNS handling, SensorTask for GPS and IMU processing, and DisplayTask for 60 FPS rendering. A mutex-protected shared state ensures safe communication between tasks. By isolating networking from rendering, display updates remain stable even during file transfers or sensor activity, resulting in consistent 60 FPS performance and scalable sensor integration.',
          codeBlocks: [
            {
              label: 'tasks.cpp — Three tasks, two cores',
              code: `static void sensorTask(void*) {
  for (;;) {
    PetSensor::write(
      gps.speed.kmph(),
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
    petAnimSetSpeed(s.speed_kmh);
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
        {
          title: 'Sensor pipeline',
          diagram: 'sensor-pipeline',
          body: 'Two sensors stream data into a mutex-guarded SensorState struct every 50 ms via SensorTask on Core 0. GPS frames arrive over UART2 — TinyGPSPlus decodes each NMEA sentence and commits speed, position, and satellite count when isUpdated() fires. The MPU-6050 delivers raw g-values over I2C: brake latches when ax < −0.35 g persists for 80 ms; bump fires immediately at |az| > 1.8 g — both events hold for 2 s so transient hits reliably reach downstream consumers.\n\nTwo independent tasks snapshot the struct safely: DisplayTask (60 Hz, Core 1) maps speed to animation states (SLEEP → WALK → RUN → TURBO) and triggers a skid-mark overlay on brake; NetworkTask (100 Hz, Core 0) serialises the same struct as JSON for the companion app\'s 1 Hz /api/state poll. In GPS-denied environments, debug speed can be injected via Serial Monitor or HTTP POST — real sensor data resumes automatically on the next NMEA sentence.',
          codeBlocks: [
            {
              label: 'pet_sensor.cpp — SensorTask: GPS + IMU → SensorState',
              code: `// SensorTask — 20 Hz, Core 0
void sensorTask(void*) {
  for (;;) {
    // GPS: NMEA stream → TinyGPSPlus
    while (Serial2.available())
      gps.encode(Serial2.read());

    if (gps.speed.isUpdated()) {
      xSemaphoreTake(mutex, portMAX_DELAY);
      state.speed_kmh  = gps.speed.kmph();
      state.lat        = gps.location.lat();
      state.lon        = gps.location.lng();
      state.satellites = gps.satellites.value();
      xSemaphoreGive(mutex);
    }

    // IMU: MPU-6050 → brake / bump detection
    mpu.getEvent(&a, &g, &t);
    float ax = a.acceleration.x / 9.81f;
    float az = a.acceleration.z / 9.81f;
    // ax < -0.35 g for 80 ms → brake_active (2 s latch)
    checkBrake(ax);
    // |az| > 1.8 g instant → bump_active (2 s latch)
    checkBump(az);

    vTaskDelay(pdMS_TO_TICKS(50)); // 20 Hz
  }
}`,
            },
          ],
        },
      ],
      fabrication: {
        text: 'To move Carpybara from breadboard to a device that could actually sit inside a car, we visited UCI FabWorks for a hands-on fabrication session. The enclosure was 3D-printed to house the ESP32-S3, TFT display, and sensor modules within a compact, mountable form factor. Sensor leads were hand-soldered—GPS module over UART2, MPU-6050 over I2C—locking in the physical wiring the firmware already assumed. Working through real tolerances, heat, and cable routing surfaced integration details that only appear when you hold the hardware.',
        images: ['/carpybara_3.jpg', '/carpybara_4.jpg'],
      },
      fieldTest: {
        text: 'To validate the experience in a real cabin, I visited the Rivian showroom at Irvine Spectrum Center and ran the device against an actual vehicle. Testing on a production EV confirmed that sensor readings and UI responses held up outside the lab—and surfaced edge cases in ambient light and mounting angle that only a real interior could reveal.',
        image: '/carpybara_2.png',
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
      'Most rehearsal happens alone—and alone, it is easy to rehearse confidence instead of clarity. Point is a presentation coaching system I built around real practice: you bring material, walk through a short quiz, then deliver while speech and video feed a coordinated set of AI passes. One orchestration layer keeps session state and recovery honest; specialized agents handle brief analysis, live speech cues, MediaPipe-based gaze and posture off the main thread, a pointed five-turn audience Q&A, and a final scorecard in everyday language. I shipped it with React, TypeScript, Zustand, Supabase, and Vercel, and leaned on GPT-4o family models, the Web Speech API, and MediaPipe where perception actually matters—so the hard UX problem stays latency, overload, and continuity, not wiring trivia.',
    url: 'https://pointpresent.com',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EB%B0%9C%ED%91%9C%20%EB%8F%84%EC%9A%B0%EB%AF%B8%20ai%20agent%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/Point.png', '/Point_2.png', '/Point_4.png', '/Point_3.png'],
    caseStudy: {
      meta: {
        platform: 'Web app · Vercel · Supabase',
        role: 'Creator · Full-stack · AI agents & multimodal UX',
        timeline: 'Ongoing',
        team: '2-person core team',
        toolsGroups: [
          { label: 'Frontend', items: 'React 18 · TypeScript · Zustand · Tailwind CSS · Vite' },
          { label: 'AI & sensing', items: 'OpenAI GPT-4o / GPT-4o-mini · Web Speech API · MediaPipe (FaceMesh, Pose, Hands) · Web Workers for vision path' },
          { label: 'Backend & data', items: 'Supabase — Auth · PostgreSQL · Storage' },
          { label: 'Infra', items: 'Vercel deployment · Environment-driven config' },
        ],
      },
      lead:
        'Practicing alone is honest work—but without a mirror you mostly rehearse confidence, not clarity. Point is built so feedback feels objective: measurable speech, visible posture, and an audience that pushes back before the real room does.',
      problem:
        'Rehearsing solo rarely produces objective feedback: you cannot hear every filler, see your own gaze drift, or stress-test arguments the way a live audience does. Real-time correction of speech and body language usually takes a human coach. Spotting weak points from slides alone is slow—and decks optimize for authoring, not for how you actually sound and move on stage.',
      overviewMedia: '/Point.png',
      highlights: [
        {
          title: 'Six agents, one session graph',
          diagram: 'point-agents',
          body:
            'Agent 0 orchestrates a state machine and session recovery. Agent 1 ingests PDF/TXT to extract summaries and weak-area cues for a quiz. Agent 2 tracks speech in real time—WPM, filler words, and semantic off-topic signals. Agent 3 runs MediaPipe-based gaze, posture, and gesture analysis off the main thread. Agent 4 plays a five-turn AI audience for a stress-style Q&A grounded in your gaps. Agent 5 aggregates logs into composite scores and natural-language feedback. Shared session context keeps the pipeline coherent instead of six disconnected chat bots.',
        },
        {
          title: 'Latency, overload, and continuity',
          asideMedia: '/Point_2.png',
          body:
            'The guiding constraints are simple: feedback has to feel immediate where rules allow (near–instant cues), the interface cannot drown you—only the highest-priority nudge surfaces at a time—and every agent has to share the same rehearsal story instead of trading isolated snippets.',
        },
        {
          title: 'End-to-end rehearsal arc',
          asideMedia: '/Point_4.png',
          body:
            'The journey is deliberately linear: upload and quiz first, then a live run with coaching in the loop, then a stressful Q&A pass, then a report you can actually use. It turns “I finished my slides” into “I survived something much closer to stage conditions”—with numbers and narrative at the end instead of a vague gut check.',
        },
      ],
      reflection:
        'Implementing a reliable multi-agent pipeline was one of the hardest parts of this project—coordination, timing, and shared context add up fast. I plan to keep iterating so presenting feels a little easier and less intimidating for people who have to stand up and speak for real.',
    },
  },
];

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  url?: string;
  description?: string;
  bullets?: string[];
  team?: boolean;
  tags: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  
  {
    role: 'Custom Language Builder — PBL Hackathon',
    company: 'Hackathon project',
    period: 'Mar 2026',
    location: 'Web · Interpreter',
    url: 'https://github.com/Yuna616/CustomLanguageLearing',
    bullets: [
      'Built a web app and CLI interpreter for designing and executing custom programming languages, developed during a PBL hackathon.',
      'Implemented a Vite + React frontend with a TypeScript Fastify backend API for writing language specs, running code, and applying languages to educational or gaming contexts.',
    ],
    tags: ['TypeScript', 'React', 'Python', 'Fastify', 'Interpreter'],
  },
  {
    role: 'Neural Network Matrix Optimization',
    company: 'Academic project',
    period: 'Oct 2025 – Dec 2025',
    location: 'C++ · HPC',
    url: 'https://github.com/Yuna616/Neural-Network-Matrix-Optimization-#',
    bullets: [
      'Applied cache-oblivious algorithms, loop unrolling, and AVX2 to matrix multiplication, achieving 4096×4096 ops in under 3 seconds at over 30,000 MFLOPS.',
      'Implemented a Fully Connected layer from scratch in C++ with direct matrix ops using pretrained VGG19 weights; optimized memory access patterns for low-level performance tuning.',
    ],
    tags: ['C++', 'AVX2', 'Matrix Optimization', 'VGG19', 'Performance'],
  },
  {
    role: 'ESP32CAM Human Classifier',
    company: 'Academic project',
    period: 'Mar 2025 – Jun 2025',
    location: 'Embedded · Deep learning',
    url: 'https://github.com/Yuna616/ESP32CAM_HumanClassifier',
    bullets: [
      'Built an ESP32CAM-based real-time human detection and emotion classification system using C/C++ firmware and a Python deep learning backend.',
      'Implemented a camera web server on ESP32CAM for live image capture and streaming, integrated with a FastAPI server for inference.',
      'Designed a full server-client pipeline: ESP32CAM captures and transmits images, backend classifies using a trained neural network model.',
    ],
    tags: ['ESP32CAM', 'C/C++', 'Python', 'FastAPI', 'Deep Learning'],
  },
  {
    role: 'Cohort Class Helper — Computer Network',
    company: 'Teaching Assistant',
    period: 'Mar 2025 – Jun 2025',
    location: 'Computer networks · Mentoring · Faculty study',
    bullets: [
      'Mentored students in computer networking through a peer learning program.',
      'Guided understanding of complex networking concepts and supported collaborative learning.',
      'Completed in-depth computer-networking study alongside a professor.',
      'Conducted research on Grover’s algorithm in quantum computing and symmetric-key cryptography.',
    ],
    tags: ['Computer Networks', 'Mentoring', 'Teaching', 'Quantum Computing', 'Cryptography'],
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
