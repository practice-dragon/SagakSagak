import {View} from "react-native";
import type {Meta, StoryObj} from "@storybook/react";
import {Button} from "./Button";
import React from "react";

const ButtonMeta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    text: {
      control: "text",
      defaultValue: "시작하기",
    },
    onPress: {action: "pressed the button"},
    size: {
      control: {type: "radio"},
      options: ["sm", "lg"],
      defaultValue: "sm",
    },
    variant: {
      control: {type: "radio"},
      options: ["gray", "primary", "textGray"],
      defaultValue: "primary",
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

export default ButtonMeta;

export const Small: StoryObj<typeof Button> = {
  args: {
    size: "sm",
  },
};

export const Large: StoryObj<typeof Button> = {
  args: {
    size: "lg",
  },
};

export const Gray: StoryObj<typeof Button> = {
  args: {
    variant: "gray",
    text: "Gray",
  },
};

export const Primary: StoryObj<typeof Button> = {
  args: {
    variant: "primary",
    text: "Primary",
  },
};

export const TextGray: StoryObj<typeof Button> = {
  args: {
    variant: "textGray",
    text: "textGray",
  },
};
