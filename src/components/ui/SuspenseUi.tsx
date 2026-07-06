import Logo from "../Logo";

export default function SuspenseUI() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="flex items-center gap-6 animate-slideUp">
        {/* Logo Component */}
        <div className="w-30">
          <Logo />
        </div>

        {/* Spinner */}
        <div className="relative w-12 h-12">
          <svg className="animate-spin w-full h-full" viewBox="0 0 50 50">
            <circle
              className="opacity-20"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="var(--color-brand-primary)"
              strokeWidth="4"
            />
            <circle
              className="opacity-100"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="var(--color-brand-primary)"
              strokeWidth="4"
              strokeDasharray="30 100"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
