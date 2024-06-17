import React from "react";
import styled from "styled-components/native";

interface TaskProps {
  text: string;
  state: "default" | "archived";
}

const TaskContainer = styled.View<{state: "default" | "archived"}>`
  background-color: ${({theme}) => theme.colors.card};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  ${({state}) =>
    state === "archived" &&
    `
    border-width: 2px;
    border-color: ${({theme}) => theme.colors.archivedBorder};
  `}
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
