import React from "react";
import styled from "styled-components/native";

const IconContainer = styled.TouchableOpacity<{color: string}>`
  width: 24px;
  height: 24px;
  background-color: ${props => props.color};
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

const IconImage = styled.Image`
  width: 16px;
  height: 16px;
`;

interface IconProps {
  source: any;
  color?: string;
  onPress?: () => void;
}

const Icon = ({source, color = "#333", onPress}: IconProps) => {
  return (
    <IconContainer color={color} onPress={onPress}>
      <IconImage source={source} />
    </IconContainer>
  );
};

export default Icon;
