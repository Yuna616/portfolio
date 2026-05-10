import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { HomeLocationState } from '../../constants/navigation';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';

export function HomePage() {
  const { pathname, hash, state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname !== '/') return;

    const st = state as HomeLocationState | null;
    if (st?.scrollToContact) {
      requestAnimationFrame(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      navigate('.', { replace: true, state: {} });
      return;
    }

    if (hash === '#contact') {
      navigate('/', { replace: true });
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, state, navigate]);

  return (
    <>
      <HeroSection />
      <AboutSection />
    </>
  );
}
