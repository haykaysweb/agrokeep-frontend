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

  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
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
    <div className="bg-background text-text-main font-sans w-full p-4 flex flex-col items-center justify-center min-h-screen gap-2">
      {errorStatus === 404 ? (
        <img
          src="/errorBoundary.svg"
          alt="404"
          className="w-full max-w-sm  h-auto object-contain mb-4"
        />
      ) : (
        <img
          src="/errorBoundary.svg"
          alt="Error"
          className="w-full max-w-md h-auto object-contain mb-4"
        />
      )}

      <h1 className="text-3xl font-bold tracking-tight">
        Something went wrong
      </h1>

      {/*   <p className="text-semantic-error font-bold text-2xl mt-1">{message}</p> */}

      <p className="text-text-subtle font-medium max-w-md text-center">
        {details}
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative inline-block shrink-0 mt-5 cursor-pointer"
        onClick={redirect}
        type="button"
      >
        <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary" />

        <span className="relative z-10 flex h-12 items-center justify-center rounded-full bg-brand-primary px-10 text-text-light">
          <span className="text-base font-semibold whitespace-nowrap">
            Go back home
          </span>
        </span>
      </motion.button>
    </div>
  );
}
