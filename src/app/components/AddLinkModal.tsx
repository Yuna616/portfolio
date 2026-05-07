import { X } from 'lucide-react';
import { useState } from 'react';
import type { Link } from './LinkCard';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (link: Omit<Link, 'id' | 'date'>) => void;
}

export function AddLinkModal({ isOpen, onClose, onAdd }: AddLinkModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    source: 'custom' as 'github' | 'instagram' | 'custom',
    thumbnail: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      title: formData.title,
      description: formData.description || undefined,
      url: formData.url,
      source: formData.source,
      thumbnail: formData.thumbnail || undefined,
    });

    setFormData({
      title: '',
      description: '',
      url: '',
      source: 'custom',
      thumbnail: '',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-5 sm:p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">새 링크 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
              제목 *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="내 GitHub 프로필"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1.5">
              링크 URL *
            </label>
            <input
              id="url"
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              설명
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm sm:text-base"
              rows={2}
              placeholder="링크에 대한 간단한 설명 (선택사항)"
            />
          </div>

          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1.5">
              소스
            </label>
            <select
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm sm:text-base"
            >
              <option value="custom">커스텀</option>
              <option value="github">GitHub</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1.5">
              썸네일 URL
            </label>
            <input
              id="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="https://example.com/image.jpg (선택사항)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
