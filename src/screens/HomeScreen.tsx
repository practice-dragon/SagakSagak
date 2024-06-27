import React, {useState} from "react";
import {SafeAreaView, Text, View} from "react-native";
import Calendar from "@story/stories/Calendar/Calendar";
import styled from "styled-components/native";
function Home(): React.JSX.Element {
  const [viewType, setViewType] = useState<"week" | "month">("week");

  return (
    <SafeAreaView>
      <Container>
        <Calendar viewType={viewType} setViewType={setViewType} />
      </Container>
    </SafeAreaView>
  );
}

export default Home;

const Container = styled.SafeAreaView`
  background-color: ${({theme}) => theme.colors.background};
  align-items: center;
`;
