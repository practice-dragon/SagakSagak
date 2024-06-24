import React from "react";
import {Text} from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

const SplashScreen: React.FC = () => {
  return (
    <Container>
      <Text>캐릭터와 함께 하루를 계획하자!</Text>
    </Container>
  );
};

export default SplashScreen;
