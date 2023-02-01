import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialThemeConfigStr } from "./utils";

interface BearState {
  themeConfigStr: string;
  setThemeConfigStr: (newVal: string) => void;
}

export const useBearStore = create<BearState>()(
  persist(
    (set) => ({
      themeConfigStr: initialThemeConfigStr,
      setThemeConfigStr: (newVal) => set(() => ({ themeConfigStr: newVal })),
    }),
    {
      name: "bear-storage",
    }
  )
);
