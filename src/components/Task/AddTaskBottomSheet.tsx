import React, {useState} from "react";
import {TextInput} from "react-native";
import styled from "styled-components/native";
import {addTask} from "@/lib/supabaseAPI";
import CustomBottomSheet from "../common/BottomSheet";
import Button from "../common/Button";

interface AddTaskBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  categoryId: number;
  selectedDate: Date;
}

const AddTaskBottomSheet = ({
  visible,
  onClose,
  userId,
  categoryId,
  selectedDate,
}: AddTaskBottomSheetProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = async () => {
    try {
      if (newTaskTitle.trim() !== "") {
        await addTask(userId, newTaskTitle.trim(), categoryId, selectedDate);
        onClose();
        setNewTaskTitle("");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <CustomBottomSheet onClose={onClose} visible={visible}>
      <BottomSheetContent>
        <TextInput
          placeholder="할 일을 입력하세요"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          style={{padding: 10, borderBottomWidth: 1, borderColor: "#ccc"}}
        />
        <Button text="추가" onPress={handleAddTask} size={"sm"} />
      </BottomSheetContent>
    </CustomBottomSheet>
  );
};

export default AddTaskBottomSheet;

const BottomSheetContent = styled.View`
  align-items: center;
`;
