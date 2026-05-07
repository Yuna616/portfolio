export type ProjectCategory = 'all' | 'react' | 'javascript' | 'typescript';

export interface PortfolioProject {
  id: string;
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
}

export const PROJECTS: PortfolioProject[] = [
  {
    id: '1',
    title: 'Carpybara',
    stack: 'In-vehicle device · Speed-driven UI',
    category: ['typescript', 'javascript'],
    tagline: 'A tiny friend on your dashboard',
    description:
      'An in-vehicle device where character animation responds to driving speed—built as a lightweight dashboard companion that stays glanceable on the road.',
    url: 'https://carpybara.com/',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EC%9E%90%EB%8F%99%EC%B0%A8%20%EC%86%8D%EB%8F%84%20%EA%B8%B0%EB%B0%98%20IoT%20%EC%9E%A5%EC%8B%9D%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/carpybara.png', '/Carpybara_video.mov'],
  },
  {
    id: '2',
    title: 'Point',
    stack: 'Web app · AI presentation agent',
    category: ['react', 'typescript'],
    tagline: 'AI agent for calmer, clearer talks',
    description:
      'An AI agent that helps you prepare and deliver talks—organizing slides and speaking flow so presentations feel clearer and less stressful on stage.',
    url: 'https://pointpresent.com/',
    devLogUrl:
      'https://lovebotw049.tistory.com/category/%EA%B0%9C%EC%9D%B8%20%EA%B0%9C%EB%B0%9C/%EB%B0%9C%ED%91%9C%20%EB%8F%84%EC%9A%B0%EB%AF%B8%20ai%20agent%20%EB%A7%8C%EB%93%A4%EA%B8%B0',
    images: ['/Point.png', '/Point_2.png'],
  },
];

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
    role: 'PCB Agent — EasyEDA Coach Extension',
    company: 'Personal project',
    period: 'Mar 2026 – Present',
    location: 'Browser Extension · AI',
    url: 'https://github.com/Yuna616/PCB_Agent',
    bullets: [
      'Developing a browser extension for EasyEDA that provides real-time AI coaching and design assistance during PCB schematic creation.',
      'Built a circuit engine in JavaScript to analyze schematic state and relay context to a Python backend via a message bridge architecture.',
      'Integrated a pcb-schematic-api layer to programmatically read and validate component placements and connections.',
    ],
    tags: ['JavaScript', 'Python', 'Browser Extension', 'EasyEDA', 'AI Agent'],
  },
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
