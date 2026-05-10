import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { BookOpen, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getProjectBySlug } from '../../constants/portfolio';
import { isVideoSrc } from '../../utils/isVideo';

const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

function SectionNumber({ n }: { n: string }) {
  return (
    <span className="font-mono text-[11px] text-[#d4e157]/50 uppercase tracking-[0.35em] mb-1 block">
      {n}
    </span>
  );
}

export function ProjectCaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = useMemo(() => (slug ? getProjectBySlug(slug) : undefined), [slug]);
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    setMediaIndex(0);
  }, [slug]);

  if (!slug || !project) {
    return <Navigate to="/" replace />;
  }

  const cs = project.caseStudy;
  const meta = cs?.meta;
  const gallery = project.images;
  const heroImage = project.heroImage ?? gallery[0];
  const currentMedia = gallery[Math.min(mediaIndex, Math.max(gallery.length - 1, 0))];

  let sectionIndex = 0;
  function nextNum() {
    sectionIndex += 1;
    return String(sectionIndex).padStart(2, '0');
  }

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8]">

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

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 md:left-12 lg:left-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 hover:text-[#d4e157] transition-colors z-10"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back
        </button>

        {/* Title overlay */}
        <motion.div
          className="absolute bottom-0 left-0 px-6 md:px-12 lg:px-20 pb-12 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[11px] text-[#d4e157] uppercase tracking-[0.38em] mb-4">
            Case study
          </p>
          <h1 className="font-sans font-black uppercase text-white tracking-[-0.03em] leading-[0.9] mb-5"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
          >
            {project.title}
          </h1>
          <p className="text-white/50 text-base sm:text-lg max-w-xl leading-relaxed">
            {project.tagline}
          </p>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-14 pb-28">

        {/* Stack label */}
        <motion.p
          className="font-mono text-[11px] text-[#555] mb-10"
          {...FADE_UP}
          transition={{ ...FADE_UP.transition, delay: 0.1 }}
        >
          {project.stack}
        </motion.p>

        {/* ── Meta (left) + Gallery (right) ── */}
        <motion.div
          className="flex flex-col lg:flex-row gap-10 lg:gap-14 py-10 border-y border-white/[0.07] mb-16"
          {...FADE_UP}
          transition={{ ...FADE_UP.transition, delay: 0.15 }}
        >
          {/* Left: Meta */}
          <div className="lg:w-[36%] shrink-0 space-y-7">
            {[
              { label: 'Platform', value: meta?.platform ?? project.stack },
              { label: 'Role', value: meta?.role ?? 'Creator' },
              { label: 'Timeline', value: meta?.timeline ?? '—' },
              { label: 'Team', value: meta?.team ?? '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#d4e157]/55 mb-1.5">{label}</p>
                <p className="text-sm text-white/75 leading-relaxed">{value}</p>
              </div>
            ))}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#d4e157]/55 mb-3">Tools & Stack</p>
              {meta?.toolsGroups ? (
                <div className="space-y-3">
                  {meta.toolsGroups.map(({ label, items }) => (
                    <div key={label}>
                      <p className="font-mono text-[9px] uppercase tracking-wide text-white/25 mb-0.5">{label}</p>
                      <p className="text-sm text-white/75">{items}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/75 leading-relaxed">{meta?.tools ?? project.stack}</p>
              )}
            </div>
          </div>

          {/* Right: Gallery */}
          {gallery.length > 0 && (
            <div className="flex-1 min-w-0">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-white/[0.07] bg-[#111]">
                {currentMedia ? (
                  isVideoSrc(currentMedia) ? (
                    <video
                      key={currentMedia}
                      src={currentMedia}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      controls autoPlay muted playsInline loop
                    />
                  ) : (
                    <img
                      src={currentMedia}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  )
                ) : null}

                {/* Prev / Next buttons */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMediaIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 bg-black/50 border border-white/[0.12] text-white/70 hover:bg-black/75 hover:text-white transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaIndex((i) => (i + 1) % gallery.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 bg-black/50 border border-white/[0.12] text-white/70 hover:bg-black/75 hover:text-white transition-all"
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
                          ? 'border-[#d4e157] opacity-100'
                          : 'border-white/[0.08] opacity-50 hover:opacity-80'
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
        {cs?.lead ? (
          <motion.p
            className="text-xl sm:text-2xl leading-snug text-white/75 font-medium mb-16 border-l-2 border-[#d4e157]/35 pl-7"
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.25 }}
          >
            {cs.lead}
          </motion.p>
        ) : null}

        {/* ── Numbered sections ── */}
        <div className="space-y-16">

          {cs?.problem ? (
            <motion.section
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.3 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-6 mt-1">
                Problem
              </h2>
              <div className="w-6 h-px bg-[#d4e157]/30 mb-7" />
              <p className="text-[#8a8a8a] text-base sm:text-lg leading-[1.85]">{cs.problem}</p>
            </motion.section>
          ) : null}

          {cs?.approach ? (
            <motion.section
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.35 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-6 mt-1">
                Approach
              </h2>
              <div className="w-6 h-px bg-[#d4e157]/30 mb-7" />
              <p className="text-[#8a8a8a] text-base sm:text-lg leading-[1.85]">{cs.approach}</p>
            </motion.section>
          ) : null}

          <motion.section
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.4 }}
          >
            <SectionNumber n={nextNum()} />
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-6 mt-1">
              Overview
            </h2>
            <div className="w-6 h-px bg-[#d4e157]/30 mb-7" />
            <p className="text-[#8a8a8a] text-base sm:text-lg leading-[1.85]">{project.description}</p>
          </motion.section>

          {cs?.highlights && cs.highlights.length > 0 ? (
            <motion.section
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.45 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-6 mt-1">
                Key points
              </h2>
              <div className="w-6 h-px bg-[#d4e157]/30 mb-8" />
              <ul className="space-y-12">
                {cs.highlights.map((h, i) =>
                  h.codeBlocks ? (
                    /* ── Code-variant highlight (no card) ── */
                    <li key={h.title}>
                      <div className="flex items-center gap-3 mb-5">
                        <span className="font-mono text-[10px] text-[#d4e157]/40 tracking-widest shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-sans text-lg font-semibold text-white/90">{h.title}</h3>
                      </div>
                      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        {/* Text — main content */}
                        <div className="flex-1 min-w-0 space-y-4">
                          {h.body.split('\n\n').map((para, pi) => (
                            <p key={pi} className="text-[#8a8a8a] text-base sm:text-lg leading-[1.85]">{para}</p>
                          ))}
                        </div>
                        {/* Single code block */}
                        <div className="w-full lg:w-[42%] shrink-0 space-y-3">
                          {h.codeBlocks.map((cb) => (
                            <div key={cb.label} className="rounded-sm overflow-hidden border border-white/[0.08]">
                              {/* IDE-style title bar */}
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161616] border-b border-white/[0.06]">
                                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                                <span className="size-2.5 rounded-full bg-[#28c840]" />
                                <span className="font-mono text-[10px] text-white/30 ml-2 tracking-wide">{cb.label}</span>
                              </div>
                              {/* Code body */}
                              <pre className="overflow-x-auto bg-[#0e0e0e] px-5 py-4 text-[12px] leading-[1.75] font-mono text-[#c9d1d9] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                                <code>{cb.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    </li>
                  ) : (
                    /* ── Default card highlight ── */
                    <li
                      key={h.title}
                      className="border border-white/[0.07] rounded-sm p-6 sm:p-8 bg-white/[0.018] hover:border-white/[0.12] transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-mono text-[10px] text-[#d4e157]/40 tracking-widest shrink-0 mt-0.5">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-sans text-base font-semibold text-white/90 mb-2">{h.title}</h3>
                          <div className="space-y-3">
                            {h.body.split('\n\n').map((para, pi) => (
                              <p key={pi} className="text-[#777] text-sm leading-relaxed">{para}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </motion.section>
          ) : null}

          {cs?.fieldTest ? (
            <motion.section
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.48 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-6 mt-1">
                Field test
              </h2>
              <div className="w-6 h-px bg-[#d4e157]/30 mb-7" />
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                <p className="text-[#8a8a8a] text-base sm:text-lg leading-[1.85] flex-1">
                  {cs.fieldTest.text}
                </p>
                <div className="w-full lg:w-[42%] shrink-0 overflow-hidden rounded-sm border border-white/[0.07]">
                  <img
                    src={cs.fieldTest.image}
                    alt="Real-vehicle field test"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.section>
          ) : null}

          {cs?.reflection ? (
            <motion.section
              className="rounded-sm border border-white/[0.07] bg-white/[0.018] p-8 sm:p-10"
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.5 }}
            >
              <SectionNumber n={nextNum()} />
              <h2 className="font-sans text-2xl font-bold text-white mb-6 mt-1">
                Reflection
              </h2>
              <div className="w-6 h-px bg-[#d4e157]/30 mb-7" />
              <p className="text-[#8a8a8a] text-base leading-[1.85]">{cs.reflection}</p>
            </motion.section>
          ) : null}
        </div>

        {/* ── CTA buttons ── */}
        <motion.div
          className="mt-20 pt-10 border-t border-white/[0.07] flex flex-wrap items-center gap-4"
          {...FADE_UP}
          transition={{ ...FADE_UP.transition, delay: 0.55 }}
        >
          {project.devLogUrl ? (
            <a
              href={project.devLogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-none border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 font-mono tracking-wide transition hover:border-[#d4e157]/40 hover:bg-white/[0.04] hover:text-white"
            >
              <BookOpen className="size-4 opacity-80" aria-hidden />
              View dev log
              <ExternalLink className="size-3.5 opacity-60" aria-hidden />
            </a>
          ) : null}
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-none bg-[#d4e157] px-5 py-3 text-sm font-bold font-mono tracking-wide text-[#111] transition hover:bg-[#e0ee6a]"
            >
              Visit project
              <ExternalLink className="size-4" aria-hidden />
            </a>
          ) : null}
        </motion.div>
      </div>
    </article>
  );
}
