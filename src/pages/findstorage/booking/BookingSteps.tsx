import { Check } from "lucide-react";

type BookingStepsProps = {
  currentStep: number;
};

const steps = [
  { id: 1, label: "Booking Details" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Confirmation" },
];

export function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <nav aria-label="Booking progress" className="w-full">
      {/* MOBILE */}
      <ol className="flex w-full items-start justify-center sm:hidden">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`flex items-start ${
              index < steps.length - 1 ? "flex-1" : "flex-none"
            }`}
          >
            {/* Step */}
            <div className="flex w-full flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                  step.id <= currentStep
                    ? "bg-brand-primary text-text-light"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id <= currentStep ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>

              <span
                className={`mt-1.5 whitespace-nowrap text-[13px] leading-tight ${
                  step.id <= currentStep
                    ? "font-medium text-text-main"
                    : "font-normal text-text-subtle"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Mobile Connector */}
            {index < steps.length - 1 && (
              <div className="mt-3.5 w-full px-1.5">
                <div
                  className={`h-[2px] w-full ${
                    step.id < currentStep ? "bg-brand-primary" : "bg-gray-300"
                  }`}
                />
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* DESKTOP */}
      <ol className="mx-auto hidden w-full max-w-[580px] items-center sm:flex">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`flex min-w-0 items-center ${
              index < steps.length - 1 ? "flex-1" : "shrink-0"
            }`}
          >
            {/* Circle + Label */}
            <div className="flex shrink-0 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold md:h-8 md:w-8 md:text-xs ${
                  step.id <= currentStep
                    ? "bg-brand-primary text-text-light"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id <= currentStep ? (
                  <Check
                    className="h-3.5 w-3.5 md:h-4 md:w-4"
                    strokeWidth={3}
                  />
                ) : (
                  step.id
                )}
              </div>

              <span
                className={`whitespace-nowrap text-[11px] md:text-sm ${
                  step.id <= currentStep
                    ? "font-medium text-text-main"
                    : "font-normal text-text-subtle"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Desktop Connector */}
            {index < steps.length - 1 && (
              <div className="mx-3 flex-1 md:mx-4">
                <div
                  className={`h-[2px] w-full ${
                    step.id < currentStep ? "bg-brand-primary" : "bg-gray-300"
                  }`}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}