import * as React from 'react';
import { useState, useEffect } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import type { HomeLocationState } from '../../constants/navigation';

type NavItem =
  | { label: string; to: string }
  | { label: string; to: string; state: HomeLocationState };

const NAV: NavItem[] = [
  { label: 'Work', to: '/#work' },
  { label: 'Expertise', to: '/#expertise' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Contact', to: '/', state: { scrollToContact: true } },
];

export function DarkHeader() {
  const { pathname } = useLocation();
  const isCaseStudy = /^\/work\/[^/]+$/.test(pathname);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {isCaseStudy ? (
            <Link
              to="/#work"
              className="inline-flex min-w-0 items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888] hover:text-[#d4e157] transition-colors sm:text-xs sm:tracking-[0.2em]"
            >
              <ArrowLeft className="size-3.5 shrink-0 sm:size-4" aria-hidden />
              <span className="truncate">Back to portfolio</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="font-mono text-sm font-semibold text-[#d4e157] tracking-tight hover:text-[#e0ee6a] transition-colors"
            >
              YP
            </Link>
          )}

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                {...('state' in item ? { state: item.state } : {})}
                className="font-mono text-xs uppercase tracking-[0.18em] text-[#606060] hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#707070] p-2 hover:text-white transition-colors"
            aria-expanded={open}
            aria-label="메뉴"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <nav className="lg:hidden pb-6 pt-4 border-t border-white/[0.06]">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                {...('state' in item ? { state: item.state } : {})}
                className="block py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#888] hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
