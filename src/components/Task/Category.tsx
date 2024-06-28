import React, {useState} from "react";
import styled from "styled-components/native";
import Task from "@story/stories/Task/Task";
import PlusIcon from "@/assets/icons/PlusIcon";
import {TaskType} from "@/types/Profile";
import {Modal, Text, TextInput, TouchableOpacity} from "react-native";
import MenuDotsIcon from "@/assets/icons/MenuDotsIcon";
import CustomBottomSheet from "@/components/common/BottomSheet";
import Button from "../common/Button";
import {addTask, updateCategory, deleteCategory} from "@/lib/supabaseAPI";

interface CategoryProps {
  text: string;
  todos?: TaskType[];
  id: number;
  user_id: string;
}

const Category = ({text, todos, id, user_id}: CategoryProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState(text);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  const handleAddTask = async () => {
    try {
      if (newTaskTitle.trim() !== "") {
        const userId = user_id;
        const categoryId = id;
        const data = await addTask(
          userId,
          newTaskTitle.trim(),
          categoryId,
          new Date(),
        );

        if (data) {
          console.log("Task added successfully:", data);
          setNewTaskTitle("");
          setModalVisible(false);
        } else {
          console.error("Failed to add task:", data);
        }
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEdit = async () => {
    try {
      if (newCategoryTitle.trim() !== "") {
        const userId = user_id;
        const success = await updateCategory(
          id,
          newCategoryTitle.trim(),
          userId,
        );

        if (success) {
          console.log(
            "Category updated successfully:",
            newCategoryTitle.trim(),
          );
          setCategoryTitle(newCategoryTitle.trim());
          setNewCategoryTitle("");
          setBottomSheetVisible(false);
        } else {
          console.error("Failed to update category:", newCategoryTitle.trim());
        }
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const userId = user_id;
      const success = await deleteCategory(id, userId);

      if (success) {
        console.log("Category deleted successfully:", id);
        // Handle successful category deletion, e.g., navigate back or update state
      } else {
        console.error("Failed to delete category:", id);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    setBottomSheetVisible(false);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  return (
    <CategoryContainer>
      <CategoryHeader>
        <CategoryBox onPress={() => setModalVisible(true)}>
          <CategoryText>{categoryTitle}</CategoryText>
          <PlusIcon width={16} height={16} />
        </CategoryBox>
        <IconBox
          onPress={() => {
            setBottomSheetVisible(true);
          }}>
          <MenuDotsIcon width={24} height={24} />
        </IconBox>
      </CategoryHeader>

      {todos?.map(task => (
        <Task
          key={task.id}
          id={task.id}
          text={task.title}
          completed={task.completed}
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
              placeholder="할 일을 입력하세요"
              onChangeText={text => setNewTaskTitle(text)}
              value={newTaskTitle}
            />
            <TouchableOpacity onPress={handleAddTask}>
              <Text>추가</Text>
            </TouchableOpacity>
          </ModalView>
        </ModalContainer>
      </Modal>

      <CustomBottomSheet
        visible={bottomSheetVisible}
        onClose={closeBottomSheet}>
        <TextInput
          placeholder="카테고리 이름을 입력하세요"
          onChangeText={text => setNewCategoryTitle(text)}
          value={newCategoryTitle}
          style={{padding: 10, borderBottomWidth: 1, borderColor: "#ccc"}}
        />
        <Button text="수정하기" onPress={handleEdit} size={"sm"} />
        <Button
          text="삭제하기"
          onPress={handleDeleteCategory}
          size={"sm"}
          variant="textGray"
        />
      </CustomBottomSheet>
    </CategoryContainer>
  );
};

export default Category;

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
  padding: 16px 15px;
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
