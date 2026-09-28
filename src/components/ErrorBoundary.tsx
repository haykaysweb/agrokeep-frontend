import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { motion } from "framer-motion";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Centralized so swapping in real monitoring later (Sentry, etc.) only
// means changing this one function.
function reportError(error: unknown) {
  // TODO: replace with real monitoring, e.g.:
  // Sentry.captureException(error);
  console.error("Unhandled application error:", error);
}

export default function ErrorBoundary() {
  const error = useRouteError();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    details =
      error.status === 404
        ? "The page you're looking for doesn't exist or may have moved."
        : error.statusText || details;
  } else if (error instanceof Error) {
    // Cast to access custom response properties safely in TS
    const apiError = error as Error & AxiosErrorLike;
    details = apiError.response?.data?.message || error.message;
  }

  // Only report real crashes, not ordinary 404s — a mistyped URL isn't a
  // bug worth alerting on.
  useEffect(() => {
    if (!is404) {
      reportError(error);
    }
  }, [error, is404]);

  const goHome = () => {
    window.location.href = "/";
  };

  const tryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight">
        {is404 ? "Page not found" : "Something went wrong"}
      </h1>

      <p className="text-text-subtle max-w-md text-center font-medium mt-2">
        {details}
      </p>

      {/* Dev-only diagnostic details — never shown to real users */}
      {import.meta.env.DEV && error instanceof Error && error.stack && (
        <pre className="mt-4 max-w-2xl overflow-x-auto rounded-lg bg-stone-900 p-4 text-left text-xs text-stone-200">
          {error.stack}
        </pre>
      )}

      <div className="flex items-center gap-3 mt-6">
        {!is404 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-block shrink-0 cursor-pointer"
            onClick={tryAgain}
            type="button"
          >
            <span className="relative z-10 flex h-12 items-center justify-center rounded-full border border-border-input px-8 text-text-main">
              <span className="whitespace-nowrap text-base font-semibold">
                Try again
              </span>
            </span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative inline-block shrink-0 cursor-pointer"
          onClick={goHome}
          type="button"
        >
          <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary" />

          <span className="relative z-10 flex h-12 items-center justify-center rounded-full bg-brand-primary px-10 text-text-light">
            <span className="whitespace-nowrap text-base font-semibold">
              Go back home
            </span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}
