import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function buildPageWindows(currentPage: number, totalPages: number): (number | '…')[] {
  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);

  const result: (number | '…')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('…');
    }
    result.push(sorted[i]);
  }
  return result;
}

const navButtonBase =
  'w-8 h-8 flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1';

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = buildPageWindows(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={[
            navButtonBase,
            currentPage === 1
              ? 'cursor-not-allowed opacity-50 text-gray-700'
              : 'text-gray-700 hover:bg-gray-100',
          ].join(' ')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page, index) =>
          page === '…' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-gray-500 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={[
                navButtonBase,
                'text-sm',
                page === currentPage
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ].join(' ')}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={[
            navButtonBase,
            currentPage === totalPages
              ? 'cursor-not-allowed opacity-50 text-gray-700'
              : 'text-gray-700 hover:bg-gray-100',
          ].join(' ')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
