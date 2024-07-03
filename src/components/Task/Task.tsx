import React, {useState} from "react";
import {TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import ActiveCheckSquareIcon from "../../../src/assets/icons/ActiveCheckSquareIcon";
import CheckSquareIcon from "../../../src/assets/icons/CheckSquareIcon";
import BinIcon from "@/assets/icons/BinIcon";
import {TaskType} from "@/types/Profile";
import EditIcon from "@/assets/icons/EditIcon";
import {format} from "date-fns";
import useStore from "@/context";
import UpdateTaskBottomSheet from "./UpdateTaskBottomSheet";
import {useAuthStore} from "@/context/authStore";

interface TaskProps {
  task: TaskType;
}

const Task = ({task}: TaskProps) => {
  const {completed, title, deadline_time, category_id} = task;
  const {userProfile} = useAuthStore();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const {updateTaskCompletedStatus, deleteTask} = useStore(state => ({
    updateTaskCompletedStatus: state.updateTaskCompletedStatus,
    deleteTask: state.deleteTask,
  }));

  const toggleCompleted = async () => {
    if (userProfile) {
      await updateTaskCompletedStatus(task.id, task.completed);
    }
  };

  const handleDelete = async () => {
    if (userProfile) {
      await deleteTask(task.id);
    }
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
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
            {format(new Date(deadline_time), "hh:mm a")} 까지
          </DeadlineText>
        )}
      </MiddleContainer>
      <RightContainer>
        <TouchableOpacity onPress={() => setBottomSheetVisible(true)}>
          <EditIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <BinIcon width={24} height={24} />
        </TouchableOpacity>
      </RightContainer>

      <UpdateTaskBottomSheet
        task={task}
        onClose={closeBottomSheet}
        visible={bottomSheetVisible}
      />
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
