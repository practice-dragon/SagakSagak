import {View} from "react-native";
import type {Meta, StoryObj} from "@storybook/react";
import React, {useState} from "react";
import Calendar from "./Calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  argTypes: {
    viewType: {
      control: {type: "radio"},
      options: ["week", "month"],
      defaultValue: "month",
    },
  },
  decorators: [
    Story => (
      <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Calendar>;

const CalendarStory = (args: any) => {
  const [viewType, setViewType] = useState<"week" | "month">(args.viewType);
  return <Calendar {...args} viewType={viewType} setViewType={setViewType} />;
};

export const Default: Story = {
  render: CalendarStory,
  args: {
    viewType: "month",
  },
};

export const WeekView: Story = {
  render: CalendarStory,
  args: {
    viewType: "week",
  },
};

export const MonthView: Story = {
  render: CalendarStory,
  args: {
    viewType: "month",
  },
};
