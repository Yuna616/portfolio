import { type KeyboardEvent, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import type { TimelineEntry } from '../../../constants/timeline';
import { joinWithAnd } from '../../../utils/joinWithAnd';
import { isVideoSrc } from '../../../utils/isVideo';

const KIND_LABEL: Record<TimelineEntry['kind'], string> = {
  project: 'Project',
  experience: 'Experience',
  education: 'Education',
};

function initials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function TimelineCard({ entry }: { entry: TimelineEntry }) {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={handleKeyDown}
      className="w-full rounded-lg border border-neutral-200 bg-white px-7 py-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5 hover:scale-[1.02] hover:border-portfolio hover:shadow-lg hover:shadow-portfolio/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-portfolio/50"
    >
      <div className="flex items-start gap-3 mb-5 flex-wrap">
        {entry.iconImage ? (
          <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden border border-neutral-200 bg-neutral-50">
            <img
              src={entry.iconImage}
              alt=""
              className={
                entry.kind === 'education'
                  ? 'w-full h-full object-contain p-1'
                  : 'w-full h-full object-cover object-top'
              }
            />
          </div>
        ) : (
          <div className="w-12 h-12 shrink-0 rounded-md flex items-center justify-center border border-neutral-200 bg-neutral-50 font-mono text-sm font-bold text-neutral-800">
            {initials(entry.title)}
          </div>
        )}

        {entry.program && (
          <span className="relative inline-flex items-center overflow-hidden rounded-md border border-portfolio/30 bg-portfolio/[0.06] px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-portfolio mt-1.5">
            {entry.program}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[shine_3.2s_ease-in-out_infinite]"
            />
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-[13px] font-bold uppercase tracking-[0.15em] text-portfolio">
          {KIND_LABEL[entry.kind]}
        </span>
        <span className="text-neutral-300" aria-hidden>
          ·
        </span>
        <span className="font-mono text-[11px] font-medium text-neutral-700">{entry.period}</span>
      </div>
      <h3 className="text-xl font-bold text-neutral-900 leading-snug mb-1.5">{entry.title}</h3>
      <p className="text-[15px] text-neutral-900">{entry.subtitle}</p>

      <span className="mt-5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-700 transition-colors">
        Preview
        <ChevronRight className={`size-3.5 transition-transform duration-300 ${open ? 'rotate-90' : ''}`} aria-hidden />
      </span>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-neutral-100">
              {entry.images && entry.images.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  {entry.images.map((src) =>
                    isVideoSrc(src) ? (
                      <div
                        key={src}
                        className="aspect-[4/3] overflow-hidden rounded-md border border-neutral-100 bg-neutral-50"
                      >
                        <video
                          src={src}
                          className="w-full h-full object-cover object-top"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      </div>
                    ) : (
                      <div
                        key={src}
                        className="aspect-[4/3] overflow-hidden rounded-md border border-neutral-100 bg-neutral-50"
                      >
                        <img src={src} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                    ),
                  )}
                </div>
              )}

              {entry.summary && (
                <p className="text-sm leading-relaxed text-neutral-900 mb-4">{entry.summary}</p>
              )}

              {entry.bullets && entry.bullets.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {entry.bullets.slice(0, 2).map((b) => (
                    <li key={b} className="flex gap-2 text-sm leading-relaxed text-neutral-900">
                      <span className="shrink-0 select-none text-portfolio" aria-hidden>
                        —
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {entry.kind === 'education' ? (
                <div className="space-y-4 mb-5">
                  {entry.tags.length > 0 && (
                    <p className="text-sm leading-relaxed text-neutral-900">
                      <span className="font-semibold text-neutral-700">Relevant coursework: </span>
                      {joinWithAnd(entry.tags)}.
                    </p>
                  )}

                  {entry.previewActivity && (
                    <div className="text-sm leading-relaxed text-neutral-900">
                      <p className="font-semibold text-neutral-700">
                        Clubs &amp; Societies — {entry.previewActivity.title}
                        {entry.previewActivity.period && (
                          <span className="font-normal text-neutral-600"> ({entry.previewActivity.period})</span>
                        )}
                      </p>
                      <p>{entry.previewActivity.text}</p>
                    </div>
                  )}

                  {entry.previewHonors && entry.previewHonors.length > 0 && (
                    <div className="text-sm leading-relaxed text-neutral-900">
                      <p className="font-semibold text-neutral-700">Honors &amp; Awards</p>
                      <ul className="space-y-1">
                        {entry.previewHonors.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded-md border border-neutral-200 text-neutral-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )
              )}

              {entry.kind !== 'education' && (
                isExternalHref(entry.detailHref) ? (
                  <a
                    href={entry.detailHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-portfolio px-4 py-2 text-sm font-semibold text-portfolio-foreground transition hover:bg-portfolio-hover"
                  >
                    Detail
                    <ChevronRight className="size-4" aria-hidden />
                  </a>
                ) : (
                  <Link
                    to={entry.detailHref}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-portfolio px-4 py-2 text-sm font-semibold text-portfolio-foreground transition hover:bg-portfolio-hover"
                  >
                    Detail
                    <ChevronRight className="size-4" aria-hidden />
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
