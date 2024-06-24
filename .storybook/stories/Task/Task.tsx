import React from "react";
import {View, Text} from "react-native";
import styled from "styled-components/native";

import ActiveCheckSquareIcon from "../../../src/assets/icons/ActiveCheckSquareIcon";
import CheckSquareIcon from "../../../src/assets/icons/CheckSquareIcon";
import MenuDotsIcon from "../../../src/assets/icons/MenuDotsIcon";

interface TaskProps {
  text: string;
  state: "default" | "archived";
}

const Task = ({text, state}: TaskProps) => {
  return (
    <Container>
      <LeftIcons>
        {state === "default" && <CheckSquareIcon width={24} height={24} />}
        {state === "archived" && (
          <ActiveCheckSquareIcon width={24} height={24} />
        )}
      </LeftIcons>
      <TaskText state={state}>{text}</TaskText>
      <MenuDotsIcon width={24} height={24} />
    </Container>
  );
};

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const LeftIcons = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-right: 2px;
`;

const TaskText = styled(Text)<{state: "default" | "archived"}>`
  flex: 1;
  font-size: 16px;
  color: ${({state}) => (state === "archived" ? "gray" : "#333")};
  text-decoration-line: ${({state}) =>
    state === "archived" ? "line-through" : "none"};
`;

export default Task;
