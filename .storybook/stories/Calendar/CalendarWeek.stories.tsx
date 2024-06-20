import type {Meta, StoryObj} from "@storybook/react";
import CalendarWeek from "./CalendarWeek";

const meta: Meta<typeof CalendarWeek> = {
  title: "Components/Calendar/CalendarWeek",
  component: CalendarWeek,
};

export default meta;

type Story = StoryObj<typeof CalendarWeek>;

export const Default: Story = {
  args: {},
};
