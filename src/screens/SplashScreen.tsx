import React, {useState} from "react";
import {Image, Text, TextInput} from "react-native";
import styled from "styled-components/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from "@/components/common/Button";
import {AuthProvider, useAuth} from "@/context/AuthContext";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background};
`;

const LogoContainer = styled.View`
  flex: 1;
  margin-top: 10px;
`;

const LogoImage = styled(Image).attrs({
  source: require("../assets/images/sagak_logo.png"),
})`
  width: 138px;
  height: 50px;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
  width: 80%;
`;

const Label = styled.Text`
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h2.fontFamily};
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 8px;
`;

const StyledTextInput = styled.TextInput`
  align-self: flex-start;
  background-color: ${({theme}) => theme.colors.card};
  width: 100%;
  border-radius: 10px;
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
`;

const SplashScreen = () => {
  const {userProfile, login} = useAuth();
  const [username, setUsername] = useState("");
  const [character, setCharacter] = useState("");
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [bedTime, setBedTime] = useState(new Date());

  const [isWakeUpTimePickerVisible, setIsWakeUpTimePickerVisible] =
    useState(false);
  const [isBedTimePickerVisible, setIsBedTimePickerVisible] = useState(false);

  const showWakeUpTimePicker = () => {
    setIsWakeUpTimePickerVisible(true);
  };

  const hideWakeUpTimePicker = () => {
    setIsWakeUpTimePickerVisible(false);
  };

  const handleWakeUpTimeConfirm = (time: Date) => {
    setWakeUpTime(time);
    hideWakeUpTimePicker();
  };

  const showBedTimePicker = () => {
    setIsBedTimePickerVisible(true);
  };

  const hideBedTimePicker = () => {
    setIsBedTimePickerVisible(false);
  };

  const handleBedTimeConfirm = (time: Date) => {
    setBedTime(time);
    hideBedTimePicker();
  };

  const handleStart = async () => {
    try {
      if (!userProfile) {
        console.error("User profile not found.");
        return;
      }

      const profile = {
        id: userProfile.id,
        username,
        character,
        joinedat: new Date().toISOString(),
        wakeuptime: wakeUpTime.toISOString(),
        bedtimetime: bedTime.toISOString(),
      };

      await login(profile);
    } catch (error) {
      console.error("Failed to start plan:", error);
    }
  };

  return (
    <AuthProvider>
      <Container>
        <LogoContainer>
          <LogoImage />
        </LogoContainer>
        <InputContainer>
          <Label>사용자 이름</Label>
          <StyledTextInput
            placeholder="사용자 이름을 입력하세요"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </InputContainer>
        <InputContainer>
          <Label>캐릭터 이름</Label>
          <StyledTextInput
            placeholder="캐릭터 이름을 넣어주세요"
            value={character}
            onChangeText={text => setCharacter(text)}
          />
        </InputContainer>
        <InputContainer>
          <Label>일어날 시간</Label>
          <StyledTextInput
            placeholder="일어날 시간을 선택하세요"
            value={wakeUpTime.toLocaleTimeString()}
            onTouchStart={showWakeUpTimePicker}
          />
          <DateTimePickerModal
            isVisible={isWakeUpTimePickerVisible}
            mode="time"
            onConfirm={handleWakeUpTimeConfirm}
            onCancel={hideWakeUpTimePicker}
          />
        </InputContainer>
        <InputContainer>
          <Label>잘 시간</Label>
          <StyledTextInput
            placeholder="잘 시간을 선택하세요"
            value={bedTime.toLocaleTimeString()}
            onTouchStart={showBedTimePicker}
          />
          <DateTimePickerModal
            isVisible={isBedTimePickerVisible}
            mode="time"
            onConfirm={handleBedTimeConfirm}
            onCancel={hideBedTimePicker}
          />
        </InputContainer>
        <Button text="계획 시작하기!" onPress={handleStart} size="lg" />
      </Container>
    </AuthProvider>
  );
};

export default SplashScreen;
