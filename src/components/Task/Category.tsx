import React, {useState, useEffect, useCallback} from "react";
import styled from "styled-components/native";
import AddTaskBottomSheet from "@/components/Task/AddTaskBottomSheet";
import PlusIcon from "@/assets/icons/PlusIcon";
import {TaskType} from "@/types/Profile";
import CustomBottomSheet from "../common/BottomSheet";
import Task from "./Task";
import useStore from "@/context";
import MenuDotsIcon from "@/assets/icons/MenuDotsIcon";
import Button from "../common/Button";

interface CategoryProps {
  id: number;
  text: string;
  todos?: TaskType[];
  user_id: string;
}

const Category = ({text, todos, id, user_id}: CategoryProps) => {
  const {updateCategory, deleteCategory, fetchTasks, deleteTask} = useStore(
    state => ({
      updateCategory: state.updateCategory,
      deleteCategory: state.deleteCategory,
      fetchTasks: state.fetchTasks,
      deleteTask: state.deleteTask,
    }),
  );

  const [newCategoryTitle, setNewCategoryTitle] = useState(text);
  const [editBottomSheetVisible, setEditBottomSheetVisible] = useState(false);

  const [addTaskBottomSheetVisible, setAddTaskBottomSheetVisible] =
    useState(false);
  const [categoryTasks, setCategoryTasks] = useState<TaskType[]>(todos || []);

  useEffect(() => {
    setCategoryTasks(todos || []);
  }, [todos]);

  const handleEdit = async () => {
    try {
      if (newCategoryTitle.trim() !== "") {
        await updateCategory(id, newCategoryTitle.trim(), user_id);
        setEditBottomSheetVisible(false);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(id, user_id);
      setEditBottomSheetVisible(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setCategoryTasks(prevTasks =>
        prevTasks.filter(task => task.id !== taskId),
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const closeBottomSheet = () => {
    setAddTaskBottomSheetVisible(false);
    setEditBottomSheetVisible(false);
  };

  const renderTasks = useCallback(() => {
    return categoryTasks.map(task => <Task key={task.id} task={task} />);
  }, [categoryTasks, handleDeleteTask]);

  return (
    <CategoryContainer>
      <CategoryHeader>
        <CategoryBox onPress={() => setAddTaskBottomSheetVisible(true)}>
          <CategoryText>{text}</CategoryText>
          <PlusIcon width={16} height={16} />
        </CategoryBox>
        <IconBox onPress={() => setEditBottomSheetVisible(true)}>
          <MenuDotsIcon width={24} height={24} />
        </IconBox>
      </CategoryHeader>

      {renderTasks()}

      <CustomBottomSheet
        visible={editBottomSheetVisible}
        onClose={closeBottomSheet}>
        <BottomSheetBox>
          <BottomSheetTitle>카테고리 수정하기</BottomSheetTitle>
          <BottomSheetTextInput
            placeholder="수정할 카테고리의 이름은?"
            onChangeText={text => setNewCategoryTitle(text)}
            value={newCategoryTitle}
          />
        </BottomSheetBox>
        <Button onPress={handleEdit} size="lg" text="수정하기" />
        <Button onPress={handleDeleteCategory} size="lg" text="삭제하기" />
      </CustomBottomSheet>

      <AddTaskBottomSheet
        visible={addTaskBottomSheetVisible}
        onClose={closeBottomSheet}
        categoryId={id}
        userId={user_id}
      />
    </CategoryContainer>
  );
};

export default Category;

const CategoryContainer = styled.View`
  margin-top: 16px;
`;

const CategoryBox = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.card};
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  align-self: flex-start;
  gap: 3px;
`;

const CategoryText = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
`;

const CategoryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const IconBox = styled.TouchableOpacity`
  border-radius: 8px;
  padding: 10px;
  margin-left: 10px;
`;

const BottomSheetBox = styled.View`
  width: 90%;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const BottomSheetTitle = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h1.fontFamily};
`;

const BottomSheetTextInput = styled.TextInput`
  align-self: flex-start;
  background-color: ${({theme}) => theme.colors.card};
  width: 100%;
  border-radius: 10px;
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.text};
`;
