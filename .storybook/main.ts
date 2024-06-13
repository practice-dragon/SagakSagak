import {StorybookConfig} from "@storybook/react-native";

const main: StorybookConfig = {
  stories: ["./stories/**/*.stories.?(ts|tsx|js|jsx|mdx)"],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
  ],
};

export default main;
