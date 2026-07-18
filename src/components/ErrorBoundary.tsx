import { isRouteErrorResponse, useRouteError } from "react-router";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ErrorBoundary() {
  const error = useRouteError();

  if (import.meta.env.DEV) {
    console.error(error);
  }

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    // Cast to access custom response properties safely in TS
    const apiError = error as Error & AxiosErrorLike;
    details = apiError?.response?.data?.message || error.message;
    stack = error.stack;
    console.log(stack);
  }

  const redirect = () => {
    window.location.href = "/";
  };

  const errorStatus = isRouteErrorResponse(error) ? error.status : null;

  return (
    <div className="bg-background text-text-main font-sans container mx-auto p-4 flex flex-col items-center justify-center min-h-screen gap-2">
      {errorStatus === 404 ? (
        <img
          src="https://media.geeksforgeeks.org/wp-content/uploads/20230802153215/Error-404.png"
          alt="404"
          className="w-full max-w-md h-auto object-contain mb-4"
        />
      ) : (
        <img
          src="https://media.geeksforgeeks.org/wp-content/uploads/20230802153215/Error-404.png"
          alt="Error"
          className="w-full max-w-md h-auto object-contain mb-4"
        />
      )}
      <h1 className="text-3xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-semantic-error font-bold text-2xl mt-1">{message}</p>
      <p className="text-text-subtle font-medium max-w-md text-center">
        {details}
      </p>

      <button
        onClick={redirect}
        type="button"
        className="my-6 px-6 py-3 rounded-full bg-brand-secondary text-text-light font-semibold shadow-md transition-colors duration-200 hover:bg-brand-secondary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        Go back home
      </button>
    </div>
  );
}
