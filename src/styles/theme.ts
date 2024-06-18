import {DefaultTheme} from "styled-components/native";

export const lightTheme: DefaultTheme = {
  colors: {
    primary: "#FF7A00",
    background: "#ffffff",
    card: "#f8f9fa",
    text: "#000000",
    textInverse: "#ffffff",
    border: "#c7c7c7",
    notification: "#ff80ab",
  },
  fonts: {
    h1: {
      fontFamily: "RixInooAriDuri Regular",
      fontSize: "32px",
    },
    h2: {
      fontFamily: "Pretendard-ExtraBold",
      fontSize: "24px",
    },
    h3: {
      fontFamily: "Pretendard-Bold",
      fontSize: "24px",
    },
    special: {
      fontFamily: "Pretendard-Regular",
      fontSize: "12px",
    },
    p1: {
      fontFamily: "Pretendard-Bold",
      fontSize: "20px",
    },
    p2: {
      fontFamily: "Pretendard-Bold",
      fontSize: "16px",
    },
    p3: {
      fontFamily: "Pretendard-Regular",
      fontSize: "14px",
    },
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    primary: "#bb86fc",
    background: "#121212",
    card: "#1f1f1f",
    text: "#ffffff",
    border: "#272727",
    textInverse: "121212",
    notification: "#ff80ab",
  },
};
