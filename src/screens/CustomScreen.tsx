import React, {useState, useEffect} from "react";
import {
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import styled, {useTheme} from "styled-components/native";
import {useAuthStore} from "@/context/authStore";
import SUSU from "@/assets/images/susu.png";
import NABI from "@/assets/images/nabi.png";

interface Message {
  text: string;
  isUser: boolean;
}

const CustomScreen = () => {
  const {userProfile} = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const theme = useTheme();

  useEffect(() => {
    setMessages([{text: "안녕? 오늘 하루도 힘내!", isUser: false}]);
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      const newMessage = {text: inputText, isUser: true};
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  return (
    <Container>
      <ChatContainer>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <MessageContainer isUser={item.isUser}>
              {!item.isUser && (
                <CharacterContainer>
                  <CharacterImage
                    source={userProfile?.character === "수수" ? SUSU : NABI}
                  />
                  <CharacterName>{userProfile?.character}</CharacterName>
                </CharacterContainer>
              )}
              <MessageText isUser={item.isUser}>{item.text}</MessageText>
            </MessageContainer>
          )}
        />
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
    isUser ? theme.colors.primary : theme.colors.n2};
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
  height: 100%;
`;

const SendButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: 12px 16px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SendButtonText = styled.Text`
  color: ${({theme}) => theme.colors.textInverse};
  font-weight: bold;
`;

const CharacterContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const CharacterImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const CharacterName = styled.Text`
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  color: ${({theme}) => theme.colors.text};
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  margin-top: 4px;
`;
