export interface StepperProps {
  current: number;
  steps: number;
  className?: string;
}

export function Stepper(props: StepperProps) {
  const percentage = (props.current / (props.steps + 1)) * 100;

  return (
    <div className={props.className}>
      <p className="mb-2">
        {props.current}/{props.steps}
      </p>
      <div className="max-w-full h-1 w-32 bg-white rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-[width] rounded-full"
          style={{
            width: `${percentage.toFixed(0)}%`,
          }}
        />
      </div>
    </div>
  );
}
