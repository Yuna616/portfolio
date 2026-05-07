import { Filter } from 'lucide-react';

interface FilterBarProps {
  selectedFilter: 'all' | 'github' | 'instagram' | 'custom';
  onFilterChange: (filter: 'all' | 'github' | 'instagram' | 'custom') => void;
  postCounts: {
    all: number;
    github: number;
    instagram: number;
    custom: number;
  };
}

export function FilterBar({ selectedFilter, onFilterChange, postCounts }: FilterBarProps) {
  const filters = [
    { id: 'all' as const, label: '전체', count: postCounts.all },
    { id: 'github' as const, label: 'GitHub', count: postCounts.github },
    { id: 'instagram' as const, label: 'Instagram', count: postCounts.instagram },
    { id: 'custom' as const, label: '커스텀', count: postCounts.custom },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
