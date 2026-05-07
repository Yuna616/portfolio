import { Plus } from 'lucide-react';

interface HeaderProps {
  onAddPost: () => void;
}

export function Header({ onAddPost }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Portfolio</h1>
          </div>

          <button
            onClick={onAddPost}
            className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">새 게시물</span>
            <span className="xs:hidden">추가</span>
          </button>
        </div>
      </div>
    </header>
  );
}
