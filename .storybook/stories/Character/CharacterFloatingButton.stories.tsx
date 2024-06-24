import type {Meta, StoryObj} from "@storybook/react";
import CharacterFloatingButton from "./CharacterFloatingButton";

const CharacterFloatingButtonMeta: Meta<typeof CharacterFloatingButton> = {
  title: "Components/CharacterFloatingButton",
  component: CharacterFloatingButton,
  argTypes: {
    imageSource: {control: "text"},
    onPress: {action: "pressed"},
  },
};

export default CharacterFloatingButtonMeta;

export const Default: StoryObj<typeof CharacterFloatingButton> = {
  args: {
    imageSource: {uri: "https://via.placeholder.com/150"},
  },
};

export const CustomImage: StoryObj<typeof CharacterFloatingButton> = {
  args: {
    imageSource: require("src/assets/images/susu.png"),
  },
};
