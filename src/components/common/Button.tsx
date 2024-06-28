import React from "react";
import styled from "styled-components/native";
import {TouchableOpacity, TouchableOpacityProps, TextProps} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  onPress: () => void;
  size: "sm" | "lg";
  variant?: "gray" | "primary" | "textGray";
  style?: TouchableOpacityProps["style"];
}

const ButtonContainer = styled(TouchableOpacity)<{
  size: "sm" | "lg";
  variant: "gray" | "primary" | "textGray";
}>`
  background-color: ${({variant, theme}) =>
    variant === "gray"
      ? theme.colors.n2
      : variant === "primary"
      ? theme.colors.primary
      : "transparent"};
  padding: 10px 5px;
  width: ${({size}) => (size === "sm" ? "70%" : "80%")};
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const ButtonText = styled.Text<{variant: "gray" | "primary" | "textGray"}>`
  color: ${({variant, theme}) =>
    variant === "textGray"
      ? theme.colors.n4
      : variant === "primary"
      ? theme.colors.textInverse
      : theme.colors.text};
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
`;

const Button = ({
  text,
  onPress,
  size = "sm",
  variant = "primary",
  style,
  ...props
}: ButtonProps) => {
  return (
    <ButtonContainer
      size={size}
      variant={variant}
      onPress={onPress}
      style={style}
      {...props}>
      <ButtonText variant={variant}>{text}</ButtonText>
    </ButtonContainer>
  );
};

export default Button;
