import type {Preview} from "@storybook/react";
import {withThemeFromJSXProvider} from "@storybook/addon-themes";
import {createGlobalStyle, ThemeProvider} from "styled-components";
import {lightTheme} from "../src/styles/theme";

const GlobalStyles = createGlobalStyle`
  body {
    font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
`;

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      light: lightTheme,
    },
    Provider: ThemeProvider,
    GlobalStyles, // Adds your GlobalStyle component to all stories
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
