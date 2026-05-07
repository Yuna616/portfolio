import { Github, Instagram, Linkedin, Mail, MapPin, Briefcase } from 'lucide-react';
import { PROFILE_IMAGE_URL } from '../../constants/profile';

export function ProfileHero() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative flex-shrink-0">
            <img
              src={PROFILE_IMAGE_URL}
              alt="Profile"
              className="block h-auto w-auto max-h-[min(50vh,280px)] sm:max-h-80 md:max-h-96 shadow-xl border-4 border-white"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-white"></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Yuna Park
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-2xl">
              IoT & embedded developer · Full-stack web
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-6 max-w-2xl leading-relaxed">
              I focus on MCU firmware (ESP32/STM32, C/C++), MQTT and cloud-backed telemetry (Firebase, AWS IoT), and FreeRTOS-style multitasking—while also shipping full-stack web products like Point (AI presentation agent). Carpybara ties physical devices and responsive in-cabin UX together.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mb-6 text-sm sm:text-base text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Seoul, South Korea</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Freelance</span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700 hover:text-gray-900"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700 hover:text-gray-900"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700 hover:text-gray-900"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="mailto:your.email@example.com"
                className="p-2.5 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700 hover:text-gray-900"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
