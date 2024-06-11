import type {Preview} from "@storybook/react";
import {withThemeFromJSXProvider} from "@storybook/addon-themes";
import {ThemeProvider} from "styled-components";
import {lightTheme} from "../src/styles/theme";

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      light: lightTheme,
    },
    Provider: ThemeProvider,
  }),
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
