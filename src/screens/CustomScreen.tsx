import React, {useState, useEffect} from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import styled, {useTheme} from "styled-components/native";
import {useAuthStore} from "@/context/authStore";
import SUSU from "@/assets/images/susu.png";
import NABI from "@/assets/images/nabi.png";
import {updateCharacter} from "@/lib/Profile";
import OpenAI from "openai";
import {OpenAI_KEY} from "@env";
import {useCharStore} from "@/context/charStore";

const openai = new OpenAI({
  apiKey: OpenAI_KEY,
});

interface Message {
  text: string;
  isUser: boolean;
}

const CustomScreen = () => {
  const {userProfile} = useAuthStore();
  const {selectedChar, setSelectedChar} = useCharStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    if (selectedChar === "수수") {
      setMessages([{text: "안녕? 오늘 하루도 힘내!", isUser: false}]);
    } else if (selectedChar === "나비") {
      setMessages([{text: "오늘 하루도 힘내서 살아봐", isUser: false}]);
    }
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [selectedChar]);

  const handleCharacterChange = async (character: string) => {
    setSelectedChar(character);
    if (userProfile) {
      try {
        await updateCharacter(userProfile.id, character);
      } catch (error) {
        console.error("Failed to update character", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== "") {
      const newMessage = {text: inputText, isUser: true};
      setMessages([...messages, newMessage]);
      setInputText("");
      setLoading(true);

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: generatePrompt(inputText, selectedChar),
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        });
        const aiMessage = {
          text: completion.choices[0]?.message?.content || "",
          isUser: false,
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Failed to get response from OpenAI", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const generatePrompt = (userInput: string, character: string) => {
    if (character === "수수") {
      return `너는 이름이 수수인 느긋한 강아지야. 수수는 항상 여유롭고 천천히 행동해. 말을 할 때는 반말로 이야기하고, 친근하고 다정하게 말해줘. 수수는 게으른 사람을 보면 같이 느긋하게 있으면서도 도와주려는 마음을 가지고 있어. 다음 질문에 답해줘: ${userInput}`;
    } else if (character === "나비") {
      return `너는 이름이 나비인 새침한 검은 고양이야. 나비는 항상 눈을 세모나게 뜨고 다녀. 말을 할 때는 반말로 이야기하고, 조금 도도한 말투를 사용해줘. 나비처럼 행동하면서 다음 질문에 답해줘: ${userInput}`;
    }
    return userInput;
  };

  return (
    <Container>
      <ChatContainer>
        <CharacterSelectionContainer>
          <CharacterOption onPress={() => handleCharacterChange("수수")}>
            <CharacterImageOption source={SUSU} />
            <CharacterSelectionName>수수</CharacterSelectionName>
          </CharacterOption>
          <CharacterOption onPress={() => handleCharacterChange("나비")}>
            <CharacterImageOption source={NABI} />
            <CharacterSelectionName>나비</CharacterSelectionName>
          </CharacterOption>
        </CharacterSelectionContainer>
        {selectedChar === "수수" && (
          <CharacterDescription>
            시골 개 수수는 늘 느긋하게 살아요.
          </CharacterDescription>
        )}
        {selectedChar === "나비" && (
          <CharacterDescription>
            새침한 검은냥이 나비는 언제나 눈을 세모나개 뜨고 다녀요.
          </CharacterDescription>
        )}
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <MessageContainer isUser={item.isUser}>
              {!item.isUser && (
                <CharacterContainer>
                  <CharacterImage
                    source={selectedChar === "수수" ? SUSU : NABI}
                  />
                  <CharacterName>{selectedChar}</CharacterName>
                </CharacterContainer>
              )}
              <MessageText isUser={item.isUser}>{item.text}</MessageText>
            </MessageContainer>
          )}
        />
        {loading && (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}
        <InputContainer>
          <Input
            onChangeText={setInputText}
            value={inputText}
            placeholder="할 말 입력하기"
            placeholderTextColor={theme.colors.n3}
            theme={theme}
          />
          <SendButton onPress={handleSendMessage} theme={theme}>
            <SendButtonText theme={theme}>보내기</SendButtonText>
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default CustomScreen;

const Container = styled.View`
  flex: 1;
  flex-direction: row;
`;

const ChatContainer = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({theme}) => theme.colors.background};
`;

const CharacterSelectionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 16px;
`;

const CharacterSelectionName = styled.Text`
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  color: ${({theme}) => theme.colors.text};
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
`;

const CharacterOption = styled.TouchableOpacity`
  align-items: center;
  gap: 3px;
`;

const CharacterImageOption = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const CharacterDescription = styled.Text`
  text-align: center;
  align-self: flex-start;
  margin-top: 8px;
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  color: ${({theme}) => theme.colors.text};
  word-break: keep-all;
  margin-bottom: 10px;
`;

const MessageContainer = styled.View<{isUser: boolean}>`
  flex-direction: row;
  margin-bottom: 12px;
  align-items: center;
  justify-content: ${({isUser}) => (isUser ? "flex-end" : "flex-start")};
`;

const MessageText = styled.Text<{isUser: boolean}>`
  color: ${({theme, isUser}) =>
    isUser ? theme.colors.textInverse : theme.colors.text};
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  padding: 12px;
  border-radius: 16px;
  background-color: ${({theme, isUser}) =>
    isUser ? theme.colors.primary : theme.colors.n1};
  max-width: 70%;
  margin-left: ${({isUser}) => (isUser ? "auto" : "8px")};
  margin-right: ${({isUser}) => (isUser ? "8px" : "auto")};
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  height: 48px;
`;

const Input = styled.TextInput`
  flex: 1;
  background-color: ${({theme}) => theme.colors.card};
  padding: 12px;
  border-radius: 8px;
  margin-right: 8px;
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  color: ${({theme}) => theme.colors.text};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.n4};
`;

const SendButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 8px;
  padding: 12px;
`;

const SendButtonText = styled.Text`
  color: ${({theme}) => theme.colors.textInverse};
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
`;

const CharacterContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const CharacterImage = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 18px;
`;

const CharacterName = styled.Text`
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  color: ${({theme}) => theme.colors.text};
`;
