import React, {useState} from "react";
import {Text, TextInput, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import ActiveCheckSquareIcon from "../../../src/assets/icons/ActiveCheckSquareIcon";
import CheckSquareIcon from "../../../src/assets/icons/CheckSquareIcon";
import BinIcon from "@/assets/icons/BinIcon";
import EditIcon from "@/assets/icons/EditIcon";
import {deleteTask, updateTask} from "@/lib/supabaseAPI";

interface TaskProps {
  id: number;
  text: string;
  completed: boolean;
}

const Task = ({id, text, completed}: TaskProps) => {
  const [editable, setEditable] = useState(false);
  const [newText, setNewText] = useState(text);

  const handleEdit = async () => {
    try {
      await updateTask(id, newText);
      setEditable(false);
    } catch (error) {
      console.error("Error updating task title", error);
    }
  };

  return (
    <Container>
      <LeftIcons>
        {completed ? (
          <ActiveCheckSquareIcon width={24} height={24} onPress={() => {}} />
        ) : (
          <CheckSquareIcon width={24} height={24} onPress={() => {}} />
        )}
      </LeftIcons>
      {editable ? (
        <TextInput
          value={newText}
          onChangeText={setNewText}
          onBlur={handleEdit}
          autoFocus
          onSubmitEditing={handleEdit}
        />
      ) : (
        <TouchableOpacity onPress={() => setEditable(true)}>
          <TaskText completed={completed}>{text}</TaskText>
        </TouchableOpacity>
      )}
      <RightIcons>
        <StyledTouchableOpacity onPress={() => setEditable(true)}>
          <EditIcon width={16} height={16} />
        </StyledTouchableOpacity>
        <StyledTouchableOpacity onPress={() => deleteTask(id)}>
          <BinIcon width={24} height={24} />
        </StyledTouchableOpacity>
      </RightIcons>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 16px;
`;

const LeftIcons = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 2px;
`;

const TaskText = styled(Text)<{completed: boolean}>`
  flex: 1;
  font-size: 16px;
  color: ${({completed}) => (completed ? "gray" : "#333")};
  text-decoration-line: ${({completed}) =>
    completed ? "line-through" : "none"};
`;

const RightIcons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export default Task;
