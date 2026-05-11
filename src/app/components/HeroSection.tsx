import * as React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Github } from 'lucide-react';
import { CircuitBackground } from './CircuitBackground';

const TECH_TAGS = ['ESP32', 'FreeRTOS', 'MQTT', 'AWS IoT', 'React', 'TypeScript', 'Python', 'C/C++'];

function RightPanel() {
  const kw = 'text-purple-800 dark:text-[#c678dd]';
  const fn = 'text-blue-700 dark:text-[#61afef]';
  const inc = 'text-sky-700 dark:text-[#7cb8ff]';
  const str = 'text-emerald-800 dark:text-[#98be65]';
  const sym = 'text-neutral-700 dark:text-[#abb2bf]';
  const num = 'text-amber-800 dark:text-[#d19a66]';

  return (
    <motion.div
      className="hidden lg:flex flex-col gap-4 shrink-0 w-[44%] xl:w-[46%]"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Code window ── */}
      <div className="border border-neutral-200 bg-white overflow-hidden shadow-sm dark:border-white/[0.08] dark:bg-[#0c0c0c] dark:shadow-none">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-200 bg-neutral-50 dark:border-white/[0.06] dark:bg-white/[0.015]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/60" />
          <span className="font-mono text-[10px] text-neutral-500 ml-3 uppercase tracking-widest dark:text-[#3a3a3a]">
            firmware.c
          </span>
        </div>

        {/* Code body */}
        <div className="px-5 py-4 font-mono text-[12px] leading-[1.95] bg-neutral-50/50 dark:bg-transparent">
          <div><span className={inc}>#include</span> <span className={str}>&quot;freertos/FreeRTOS.h&quot;</span></div>
          <div><span className={inc}>#include</span> <span className={str}>&quot;mqtt_client.h&quot;</span></div>
          <div className="h-[1em]" />
          <div>
            <span className={kw}>void </span>
            <span className={fn}>sensor_task</span>
            <span className={sym}>(void *arg) {'{'}</span>
          </div>
          <div className="pl-5">
            <span className={kw}>float </span>
            <span className={sym}>val = </span>
            <span className={fn}>sensor_read</span>
            <span className={sym}>();</span>
          </div>
          <div className="pl-5">
            <span className={fn}>mqtt_publish</span>
            <span className={sym}>(topic, val);</span>
          </div>
          <div className="pl-5">
            <span className={fn}>vTaskDelay</span>
            <span className={sym}>(</span>
            <span className={num}>1000</span>
            <span className={sym}> / portTICK_PERIOD_MS);</span>
          </div>
          <div><span className={sym}>{'}'}</span></div>
          <div className="h-[1em]" />
          <div>
            <span className={kw}>void </span>
            <span className={fn}>app_main</span>
            <span className={sym}>() {'{'}</span>
          </div>
          <div className="pl-5">
            <span className={fn}>mqtt_connect</span>
            <span className={sym}>(</span>
            <span className={str}>&quot;broker.io&quot;</span>
            <span className={sym}>);</span>
          </div>
          <div className="pl-5">
            <span className={fn}>xTaskCreate</span>
            <span className={sym}>(sensor_task,</span>
          </div>
          <div className="pl-10">
            <span className={str}>&quot;sensor&quot;</span>
            <span className={sym}>, </span>
            <span className={num}>2048</span>
            <span className={sym}>, NULL, </span>
            <span className={num}>5</span>
            <span className={sym}>, NULL);</span>
          </div>
          <div><span className={sym}>{'}'}</span></div>
        </div>
      </div>

      {/* ── Device status panel ── */}
      <div className="border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#0c0c0c] dark:shadow-none">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-portfolio animate-pulse" />
          <span className="font-mono text-[10px] text-portfolio uppercase tracking-[0.28em]">
            Device Status
          </span>
        </div>
        <div className="space-y-2.5">
          {[
            { key: 'Board',      val: 'ESP32-S3' },
            { key: 'RTOS',       val: 'FreeRTOS v10.5' },
            { key: 'Connection', val: 'MQTT · broker.io' },
            { key: 'Task',       val: 'sensor_task  [RUNNING]' },
            { key: 'Uptime',     val: '00:04:12' },
          ].map(({ key, val }) => (
            <div key={key} className="flex justify-between items-baseline gap-4">
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wide shrink-0 dark:text-[#3d3d3d]">
                {key}
              </span>
              <span className="font-mono text-[11px] text-neutral-700 text-right dark:text-[#5a5a5a]">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech stack badges ── */}
      <div className="flex flex-wrap gap-2">
        {TECH_TAGS.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] uppercase tracking-wide px-2.5 py-1
                       border border-neutral-200 text-neutral-600
                       hover:border-portfolio/40 hover:text-neutral-800 transition-colors duration-200
                       dark:border-white/[0.07] dark:text-[#484848] dark:hover:border-portfolio/25 dark:hover:text-[#777]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-28 pb-12 overflow-hidden bg-[#f7f7f4] scroll-mt-0 dark:bg-[#0a0a0a]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <CircuitBackground />
      </div>

      {/* Top meta row */}
      <motion.div
        className="relative z-10 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.35em] dark:text-[#444]">
          Portfolio · 2025
        </p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-portfolio animate-pulse" />
          <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.2em] dark:text-[#555]">
            Open to work
          </p>
        </div>
      </motion.div>

      {/* Main: left text + right panel */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-14 py-10 md:py-12">

        {/* ── Left: text content ── */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Greeting + small profile photo */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 shrink-0 overflow-hidden rounded-full border border-portfolio/30">
              <img
                src="/profile.png"
                alt="Yuna Park"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p className="font-mono text-[11px] text-portfolio uppercase tracking-[0.3em]">
              &lt;&nbsp;Yuna&nbsp;/&gt;&nbsp;&nbsp;Hi, I'm Yuna —
            </p>
          </div>

          {/* Name */}
          <h1
            className="font-sans font-black uppercase text-neutral-900 tracking-[-0.03em] leading-[0.88] mb-7 dark:text-white"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }}
          >
            Yuna
            <br />
            Park
          </h1>

          {/* Role line */}
          <p className="font-mono text-[12px] text-portfolio/65 uppercase tracking-[0.22em] mb-6">
            Embedded Systems Engineer&nbsp;&nbsp;·&nbsp;&nbsp;Full-Stack Developer
          </p>

          {/* Divider */}
          <div className="w-10 h-px bg-portfolio/30 mb-6" />

          {/* Bio */}
          <p className="text-neutral-600 text-[15px] leading-[1.85] max-w-md mb-9 dark:text-[#777]">
            Building connected systems from MCU firmware to cloud dashboards.
            I work across the full hardware–software stack — ESP32, FreeRTOS,
            MQTT, and full-stack web — turning low-level signals into products
            people actually use.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href="https://github.com/Yuna616"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-none font-mono text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-3
                         bg-portfolio text-portfolio-foreground transition-colors hover:bg-portfolio-hover"
            >
              <Github className="size-4 shrink-0 text-portfolio-foreground" aria-hidden />
              GitHub ↗
            </a>
            <a
              href="https://lovebotw049.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-none font-mono text-[11px] uppercase tracking-[0.2em] px-7 py-3
                         border border-neutral-300 text-neutral-600 transition-colors
                         hover:border-portfolio hover:bg-portfolio/10 hover:text-portfolio
                         dark:border-white/[0.18] dark:text-[#888]"
            >
              <BookOpen className="size-4 shrink-0" aria-hidden />
              Tech blog ↗
            </a>
            <button
              type="button"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="inline-flex items-center justify-center rounded-none font-mono text-[11px] uppercase tracking-[0.2em] px-7 py-3
                         border border-neutral-300 text-neutral-600 transition-colors
                         hover:border-portfolio hover:bg-portfolio/10 hover:text-portfolio
                         dark:border-white/[0.18] dark:text-[#888]"
            >
              Contact ↗
            </button>
          </div>

          {/* Location */}
          <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.28em] dark:text-[#3a3a3a]">
            Kookmin University&nbsp;&nbsp;·&nbsp;&nbsp;Seoul, Korea
          </p>
        </motion.div>

        {/* ── Right panel ── */}
        <RightPanel />
      </div>

      {/* Bottom footer row */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="h-px bg-neutral-200 mb-8 dark:bg-white/[0.07]" />
        <p className="font-mono text-[11px] text-neutral-500 leading-[1.8] uppercase tracking-[0.1em] dark:text-[#505050]">
          MCU firmware · MQTT & cloud IoT
          <br />
          FreeRTOS · Full-stack web
        </p>
      </motion.div>
    </section>
  );
}
