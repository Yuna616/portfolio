import { motion } from 'motion/react';
import { TIMELINE, timelineEntryYear } from '../../../constants/timeline';
import { TimelineCard } from './TimelineCard';

export function Timeline() {
  // TIMELINE is sorted newest-first, so same-year entries are contiguous — the year tag
  // should sit next to whichever one started earliest in that year, i.e. the *last* entry
  // in each contiguous year-group as we scan newest → oldest.
  const years = TIMELINE.map(timelineEntryYear);

  return (
    <section id="timeline" className="scroll-mt-24 px-6 md:px-12 lg:px-20 pt-0 pb-20 md:pb-28">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[13px] text-portfolio uppercase tracking-[0.35em] mb-12 text-center">
          ▸ Timeline
        </p>

        <div className="relative">
          {/* Spine — a plain hairline, centered for mobile (left) and desktop (middle) */}
          <div className="absolute left-4 lg:left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-neutral-200" />

          <ol className="space-y-10 lg:space-y-8">
            {TIMELINE.map((entry, i) => {
              const year = years[i];
              // Last entry of the year-group (scanning newest → oldest) = the one that
              // actually started first that year.
              const showYear = i === years.length - 1 || years[i + 1] !== year;
              const isLeft = i % 2 === 0;

              const card = (
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TimelineCard entry={entry} />
                </motion.div>
              );

              // Marks where a new year starts — shown right beside the card on desktop,
              // stacked above it on mobile (where there's no room beside the spine).
              const yearTag = showYear ? (
                <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-neutral-600">
                  {year}
                </p>
              ) : null;

              return (
                <li key={entry.id} className="relative">
                  <div className="relative z-10 lg:grid lg:grid-cols-2 lg:gap-12 items-start">
                    {isLeft ? (
                      <>
                        <div className="pl-10 lg:pl-0 lg:pr-4">
                          {yearTag && <div className="mb-2 lg:hidden">{yearTag}</div>}
                          {card}
                        </div>
                        <div className="hidden lg:block lg:pl-8 pt-5">{yearTag}</div>
                      </>
                    ) : (
                      <>
                        <div className="hidden lg:flex lg:justify-end lg:pr-8 pt-5">{yearTag}</div>
                        <div className="pl-10 lg:pl-4">
                          {yearTag && <div className="mb-2 lg:hidden">{yearTag}</div>}
                          {card}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Connector — links the spine to the card */}
                  <span
                    className={`absolute top-[30px] h-px bg-neutral-300 left-4 w-6 ${
                      isLeft ? 'lg:left-auto lg:right-1/2 lg:w-10' : 'lg:left-1/2 lg:w-10'
                    }`}
                  />

                  {/* Via-pad marker on the spine — a small nod to PCB pads */}
                  <span className="absolute top-6 left-4 lg:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-3 h-3 rounded-[3px] border-[1.5px] border-neutral-900 bg-white">
                    <span className="w-1 h-1 rounded-full bg-portfolio" />
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
