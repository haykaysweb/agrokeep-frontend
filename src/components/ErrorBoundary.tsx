import { isRouteErrorResponse, useRouteError } from "react-router";
import { motion } from "framer-motion";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ErrorBoundary() {
  const error = useRouteError();

  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (error instanceof Error) {
    // Cast to access custom response properties safely in TS
    const apiError = error as Error & AxiosErrorLike;
    details = apiError.response?.data?.message || error.message;
  }

  const redirect = () => {
    window.location.href = "/";
  };

  const errorStatus = isRouteErrorResponse(error) ? error.status : null;

  return (
    <div>
      {errorStatus === 404 ? <></> : <></>}

      <h1 className="text-3xl font-bold tracking-tight">
        Something went wrong
      </h1>

      <p className="text-text-subtle max-w-md text-center font-medium">
        {details}
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative mt-5 inline-block shrink-0 cursor-pointer"
        onClick={redirect}
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
  );
}
