import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMeasure } from "react-use";

interface BannerInstance {
  id: string;
  height: number;
}

const BannerContext = createContext<
  [BannerInstance[], Dispatch<SetStateAction<BannerInstance[]>>]
>(null as any);

export function BannerContextProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<BannerInstance[]>([]);
  const memod = useMemo<
    [BannerInstance[], Dispatch<SetStateAction<BannerInstance[]>>]
  >(() => [state, setState], [state]);

  return (
    <BannerContext.Provider value={memod}>
      {props.children}
    </BannerContext.Provider>
  );
}

export function useBanner<T extends Element>(id: string) {
  const [ref, { height }] = useMeasure<T>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, set] = useContext(BannerContext);

  useEffect(() => {
    set((v) => [...v, { id, height: 0 }]);
    set((value) => {
      const v = value.find((item) => item.id === id);
      if (v) {
        v.height = height;
      }
      return value;
    });
    return () => {
      set((v) => v.filter((item) => item.id !== id));
    };
  }, [height, id, set]);

  return [ref];
}

export function useBannerSize() {
  const [val] = useContext(BannerContext);

  return val.reduce((a, v) => a + v.height, 0);
}
