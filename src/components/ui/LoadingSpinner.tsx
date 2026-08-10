interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = "Message...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center py-12 w-full h-full min-h-[calc(100vh-80px)]";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-brand-primary/15"></div>

        <div className="absolute w-14 h-14 rounded-full border-4 border-t-brand-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

        <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-secondary"></div>
      </div>

      {message && (
        <p className="mt-5 text-sm font-medium tracking-wide text-text-subtle animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
