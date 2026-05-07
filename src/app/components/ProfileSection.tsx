import { Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { PROFILE_IMAGE_URL } from '../../constants/profile';

export function ProfileSection() {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <div className="relative inline-block mb-4 sm:mb-6">
        <img
          src={PROFILE_IMAGE_URL}
          alt="Profile"
          className="mx-auto block h-auto w-auto max-h-44 sm:max-h-52 shadow-lg border-4 border-white"
        />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        김지원
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
        크리에이티브 디자이너 & 개발자
      </p>

      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700 hover:text-gray-900"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700 hover:text-gray-900"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700 hover:text-gray-900"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href="mailto:your.email@example.com"
          className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700 hover:text-gray-900"
          aria-label="Email"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
