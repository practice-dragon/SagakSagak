import React from "react";
import {View} from "react-native";
import {Meta, StoryObj} from "@storybook/react";
import Task from "./Task";

const TaskMeta: Meta<typeof Task> = {
  title: "Components/Task",
  component: Task,
  argTypes: {
    text: {},
    state: {
      options: ["default", "archived"],
      control: {type: "radio"},
    },
  },
  args: {
    text: "시작하기",
    state: "default",
  },
  decorators: [
    Story => (
      <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
        <Story />
      </View>
    ),
  ],
};

export default TaskMeta;

export const Default: StoryObj = {
  args: {
    state: "default",
  },
};

export const Archived: StoryObj = {
  args: {
    state: "archived",
  },
};
