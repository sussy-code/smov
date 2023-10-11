import { Transition } from "@/components/Transition";

export function TopControls(props: {
  show?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full text-white">
      <Transition
        animation="fade"
        show={props.show}
        className="pointer-events-none flex justify-end pb-32 bg-gradient-to-b from-black to-transparent [margin-bottom:env(safe-area-inset-bottom)] transition-opacity duration-200 absolute top-0 w-full"
      />
      <Transition
        animation="slide-down"
        show={props.show}
        className="pointer-events-auto pl-[calc(2rem+env(safe-area-inset-left))] pr-[calc(2rem+env(safe-area-inset-right))] pt-6 absolute top-0 w-full text-white"
      >
        {props.children}
      </Transition>
    </div>
  );
}
