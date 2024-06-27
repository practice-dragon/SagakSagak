import React, {useState} from "react";
import {View, Text, TextInput, TouchableOpacity, Modal} from "react-native";
import styled from "styled-components/native";
import ActiveCheckSquareIcon from "../../../src/assets/icons/ActiveCheckSquareIcon";
import CheckSquareIcon from "../../../src/assets/icons/CheckSquareIcon";
import BinIcon from "@/assets/icons/BinIcon";
import {supabase} from "@/lib/supabase";

interface TaskProps {
  id: number;
  text: string;
  completed: boolean;
  onDelete: () => void;
  onEdit: () => void;
}

const Task = ({id, text, completed, onDelete, onEdit}: TaskProps) => {
  const [editable, setEditable] = useState(false);
  const [newText, setNewText] = useState(text);

  const toggleCompleted = async () => {
    try {
      const {data, error} = await supabase
        .from("todos")
        .update({completed: !completed})
        .eq("id", id.toString())
        .single();

      if (error) {
        console.error("Supabase update error", error);
        return;
      }
    } catch (error) {
      console.error("Error updating task completed status", error);
    }
  };

  const handleDelete = async () => {
    try {
      const {error} = await supabase
        .from("todos")
        .delete()
        .eq("id", id.toString());

      if (error) {
        console.error("Supabase delete error", error);
        return;
      }

      onDelete();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleEdit = async () => {
    try {
      const {data, error} = await supabase
        .from("todos")
        .update({title: newText})
        .eq("id", id.toString())
        .single();

      if (error) {
        console.error("Supabase update error", error);
        return;
      }

      setEditable(false);
    } catch (error) {
      console.error("Error updating task title", error);
    }
  };

  return (
    <Container>
      <LeftIcons>
        {completed ? (
          <ActiveCheckSquareIcon
            width={24}
            height={24}
            onPress={toggleCompleted}
          />
        ) : (
          <CheckSquareIcon width={24} height={24} onPress={toggleCompleted} />
        )}
      </LeftIcons>
      {editable ? (
        <TextInput
          value={newText}
          onChangeText={setNewText}
          onBlur={handleEdit}
          autoFocus
        />
      ) : (
        <TouchableOpacity onPress={() => setEditable(true)}>
          <TaskText completed={completed}>{text}</TaskText>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleDelete}>
        <BinIcon width={24} height={24} />
      </TouchableOpacity>
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

export default Task;
