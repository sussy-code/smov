import { ChangeEventHandler, useEffect, useRef } from "react";

export type SliderProps = {
  label?: string;
  min: number;
  max: number;
  step: number;
  value?: number;
  valueDisplay?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export function Slider(props: SliderProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const e = ref.current as HTMLInputElement;
    e.style.setProperty("--value", e.value);
    e.style.setProperty("--min", e.min === "" ? "0" : e.min);
    e.style.setProperty("--max", e.max === "" ? "100" : e.max);
    e.addEventListener("input", () => e.style.setProperty("--value", e.value));
  }, [ref]);

  return (
    <div className="mb-6 flex flex-row gap-4">
      <div className="flex w-full flex-col gap-2">
        {props.label ? (
          <label className="font-bold">{props.label}</label>
        ) : null}
        <input
          type="range"
          ref={ref}
          className="styled-slider slider-progress mt-[20px]"
          onChange={props.onChange}
          value={props.value}
          max={props.max}
          min={props.min}
          step={props.step}
        />
      </div>
      <div className="mt-1 aspect-[2/1] h-8 rounded-sm bg-[#1C161B] pt-1">
        <div className="text-center font-bold text-white">
          {props.valueDisplay ?? props.value}
        </div>
      </div>
    </div>
  );
}
