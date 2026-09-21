import { Check } from "lucide-react";
import { Fragment } from "react";

interface AdminStepperProps {
  steps: string[];
  currentStep?: number;
}

export default function AdminStepper({
  steps,
  currentStep = 0,
}: AdminStepperProps) {
  return (
    <div className="w-full mt-5">
      {/* Mobile: number on top, label underneath, equal-width lines between */}
      <div className="flex sm:hidden items-start w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLineFilled = index < currentStep;

          return (
            <Fragment key={step}>
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium ${
                    isCompleted
                      ? "bg-brand-primary text-text-light"
                      : isCurrent
                        ? "bg-brand-secondary text-text-light"
                        : "bg-background-subtle text-text-muted"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                </div>
                <span
                  className={`mt-1.5 text-base leading-4 text-center whitespace-nowrap ${
                    isCurrent || isCompleted
                      ? "text-text-main font-medium"
                      : "text-text-muted"
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px min-w-[12px] mt-2.5 mx-1.5 ${
                    isLineFilled ? "bg-brand-primary" : "bg-border-base"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* Desktop: number + label inline, equal-width lines between */}
      <div className="hidden sm:flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLineFilled = index < currentStep;

          return (
            <Fragment key={step}>
              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    isCompleted
                      ? "bg-brand-primary text-text-light"
                      : isCurrent
                        ? "bg-brand-secondary text-text-light"
                        : "bg-background-subtle text-text-muted"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`text-sm whitespace-nowrap ${
                    isCurrent || isCompleted
                      ? "text-text-main font-medium"
                      : "text-text-muted"
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px min-w-[16px] mx-2 ${
                    isLineFilled ? "bg-brand-primary" : "bg-border-base"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
