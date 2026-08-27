import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { type CourseCategory, type CourseItem, COURSES, GPA } from '../../constants/portfolio';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

type FilterCategory = 'all' | CourseCategory;

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'embedded', label: 'Embedded' },
  { key: 'algorithms', label: 'Algorithms & C++' },
  { key: 'networks', label: 'Networks & OS' },
  { key: 'web', label: 'Software Design' },
  { key: 'math', label: 'Math' },
];

const CATEGORY_COLOR: Record<CourseCategory, string> = {
  embedded: 'text-amber-600 border-amber-300/60 bg-amber-50 dark:text-amber-400 dark:border-amber-400/20 dark:bg-amber-400/[0.06]',
  ai: 'text-violet-600 border-violet-300/60 bg-violet-50 dark:text-violet-400 dark:border-violet-400/20 dark:bg-violet-400/[0.06]',
  algorithms: 'text-sky-600 border-sky-300/60 bg-sky-50 dark:text-sky-400 dark:border-sky-400/20 dark:bg-sky-400/[0.06]',
  networks: 'text-emerald-600 border-emerald-300/60 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-400/20 dark:bg-emerald-400/[0.06]',
  web: 'text-rose-600 border-rose-300/60 bg-rose-50 dark:text-rose-400 dark:border-rose-400/20 dark:bg-rose-400/[0.06]',
  math: 'text-neutral-600 border-neutral-300/60 bg-neutral-100 dark:text-neutral-400 dark:border-neutral-400/20 dark:bg-neutral-400/[0.06]',
};

const CATEGORY_LABEL: Record<CourseCategory, string> = {
  embedded: 'Embedded',
  ai: 'AI / ML',
  algorithms: 'Algorithms',
  networks: 'Networks & OS',
  web: 'Software Design',
  math: 'Math',
};

function CourseModal({ course, onClose }: { course: CourseItem; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-lg bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/[0.08] shadow-2xl overflow-y-auto max-h-[90vh]"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-neutral-100 dark:border-white/[0.06]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-block font-mono text-[10px] uppercase tracking-[0.3em] px-2.5 py-1 border mb-4 ${CATEGORY_COLOR[course.category]}`}
                >
                  {CATEGORY_LABEL[course.category]}
                </span>
                <h2 className="font-sans text-2xl font-bold text-neutral-900 dark:text-white mb-3 leading-tight">
                  {course.name}
                </h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-mono text-sm text-portfolio">{course.semester}</span>
                  {course.grade && (
                    <span className="font-mono text-xs font-bold text-neutral-700 dark:text-[#b3b3b3]">
                      {course.grade}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
                aria-label="닫기"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">
            {/* Description */}
            <p className="text-sm text-neutral-500 dark:text-[#b3b3b3] leading-relaxed">
              {course.description}
            </p>

            {/* Topics */}
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-portfolio mb-4">
                What I Learned
              </p>
              <ul className="space-y-2.5">
                {course.topics.map((topic) => (
                  <li key={topic} className="flex gap-3 text-sm leading-relaxed">
                    <span className="text-portfolio/50 shrink-0 mt-px select-none">—</span>
                    <span className="text-neutral-600 dark:text-[#c8c8c8]">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            {course.tools && course.tools.length > 0 && (
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-portfolio mb-3">
                  Tools Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {course.tools.map((tool) => (
                    <span
                      key={tool}
                      className="font-mono text-[10px] uppercase tracking-wide px-2.5 py-1 border border-neutral-200 text-neutral-500 dark:border-white/[0.08] dark:text-[#858585]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CourseCard({ course, onClick }: { course: CourseItem; onClick: () => void }) {
  return (
    <motion.button
      variants={fadeUp}
      onClick={onClick}
      className="group text-left w-full border border-neutral-200 bg-white p-6 overflow-hidden relative
                 hover:border-portfolio/30 hover:shadow-sm transition-all duration-300 cursor-pointer
                 dark:border-white/[0.07] dark:bg-white/[0.015] dark:hover:border-portfolio/20 dark:hover:bg-white/[0.03]"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 h-[2px] w-0 bg-portfolio group-hover:w-full transition-all duration-500 ease-out" />

      <div className="mb-4">
        <span
          className={`inline-block font-mono text-[9px] uppercase tracking-[0.3em] px-2 py-0.5 border mb-3 ${CATEGORY_COLOR[course.category]}`}
        >
          {CATEGORY_LABEL[course.category]}
        </span>
        <h3 className="font-sans text-base font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-portfolio transition-colors duration-200">
          {course.name}
        </h3>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-[12px] text-portfolio/70">{course.semester}</span>
        {course.grade && (
          <>
            <span className="text-neutral-300 dark:text-white/10 select-none">·</span>
            <span className="font-mono text-[10px] font-bold text-neutral-600 dark:text-[#a8a8a8]">
              {course.grade}
            </span>
          </>
        )}
      </div>

      <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 dark:text-[#8a8a8a] mb-5">
        {course.description}
      </p>

      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-portfolio/60 group-hover:text-portfolio transition-colors duration-200">
        View details →
      </span>
    </motion.button>
  );
}

export function AcademicsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  const filtered =
    activeFilter === 'all' ? COURSES : COURSES.filter((c) => c.category === activeFilter);

  const gpaPercent = (GPA.value / GPA.scale) * 100;

  return (
    <>
      <section
        id="academics"
        className="scroll-mt-24 px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-neutral-200 dark:border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <motion.div
            className="mb-14 md:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <p className="font-mono text-[13px] text-portfolio uppercase tracking-[0.35em] mb-3">
              02 — University study
            </p>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight dark:text-white">
              Academics
            </h2>
          </motion.div>

          {/* GPA card */}
          <motion.div
            className="mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 border border-neutral-200 bg-white p-8 dark:border-white/[0.07] dark:bg-white/[0.015]">
              <div className="flex-1">
                <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-portfolio mb-2">
                  Kookmin University · Computer Science
                </p>
                <p className="text-sm text-neutral-500 dark:text-[#9a9a9a]">
                  Seoul, Korea · 2022 — Present
                </p>
              </div>
              <div className="shrink-0">
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-sans text-4xl font-black text-neutral-900 dark:text-white leading-none">
                    {GPA.value.toFixed(2)}
                  </span>
                  <span className="font-mono text-sm text-neutral-400 dark:text-[#585858] mb-1">
                    / {GPA.scale.toFixed(1)}
                  </span>
                </div>
                <div className="w-40 h-1.5 bg-neutral-100 dark:bg-white/[0.05] overflow-hidden">
                  <motion.div
                    className="h-full bg-portfolio"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${gpaPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="font-mono text-[10px] text-neutral-400 dark:text-[#585858] mt-1.5 text-right">
                  GPA
                </p>
              </div>
            </div>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            className="flex flex-wrap gap-2 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all duration-200
                  ${
                    activeFilter === f.key
                      ? 'bg-portfolio text-portfolio-foreground border-portfolio'
                      : 'border-neutral-200 text-neutral-500 hover:border-portfolio/40 hover:text-portfolio dark:border-white/[0.08] dark:text-[#747474] dark:hover:border-portfolio/25'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* Course grid */}
          <motion.div
            key={activeFilter}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => setSelectedCourse(course)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </>
  );
}
