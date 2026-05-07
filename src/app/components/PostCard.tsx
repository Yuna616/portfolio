import { ExternalLink, Github, Instagram } from 'lucide-react';

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  source: 'github' | 'instagram' | 'custom';
  url?: string;
  date: string;
  tags: string[];
}

interface PostCardProps {
  post: Post;
}

const sourceIcons = {
  github: Github,
  instagram: Instagram,
  custom: ExternalLink,
};

const sourceColors = {
  github: 'bg-gray-900 text-white',
  instagram: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white',
  custom: 'bg-blue-600 text-white',
};

export function PostCard({ post }: PostCardProps) {
  const SourceIcon = sourceIcons[post.source];

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 p-2 rounded-full ${sourceColors[post.source]} shadow-lg`}>
          <SourceIcon className="w-4 h-4" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{post.title}</h3>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-2"
              aria-label="View source"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-500">{post.date}</p>
      </div>
    </div>
  );
}
