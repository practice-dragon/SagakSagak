import {create} from "zustand";

interface CharStore {
  selectedChar: string;
  setSelectedChar: (newChar: string) => void;
}

export const useCharStore = create<CharStore>(set => ({
  selectedChar: "수수",
  setSelectedChar: (newChar: string) => set({selectedChar: newChar}),
}));
