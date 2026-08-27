import { EDUCATION, EXPERIENCE, PROJECTS } from './portfolio';
import { isVideoSrc } from '../utils/isVideo';

/**
 * The home page timeline: projects + experience + education merged into one list,
 * ordered by when each entry first appeared (periodStart, most recent first). Styling
 * is intentionally monochrome with a single shared accent color (--portfolio-accent) —
 * there's no per-entry theme here.
 */

export type TimelineKind = 'project' | 'experience' | 'education';

export interface TimelineEntry {
  id: string;
  kind: TimelineKind;
  title: string;
  subtitle: string;
  /** Display text, e.g. 'Mar 2026 – Jun 2026' */
  period: string;
  /** ISO 'YYYY-MM' */
  periodStart: string;
  /** ISO 'YYYY-MM' */
  periodEnd: string;
  /** Shared program/affiliation label, e.g. 'Kookmin Global PBL Program' */
  program?: string;
  /** Route to the detail page for this entry */
  detailHref: string;
  /** Square icon image (projects only — experience entries use a kind icon instead) */
  iconImage?: string;
  /** Photo strip shown when the card is expanded (projects only) */
  images?: string[];
  /** Bullet points shown when the card is expanded */
  bullets?: string[];
  /** One-line summary shown when the card is expanded */
  summary?: string;
  /** Single highlighted club/society shown in the card preview (education only) */
  previewActivity?: { title: string; text: string; period?: string };
  /** Honors & awards shown in the card preview (education only) */
  previewHonors?: string[];
  tags: string[];
}

function monthKey(period: string): number {
  const [y, m] = period.split('-').map(Number);
  return y * 100 + (m || 1);
}

const rawEntries: TimelineEntry[] = [];

for (const p of PROJECTS) {
  if (p.includeInTimeline === false) continue;
  if (!p.periodStart) continue;
  rawEntries.push({
    id: `project-${p.slug}`,
    kind: 'project',
    title: p.title,
    subtitle: p.tagline,
    period: p.period ?? p.periodStart,
    periodStart: p.periodStart,
    periodEnd: p.periodEnd ?? p.periodStart,
    program: p.program,
    detailHref: `/work/${p.slug}`,
    iconImage: p.heroImage ?? p.images[0],
    // Photos carry the preview for projects — the tagline is already shown as the card subtitle.
    images: p.images.filter((src) => !isVideoSrc(src)).slice(0, 3),
    tags: p.stack.split(/\s*[·|]\s*/).filter(Boolean),
  });
}

for (const e of EXPERIENCE) {
  rawEntries.push({
    id: `experience-${e.slug}`,
    kind: 'experience',
    title: e.role,
    subtitle: e.company,
    period: e.period,
    periodStart: e.periodStart,
    periodEnd: e.periodEnd,
    detailHref: e.detailUrl ?? `/experience/${e.slug}`,
    iconImage: e.icon,
    images: e.images,
    // previewText replaces the summary+bullets combo with just one line for a leaner card preview
    bullets: e.previewText ? undefined : e.bullets,
    summary: e.previewText ?? e.summary ?? e.description,
    tags: e.tags,
  });
}

for (const ed of EDUCATION) {
  rawEntries.push({
    id: `education-${ed.slug}`,
    kind: 'education',
    title: ed.school,
    subtitle: ed.gpa ? `${ed.degree} · GPA ${ed.gpa}` : ed.degree,
    period: ed.period,
    periodStart: ed.periodStart,
    periodEnd: ed.periodEnd,
    detailHref: `/education/${ed.slug}`,
    iconImage: ed.icon,
    tags: ed.previewCourses ?? ed.courses ?? [],
    previewActivity: ed.activities?.[0]
      ? { title: ed.activities[0].title, text: ed.activities[0].bullets[0], period: ed.activities[0].period }
      : undefined,
    previewHonors: ed.honors,
  });
}

// Ordered by when each entry first appeared (periodStart), newest first — a multi-year
// entry like an ongoing degree stays anchored to its start year instead of jumping to
// the top because it's still "in progress". Array.prototype.sort is stable, so ties
// keep their original PROJECTS → EXPERIENCE → EDUCATION insertion order.
export const TIMELINE: TimelineEntry[] = [...rawEntries].sort((a, b) => {
  const startDiff = monthKey(b.periodStart) - monthKey(a.periodStart);
  if (startDiff !== 0) return startDiff;
  return monthKey(b.periodEnd) - monthKey(a.periodEnd);
});

/** The calendar year each entry first appeared in — used for the "year started" tag beside its card. */
export function timelineEntryYear(entry: TimelineEntry): number {
  return Math.floor(monthKey(entry.periodStart) / 100);
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Embedded & IoT',
    skills: ['ESP32', 'FreeRTOS', 'Arduino', 'Linux', 'I2C/UART/BLE', 'PlatformIO'],
  },
  {
    label: 'Edge & Applied AI',
    skills: ['Qualcomm NPU', 'ONNX Runtime', 'QAIRT Genie', 'Computer Vision', 'LLM/RAG', 'Multi-Agent'],
  },
  {
    label: 'Full-Stack & Cloud',
    skills: ['TypeScript/JavaScript', 'React', 'FastAPI', 'Supabase', 'AWS', 'Vercel'],
  },
  {
    label: 'Languages & Tools',
    skills: ['C', 'C++', 'Python', 'Rust', 'Java', 'Git'],
  },
];
