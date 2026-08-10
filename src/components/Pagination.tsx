import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) {
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
      <div className="flex items-center gap-4">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-medium transition-colors ${
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
