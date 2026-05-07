import { motion } from 'motion/react';
import { CircuitBackground } from './CircuitBackground';

const TECH_TAGS = ['ESP32', 'FreeRTOS', 'MQTT', 'AWS IoT', 'React', 'TypeScript', 'Python', 'C/C++'];

function RightPanel() {
  return (
    <motion.div
      className="hidden lg:flex flex-col gap-4 shrink-0 w-[44%] xl:w-[46%]"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Code window ── */}
      <div className="border border-white/[0.08] bg-[#0c0c0c] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.015]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/60" />
          <span className="font-mono text-[10px] text-[#3a3a3a] ml-3 uppercase tracking-widest">
            firmware.c
          </span>
        </div>

        {/* Code body */}
        <div className="px-5 py-4 font-mono text-[12px] leading-[1.95]">
          <div><span className="text-[#7cb8ff]">#include</span> <span className="text-[#98be65]">&quot;freertos/FreeRTOS.h&quot;</span></div>
          <div><span className="text-[#7cb8ff]">#include</span> <span className="text-[#98be65]">&quot;mqtt_client.h&quot;</span></div>
          <div className="h-[1em]" />
          <div>
            <span className="text-[#c678dd]">void </span>
            <span className="text-[#61afef]">sensor_task</span>
            <span className="text-[#abb2bf]">(void *arg) {'{'}</span>
          </div>
          <div className="pl-5">
            <span className="text-[#c678dd]">float </span>
            <span className="text-[#abb2bf]">val = </span>
            <span className="text-[#61afef]">sensor_read</span>
            <span className="text-[#abb2bf]">();</span>
          </div>
          <div className="pl-5">
            <span className="text-[#61afef]">mqtt_publish</span>
            <span className="text-[#abb2bf]">(topic, val);</span>
          </div>
          <div className="pl-5">
            <span className="text-[#61afef]">vTaskDelay</span>
            <span className="text-[#abb2bf]">(</span>
            <span className="text-[#d19a66]">1000</span>
            <span className="text-[#abb2bf]"> / portTICK_PERIOD_MS);</span>
          </div>
          <div><span className="text-[#abb2bf]">{'}'}</span></div>
          <div className="h-[1em]" />
          <div>
            <span className="text-[#c678dd]">void </span>
            <span className="text-[#61afef]">app_main</span>
            <span className="text-[#abb2bf]">() {'{'}</span>
          </div>
          <div className="pl-5">
            <span className="text-[#61afef]">mqtt_connect</span>
            <span className="text-[#abb2bf]">(</span>
            <span className="text-[#98be65]">&quot;broker.io&quot;</span>
            <span className="text-[#abb2bf]">);</span>
          </div>
          <div className="pl-5">
            <span className="text-[#61afef]">xTaskCreate</span>
            <span className="text-[#abb2bf]">(sensor_task,</span>
          </div>
          <div className="pl-10">
            <span className="text-[#98be65]">&quot;sensor&quot;</span>
            <span className="text-[#abb2bf]">, </span>
            <span className="text-[#d19a66]">2048</span>
            <span className="text-[#abb2bf]">, NULL, </span>
            <span className="text-[#d19a66]">5</span>
            <span className="text-[#abb2bf]">, NULL);</span>
          </div>
          <div><span className="text-[#abb2bf]">{'}'}</span></div>
        </div>
      </div>

      {/* ── Device status panel ── */}
      <div className="border border-white/[0.08] bg-[#0c0c0c] p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4e157] animate-pulse" />
          <span className="font-mono text-[10px] text-[#d4e157] uppercase tracking-[0.28em]">
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
              <span className="font-mono text-[10px] text-[#3d3d3d] uppercase tracking-wide shrink-0">
                {key}
              </span>
              <span className="font-mono text-[11px] text-[#5a5a5a] text-right">{val}</span>
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
                       border border-white/[0.07] text-[#484848]
                       hover:border-[#d4e157]/25 hover:text-[#777] transition-colors duration-200"
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
      className="relative min-h-[100svh] flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-28 pb-12 overflow-hidden bg-[#0a0a0a] scroll-mt-0"
    >
      <CircuitBackground />

      {/* Top meta row */}
      <motion.div
        className="relative z-10 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="font-mono text-[10px] text-[#444] uppercase tracking-[0.35em]">
          Portfolio · 2025
        </p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4e157] animate-pulse" />
          <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em]">
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
            <div className="w-11 h-11 shrink-0 overflow-hidden rounded-full border border-[#d4e157]/30">
              <img
                src="/profile.png"
                alt="Yuna Park"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p className="font-mono text-[11px] text-[#d4e157] uppercase tracking-[0.3em]">
              &lt;&nbsp;Yuna&nbsp;/&gt;&nbsp;&nbsp;Hi, I'm Yuna —
            </p>
          </div>

          {/* Name */}
          <h1
            className="font-sans font-black uppercase text-white tracking-[-0.03em] leading-[0.88] mb-7"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }}
          >
            Yuna
            <br />
            Park
          </h1>

          {/* Role line */}
          <p className="font-mono text-[12px] text-[#d4e157]/65 uppercase tracking-[0.22em] mb-6">
            Embedded Systems Engineer&nbsp;&nbsp;·&nbsp;&nbsp;Full-Stack Developer
          </p>

          {/* Divider */}
          <div className="w-10 h-px bg-[#d4e157]/30 mb-6" />

          {/* Bio */}
          <p className="text-[#777] text-[15px] leading-[1.85] max-w-md mb-9">
            Building connected systems from MCU firmware to cloud dashboards.
            I work across the full hardware–software stack — ESP32, FreeRTOS,
            MQTT, and full-stack web — turning low-level signals into products
            people actually use.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href="#work"
              className="font-mono text-[11px] uppercase tracking-[0.2em] px-7 py-3
                         bg-[#d4e157] text-[#0a0a0a] font-bold hover:bg-[#e0ee6a] transition-colors"
            >
              View Projects →
            </a>
            <a
              href="https://github.com/Yuna616"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.2em] px-7 py-3
                         border border-white/[0.12] text-[#666] hover:text-white hover:border-white/25 transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="#contact"
              className="font-mono text-[11px] uppercase tracking-[0.2em] px-7 py-3
                         border border-white/[0.12] text-[#666] hover:text-white hover:border-white/25 transition-colors"
            >
              Contact ↗
            </a>
          </div>

          {/* Location */}
          <p className="font-mono text-[10px] text-[#3a3a3a] uppercase tracking-[0.28em]">
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
        <div className="h-px bg-white/[0.07] mb-8" />
        <p className="font-mono text-[11px] text-[#505050] leading-[1.8] uppercase tracking-[0.1em]">
          MCU firmware · MQTT & cloud IoT
          <br />
          FreeRTOS · Full-stack web
        </p>
      </motion.div>
    </section>
  );
}
