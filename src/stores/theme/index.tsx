import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface ThemeStore {
  theme: string | null;
  setTheme(v: string | null): void;
}

export const useThemeStore = create(
  persist(
    immer<ThemeStore>((set) => ({
      theme: null,
      setTheme(v) {
        set((s) => {
          s.theme = v;
        });
      },
    })),
    {
      name: "__MW::theme",
    },
  ),
);

export function ThemeProvider(props: {
  children?: ReactNode;
  applyGlobal?: boolean;
}) {
  const theme = useThemeStore((s) => s.theme);
  const themeSelector = theme ? `theme-${theme}` : undefined;

  return (
    <div className={themeSelector}>
      {props.applyGlobal ? (
        <Helmet>
          <body className={themeSelector} />
        </Helmet>
      ) : null}
      {props.children}
    </div>
  );
}
