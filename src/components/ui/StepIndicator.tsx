import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                index + 1 < currentStep
                  ? "bg-brand-green border-brand-green text-white"
                  : index + 1 === currentStep
                  ? "bg-brand-green border-brand-green text-white"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
            >
              {index + 1 < currentStep ? (
                <Check size={16} />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                index + 1 <= currentStep ? "text-brand-green" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>

          {/* Connector Line */}
          {index < totalSteps - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                index + 1 < currentStep ? "bg-brand-green" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
