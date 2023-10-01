import { Transition } from "@/components/Transition";
import { PlayerHoverState } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";

export function BottomControls(props: {
  show?: boolean;
  children: React.ReactNode;
}) {
  const { hovering } = usePlayerStore((s) => s.interface);
  const visible =
    (hovering !== PlayerHoverState.NOT_HOVERING || props.show) ?? false;

  return (
    <div className="w-full text-white">
      <Transition
        animation="fade"
        show={visible}
        className="pointer-events-none flex justify-end pt-32 bg-gradient-to-t from-black to-transparent [margin-bottom:env(safe-area-inset-bottom)] transition-opacity duration-200 absolute bottom-0 w-full"
      />
      <Transition
        animation="slide-up"
        show={visible}
        className="pointer-events-auto px-4 pb-3 absolute bottom-0 w-full"
      >
        {props.children}
      </Transition>
    </div>
  );
}
