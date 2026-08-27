import { Github, BookOpen, FileText, Linkedin } from 'lucide-react';

export function TimelineHero() {
  return (
    <header className="px-6 md:px-12 lg:px-20 pt-16 pb-16 md:pt-20 md:pb-20 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mb-2">
          Yuna Park
        </h1>
        <p className="font-mono text-[12px] text-neutral-700 tracking-[0.08em] mb-6">
          Irvine, CA{' '}
          <span className="text-neutral-300">|</span>{' '}
          <a href="mailto:botw461@gmail.com" className="hover:text-portfolio transition-colors">
            botw461@gmail.com
          </a>{' '}
          <span className="text-neutral-300">|</span>{' '}
          <a href="tel:+19493318640" className="hover:text-portfolio transition-colors">
            +1(949)-331-8640
          </a>
        </p>
        <p className="text-neutral-900 text-base leading-relaxed mb-8">
          Embedded Software Engineer with hands-on experience deploying AI models on Qualcomm Hexagon NPU
          hardware and building real-time firmware (FreeRTOS/ESP32).
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/YunaPark_Resume_Embedded.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-portfolio px-4 py-2.5 text-sm font-semibold text-portfolio-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-portfolio-hover hover:shadow-lg hover:shadow-portfolio/25"
          >
            <FileText className="size-4" aria-hidden />
            Resume
          </a>
          <a
            href="https://github.com/Yuna616"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-portfolio hover:shadow-lg hover:shadow-portfolio/10"
          >
            <Github className="size-4" aria-hidden />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/yunapark616"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-portfolio hover:shadow-lg hover:shadow-portfolio/10"
          >
            <Linkedin className="size-4" aria-hidden />
            LinkedIn
          </a>
          <a
            href="https://lovebotw049.tistory.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-portfolio hover:shadow-lg hover:shadow-portfolio/10"
          >
            <BookOpen className="size-4" aria-hidden />
            Tech blog
          </a>
        </div>
      </div>
    </header>
  );
}
