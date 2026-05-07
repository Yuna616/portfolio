import { type FormEvent, type KeyboardEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  EXPERIENCE,
  PROJECTS,
  type PortfolioProject,
} from '../../constants/portfolio';
import { ProjectDetailModal } from './ProjectDetailModal';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <motion.div
      className="mb-14 md:mb-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
    >
      <p className="font-mono text-[11px] text-[#d4e157] uppercase tracking-[0.35em] mb-3">{number}</p>
      <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
        {title}
      </h2>
    </motion.div>
  );
}

export function AboutSection() {
  const [sent, setSent] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const onContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  const onProjectKeyDown = (e: KeyboardEvent<HTMLElement>, project: PortfolioProject) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedProject(project);
    }
  };

  return (
    <>
      <ProjectDetailModal
        project={selectedProject}
        onOpenChange={(next) => {
          if (!next) setSelectedProject(null);
        }}
      />

      {/* ── Work ── */}
      <section
        id="work"
        className="scroll-mt-24 px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel number="01 — Selected projects" title="Work" />

          {/* Project rows */}
          <motion.div
            className="divide-y divide-white/[0.06]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {PROJECTS.map((project) => {
              const thumb = project.images[0];
              return (
                <motion.article
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => onProjectKeyDown(e, project)}
                  className="group cursor-pointer py-12 md:py-16 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4e157]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  variants={fadeUp}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-[#d4e157] uppercase tracking-[0.3em] mb-4">
                        {project.id.padStart(2, '0')}
                      </p>
                      <h3
                        className="font-sans font-bold uppercase text-white tracking-[-0.02em] leading-none mb-4 transition-colors duration-300 group-hover:text-[#d4e157]"
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                      >
                        {project.title}
                      </h3>
                      <p className="font-mono text-xs text-[#555] mb-5">{project.stack}</p>
                      <p className="text-[#777] text-sm max-w-sm mb-8 leading-relaxed">{project.tagline}</p>
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#555] border-b border-white/[0.1] pb-0.5 transition-colors duration-300 group-hover:text-[#d4e157] group-hover:border-[#d4e157]/30">
                        View project →
                      </span>
                    </div>

                    {/* Thumbnail */}
                    {thumb && (
                      <div className="w-full lg:w-[42%] shrink-0 overflow-hidden">
                        <div className="aspect-[16/10] overflow-hidden bg-[#0d0d0d] border border-white/[0.05] transition-colors duration-300 group-hover:border-white/[0.1]">
                          <img
                            src={thumb}
                            alt=""
                            className="w-full h-full object-cover object-top opacity-55 transition-all duration-500 group-hover:opacity-85 group-hover:scale-[1.03]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Expertise ── */}
      <section
        id="expertise"
        className="scroll-mt-24 px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel number="02 — Capabilities" title="Expertise" />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <ExpertiseItem
              num="01"
              titleTop="MCU firmware"
              titleBottom="ESP32 · STM32 · C/C++"
              body="GPIO and peripheral bring-up, sensor reads, interrupt-driven paths, careful memory use, and hands-on debugging with tight, optimized C code."
              foot="GPIO · Sensors · Interrupts · Memory · Debug"
            />
            <ExpertiseItem
              num="02"
              titleTop="IoT & cloud"
              titleBottom="MQTT · HTTP · Firebase · AWS IoT"
              body="End-to-end IoT flows — devices publish over MQTT or HTTP, payloads land in Firebase or AWS IoT, with full-stack web surfaces and product-grade UX."
              foot="Telemetry · Cloud ingest · Full-stack web"
            />
            <ExpertiseItem
              num="03"
              titleTop="RTOS systems"
              titleBottom="FreeRTOS · Tasks · Queues · Semaphores"
              body="Reliable multitasking firmware: dedicated tasks for sensing, connectivity, and control, coordinated with queues and semaphores for predictable real-time behavior."
              foot="Multitasking · Real-time · Separation of concerns"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section
        id="experience"
        className="scroll-mt-24 px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel number="03 — Projects & Career" title="Experience" />
          <motion.div
            className="divide-y divide-white/[0.06]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {EXPERIENCE.map((job) => (
              <motion.div
                key={`${job.company}-${job.period}`}
                className="grid grid-cols-1 lg:grid-cols-[minmax(0,220px)_1fr] gap-8 lg:gap-16 py-12 md:py-14"
                variants={fadeUp}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-sans text-lg font-semibold text-white">{job.role}</h3>
                    {job.team && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[#d4e157]/30 text-[#d4e157]/70">
                        Team
                      </span>
                    )}
                  </div>
                  <p className="text-[#d4e157] text-sm mb-2">@ {job.company}</p>
                  <p className="font-mono text-xs text-[#666] mb-1">{job.period}</p>
                  <p className="font-mono text-xs text-[#555] mb-4">{job.location}</p>
                  {job.url && (
                    <a
                      href={job.url}
                      className="font-mono text-xs text-[#d4e157]/60 hover:text-[#d4e157] underline underline-offset-4 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                <div>
                  {job.bullets && job.bullets.length > 0 ? (
                    <ul className="space-y-3 mb-6">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm leading-relaxed">
                          <span className="text-[#d4e157]/40 shrink-0 select-none mt-px">—</span>
                          <span className="text-[#888]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : job.description ? (
                    <p className="text-[#888] text-sm leading-relaxed mb-6">{job.description}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 border border-white/[0.08] text-[#666]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        id="contact"
        className="scroll-mt-24 px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <p className="font-mono text-[11px] text-[#d4e157] uppercase tracking-[0.35em] mb-4">
              04 — Get in touch
            </p>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white mb-10 max-w-lg">
              Have a question or want to work together?
            </h2>
          </motion.div>

          {sent ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-sm text-[#d4e157] py-4"
            >
              Message sent. Thanks!
            </motion.p>
          ) : (
            <motion.form
              onSubmit={onContactSubmit}
              className="max-w-xl space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp}>
                <label htmlFor="contact-email" className="sr-only">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full border-b border-white/[0.12] bg-transparent px-0 py-3 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#d4e157]/50 transition-colors"
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <label htmlFor="contact-message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Your message"
                  className="w-full border-b border-white/[0.12] bg-transparent px-0 py-3 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#d4e157]/50 transition-colors resize-none min-h-[120px]"
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <button
                  type="submit"
                  className="font-mono text-xs uppercase tracking-[0.2em] px-8 py-3 bg-[#d4e157] text-[#0a0a0a] font-bold hover:bg-[#e0ee6a] transition-colors"
                >
                  Submit
                </button>
              </motion.div>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}

function ExpertiseItem({
  num,
  titleTop,
  titleBottom,
  body,
  foot,
}: {
  num: string;
  titleTop: string;
  titleBottom: string;
  body: string;
  foot: string;
}) {
  const tags = foot.split(' · ');

  return (
    <motion.article
      className="group relative border border-white/[0.07] bg-white/[0.015] p-8 overflow-hidden
                 hover:border-[#d4e157]/25 hover:bg-white/[0.03] transition-all duration-500 cursor-default"
      variants={fadeUp}
    >
      {/* Top accent line — slides in on hover */}
      <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#d4e157] to-[#d4e157]/30 group-hover:w-full transition-all duration-500 ease-out" />

      {/* Ghost number */}
      <span className="absolute bottom-4 right-5 font-sans font-black select-none pointer-events-none
                       text-[6rem] leading-none text-white/[0.03] group-hover:text-[#d4e157]/[0.07]
                       transition-colors duration-500">
        {num}
      </span>

      {/* Number tag */}
      <p className="font-mono text-[10px] text-[#d4e157] uppercase tracking-[0.35em] mb-6">{num}</p>

      {/* Title */}
      <h3 className="font-sans text-2xl font-bold text-white leading-tight mb-1
                     group-hover:text-[#d4e157] transition-colors duration-300">
        {titleTop}
      </h3>
      <p className="font-mono text-[11px] text-[#d4e157]/45 mb-6">{titleBottom}</p>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-6 group-hover:bg-[#d4e157]/10 transition-colors duration-300" />

      {/* Body */}
      <p className="text-[#777] text-sm leading-relaxed mb-7">{body}</p>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] uppercase tracking-wide px-2.5 py-1
                       border border-white/[0.07] text-[#505050]
                       group-hover:border-[#d4e157]/20 group-hover:text-[#777]
                       transition-all duration-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
