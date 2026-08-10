interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export default function ErrorDisplay({
  message = "Something went wrong. Please try again.",
  onRetry,
  fullScreen = false,
}: ErrorDisplayProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-error/10 text-semantic-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-text-main mb-1">
          Something went wrong
        </h3>
        <p className="text-sm text-text-subtle max-w-md mb-5">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            type="button"
            className="px-5 py-2 text-sm font-medium rounded-lg bg-brand-primary text-text-light hover:bg-brand-primary/90 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-8 my-6">
      <div className="w-full flex flex-col items-center justify-center rounded-2xl border border-border-light bg-surface-card p-8 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-error/10 text-semantic-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-text-main mb-1">
          Something went wrong
        </h3>
        <p className="text-sm text-text-subtle max-w-md mb-5">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            type="button"
            className="px-5 py-2 text-sm font-medium rounded-lg bg-brand-primary text-text-light hover:bg-brand-primary/90 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
