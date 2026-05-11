import { BrowserRouter, Route, Routes } from 'react-router';
import { BackToTop } from './components/BackToTop';
import { DarkHeader } from './components/DarkHeader';
import { HomePage } from './pages/HomePage';
import { ProjectCaseStudyPage } from './pages/ProjectCaseStudyPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fafaf8] text-neutral-900 font-sans antialiased selection:bg-portfolio/30 selection:text-neutral-900 dark:bg-[#0a0a0a] dark:text-[#e8e8e8] dark:selection:bg-portfolio/20 dark:selection:text-white">
        <DarkHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:slug" element={<ProjectCaseStudyPage />} />
          </Routes>
        </main>

        <footer className="px-6 md:px-12 lg:px-20 py-10 border-t border-neutral-200 dark:border-white/[0.06]">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-[#444]">
            Yuna Park © {new Date().getFullYear()}
          </p>
        </footer>

        <BackToTop />
      </div>
    </BrowserRouter>
  );
}
