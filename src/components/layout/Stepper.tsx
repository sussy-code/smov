export interface StepperProps {
  current: number;
  steps: number;
  className?: string;
}

export function Stepper(props: StepperProps) {
  const percentage = (props.current / props.steps) * 100;

  return (
    <div className={props.className}>
      <p className="mb-2">
        {props.current}/{props.steps}
      </p>
      <div className="max-w-full h-1 w-32 bg-onboarding-bar rounded-full overflow-hidden">
        <div
          className="h-full bg-onboarding-barFilled transition-[width] rounded-full"
          style={{
            width: `${percentage.toFixed(0)}%`,
          }}
        />
      </div>
    </div>
  );
}
