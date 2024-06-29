import React, {useState} from "react";
import {View, TextInput, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import ActiveCheckSquareIcon from "../../../src/assets/icons/ActiveCheckSquareIcon";
import CheckSquareIcon from "../../../src/assets/icons/CheckSquareIcon";
import BinIcon from "@/assets/icons/BinIcon";
import {supabase} from "@/lib/supabase";
import {TaskType} from "@/types/Profile";
import EditIcon from "@/assets/icons/EditIcon";
import {format} from "date-fns";
import {deleteTask, updateTaskCompletedStatus} from "@/lib/supabaseAPI";

interface TaskProps {
  id: number;
  task: TaskType;
}

const Task = ({id, task}: TaskProps) => {
  const {completed, title, description, deadline_time, reminder_time} = task;
  const [editable, setEditable] = useState(false);
  const [newText, setNewText] = useState(title);

  const toggleCompleted = async () => {
    await updateTaskCompletedStatus(task.id, completed);
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
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
    <TaskContainer>
      <LeftContainer>
        <CheckIconContainer>
          <TouchableOpacity onPress={toggleCompleted}>
            {completed ? (
              <ActiveCheckSquareIcon width={24} height={24} />
            ) : (
              <CheckSquareIcon width={24} height={24} />
            )}
          </TouchableOpacity>
        </CheckIconContainer>
      </LeftContainer>
      <MiddleContainer>
        <TaskTitle completed={completed}>{title}</TaskTitle>
        {deadline_time && (
          <DeadlineText completed={completed}>
            {format(deadline_time, "hh:mm a")} 까지
          </DeadlineText>
        )}
      </MiddleContainer>
      <RightContainer>
        <TouchableOpacity onPress={() => setEditable(true)}>
          <EditIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <BinIcon width={24} height={24} />
        </TouchableOpacity>
      </RightContainer>
    </TaskContainer>
  );
};

export default Task;

const TaskContainer = styled.View`
  flex-direction: row;
  padding: 10px 16px;
`;

const CheckIconContainer = styled.View``;

const LeftContainer = styled.View``;

const MiddleContainer = styled.View`
  flex: 1;
`;

const RightContainer = styled.View`
  align-self: flex-end;
  gap: 3px;
`;

const TaskTitle = styled.Text<{completed: boolean}>`
  color: ${({completed, theme}) =>
    completed ? theme.colors.n4 : theme.colors.text};
  text-decoration-line: ${({completed}) =>
    completed ? "line-through" : "none"};
  margin-left: 8px;
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
`;

const DeadlineText = styled.Text<{completed: boolean}>`
  color: ${({completed, theme}) =>
    completed ? theme.colors.n4 : theme.colors.text};
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  margin-left: 8px;
`;
