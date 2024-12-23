import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  subtitle: string;
  completed: boolean;
  current: boolean;
}

interface StepNavigationProps {
  steps: Step[];
  onStepClick: (stepId: number) => void;
}

export function StepNavigation({ steps, onStepClick }: StepNavigationProps) {
  return (
    <nav className="space-y-2">
      <h2 className="text-lg font-semibold mb-4 text-white">步骤导航</h2>
      {steps.map((step) => (
        <button
          key={step.id}
          className={cn(
            "w-full text-left p-2 rounded-lg transition-colors",
            step.current
              ? "bg-blue-100 text-blue-800"
              : step.completed
              ? "bg-green-100 text-green-800"
              : "bg-white hover:bg-gray-100"
          )}
          onClick={() => onStepClick(step.id)}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              {step.completed ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-white",
                    step.current ? "bg-blue-500" : "bg-gray-300"
                  )}
                >
                  {step.id}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{step.title}</p>
              <p className="text-xs text-gray-500">{step.subtitle}</p>
            </div>
          </div>
        </button>
      ))}
    </nav>
  );
}
