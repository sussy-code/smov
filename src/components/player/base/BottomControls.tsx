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
        className="pointer-events-none flex justify-end pt-32 bg-gradient-to-t from-black to-transparent transition-opacity duration-200 absolute bottom-0 w-full"
      />
      <Transition
        animation="slide-up"
        show={props.show}
        className="pointer-events-auto pl-[calc(2rem+env(safe-area-inset-left))] pr-[calc(2rem+env(safe-area-inset-right))] pb-3 mb-[env(safe-area-inset-bottom)] absolute bottom-0 w-full"
      >
        {props.children}
      </Transition>
    </div>
  );
}
