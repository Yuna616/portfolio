import { ExternalLink, Github, Instagram, ChevronRight } from 'lucide-react';

export interface Link {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: 'github' | 'instagram' | 'custom';
  thumbnail?: string;
  date: string;
}

interface LinkCardProps {
  link: Link;
}

const sourceIcons = {
  github: Github,
  instagram: Instagram,
  custom: ExternalLink,
};

const sourceColors = {
  github: 'text-gray-900',
  instagram: 'text-pink-600',
  custom: 'text-blue-600',
};

export function LinkCard({ link }: LinkCardProps) {
  const SourceIcon = sourceIcons[link.source];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 group"
    >
      <div className="flex items-center gap-4">
        {link.thumbnail && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={link.thumbnail}
              alt={link.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
              {link.title}
            </h3>
            <SourceIcon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${sourceColors[link.source]}`} />
          </div>
          {link.description && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-1">
              {link.description}
            </p>
          )}
          <p className="text-xs text-gray-500">{link.date}</p>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </a>
  );
}
