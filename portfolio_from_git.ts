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
  highlights?: { title: string; body: string; codeBlocks?: { label: string; code: string }[] }[];
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
    stack: 'In-vehicle device 쨌 Speed-driven UI',
    category: ['typescript', 'javascript'],
    tagline: 'Long drives drag?봀arpybara keeps them from feeling that way.',
    description:
      'Driving can turn into a stretch of sameness: same lanes, same silence, same wait. Carpybara is a small dashboard companion whose motion tracks your speed?봳here to make those minutes feel less empty, not to shout for attention. I led firmware development and drove product direction as PM/PO: embedded bring-up, reliable sensing pipelines, and the scope and milestone decisions that kept the in-cabin experience on track.',
    url: 'https://carpybara.com/',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EC%9E%90%EB%8F%99%EC%B0%A8%20%EC%86%8D%EB%8F%84%20%EA%B8%B0%EB%B0%98%20IoT%20%EC%9E%A5%EC%8B%9D%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/carpybara.png', '/Carpybara_video.mov', '/carpybara_2.png', '/carpybara_3.jpg','/run (1).gif'],
    heroImage: '/run (1).gif',
    caseStudy: {
      meta: {
        platform: 'In-vehicle embedded device 쨌 Companion UI',
        role: 'Firmware development 쨌 PM / PO',
        timeline: 'Ongoing',
        team: '4-person core team',
        toolsGroups: [
          { label: 'Firmware & Embedded', items: 'ESP32 쨌 FreeRTOS 쨌 PlatformIO 쨌 C/C++ 쨌 Arduino' },
          { label: 'Sensors', items: 'MPU-6050 (IMU) 쨌 NEO-6M (GPS)' },
          { label: 'Tools', items: 'Git 쨌 Linux 쨌 VS Code 쨌 PlatformIO ' },
        ],
      },
      lead:
        'The road is often boring; the cabin does not have to be. Carpybara sits where you already look?봞 quiet co-pilot whose mood moves with your speed?봲o the drive feels a little less like clock-watching and a little more like good company.',
      problem:
        'Drivers need information at a glance without cognitive overload. Heavy dashboards compete for attention; a companion layer must stay subtle, readable in sunlight, and responsive to real vehicle state.',
      approach:
        'On the firmware side I focused on reliable sensing, state handling, and performance so motion tracks real driving dynamics?봭ot demo curves. As PM/PO I prioritized the roadmap, acceptance criteria, and trade-offs between BOM risk and the glanceable UX we wanted on the road?봩eeping firmware delivery and product goals in sync.',
      highlights: [
        {
          title: 'Firmware & sensing',
          body: 'Low-level code paths tie UI behavior to vehicle/speed context with predictable timing, so the character reads as trustworthy rather than decorative.',
        },
        {
          title: 'Why FreeRTOS',
          body: 'The original Arduino loop() ran everything sequentially on a single core: HTTP serving, sensor reads, and screen drawing waited in line one after another. A file transfer blocking for 30 ms meant 30 ms of frozen animation. Adding GPS and IMU made it worse?봳he loop grew longer and frame rate dropped further.\n\nFreeRTOS replaced that single queue with three independent tasks pinned across both ESP32-S3 cores. NetworkTask (Core 0, 100 Hz) handles petWebTick(), DNS, and HTTP file serving. SensorTask (Core 0, 20 Hz) parses GPS over Serial2 and reads the MPU-6050 via I2C, then detects brake and bump events. DisplayTask (Core 1, 60 Hz) reads a snapshot of sensor state and drives every frame of animation. A single mutex guards the shared SensorState struct so reads and writes never race.\n\nThe result: HTTP blocking is fully isolated to Core 0, so a 30 ms file transfer no longer touches the display. DisplayTask fires every 16 ms regardless of network load. Sensor additions stay inside SensorTask and have zero impact on frame timing. vTaskDelay() yields the CPU between ticks rather than spinning, so each core works on something useful instead of burning cycles on delay(). The frame rate went from loop()-dependent and irregular to a stable 60 fps?봞nd adding new sensors costs nothing in display performance.',
          codeBlocks: [
            {
              label: 'tasks.cpp ??Three tasks, two cores',
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
    petWebTick(); // may block ??Core 0 only
    vTaskDelay(pdMS_TO_TICKS(10)); // 100 Hz
  }
}`,
            },
          ],
        },
        {
          title: 'PM / PO ownership',
          body: 'Backlog, milestones, and stakeholder alignment kept firmware and UI moving together?봠utting scope where needed and defending quality for in-cabin use.',
        },
      ],
      fieldTest: {
        text: 'To validate the experience in a real cabin, I visited the Rivian showroom at Irvine Spectrum Center and ran the device against an actual vehicle. Testing on a production EV confirmed that sensor readings and UI responses held up outside the lab?봞nd surfaced edge cases in ambient light and mounting angle that only a real interior could reveal.',
        image: '/carpybara_2.png',
      },
      reflection:
        'Carpybara reinforced that ?쐏roduct??on the dashboard is really two threads: the code that reads and interprets the world, and the decisions that keep a small team shipping. Wearing firmware and PM/PO hats at once is messy?봟ut it is the fastest way to learn where the real risks live.',
    },
  },
  {
    id: '2',
    slug: 'pcb-agent',
    title: 'PCB Agent',
    stack: 'Browser extension 쨌 EasyEDA 쨌 AI coach',
    category: ['javascript', 'typescript'],
    tagline: 'EasyEDA coach extension',
    description:
      'A browser extension for EasyEDA that offers real-time AI coaching during PCB schematic work. Includes a JavaScript circuit engine to read schematic state and a message bridge to a Python backend, plus a pcb-schematic-api layer for programmatic validation of placements and connections.',
    url: 'https://github.com/Yuna616/PCB_Agent',
    images: ['https://picsum.photos/seed/pcb-agent/1600/900'],
    caseStudy: {
      meta: {
        platform: 'Browser extension 쨌 Web + Python services',
        role: 'Creator 쨌 Full-stack integration',
        timeline: 'Mar 2026 ??Present',
        team: 'Solo',
        tools: 'JavaScript 쨌 Python 쨌 EasyEDA 쨌 Extension APIs',
      },
      lead: 'Schematic tools are powerful?봟ut feedback often arrives too late, after mistakes are already committed to the canvas.',
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
        'Building for someone else?셲 CAD surface taught me to treat extension APIs and DOM stability as first-class risks?봣eatures are only useful if they survive real user sessions without breaking flow.',
    },
  },
  {
    id: '3',
    slug: 'point',
    title: 'Point',
    stack: 'Web app 쨌 AI presentation agent',
    category: ['react', 'typescript'],
    tagline: 'AI agent for calmer, clearer talks',
    description:
      'An AI agent that helps you prepare and deliver talks?봮rganizing slides and speaking flow so presentations feel clearer and less stressful on stage.',
    url: 'https://pointpresent.com/',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EB%B0%9C%ED%91%9C%20%EB%8F%84%EC%9A%B0%EB%AF%B8%20ai%20agent%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/Point.png', '/Point_2.png', '/Point_4.png', '/Point_3.png'],
    caseStudy: {
      meta: {
        platform: 'Web application',
        role: 'Creator 쨌 Full-stack product',
        timeline: 'Ongoing',
        team: '2',
        tools: 'React 쨌 TypeScript 쨌 Vite 쨌 AI UX',
      },
      lead: 'People rarely fail presentations because they lack slides?봳hey fail because structure, pacing, and confidence fall apart under pressure.',
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
          body: 'Interactions are tuned for ?쐋ast 10 minutes before presenting?앪봪arge type, obvious next steps, and minimal chrome.',
        },
      ],
      reflection:
        'Shipping Point reinforced that AI products win when the model is invisible and the user?셲 job-to-be-done is obvious. Presentation software is as much emotional design as it is information architecture.',
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
    role: 'Custom Language Builder ??PBL Hackathon',
    company: 'Hackathon project',
    period: 'Mar 2026',
    location: 'Web 쨌 Interpreter',
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
    period: 'Oct 2025 ??Dec 2025',
    location: 'C++ 쨌 HPC',
    url: 'https://github.com/Yuna616/Neural-Network-Matrix-Optimization-#',
    bullets: [
      'Applied cache-oblivious algorithms, loop unrolling, and AVX2 to matrix multiplication, achieving 4096횞4096 ops in under 3 seconds at over 30,000 MFLOPS.',
      'Implemented a Fully Connected layer from scratch in C++ with direct matrix ops using pretrained VGG19 weights; optimized memory access patterns for low-level performance tuning.',
    ],
    tags: ['C++', 'AVX2', 'Matrix Optimization', 'VGG19', 'Performance'],
  },
  {
    role: 'ESP32CAM Human Classifier',
    company: 'Academic project',
    period: 'Mar 2025 ??Jun 2025',
    location: 'Embedded 쨌 Deep learning',
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
      '?섎뱶?⑥뼱??媛源뚯슫 ?쒗뭹???ㅻ０ ?뚮룄 ?ъ슜??愿?먯쓣 ?껋? ?딄퀬, ?꾨줈?좏??낆쓣 鍮좊Ⅴ寃?留욎떠 以띾땲??',
    name: '?묒뾽??,
    role: '?꾨줈?앺듃 ?쇰뱶諛????ㅻ챸?쇰줈 援먯껜 媛??,
  },
  {
    quote:
      '諛쒗몴 ?꾧뎄瑜?留뚮뱾硫댁꽌???ㅺ낵 ?뺣낫 援ъ“瑜??뺣룉?섎젮???쒕룄媛 ?몄긽?곸씠?덉뒿?덈떎.',
    name: '諛쒗몴 紐⑥엫 ?숇즺',
    role: '?ъ슜 ?쇰뱶諛?,
  },
  {
    quote:
      '李⑤웾쨌?뮤룹뿉?댁쟾?몄쿂???곸뿭???щ씪???쇨????ㅽ넗由щ줈 ?곌껐???ㅻ챸?⑸땲??',
    name: '硫섑넗',
    role: '?깆옣 諛⑺뼢 ?쇱쓽',
  },
];
