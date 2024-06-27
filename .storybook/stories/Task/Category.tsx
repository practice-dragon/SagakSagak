import React from "react";
import {View, Text} from "react-native";
import styled from "styled-components/native";
import PlusIcon from "@/assets/icons/PlusIcon";
import MenuDotsIcon from "@/assets/icons/MenuDotsIcon";
import {TouchableOpacity} from "react-native-gesture-handler";

interface CategoryProps {
  text: string;
}

const Category = ({text}: CategoryProps) => {
  return (
    <Container>
      <LeftContent>
        <CategoryText>{text}</CategoryText>
        <PlusIcon width={16} height={16} />
      </LeftContent>
      <RightContent>
        <MenuDotsIcon width={24} height={24} />
      </RightContent>
    </Container>
  );
};

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0;
`;

const LeftContent = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.card};
  padding: 12px 16px;
  align-items: center;
  gap: 3px;
  border-radius: 8px;
`;

const RightContent = styled(View)`
  padding: 16px;
`;

const CategoryText = styled(Text)`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
`;

export default Category;
