import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

type PaginationItem = number | "...";

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

// Never returns more than 6 items (numbers + "...")
function getPageNumbers(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  // 6 pages or fewer: show them all
  if (totalPages <= 6) {
    return range(1, totalPages);
  }

  // Near the start: 1 2 3 4 ... last
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  // Near the end: 1 ... last-3 last-2 last-1 last
  if (currentPage >= totalPages - 3) {
    return [1, "...", ...range(totalPages - 3, totalPages)];
  }

  // Middle: 1 ... current next ... last
  return [1, "...", currentPage, currentPage + 1, "...", totalPages];
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-4 pt-4 pb-2">
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        aria-label="Previous page"
        className="flex items-center justify-center text-text-subtle transition-colors hover:text-text-main disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2 sm:gap-4">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-7 w-7 items-center justify-center text-text-subtle"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium transition-colors ${
                isActive
                  ? "bg-brand-primary text-text-light"
                  : "text-text-subtle hover:bg-background-subtle hover:text-text-main"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
        className="flex items-center justify-center text-text-subtle transition-colors hover:text-text-main disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
      </button>
    </div>
  );
}
