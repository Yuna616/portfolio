import * as DialogPrimitive from '@radix-ui/react-dialog';
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PortfolioProject } from '../../constants/portfolio';
import { Dialog, DialogOverlay, DialogPortal } from './ui/dialog';
import { cn } from './ui/utils';

const VIDEO_EXTS = ['.mp4', '.mov', '.webm', '.ogg'];
function isVideo(src: string) {
  return VIDEO_EXTS.some((ext) => src.toLowerCase().endsWith(ext));
}

type ProjectDetailModalProps = {
  project: PortfolioProject | null;
  onOpenChange: (open: boolean) => void;
};

export function ProjectDetailModal({ project, onOpenChange }: ProjectDetailModalProps) {
  const open = project !== null;
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (project) setSlide(0);
  }, [project?.id]);

  const images = project?.images ?? [];
  const hasMany = images.length > 1;
  const current = images[Math.min(slide, Math.max(images.length - 1, 0))];

  const goPrev = () => {
    setSlide((i) => (i <= 0 ? images.length - 1 : i - 1));
  };

  const goNext = () => {
    setSlide((i) => (i >= images.length - 1 ? 0 : i + 1));
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay
          className={cn(
            'z-50 bg-black/80 backdrop-blur-[2px]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(100vw-1.5rem,680px)] max-h-[min(90vh,100dvh-1.5rem)] -translate-x-1/2 -translate-y-1/2',
            'flex flex-col overflow-y-auto overflow-x-hidden rounded-lg border border-white/[0.12] bg-[#0c0c0c] shadow-2xl shadow-black/60',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'duration-200 outline-none',
          )}
        >
          <DialogPrimitive.Title className="sr-only">{project.title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{project.description}</DialogPrimitive.Description>

          <div className="flex shrink-0 justify-center px-4 pt-4">
            <div className="relative aspect-[16/10] w-full max-w-[420px] overflow-hidden rounded-md bg-gradient-to-br from-white/[0.06] to-transparent sm:max-w-[460px]">
              {current ? (
                isVideo(current) ? (
                  <video
                    key={current}
                    src={current}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                  />
                ) : (
                  <img
                    src={current}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.08] to-transparent font-mono text-xs text-white/30">
                  No preview
                </div>
              ) }
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-80" />

              {hasMany && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:border-[#d4e157]/50 hover:bg-black/70 hover:text-[#d4e157] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4e157]/60"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:border-[#d4e157]/50 hover:bg-black/70 hover:text-[#d4e157] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4e157]/60"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col border-t border-white/[0.08] bg-[#0a0a0a] px-6 py-7 sm:px-8 sm:py-9">
            <h2 className="font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">{project.title}</h2>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b6b] sm:text-[11px]">
              {project.tagline}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/80 sm:text-[15px]">{project.description}</p>

            <div className="mt-9 flex flex-wrap items-center justify-end gap-3 border-t border-white/[0.06] pt-7">
              {!project.url && !project.devLogUrl ? (
                <p className="mr-auto font-mono text-xs text-white/35">No public site or dev log linked.</p>
              ) : null}

              {project.devLogUrl ? (
                <a
                  href={project.devLogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:border-[#d4e157]/45 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4e157]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  <BookOpen className="size-4 shrink-0 opacity-90" aria-hidden />
                  View dev log
                  <ExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden />
                </a>
              ) : null}

              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#d4e157] px-4 py-2.5 text-sm font-semibold text-[#111] transition hover:bg-[#e0ee6a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4e157] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  Open site
                  <ExternalLink className="size-4 shrink-0" aria-hidden />
                </a>
              ) : null}

              <DialogPrimitive.Close
                type="button"
                className="flex size-11 shrink-0 items-center justify-center rounded border border-white/15 text-white/70 transition hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4e157]/50"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={1.5} />
              </DialogPrimitive.Close>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
