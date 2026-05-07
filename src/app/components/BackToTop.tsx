import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#d4e157] text-[#111] shadow-lg shadow-[#d4e157]/20 transition hover:bg-[#e0ee6a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4e157] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
      aria-label="맨 위로"
    >
      <ChevronUp className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}
