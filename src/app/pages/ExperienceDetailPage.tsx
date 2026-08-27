import { useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import { getExperienceBySlug } from '../../constants/portfolio';
import { OnDevicePipelineDiagram } from '../components/OnDevicePipelineDiagram';
import { isVideoSrc } from '../../utils/isVideo';

const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionNumber({ n }: { n: string }) {
  return (
    <div className="flex items-center gap-4 mb-6 md:mb-7">
      <span className="font-mono text-[14px] text-portfolio/80 tracking-[0.4em] shrink-0">{n}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-portfolio/20 to-transparent" />
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4 mt-6">
      {items.map((b) => (
        <li key={b} className="flex gap-3 text-base leading-relaxed text-neutral-900">
          <span className="shrink-0 select-none mt-0.5 text-portfolio" aria-hidden>
            —
          </span>
          {b}
        </li>
      ))}
    </ul>
  );
}

export function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const item = useMemo(() => (slug ? getExperienceBySlug(slug) : undefined), [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug || !item) return <Navigate to="/" replace />;

  const cs = item.caseStudy;
  const meta = cs?.meta;

  let sectionIndex = 0;
  function nextNum() {
    sectionIndex += 1;
    return String(sectionIndex).padStart(2, '0');
  }

  const mainMedia = cs?.heroMedia;

  return (
    <article className="min-h-screen bg-[#fafaf8] text-neutral-800">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-28 pb-28 md:pt-32 md:pb-36">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.28em] text-portfolio hover:text-portfolio-hover transition-colors mb-10"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </button>

        <motion.div {...FADE_UP}>
          <p className="font-mono text-[12px] font-bold uppercase tracking-[0.28em] text-portfolio mb-6">
            Experience
          </p>

          <h1 className="font-sans font-black text-neutral-900 tracking-[-0.02em] leading-[1.05] mb-4 text-3xl sm:text-4xl md:text-5xl">
            {item.role}
          </h1>
          <p className="text-lg sm:text-xl mb-6 text-portfolio">
            {item.company}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-800 mb-12">
            <span className="font-mono">{item.period}</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {item.location}
            </span>
            {item.team && (
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] px-2 py-0.5 border border-portfolio/40 text-portfolio">
                Team
              </span>
            )}
          </div>
        </motion.div>

        {!cs ? (
          <>
            {item.summary && (
              <motion.p
                className="text-lg sm:text-xl leading-[1.8] text-neutral-900 font-light mb-14"
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.1 }}
              >
                {item.summary}
              </motion.p>
            )}

            {item.bullets && item.bullets.length > 0 && (
              <motion.section {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.15 }} className="mb-14">
                <h2 className="font-sans text-xl font-bold text-neutral-900 mb-6">Highlights</h2>
                <ul className="space-y-4">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-base leading-relaxed text-neutral-900">
                      <span className="shrink-0 select-none mt-0.5 text-portfolio" aria-hidden>
                        —
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}
          </>
        ) : (
          <>
            {/* ── Meta (left) + main media (right) ── */}
            <motion.div
              className="flex flex-col lg:flex-row gap-10 lg:gap-16 py-12 md:py-14 border-y border-neutral-200 mb-14"
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.1 }}
            >
              <div className="lg:w-[36%] shrink-0 divide-y divide-neutral-200">
                {[
                  { label: 'Role', value: meta?.role },
                  { label: 'Timeline', value: meta?.timeline },
                  { label: 'Team', value: meta?.team },
                ]
                  .filter((row) => row.value)
                  .map(({ label, value }) => (
                    <div key={label} className="py-4 first:pt-0">
                      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-portfolio mb-1.5">{label}</p>
                      {Array.isArray(value) ? (
                        <ul className="space-y-1.5">
                          {value.map((v) => (
                            <li key={v} className="flex gap-2 text-sm text-neutral-900 leading-relaxed">
                              <span className="shrink-0 select-none text-portfolio/50" aria-hidden>
                                —
                              </span>
                              {v}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-neutral-900 leading-relaxed">{value}</p>
                      )}
                    </div>
                  ))}
                {meta?.toolsGroups && (
                  <div className="py-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-portfolio mb-3">Tools & Stack</p>
                    <div className="space-y-3">
                      {meta.toolsGroups.map(({ label, items }) => (
                        <div key={label}>
                          <p className="font-mono text-[8px] uppercase tracking-wider text-neutral-600 mb-1">{label}</p>
                          <p className="text-sm text-neutral-900 leading-relaxed">{items}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {mainMedia && (
                <div className="flex-1 min-w-0">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100">
                    {isVideoSrc(mainMedia) ? (
                      <video
                        src={mainMedia}
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay muted loop playsInline controls
                      />
                    ) : (
                      <img src={mainMedia} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Lead quote ── */}
            {cs.lead && (
              <motion.blockquote
                className="pl-6 border-l-2 border-portfolio/35 mb-20"
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.15 }}
              >
                <p className="text-xl leading-[1.7] text-neutral-900 font-light">{cs.lead}</p>
              </motion.blockquote>
            )}

            <div className="space-y-24 md:space-y-28">
              {cs.problem && (
                <motion.section {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.2 }}>
                  <SectionNumber n={nextNum()} />
                  <h2 className="font-sans text-2xl font-bold text-neutral-900 mb-6">Problem</h2>
                  <p className="text-neutral-900 text-lg leading-[1.9]">{cs.problem}</p>
                </motion.section>
              )}

              {cs.highlights && cs.highlights.length > 0 && (
                <motion.section {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.25 }}>
                  <SectionNumber n={nextNum()} />
                  <h2 className="font-sans text-2xl font-bold text-neutral-900 mb-10">
                    {cs.highlightsTitle ?? 'Key points'}
                  </h2>
                  <ul className="space-y-24">
                    {cs.highlights.map((h, i) => {
                      const hasCode = Boolean(h.codeBlocks && h.codeBlocks.length > 0);
                      return (
                        <li key={h.title}>
                          <div className="flex items-center gap-3 mb-5">
                            <span className="font-mono text-[14px] text-portfolio/65 tracking-widest shrink-0">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className="font-sans text-xl font-bold text-neutral-900">{h.title}</h3>
                          </div>
                          {h.diagram === 'on-device-pipeline' && <OnDevicePipelineDiagram />}
                          {(h.body || h.items) && (
                            <div
                              className={
                                h.asideMedia && !hasCode
                                  ? 'flex flex-col lg:flex-row gap-8 lg:gap-10 items-start mt-6'
                                  : 'mt-6 space-y-4'
                              }
                            >
                              <div className={h.asideMedia && !hasCode ? 'flex-1 min-w-0 space-y-4' : 'space-y-4'}>
                                {h.items ? (
                                  <ul className="space-y-4">
                                    {h.items.map((item) => (
                                      <li key={item} className="flex gap-3 text-neutral-900 text-lg leading-[1.85]">
                                        <span className="shrink-0 select-none mt-1 text-portfolio" aria-hidden>
                                          —
                                        </span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  h.body!.split('\n\n').map((para, pi) => (
                                    <p key={pi} className="text-neutral-900 text-lg leading-[1.85]">
                                      {para}
                                    </p>
                                  ))
                                )}
                              </div>
                              {h.asideMedia && !hasCode && (
                                <div className="w-full lg:w-[42%] shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 aspect-[16/10]">
                                  <img src={h.asideMedia} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>
                          )}
                          {hasCode && (
                            <div className="mt-6 space-y-3">
                              {h.codeBlocks!.map((cb) => (
                                <div
                                  key={cb.label}
                                  className="rounded-sm overflow-hidden border border-neutral-200 bg-white shadow-sm"
                                >
                                  <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 border-b border-neutral-200">
                                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                                    <span className="font-mono text-[10px] text-neutral-600 ml-2 tracking-wide">
                                      {cb.label}
                                    </span>
                                  </div>
                                  <pre className="no-scrollbar overflow-x-auto bg-neutral-50 px-5 py-4 text-[12px] leading-[1.75] font-mono text-neutral-800 border-t border-neutral-100">
                                    <code>{cb.code}</code>
                                  </pre>
                                </div>
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.section>
              )}

              {cs.demoVideos && cs.demoVideos.length > 0 && (
                <motion.section {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.28 }}>
                  <SectionNumber n={nextNum()} />
                  <h2 className="font-sans text-2xl font-bold text-neutral-900 mb-10">Demo</h2>
                  <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
                    {cs.demoVideos.map((dv, i) => (
                      <div key={dv.video}>
                        <div className="w-full overflow-hidden rounded-sm border border-neutral-200 bg-neutral-900 aspect-video shadow-sm">
                          <video src={dv.video} className="w-full h-full object-contain" controls playsInline />
                        </div>
                        {dv.text && (
                          <p className="mt-4 flex gap-3 text-sm text-neutral-600 leading-relaxed">
                            <span className="font-mono text-[13px] uppercase tracking-widest text-portfolio/75 shrink-0 mt-0.5">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            {dv.text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {cs.secondary && (
                <motion.section {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.3 }}>
                  <SectionNumber n={nextNum()} />
                  <h2 className="font-sans text-2xl font-bold text-neutral-900 mb-6">
                    {cs.secondaryTitle ?? 'Details'}
                  </h2>
                  <p className="text-neutral-900 text-lg leading-[1.9]">{cs.secondary.text}</p>
                  {cs.secondary.items && <BulletList items={cs.secondary.items} />}
                </motion.section>
              )}

              {cs.verification && (
                <motion.section {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.35 }}>
                  <SectionNumber n={nextNum()} />
                  <h2 className="font-sans text-2xl font-bold text-neutral-900 mb-6">
                    {cs.verificationTitle ?? 'Verification'}
                  </h2>
                  <p className="text-neutral-900 text-lg leading-[1.9]">{cs.verification.text}</p>
                  {cs.verification.items && <BulletList items={cs.verification.items} />}
                </motion.section>
              )}

              {cs.reflection && (
                <motion.section
                  className="rounded-sm border border-portfolio/25 bg-portfolio/[0.06] p-8 sm:p-10"
                  {...FADE_UP}
                  transition={{ ...FADE_UP.transition, delay: 0.4 }}
                >
                  <SectionNumber n={nextNum()} />
                  <h2 className="font-sans text-2xl font-bold text-neutral-900 mb-6">Reflection</h2>
                  <p className="text-neutral-900 text-lg leading-[1.9]">{cs.reflection}</p>
                </motion.section>
              )}
            </div>
          </>
        )}

        {item.tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mt-14 mb-14"
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.45 }}
          >
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-md border border-neutral-200 text-neutral-800"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {item.url && (
          <motion.div {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.5 }}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-portfolio px-5 py-3 text-sm font-semibold text-portfolio-foreground transition hover:bg-portfolio-hover"
            >
              View project
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </motion.div>
        )}
      </div>
    </article>
  );
}
