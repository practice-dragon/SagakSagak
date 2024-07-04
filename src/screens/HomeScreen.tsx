import React, {useEffect, useState, useCallback} from "react";
import {SafeAreaView, View, Text} from "react-native";
import styled from "styled-components/native";
import PlusIcon from "@/assets/icons/PlusIcon";
import Category from "@/components/Task/Category";
import Calendar from "@/components/Task/Calendar";
import CustomBottomSheet from "@/components/common/BottomSheet";
import Button from "@/components/common/Button";
import {useAuthStore} from "@/context/authStore";
import useStore from "@/context";
import {useDateStore} from "@/context/DateStore";
import CharacterFloatingButton from "@/components/Character/CharacterFloatingButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {RootTabParamList} from "@/types/route";

import SUSU from "@/assets/images/susu.png";
import NABI from "@/assets/images/nabi.png";
import {useCharStore} from "@/context/charStore";

function Home() {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const {isAuthenticated, userProfile} = useAuthStore();
  const {fetchCategories, addCategory, categories, tasks, fetchAllTasks} =
    useStore();
  const {selectedChar, setSelectedChar} = useCharStore();
  const {selectedDate} = useDateStore();
  const [viewType, setViewType] = useState<"week" | "month">("week");
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const userId = userProfile.id.toString();
      fetchCategories(userId);
      fetchAllTasks(userId);
    }
  }, [isAuthenticated, userProfile]);

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      fetchCategories(userProfile.id.toString());
    }
  }, [selectedDate]);

  const handleAddCategory = async () => {
    if (isAuthenticated && userProfile && newCategoryName.trim()) {
      await addCategory(newCategoryName.trim(), userProfile);
      setNewCategoryName("");
      setBottomSheetVisible(false);
    }
  };

  const filterTodosByDate = useCallback(
    (todos: any[]) => {
      return todos.filter((todo: {created_at: string | number | Date}) => {
        if (todo.created_at) {
          const todoDate = new Date(todo.created_at).setHours(0, 0, 0, 0);
          const selectedDateOnly = new Date(selectedDate).setHours(0, 0, 0, 0);
          return todoDate === selectedDateOnly;
        }
        return false;
      });
    },
    [selectedDate],
  );

  const getCategoryTasks = useCallback(
    (categoryId: number) => {
      return filterTodosByDate(
        tasks.filter(task => task.category_id === categoryId),
      );
    },
    [tasks, filterTodosByDate],
  );

  return (
    <SafeAreaView>
      <Container>
        <Calendar viewType={viewType} setViewType={setViewType} />
        <AddCategoryButton onPress={() => setBottomSheetVisible(true)}>
          <AddCategoryButtonText>카테고리 만들기</AddCategoryButtonText>
          <PlusIcon width={16} height={16} />
        </AddCategoryButton>
        {categories?.map(category => (
          <Category
            key={category.id}
            id={category.id}
            text={category.name}
            todos={getCategoryTasks(category.id)}
            user_id={userProfile?.id ?? ""}
          />
        ))}
        <CustomBottomSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}>
          <BottomSheetBox>
            <BottomSheetTitle>카테고리 만들기</BottomSheetTitle>
            <BottomSheetTextInput
              placeholder="새 카테고리의 이름은?"
              onChangeText={text => setNewCategoryName(text)}
              value={newCategoryName}
            />
          </BottomSheetBox>
          <Button onPress={handleAddCategory} size="lg" text="만들기" />
        </CustomBottomSheet>
        <View style={{height: 100}} />
      </Container>
      <CharacterFloatingButton
        imageSource={selectedChar === "수수" ? SUSU : NABI}
        onPress={() => navigation.navigate("캐릭터")}
      />
    </SafeAreaView>
  );
}

export default Home;

const Container = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background};
  height: 100%;

  padding: 0 16px;
  box-sizing: border-box;
  padding-bottom: 70px;
`;

const AddCategoryButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.card};
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  padding: 12px 16px;
`;

const AddCategoryButtonText = styled.Text`
  flex: 1;
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
