interface LoadingButtonProps {
  loading: boolean;
  loadingText: string;
  text: string;
}

export default function LoadingButton({
  loading,
  loadingText,
  text,
}: LoadingButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full bg-[#1B4D3E] text-white py-4 rounded-3xl font-medium text-base transition-all flex items-center justify-center gap-2 cursor-pointer
        ${
          loading
            ? "opacity-80 cursor-not-allowed"
            : "active:translate-y-0.5 active:shadow-none hover:bg-[#143b2f] shadow-[0px_4px_0px_0px_#D97706]"
        }`}
    >
      {loading ? (
        <>
          {/* Simple Inline SVG Spinner */}
          <svg
            className="animate-spin h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
}
