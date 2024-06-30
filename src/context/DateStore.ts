import {create} from "zustand";

interface DateState {
  selectedDate: Date;
  setSelectedDate: (newDate: Date) => void;
}

export const useDateStore = create<DateState>(set => ({
  selectedDate: new Date(),
  setSelectedDate: (newDate: Date) => set({selectedDate: newDate}),
}));
