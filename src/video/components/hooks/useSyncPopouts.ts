import { useInitialized } from "@/video/components/hooks/useInitialized";
import { ControlMethods, useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";
import { useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";

function syncRouteToPopout(
  location: ReturnType<typeof useLocation>,
  controls: ControlMethods
) {
  const parsed = new URLSearchParams(location.search);
  const value = parsed.get("modal");
  if (value) controls.openPopout(value);
  else controls.closePopout();
}

// TODO make closing a popout go backwords in history
// TODO fix first event breaking (clicking on page somehow resolves it)
export function useSyncPopouts(descriptor: string) {
  const history = useHistory();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);
  const intialized = useInitialized(descriptor);
  const loc = useLocation();

  const lastKnownValue = useRef<string | null>(null);

  const controlsRef = useRef<typeof controls>(controls);
  useEffect(() => {
    controlsRef.current = controls;
  }, [controls]);

  // sync current popout to router
  useEffect(() => {
    const popoutId = videoInterface.popout;
    if (lastKnownValue.current === popoutId) return;
    lastKnownValue.current = popoutId;
    // rest only triggers with changes

    if (popoutId) {
      const params = new URLSearchParams([["modal", popoutId]]).toString();
      history.push({
        search: params,
        state: "popout",
      });
    } else {
      history.push({
        search: "",
        state: "popout",
      });
    }
  }, [videoInterface, history]);

  // sync router to popout state (but only if its not done by block of code above)
  useEffect(() => {
    if (loc.state === "popout") return;

    // sync popout state
    syncRouteToPopout(loc, controlsRef.current);
  }, [loc]);

  // mount hook
  const routerInitialized = useRef(false);
  useEffect(() => {
    if (routerInitialized.current) return;
    if (!intialized) return;
    syncRouteToPopout(loc, controlsRef.current);
    routerInitialized.current = true;
  }, [loc, intialized]);
}
