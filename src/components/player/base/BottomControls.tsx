import { Transition } from "@/components/Transition";

export function BottomControls(props: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full absolute bottom-0 flex flex-col  pt-32 bg-gradient-to-t from-black to-transparent [margin-bottom:env(safe-area-inset-bottom)]">
      <Transition
        animation="slide-up"
        show={props.show}
        className="pointer-events-auto px-4 pb-2 flex justify-end"
      >
        {props.children}
      </Transition>
    </div>
  );
}
