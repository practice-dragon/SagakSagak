import {View} from "react-native";
import type {Meta, StoryObj} from "@storybook/react";
import {Button} from "./Button";
import React from "react";

const ButtonMeta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    text: {
      group: "Component",
    },

    onPress: {action: "pressed the button"},
    size: {
      control: {type: "radio"},
      options: ["sm", "lg"],
    },
  },
  args: {
    text: "Hello world",
    size: "sm",
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
