import React, {useState, useEffect} from "react";
import {TextInput, TouchableOpacity, Text, StyleSheet} from "react-native";
import styled from "styled-components/native";
import {format} from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AlarmIcon from "@/assets/icons/AlarmIcon";
import AlarmTurnOffIcon from "@/assets/icons/AlarmTurnOffIcon";
import {TaskType} from "@/types/Profile";
import CustomBottomSheet from "../common/BottomSheet";
import Button from "../common/Button";
import useStore from "@/context";
import {useAuthStore} from "@/context/authStore";

interface UpdateTaskBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  task: TaskType;
}

const UpdateTaskBottomSheet = ({
  visible,
  onClose,
  task,
}: UpdateTaskBottomSheetProps) => {
  const {userProfile} = useAuthStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [deadlineTime, setDeadlineTime] = useState(new Date());
  const [isReminderPickerVisible, setReminderPickerVisible] = useState(false);
  const [isDeadlinePickerVisible, setDeadlinePickerVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const {updateTask} = useStore();
  useEffect(() => {
    setNewTaskTitle(task.title || "");
    setDescription(task.description || "");
    setReminderTime(
      task.reminder_time ? new Date(task.reminder_time) : new Date(),
    );
    setDeadlineTime(
      task.deadline_time ? new Date(task.deadline_time) : new Date(),
    );
    setCompleted(task.completed || false);
  }, [task]);

  const handleUpdateTask = async () => {
    try {
      if (newTaskTitle.trim() !== "") {
        await updateTask(
          userProfile?.id ?? "",
          task.category_id,
          task.id,
          newTaskTitle.trim(),
          description,
          reminderTime,
          "",
          "",
          deadlineTime,
          completed,
        );
        onClose();
        setNewTaskTitle("");
        setDescription("");
        setReminderTime(new Date());
        setDeadlineTime(new Date());
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const showReminderPicker = () => setReminderPickerVisible(true);
  const hideReminderPicker = () => setReminderPickerVisible(false);
  const handleConfirmReminder = (date: Date) => {
    setReminderTime(date);
    hideReminderPicker();
  };

  const showDeadlinePicker = () => setDeadlinePickerVisible(true);
  const hideDeadlinePicker = () => setDeadlinePickerVisible(false);
  const handleConfirmDeadline = (date: Date) => {
    setDeadlineTime(date);
    hideDeadlinePicker();
  };

  return (
    <CustomBottomSheet onClose={onClose} visible={visible}>
      <BottomSheetContent>
        <BottomSheetTitle>할 일 수정하기</BottomSheetTitle>
        <StyledTextInput
          placeholder="할 일을 수정해봐요"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <StyledTextInput
          placeholder="설명"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity onPress={showReminderPicker}>
          <InputWrapper>
            <AlarmIcon width={30} height={30} />
            <InputLabel>알림 시간</InputLabel>
            <InputText>{format(reminderTime, "hh:mm a")}</InputText>
          </InputWrapper>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isReminderPickerVisible}
          mode="time"
          onConfirm={handleConfirmReminder}
          onCancel={hideReminderPicker}
        />
        <TouchableOpacity onPress={showDeadlinePicker}>
          <InputWrapper>
            <AlarmTurnOffIcon width={30} height={30} />
            <InputLabel>마감 시간</InputLabel>
            <InputText>{format(deadlineTime, "hh:mm a")}</InputText>
          </InputWrapper>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDeadlinePickerVisible}
          mode="time"
          onConfirm={handleConfirmDeadline}
          onCancel={hideDeadlinePicker}
        />
        <StyledButton text="수정하기!" onPress={handleUpdateTask} size={"lg"} />
      </BottomSheetContent>
    </CustomBottomSheet>
  );
};

export default UpdateTaskBottomSheet;

const BottomSheetContent = styled.View`
  width: 100%;
  padding: 20px;
  gap: 10px;
`;

const BottomSheetTitle = styled.Text`
  align-self: center;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h1.fontFamily};
`;

const StyledTextInput = styled.TextInput`
  background-color: ${({theme}) => theme.colors.card};
  width: 100%;
  border-radius: 10px;
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.text};
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  padding: 10px;
  width: 100%;
`;

const InputLabel = styled.Text`
  margin-left: 10px;
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.text};
`;

const InputText = styled.Text`
  margin-left: auto;
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.n4};
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;
