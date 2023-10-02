import { Transition } from "@/components/Transition";

export function BottomControls(props: {
  show?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full text-white">
      <Transition
        animation="fade"
        show={props.show}
        className="pointer-events-none flex justify-end pt-32 bg-gradient-to-t from-black to-transparent [margin-bottom:env(safe-area-inset-bottom)] transition-opacity duration-200 absolute bottom-0 w-full"
      />
      <Transition
        animation="slide-up"
        show={props.show}
        className="pointer-events-auto px-4 pb-3 absolute bottom-0 w-full"
      >
        {props.children}
      </Transition>
    </div>
  );
}
