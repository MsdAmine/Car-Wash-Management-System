import { Fragment } from 'react';
import { Check } from 'lucide-react';

interface StepTrackerStep {
  label: string;
  completedAt?: string;
}

interface StepTrackerProps {
  steps: StepTrackerStep[];
  currentStep: number;
}

type StepState = 'completed' | 'current' | 'upcoming';

function getStepState(index: number, currentStep: number): StepState {
  if (index < currentStep) return 'completed';
  if (index === currentStep) return 'current';
  return 'upcoming';
}

const circleClasses: Record<StepState, string> = {
  completed: 'bg-indigo-600 text-white',
  current: 'border-2 border-indigo-600 bg-white text-indigo-600',
  upcoming: 'bg-gray-200 text-gray-500',
};

const labelClasses: Record<StepState, string> = {
  completed: 'text-indigo-600 font-medium',
  current: 'text-indigo-600 font-semibold',
  upcoming: 'text-gray-400',
};

export function StepTracker({ steps, currentStep }: StepTrackerProps) {
  return (
    <div className="flex w-full items-start">
      {steps.map((step, index) => {
        const state = getStepState(index, currentStep);
        const isLast = index === steps.length - 1;

        return (
          <Fragment key={index}>
            <div className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${circleClasses[state]}`}
              >
                {state === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Label + date */}
              <div className="hidden sm:block mt-2 text-center">
                <p className={`text-xs ${labelClasses[state]}`}>{step.label}</p>
                {state === 'completed' && step.completedAt && (
                  <p className="text-xs text-gray-400 mt-0.5">{step.completedAt}</p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={`flex-1 h-px mt-4 self-start ${
                  state === 'completed' ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
