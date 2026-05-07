import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function DarkHeader() {
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
          <a
            href="#home"
            className="font-mono text-sm font-semibold text-[#d4e157] tracking-tight hover:text-[#e0ee6a] transition-colors"
          >
            YP
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-[#606060] hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
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
              <a
                key={item.href}
                href={item.href}
                className="block py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#888] hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
