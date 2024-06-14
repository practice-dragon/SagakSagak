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
  border: ${({state}) => (state === "archived" ? `` : "none")};
  width: 90%;
`;

const TaskTitle = styled.Text<{state: "default" | "archived"}>`
  font-size: 16px;
  color: ${({theme}) => theme.colors.text};
  font-weight: bold;
  text-decoration-line: ${({state}) =>
    state === "archived" ? "line-through" : "none"};
`;

const Task = ({text, state}: TaskProps) => {
  return (
    <TaskContainer state={state}>
      <TaskTitle state={state}>{text}</TaskTitle>
    </TaskContainer>
  );
};

export default Task;
