interface Props {
  className?: string;
  radius?: number;
  percentage: number;
  backingRingClassname?: string;
}

export function ProgressRing(props: Props) {
  const radius = props.radius ?? 40;

  return (
    <svg
      className={`${props.className ?? ""} -rotate-90`}
      viewBox="0 0 100 100"
    >
      <circle
        className={`fill-transparent stroke-type-text stroke-[15] opacity-25 ${
          props.backingRingClassname ?? ""
        }`}
        r={radius}
        cx="50"
        cy="50"
      />
      <circle
        className="fill-transparent stroke-current stroke-[15] transition-[stroke-dashoffset] duration-150"
        r={radius}
        cx="50"
        cy="50"
        style={{
          strokeDasharray: `${2 * Math.PI * radius} ${2 * Math.PI * radius}`,
          strokeDashoffset: `${
            2 * Math.PI * radius -
            (props.percentage / 100) * (2 * Math.PI * radius)
          }`,
        }}
      />
    </svg>
  );
}
