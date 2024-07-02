import React, {useState} from "react";
import styled from "styled-components/native";
import MenuDotsIcon from "@/assets/icons/MenuDotsIcon";
import AddTaskBottomSheet from "@/components/Task/AddTaskBottomSheet";
import Button from "../common/Button";
import PlusIcon from "@/assets/icons/PlusIcon";
import {TaskType} from "@/types/Profile";
import CustomBottomSheet from "../common/BottomSheet";
import Task from "./Task";
import {useDateStore} from "@/context/DateStore";
import useStore from "@/context";

interface CategoryProps {
  id: number;
  text: string;
  todos?: TaskType[];
  user_id: string;
}

const Category = ({text, todos, id, user_id}: CategoryProps) => {
  const {selectedDate} = useDateStore();

  const {updateCategory, deleteCategory} = useStore(state => ({
    updateCategory: state.updateCategory,
    deleteCategory: state.deleteCategory,
  }));

  const [newCategoryTitle, setNewCategoryTitle] = useState(text);
  const [editBottomSheetVisible, setEditBottomSheetVisible] = useState(false);
  const [addTaskBottomSheetVisible, setAddTaskBottomSheetVisible] =
    useState(false);

  const handleEdit = async () => {
    try {
      if (newCategoryTitle.trim() !== "") {
        await updateCategory(
          id,
          newCategoryTitle.trim(),
          user_id,
          selectedDate,
        );
        setNewCategoryTitle(newCategoryTitle);
        setEditBottomSheetVisible(false);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(id, user_id, selectedDate);
      setEditBottomSheetVisible(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const closeBottomSheet = () => {
    setAddTaskBottomSheetVisible(false);
    setEditBottomSheetVisible(false);
  };

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

      {todos?.map(task => (
        <Task key={task.id} task={task} selectedDate={selectedDate} />
      ))}

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
        <Button text="수정하기" onPress={handleEdit} size={"sm"} />
        <Button
          text="삭제하기"
          onPress={handleDeleteCategory}
          size={"sm"}
          variant="textGray"
        />
      </CustomBottomSheet>

      <AddTaskBottomSheet
        visible={addTaskBottomSheetVisible}
        onClose={closeBottomSheet}
        userId={user_id}
        categoryId={id}
        selectedDate={selectedDate}
      />
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
