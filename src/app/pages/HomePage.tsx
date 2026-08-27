import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { HomeLocationState } from '../../constants/navigation';
import { TimelineHero } from '../components/timeline/TimelineHero';
import { Timeline } from '../components/timeline/Timeline';
import { SkillsSection } from '../components/timeline/SkillsSection';
import { ContactSection } from '../components/ContactSection';

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

    if (hash) {
      const id = hash.replace('#', '');
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      navigate('/', { replace: true });
    }
  }, [pathname, hash, state, navigate]);

  return (
    <>
      <TimelineHero />
      <Timeline />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
