import React from "react";
import styled from "styled-components/native";

interface ButtonProps {
  text: string;
  onPress: () => void;
  size: "sm" | "lg";
  variant?: "gray" | "primary" | "textGray";
}

const ButtonContainer = styled.TouchableOpacity<{
  size: "sm" | "lg";
  variant: "gray" | "primary" | "textGray";
}>`
  background-color: ${({variant, theme}) =>
    variant === "gray"
      ? theme.colors.n2
      : variant === "primary"
      ? theme.colors.primary
      : "transparent"};
  padding: 10px 0;
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
  font-size: ${({theme}) => theme.fonts.p2.fontSize};
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
`;

export const Button = ({
  text,
  onPress,
  size = "sm",
  variant = "primary",
}: ButtonProps) => {
  return (
    <ButtonContainer size={size} variant={variant} onPress={onPress}>
      <ButtonText variant={variant}>{text}</ButtonText>
    </ButtonContainer>
  );
};
