import { BrowserRouter, Route, Routes } from 'react-router';
import { BackToTop } from './components/BackToTop';
import { HomePage } from './pages/HomePage';
import { ProjectCaseStudyPage } from './pages/ProjectCaseStudyPage';
import { ExperienceDetailPage } from './pages/ExperienceDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-portfolio/30 selection:text-neutral-900">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:slug" element={<ProjectCaseStudyPage />} />
            <Route path="/experience/:slug" element={<ExperienceDetailPage />} />
          </Routes>
        </main>

        <footer className="px-6 md:px-12 lg:px-20 py-10 border-t border-neutral-200 dark:border-white/[0.06]">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-700 dark:text-[#444]">
            Yuna Park © {new Date().getFullYear()}
          </p>
        </footer>

        <BackToTop />
      </div>
    </BrowserRouter>
  );
}
