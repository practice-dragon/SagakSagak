import {View} from "react-native";
import type {Meta, StoryObj} from "@storybook/react";
import React from "react";
import Icon from "./Icon";

const IconMeta: Meta = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    text: {
      group: "Component",
    },
    onPress: {action: "pressed the icon"},
    color: {
      control: {type: "color"},
    },
  },
  args: {
    color: "#333",
  },
  decorators: [
    Story => (
      <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
        <Story />
      </View>
    ),
  ],
};

export default IconMeta;

export const Default: StoryObj = {
  args: {
    color: "#333",
  },
};

export const Selected: StoryObj = {
  args: {
    color: "tomato",
  },
};
