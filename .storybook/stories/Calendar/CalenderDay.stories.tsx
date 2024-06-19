import type {Meta, StoryObj} from "@storybook/react";
import CalendarDay from "./CalendarDay";

const CalendarDayMeta: Meta<typeof CalendarDay> = {
  title: "Components/Calendar/CalendarDay",
  component: CalendarDay,
  argTypes: {
    totalTasks: {control: {type: "number"}},
    completedTasks: {control: {type: "number"}},
    day: {control: {type: "number"}},
    isSelected: {control: {type: "boolean"}},
  },
};

export default CalendarDayMeta;

export const Default: StoryObj<typeof CalendarDay> = {
  args: {
    totalTasks: 7,
    completedTasks: 5,
    day: 15,
  },
};

export const Selected: StoryObj<typeof CalendarDay> = {
  args: {
    day: 15,
    totalTasks: 7,
    completedTasks: 1,
    isSelected: true,
  },
};

export const Completed: StoryObj<typeof CalendarDay> = {
  args: {
    totalTasks: 7,
    completedTasks: 2,
    day: 15,
  },
};
