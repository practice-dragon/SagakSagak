import React, {useState} from "react";
import styled from "styled-components/native";
import Task from "@story/stories/Task/Task";
import PlusIcon from "@/assets/icons/PlusIcon";
import {TaskType} from "@/types/Profile";
import {Modal, Text, TextInput, TouchableOpacity} from "react-native";
import MenuDotsIcon from "@/assets/icons/MenuDotsIcon";
import EditIcon from "@/assets/icons/EditIcon";

interface CategoryProps {
  text: string;
  onPress: () => void;
  todos: TaskType[];
  onDeleteTask: (taskId: number) => void;
  onUpdateTask: (taskId: number, newTitle: string) => void;
}

const Category = ({
  text,
  onPress,
  todos,
  onDeleteTask,
  onUpdateTask,
}: CategoryProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const handleEditTask = (taskId: number, currentTitle: string) => {
    setSelectedTaskId(taskId);
    setNewTaskTitle(currentTitle);
    setModalVisible(true);
  };

  const handleConfirmEdit = () => {
    if (selectedTaskId && newTaskTitle.trim() !== "") {
      onUpdateTask(selectedTaskId, newTaskTitle.trim());
      setModalVisible(false);
      setSelectedTaskId(null);
      setNewTaskTitle("");
    }
  };

  return (
    <CategoryContainer>
      <CategoryHeader>
        <CategoryBox onPress={onPress}>
          <CategoryText>{text}</CategoryText>
          <PlusIcon width={16} height={16} />
        </CategoryBox>
        <IconBox>
          <MenuDotsIcon width={16} height={16} />
        </IconBox>
      </CategoryHeader>

      {todos?.map(task => (
        <Task
          key={task.id}
          id={task.id}
          text={task.title}
          completed={task.completed}
          onDelete={() => onDeleteTask(task.id)}
          onEdit={() => handleEditTask(task.id, task.title)}
        />
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ModalContainer>
          <ModalView>
            <TextInput
              placeholder="수정할 내용 입력"
              onChangeText={text => setNewTaskTitle(text)}
              value={newTaskTitle}
            />
            <TouchableOpacity onPress={handleConfirmEdit}>
              <Text>확인</Text>
            </TouchableOpacity>
          </ModalView>
        </ModalContainer>
      </Modal>
    </CategoryContainer>
  );
};

const CategoryContainer = styled.View`
  margin-top: 16px;
`;

const CategoryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CategoryBox = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.card};
  padding: 12px 16px;
  align-self: flex-start;
  gap: 3px;
  border-radius: 8px;
`;

const IconBox = styled.TouchableOpacity`
  padding: 0 20px;
`;

const CategoryText = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalView = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

export default Category;
