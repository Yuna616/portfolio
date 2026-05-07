import { motion } from 'motion/react';
import { CircuitBackground } from './CircuitBackground';

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-28 pb-12 overflow-hidden bg-[#0a0a0a] scroll-mt-0"
    >
      <CircuitBackground />

      {/* Top meta row */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="font-mono text-[10px] text-[#444] uppercase tracking-[0.35em]">
          Portfolio · 2025
        </p>
      </motion.div>

      {/* Main: large display name */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col justify-center py-12 md:py-16"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-[11px] text-[#d4e157] uppercase tracking-[0.35em] mb-5">
          &lt;&nbsp;Yuna&nbsp;/&gt;
        </p>
        <h1
          className="font-sans font-black uppercase text-white tracking-[-0.03em] leading-[0.88]"
          style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
        >
          Yuna
          <br />
          Park
        </h1>
      </motion.div>

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
