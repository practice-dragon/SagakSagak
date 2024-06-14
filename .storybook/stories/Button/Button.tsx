import React from "react";
import styled from "styled-components/native";

interface ButtonProps {
  text: string;
  onPress: () => void;
  size: "sm" | "lg";
}

const ButtonContainer = styled.TouchableOpacity<{size: "sm" | "lg"}>`
  background-color: ${({theme}) => theme.colors.primary};
  padding: 10px 0;
  width: ${({size}) => (size === "sm" ? "70%" : "80%")};
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const ButtonText = styled.Text`
  color: ${({theme}) => theme.colors.textInverse};
  font-size: 16px;
  font-family: "Pretendard-SemiBold";
`;

export const Button = ({text, onPress, size = "sm"}: ButtonProps) => {
  return (
    <ButtonContainer size={size} onPress={onPress}>
      <ButtonText>{text}</ButtonText>
    </ButtonContainer>
  );
};
