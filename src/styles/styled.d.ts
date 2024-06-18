import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      textInverse: string;
      n1: string;
      n2: string;
      n3: string;
      n4: string;
      n5: string;
    };
  }
}
