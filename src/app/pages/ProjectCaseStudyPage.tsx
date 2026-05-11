import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { BookOpen, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getProjectBySlug } from '../../constants/portfolio';
import { SensorPipelineDiagram } from '../components/SensorPipelineDiagram';
import { PointAgentsDiagram } from '../components/PointAgentsDiagram';
import { isVideoSrc } from '../../utils/isVideo';

/** Gallery autoplay on /work/:slug — interval resets when slide changes */
const GALLERY_AUTO_IMAGE_MS = 6000;
const GALLERY_AUTO_VIDEO_MS = 14000;

const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

function SectionNumber({ n }: { n: string }) {
  return (
    <div className="flex items-center gap-4 mb-6 md:mb-7">
      <span className="font-mono text-[10px] text-portfolio/55 tracking-[0.4em] shrink-0">{n}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-portfolio/20 to-transparent" />
    </div>
  );
}

export function ProjectCaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = useMemo(() => (slug ? getProjectBySlug(slug) : undefined), [slug]);
  const [mediaIndex, setMediaIndex] = useState(0);
  const galleryVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => { setMediaIndex(0); }, [slug]);

  useEffect(() => {
    galleryVideoRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === mediaIndex) void el.play().catch(() => {});
      else el.pause();
    });
  }, [mediaIndex]);

  const cs = project?.caseStudy;
  const meta = cs?.meta;
  const gallery = project?.images ?? [];

  useEffect(() => {
    if (!project || gallery.length <= 1) return;
    const current = gallery[Math.min(mediaIndex, gallery.length - 1)];
    const ms =
      current && isVideoSrc(current) ? GALLERY_AUTO_VIDEO_MS : GALLERY_AUTO_IMAGE_MS;
    const id = window.setInterval(() => {
      setMediaIndex((i) => (i + 1) % gallery.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [project, gallery, mediaIndex, gallery.length]);

  if (!slug || !project) return <Navigate to="/" replace />;
  const heroImage = project.heroImage ?? gallery[0];

  let sectionIndex = 0;
  function nextNum() {
    sectionIndex += 1;
    return String(sectionIndex).padStart(2, '0');
  }

  return (
    <article className="min-h-screen bg-[#fafaf8] text-neutral-800 dark:bg-[#0a0a0a] dark:text-[#e8e8e8]">

      {/* ── Full-width hero ── */}
      <div className="relative w-full h-[62vh] min-h-[380px] overflow-hidden">
        {heroImage ? (
          isVideoSrc(heroImage) ? (
            <video
              src={heroImage}
              className="absolute inset-0 h-full w-full object-cover object-top"
              autoPlay muted playsInline loop
            />
          ) : (
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          )
        ) : (
          <div className="absolute inset-0 bg-[#111]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf8] via-[#fafaf8]/55 to-[#fafaf8]/10 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/55 dark:to-[#0a0a0a]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fafaf8]/40 to-transparent dark:from-[#0a0a0a]/40" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 md:left-12 lg:left-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-portfolio hover:text-portfolio-hover transition-colors z-10"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back
        </button>

        <motion.div
          className="absolute bottom-0 left-0 px-6 md:px-12 lg:px-20 pb-12 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[11px] text-portfolio uppercase tracking-[0.38em] mb-4">
            Work
          </p>
          <h1
            className="font-sans font-black uppercase text-neutral-900 tracking-[-0.03em] leading-[0.9] mb-5 dark:text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
          >
            {project.title}
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg max-w-xl leading-relaxed dark:text-white/65">
            {project.tagline}
          </p>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-16 pb-36 md:pt-20 md:pb-44">

        {/* Stack label */}
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-16 dark:text-[#8a8a8a]"
          {...FADE_UP}
          transition={{ ...FADE_UP.transition, delay: 0.1 }}
        >
          {project.stack}
        </motion.p>

        {/* ── Meta (left) + Gallery (right) ── */}
        <motion.div
          className="flex flex-col lg:flex-row gap-10 lg:gap-16 py-12 md:py-14 border-y border-neutral-200 mb-28 md:mb-32 dark:border-white/[0.06]"
          {...FADE_UP}
          transition={{ ...FADE_UP.transition, delay: 0.15 }}
        >
          {/* Left: Meta */}
          <div className="lg:w-[36%] shrink-0 divide-y divide-neutral-200 dark:divide-white/[0.06]">
            {[
              { label: 'Platform', value: meta?.platform ?? project.stack },
              { label: 'Role', value: meta?.role ?? 'Creator' },
              { label: 'Timeline', value: meta?.timeline ?? '—' },
              { label: 'Team', value: meta?.team ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="py-4 first:pt-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-portfolio/50 mb-1.5">{label}</p>
                <p className="text-sm text-neutral-700 leading-relaxed dark:text-white/88">{value}</p>
              </div>
            ))}
            <div className="py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-portfolio/50 mb-3">Tools & Stack</p>
              {meta?.toolsGroups ? (
                <div className="space-y-3">
                  {meta.toolsGroups.map(({ label, items }) => (
                    <div key={label}>
                      <p className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 mb-1 dark:text-white/45">{label}</p>
                      <p className="text-sm text-neutral-600 leading-relaxed dark:text-white/85">{items}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-600 leading-relaxed dark:text-white/85">{meta?.tools ?? project.stack}</p>
              )}
            </div>
          </div>

          {/* Right: Gallery */}
          {gallery.length > 0 && (
            <div className="flex-1 min-w-0">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 dark:border-white/[0.07] dark:bg-[#111]">
                <div
                  className="flex h-full transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateX(-${mediaIndex * 100}%)` }}
                >
                  {gallery.map((src, i) => (
                    <div key={`${src}-${i}`} className="relative min-h-full min-w-full shrink-0">
                      {isVideoSrc(src) ? (
                        <video
                          ref={(el) => {
                            galleryVideoRefs.current[i] = el;
                          }}
                          src={src}
                          className="absolute inset-0 h-full w-full object-cover object-top"
                          controls
                          muted
                          playsInline
                          loop
                          autoPlay={i === mediaIndex}
                        />
                      ) : (
                        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
                      )}
                    </div>
                  ))}
                </div>

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMediaIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-sm bg-black/50 border border-white/[0.12] text-white/70 hover:bg-black/75 hover:text-white transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaIndex((i) => (i + 1) % gallery.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-sm bg-black/50 border border-white/[0.12] text-white/70 hover:bg-black/75 hover:text-white transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                    <p className="absolute bottom-3 right-3 font-mono text-[10px] text-white/40">
                      {mediaIndex + 1} / {gallery.length}
                    </p>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setMediaIndex(i)}
                      className={`relative h-12 w-20 overflow-hidden rounded-sm border transition-all ${
                        i === mediaIndex
                          ? 'border-portfolio opacity-100'
                          : 'border-neutral-300 opacity-45 hover:opacity-75 dark:border-white/[0.08]'
                      }`}
                    >
                      {isVideoSrc(src) ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/80 font-mono text-[8px] uppercase text-white/70">
                          Video
                        </span>
                      ) : (
                        <img src={src} alt="" className="h-full w-full object-cover object-top" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ── Lead quote ── */}
        {cs?.lead && (
          <motion.blockquote
            className="pl-6 border-l-2 border-portfolio/35 mb-28 md:mb-32"
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.25 }}
          >
            <p className="text-xl sm:text-2xl leading-[1.7] text-neutral-500 font-light dark:text-white/88">
              {cs.lead}
            </p>
          </motion.blockquote>
        )}

        {/* ── Numbered sections ── */}
        <div className="space-y-40 md:space-y-48">

          {cs?.problem && (
            <motion.section
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.3 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 mb-6 dark:text-white">
                Problem
              </h2>
              <p className="text-neutral-500 text-lg leading-[1.9] dark:text-[#b8b8b8]">{cs.problem}</p>
            </motion.section>
          )}

          <motion.section
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.35 }}
          >
            <SectionNumber n={nextNum()} />
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 mb-6 dark:text-white">
              Overview
            </h2>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <p className="text-neutral-500 text-lg leading-[1.9] flex-1 dark:text-[#b8b8b8]">{project.description}</p>
              {cs?.overviewMedia && (
                <div className="w-full lg:w-[42%] shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 dark:border-white/[0.07] dark:bg-[#111]">
                  <img
                    src={cs.overviewMedia}
                    alt="Overview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </motion.section>

          {cs?.highlights && cs.highlights.length > 0 && (
            <motion.section
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.45 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 mb-12 md:mb-14 dark:text-white">
                Key points
              </h2>
              <ul className="space-y-20 md:space-y-24">
                {cs.highlights.map((h, i) => {
                  const hasCode = Boolean(h.codeBlocks && h.codeBlocks.length > 0);
                  const asideMedia = h.asideMedia;
                  const useSplitRow = hasCode || Boolean(asideMedia);
                  return (
                    <li key={h.title}>
                      <div className="flex items-center gap-3 mb-5">
                        <span className="font-mono text-[10px] text-portfolio/40 tracking-widest shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-sans text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">{h.title}</h3>
                      </div>
                      {h.diagram === 'sensor-pipeline' && <SensorPipelineDiagram />}
                      {h.diagram === 'point-agents' && <PointAgentsDiagram />}
                      <div
                        className={
                          useSplitRow
                            ? 'flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-8'
                            : 'mt-8 space-y-4'
                        }
                      >
                        <div
                          className={
                            useSplitRow ? 'flex-1 min-w-0 space-y-4' : 'space-y-4'
                          }
                        >
                          {h.body.split('\n\n').map((para, pi) => (
                            <p key={pi} className="text-neutral-500 text-lg leading-[1.85] dark:text-[#b8b8b8]">
                              {para}
                            </p>
                          ))}
                        </div>
                        {hasCode && (
                          <div className="w-full lg:w-[42%] shrink-0 space-y-3">
                            {h.codeBlocks!.map((cb) => (
                              <div
                                key={cb.label}
                                className="rounded-sm overflow-hidden border border-neutral-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-transparent dark:shadow-none"
                              >
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 border-b border-neutral-200 dark:bg-[#161616] dark:border-white/[0.06]">
                                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                                  <span className="font-mono text-[10px] text-neutral-500 ml-2 tracking-wide dark:text-white/45">
                                    {cb.label}
                                  </span>
                                </div>
                                <pre className="overflow-x-auto bg-neutral-50 px-5 py-4 text-[12px] leading-[1.75] font-mono text-neutral-800 border-t border-neutral-100 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300 scrollbar-thumb-rounded-full dark:border-t-0 dark:bg-[#0e0e0e] dark:text-[#c9d1d9] dark:scrollbar-thumb-white/10">
                                  <code>{cb.code}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        )}
                        {asideMedia && !hasCode && (
                          <div className="w-full lg:w-[42%] shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 aspect-[16/10] dark:border-white/[0.07] dark:bg-[#111]">
                            <img src={asideMedia} alt="" className="w-full h-full object-cover object-top" />
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          )}

          {cs?.fabrication && (
            <motion.section
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.47 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 mb-6 dark:text-white">
                Fabrication
              </h2>
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                <p className="text-neutral-500 text-lg leading-[1.9] flex-1 dark:text-[#b8b8b8]">
                  {cs.fabrication.text}
                </p>
                <div className="w-full lg:w-[42%] shrink-0 grid grid-cols-2 gap-3">
                  {cs.fabrication.images.map((src, i) => (
                    <div key={i} className="overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 aspect-[4/3] dark:border-white/[0.07] dark:bg-[#111]">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {cs?.fieldTest && (
            <motion.section
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.48 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 mb-6 dark:text-white">
                Field test
              </h2>
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                <p className="text-neutral-500 text-lg leading-[1.9] flex-1 dark:text-[#b8b8b8]">
                  {cs.fieldTest.text}
                </p>
                <div className="w-full lg:w-[42%] shrink-0 overflow-hidden rounded-sm border border-neutral-200 dark:border-white/[0.07]">
                  <img
                    src={cs.fieldTest.image}
                    alt="Real-vehicle field test"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.section>
          )}

          {cs?.reflection && (
            <motion.section
              className="rounded-sm border border-portfolio/25 bg-portfolio/[0.06] p-8 sm:p-10 dark:border-portfolio/[0.12] dark:bg-portfolio/[0.022]"
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.5 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl font-bold text-neutral-900 mb-6 dark:text-white">
                Reflection
              </h2>
              <p className="text-neutral-500 text-lg leading-[1.9] dark:text-[#b8b8b8]">{cs.reflection}</p>
            </motion.section>
          )}
        </div>

        {/* ── CTA buttons ── */}
        <motion.div
          className="mt-28 md:mt-36 pt-12 md:pt-14 border-t border-neutral-200 flex flex-wrap items-center gap-4 dark:border-white/[0.06]"
          {...FADE_UP}
          transition={{ ...FADE_UP.transition, delay: 0.55 }}
        >
          {project.devLogUrl && (
            <a
              href={project.devLogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 font-mono tracking-wide transition hover:border-portfolio/40 hover:bg-portfolio/5 hover:text-neutral-900 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/[0.04] dark:hover:text-white"
            >
              <BookOpen className="size-4 opacity-80" aria-hidden />
              View dev log
              <ExternalLink className="size-3.5 opacity-60" aria-hidden />
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-portfolio px-5 py-3 text-sm font-bold font-mono tracking-wide text-portfolio-foreground transition hover:bg-portfolio-hover"
            >
              Visit project
              <ExternalLink className="size-4" aria-hidden />
            </a>
          )}
        </motion.div>
      </div>
    </article>
  );
}
