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
  approach?: string;
  highlights?: { title: string; body: string }[];
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
    tagline: 'Long drives drag—Carpybara keeps them from feeling that way.',
    description:
      'Driving can turn into a stretch of sameness: same lanes, same silence, same wait. Carpybara is a small dashboard companion whose motion tracks your speed—there to make those minutes feel less empty, not to shout for attention. I owned the full arc from hardware and firmware through product direction: embedded bring-up, board- and system-level hardware design, and PM/PO work to align scope, milestones, and the in-cabin experience.',
    url: 'https://carpybara.com/',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EC%9E%90%EB%8F%99%EC%B0%A8%20%EC%86%8D%EB%8F%84%20%EA%B8%B0%EB%B0%98%20IoT%20%EC%9E%A5%EC%8B%9D%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/carpybara.png', '/Carpybara_video.mov', '/carpybara_2.png', '/carpybara_3.jpg','/run (1).gif'],
    heroImage: '/run (1).gif',
    caseStudy: {
      meta: {
        platform: 'In-vehicle embedded device · Companion UI',
        role: 'Firmware development · Hardware design · PM / PO',
        timeline: 'Ongoing',
        team: '4-person core team',
        toolsGroups: [
          { label: 'Firmware & Embedded', items: 'ESP32 · FreeRTOS · PlatformIO · C/C++ · Arduino' },
          { label: 'Sensors & Hardware', items: 'MPU-6050 (IMU) · NEO-6M (GPS)' },
          { label: 'Tools', items: 'Git · Linux · VS Code · PlatformIO ' },
        ],
      },
      lead:
        'The road is often boring; the cabin does not have to be. Carpybara sits where you already look—a quiet co-pilot whose mood moves with your speed—so the drive feels a little less like clock-watching and a little more like good company.',
      problem:
        'Drivers need information at a glance without cognitive overload. Heavy dashboards compete for attention; a companion layer must stay subtle, readable in sunlight, and responsive to real vehicle state.',
      approach:
        'On the firmware side I focused on reliable sensing, state handling, and performance so motion tracks real driving dynamics—not demo curves. On hardware I carried schematic and layout decisions through bring-up so the device survives automotive-ish constraints. As PM/PO I prioritized the roadmap, acceptance criteria, and trade-offs between mechanical fit, BOM risk, and the glanceable UX we wanted on the road.',
      highlights: [
        {
          title: 'Firmware & sensing',
          body: 'Low-level code paths tie UI behavior to vehicle/speed context with predictable timing, so the character reads as trustworthy rather than decorative.',
        },
        {
          title: 'Hardware design & integration',
          body: 'Board-level design and integration work connect sensors, power, and comms to the product shell—closing the loop between what the firmware reads and what the driver actually experiences.',
        },
        {
          title: 'PM / PO ownership',
          body: 'Backlog, milestones, and stakeholder alignment kept firmware, hardware, and UI moving together—cutting scope where needed and defending quality for in-cabin use.',
        },
      ],
      reflection:
        'Carpybara reinforced that “product” on the dashboard is really three threads: silicon and copper, the code that interprets them, and the decisions that keep a small team shipping. Wearing firmware, hardware, and PM/PO hats at once is messy—but it is the fastest way to learn where the real risks live.',
    },
  },
  {
    id: '2',
    slug: 'pcb-agent',
    title: 'PCB Agent',
    stack: 'Browser extension · EasyEDA · AI coach',
    category: ['javascript', 'typescript'],
    tagline: 'EasyEDA coach extension',
    description:
      'A browser extension for EasyEDA that offers real-time AI coaching during PCB schematic work. Includes a JavaScript circuit engine to read schematic state and a message bridge to a Python backend, plus a pcb-schematic-api layer for programmatic validation of placements and connections.',
    url: 'https://github.com/Yuna616/PCB_Agent',
    images: ['https://picsum.photos/seed/pcb-agent/1600/900'],
    caseStudy: {
      meta: {
        platform: 'Browser extension · Web + Python services',
        role: 'Creator · Full-stack integration',
        timeline: 'Mar 2026 – Present',
        team: 'Solo',
        tools: 'JavaScript · Python · EasyEDA · Extension APIs',
      },
      lead: 'Schematic tools are powerful—but feedback often arrives too late, after mistakes are already committed to the canvas.',
      problem:
        'Designers iterate quickly in EasyEDA, yet validation and coaching are usually disconnected from the live schematic. Errors in placement, nets, or library usage are easy to miss until export or review.',
      approach:
        'PCB Agent lives inside the editor: a circuit engine in JavaScript reads schematic state in real time, forwards structured context through a message bridge to Python, and returns guidance through a pcb-schematic-api validation layer.',
      highlights: [
        {
          title: 'Editor-native coaching',
          body: 'Instead of a separate chat window divorced from the canvas, assistance is grounded in the actual components and connections under the cursor.',
        },
        {
          title: 'Bridge architecture',
          body: 'A clear split between in-browser analysis and backend reasoning keeps the extension responsive while still allowing deeper checks server-side.',
        },
      ],
      reflection:
        'Building for someone else’s CAD surface taught me to treat extension APIs and DOM stability as first-class risks—features are only useful if they survive real user sessions without breaking flow.',
    },
  },
  {
    id: '3',
    slug: 'point',
    title: 'Point',
    stack: 'Web app · AI presentation agent',
    category: ['react', 'typescript'],
    tagline: 'AI agent for calmer, clearer talks',
    description:
      'An AI agent that helps you prepare and deliver talks—organizing slides and speaking flow so presentations feel clearer and less stressful on stage.',
    url: 'https://pointpresent.com/',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EB%B0%9C%ED%91%9C%20%EB%8F%84%EC%9A%B0%EB%AF%B8%20ai%20agent%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/Point.png', '/Point_2.png', '/Point_4.png', '/Point_3.png'],
    caseStudy: {
      meta: {
        platform: 'Web application',
        role: 'Creator · Full-stack product',
        timeline: 'Ongoing',
        team: '2',
        tools: 'React · TypeScript · Vite · AI UX',
      },
      lead: 'People rarely fail presentations because they lack slides—they fail because structure, pacing, and confidence fall apart under pressure.',
      problem:
        'Classic slide decks optimize for authoring, not for rehearsal or live delivery. Speakers juggle outline, visuals, and timing without a single calm interface that adapts to where they are in the talk.',
      approach:
        'Point reframes the product as an agent: it helps you shape narrative order, align speaking beats with slides, and reduce cognitive load before you walk on stage. The UI favors clarity, progressive disclosure, and calm microcopy over feature density.',
      highlights: [
        {
          title: 'Structured preparation',
          body: 'Flows emphasize ordering ideas and rehearsing transitions so the deck becomes a support surface instead of a script to read.',
        },
        {
          title: 'Delivery-minded UI',
          body: 'Interactions are tuned for “last 10 minutes before presenting”—large type, obvious next steps, and minimal chrome.',
        },
      ],
      reflection:
        'Shipping Point reinforced that AI products win when the model is invisible and the user’s job-to-be-done is obvious. Presentation software is as much emotional design as it is information architecture.',
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
