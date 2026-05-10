import { BrowserRouter, Route, Routes } from 'react-router';
import { BackToTop } from './components/BackToTop';
import { DarkHeader } from './components/DarkHeader';
import { HomePage } from './pages/HomePage';
import { ProjectCaseStudyPage } from './pages/ProjectCaseStudyPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-sans antialiased selection:bg-[#d4e157]/20 selection:text-white">
        <DarkHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:slug" element={<ProjectCaseStudyPage />} />
          </Routes>
        </main>

        <footer className="px-6 md:px-12 lg:px-20 py-10 border-t border-white/[0.06]">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#444]">
            Yuna Park © {new Date().getFullYear()}
          </p>
        </footer>

        <BackToTop />
      </div>
    </BrowserRouter>
  );
}
