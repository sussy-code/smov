import { Transition } from "@/components/utils/Transition";

export function BlackOverlay(props: { show?: boolean }) {
  return (
    <Transition
      animation="fade"
      show={props.show}
      className="absolute inset-0 w-full h-full bg-black bg-opacity-20 pointer-events-none"
    />
  );
}
