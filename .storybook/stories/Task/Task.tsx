import React from "react";
import styled from "styled-components/native";

interface TaskProps {
  text: string;
  state: "default" | "archived";
}

const TaskContainer = styled.View<{state: "default" | "archived"}>`
  background-color: ${({theme, state}) =>
    state === "default" ? theme.colors.card : theme.colors.archivedCard};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const TaskTitle = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colors.text};
  font-weight: bold;
`;

const Task = ({text, state}: TaskProps) => {
  return (
    <TaskContainer state={state}>
      <TaskTitle>{text}</TaskTitle>
    </TaskContainer>
  );
};

export default Task;
