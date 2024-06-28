import React, {useState, useEffect} from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Text,
} from "react-native";
import styled from "styled-components/native";
import PlusIcon from "@/assets/icons/PlusIcon";
import {CategoryType} from "@/types/Profile";
import {useAuth} from "@/context/AuthContext";
import {
  fetchCategories,
  addCategory,
  addTask,
  deleteTask,
  updateTask,
} from "@/lib/supabaseAPI";
import Category from "@/components/Task/Category";
import Calendar from "@/components/Task/Calendar";

function Home() {
  const [viewType, setViewType] = useState<"week" | "month">("week");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {userProfile} = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    if (userProfile) {
      const data = await fetchCategories(userProfile.id.toString());
      setCategories(data);
    }
  };

  const handleAddCategory = async () => {
    if (userProfile && newCategoryName.trim() !== "") {
      const success = await addCategory(
        newCategoryName.trim(),
        userProfile,
        selectedDate,
      );
      if (success) {
        setNewCategoryName("");
        setModalVisible(false);
        fetchCategoriesData();
      }
    }
  };

  const handleAddTask = async () => {
    if (userProfile && newTaskTitle.trim() !== "" && selectedCategoryId) {
      const success = await addTask(
        userProfile.id.toString(),
        newTaskTitle.trim(),
        selectedCategoryId,
        selectedDate,
      );
      if (success) {
        setNewTaskTitle("");
        setModalVisible(false);
        fetchCategoriesData();
      }
    }
  };

  return (
    <SafeAreaView>
      <Container>
        <Calendar
          viewType={viewType}
          setViewType={setViewType}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <AddCategoryButton onPress={() => setModalVisible(true)}>
          <AddCategoryButtonText>카테고리 만들기</AddCategoryButtonText>
          <PlusIcon width={16} height={16} />
        </AddCategoryButton>
        {categories?.map(category => (
          <Category
            key={category.id}
            id={category.id}
            text={category.name}
            todos={category.todos}
            user_id={userProfile?.id ?? ""}
          />
        ))}
        {/* 카테고리 추가 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <ModalContainer>
            <ModalView>
              <TextInput
                placeholder={
                  selectedCategoryId ? "할 일 입력" : "새 카테고리 이름 입력"
                }
                onChangeText={text =>
                  selectedCategoryId
                    ? setNewTaskTitle(text)
                    : setNewCategoryName(text)
                }
                value={selectedCategoryId ? newTaskTitle : newCategoryName}
              />
              <TouchableOpacity
                onPress={
                  selectedCategoryId ? handleAddTask : handleAddCategory
                }>
                <Text>확인</Text>
              </TouchableOpacity>
            </ModalView>
          </ModalContainer>
        </Modal>
        <View style={{height: 100}} />
      </Container>
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

const AddCategoryButton = styled(TouchableOpacity)`
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
