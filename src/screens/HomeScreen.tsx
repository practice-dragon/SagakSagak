import React, {useState} from "react";
import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import Calendar from "@story/stories/Calendar/Calendar";
import Task from "@story/stories/Task/Task";
import Category from "@story/stories/Task/Category";
import styled from "styled-components/native";
import PlusIcon from "@/assets/icons/PlusIcon";

function Home(): React.JSX.Element {
  const [viewType, setViewType] = useState<"week" | "month">("week");

  const mockCategories = [
    {
      text: "카테고리 1",
      tasks: [
        {text: "할 일 1-1", state: "default"},
        {text: "할 일 1-2", state: "archived"},
      ],
    },
    {text: "카테고리 2", tasks: [{text: "할 일 2-1", state: "default"}]},
    {
      text: "카테고리 3",
      tasks: [
        {text: "할 일 3-1", state: "default"},
        {text: "할 일 3-2", state: "default"},
      ],
    },
  ];

  return (
    <SafeAreaView>
      <Container>
        <Calendar viewType={viewType} setViewType={setViewType} />
        <AddCategoryButton>
          <AddCategoryButtonText>카테고리 만들기</AddCategoryButtonText>
          <PlusIcon width={16} height={16} />
        </AddCategoryButton>

        {mockCategories.map((category, index) => (
          <View key={index}>
            <Category text={category.text} />
            {category.tasks.map((task, taskIndex) => (
              <Task
                key={taskIndex}
                text={task.text}
                state={task.state as "default" | "archived"}
              />
            ))}
          </View>
        ))}
      </Container>
    </SafeAreaView>
  );
}

export default Home;

const Container = styled.SafeAreaView`
  background-color: ${({theme}) => theme.colors.background};
  height: 100%;
  padding: 0 16px;
  box-sizing: border-box;
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

const AddTaskButton = styled(TouchableOpacity)`
  background-color: ${({theme}) => theme.colors.card};
  padding: 12px 16px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;

const AddTaskButtonText = styled.Text`
  flex: 1;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
`;
