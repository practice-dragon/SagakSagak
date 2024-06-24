import React from "react";
import {TouchableOpacity, Image, ImageSourcePropType, Text} from "react-native";
import styled from "styled-components/native";

interface CharacterFloatingButtonProps {
  imageSource: ImageSourcePropType;
  onPress?: () => void;
}

const CharacterFloatingButton = ({
  imageSource = {uri: "https://via.placeholder.com/150"},
  onPress,
}: CharacterFloatingButtonProps) => {
  console.log(imageSource);

  return (
    <ButtonContainer onPress={onPress}>
      <CharacterImage source={imageSource} />
    </ButtonContainer>
  );
};

const ButtonContainer = styled(TouchableOpacity)`
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  justify-content: center;
  align-items: center;
`;

const CharacterImage = styled(Image)`
  width: 70px;
  height: 70px;
  border-radius: 35px;
`;

export default CharacterFloatingButton;
