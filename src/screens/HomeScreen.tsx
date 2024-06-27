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
import {supabase} from "@/lib/supabase";
import {CategoryType} from "@/types/Profile";
import {useAuth} from "@/context/AuthContext";
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    if (userProfile) {
      const {data, error} = await supabase
        .from("categories")
        .select("*, todos (*)")
        .eq("user_id", userProfile.id.toString());
      if (error) {
        console.error(error);
      } else {
        setCategories(data as CategoryType[]);
      }
    }
  };

  const addCategory = () => {
    setModalVisible(true);
    setSelectedCategoryId(null);
  };

  const handleAddCategory = async () => {
    if (userProfile && newCategoryName.trim() !== "") {
      const formattedDate = `${selectedDate.getFullYear()}-${
        selectedDate.getMonth() + 1
      }-${selectedDate.getDate()}`;
      const {data, error} = await supabase
        .from("categories")
        .insert([
          {
            name: newCategoryName.trim(),
            user_id: userProfile.id,
            created_at: formattedDate,
          },
        ])
        .select();

      if (error) {
        console.error(error);
      } else {
        setCategories([...categories, ...(data as CategoryType[])]);
        setNewCategoryName("");
        setModalVisible(false);
      }
    }
  };

  const addTask = (categoryId: number) => {
    setModalVisible(true);
    setSelectedCategoryId(categoryId);
  };

  const handleAddTask = async () => {
    if (userProfile && newTaskTitle.trim() !== "" && selectedCategoryId) {
      const {data, error} = await supabase
        .from("todos")
        .insert([
          {
            title: newTaskTitle.trim(),
            category_id: selectedCategoryId,
            user_id: userProfile.id,
            created_at: selectedDate.toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error(error);
      } else {
        fetchCategories();
        setNewTaskTitle("");
        setModalVisible(false);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const {error} = await supabase
        .from("todos")
        .delete()
        .eq("id", taskId.toString());

      if (error) {
        console.error("Supabase delete error", error);
        return;
      }
      fetchCategories();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleUpdateTask = async (taskId: number, newTitle: string) => {
    try {
      const {data, error} = await supabase
        .from("todos")
        .update({title: newTitle})
        .eq("id", taskId.toString())
        .single();

      if (error) {
        console.error("Supabase update error", error);
        return;
      }
      fetchCategories();
    } catch (error) {
      console.error("Error updating task title", error);
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
        <AddCategoryButton onPress={addCategory}>
          <AddCategoryButtonText>카테고리 만들기</AddCategoryButtonText>
          <PlusIcon width={16} height={16} />
        </AddCategoryButton>
        {categories?.map(category => (
          <Category
            key={category.id}
            text={category.name}
            todos={category.todos}
            onPress={() => addTask(category.id)}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        ))}
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

export default Home;
