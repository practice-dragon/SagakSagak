import React, {useState} from "react";
import {TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from "@/components/common/Button";
import {AuthProvider, useAuth} from "@/context/AuthContext";
import {format} from "date-fns";
import {upsertProfile} from "@/lib/Profile";
import {Profile} from "@/types/Profile";

const SplashScreen = () => {
  const {userProfile, login} = useAuth();
  const [username, setUsername] = useState<string>("");
  const [character, setCharacter] = useState<string>("수수");
  const [wakeUpTime, setWakeUpTime] = useState<Date>(new Date());
  const [bedTime, setBedTime] = useState<Date>(new Date());
  const [isWakeUpTimePickerVisible, setIsWakeUpTimePickerVisible] =
    useState<boolean>(false);
  const [isBedTimePickerVisible, setIsBedTimePickerVisible] =
    useState<boolean>(false);

  const showWakeUpTimePicker = () => setIsWakeUpTimePickerVisible(true);
  const hideWakeUpTimePicker = () => setIsWakeUpTimePickerVisible(false);
  const handleWakeUpTimeConfirm = (time: Date) => {
    setWakeUpTime(time);
    hideWakeUpTimePicker();
  };

  const showBedTimePicker = () => setIsBedTimePickerVisible(true);
  const hideBedTimePicker = () => setIsBedTimePickerVisible(false);
  const handleBedTimeConfirm = (time: Date) => {
    setBedTime(time);
    hideBedTimePicker();
  };

  const handleCharacterSelect = (selectedCharacter: string) =>
    setCharacter(selectedCharacter);

  const handleStart = async () => {
    try {
      if (!userProfile) {
        console.error("User profile not found.");
        return;
      }

      const wakeUpTimeFormatted = format(wakeUpTime, "HH:mm:ss");
      const bedTimeFormatted = format(bedTime, "HH:mm:ss");

      const profile: Profile = {
        id: userProfile.id,
        username,
        character,
        joinedat: new Date().toISOString(),
        wakeuptime: wakeUpTimeFormatted,
        bedtimetime: bedTimeFormatted,
      };

      await upsertProfile(profile);
      await login(profile);
    } catch (error) {
      console.error("Failed to start plan:", error);
    }
  };

  return (
    <AuthProvider>
      <Container>
        <InputContainer>
          <LogoContainer>
            <LogoImage />
          </LogoContainer>
          <CharacterLabel>캐릭터 선택</CharacterLabel>
          <CharacterContainer>
            <CharacterOption onPress={() => handleCharacterSelect("수수")}>
              <CharacterName>수수</CharacterName>
              <CharacterImage source={require("../assets/images/susu.png")} />
            </CharacterOption>
            <CharacterOption onPress={() => handleCharacterSelect("나비")}>
              <CharacterName>나비</CharacterName>
              <CharacterImage source={require("../assets/images/nabi.png")} />
            </CharacterOption>
          </CharacterContainer>
          {character === "수수" && (
            <CharacterDescription>
              시골 개 수수는 늘 털끝이 물든 꼬리를 흔들며 주인을 기다리고
              있어요.
            </CharacterDescription>
          )}
          {character === "나비" && (
            <CharacterDescription>
              새침한 검은냥이 나비는 언제나 눈을 동그랗게 뜨고 다녀요.
            </CharacterDescription>
          )}
          <InputBox>
            <Label>이름</Label>
            <StyledTextInput
              placeholder="이름을 입력하세요"
              value={username}
              onChangeText={setUsername}
            />
          </InputBox>
          <InputBox>
            <Label>일어날 시간</Label>
            <TouchableOpacity onPress={showWakeUpTimePicker}>
              <InputWrapper>
                <InputText>{format(wakeUpTime, "hh:mm a")}</InputText>
              </InputWrapper>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isWakeUpTimePickerVisible}
              mode="time"
              onConfirm={handleWakeUpTimeConfirm}
              onCancel={hideWakeUpTimePicker}
            />
          </InputBox>
          <InputBox>
            <Label>잘 시간</Label>
            <TouchableOpacity onPress={showBedTimePicker}>
              <InputWrapper>
                <InputText>{format(bedTime, "hh:mm a")}</InputText>
              </InputWrapper>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isBedTimePickerVisible}
              mode="time"
              onConfirm={handleBedTimeConfirm}
              onCancel={hideBedTimePicker}
            />
          </InputBox>
        </InputContainer>
        <Button
          text="계획 시작하기!"
          onPress={handleStart}
          size="lg"
          style={{marginBottom: 30}}
        />
      </Container>
    </AuthProvider>
  );
};

export default SplashScreen;

const Container = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background};
  padding-bottom: 50px;
`;

const InputContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background};
  margin-bottom: 50px;
`;

const LogoContainer = styled.View`
  position: absolute;
  top: 15px;
`;

const LogoImage = styled.Image.attrs({
  source: require("../assets/images/sagak_logo.png"),
})`
  width: 138px;
  height: 50px;
`;

const CharacterLabel = styled.Text`
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h2.fontFamily};
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 16px;
  padding-top: 90px;
`;

const CharacterContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 80%;
`;

const CharacterOption = styled.TouchableOpacity`
  align-items: center;
  margin: 16px 0;
`;

const CharacterImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const CharacterName = styled.Text`
  margin-top: 8px;
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h2.fontFamily};
  color: ${({theme}) => theme.colors.text};
`;

const CharacterDescription = styled.Text`
  text-align: center;
  margin-top: 8px;
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.text};
  width: 80%;
  word-break: keep-all;
  margin-bottom: 10px;
`;

const InputBox = styled.View`
  width: 80%;
  margin-top: 10px;
`;

const Label = styled.Text`
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h2.fontFamily};
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 8px;
`;

const StyledTextInput = styled.TextInput`
  background-color: ${({theme}) => theme.colors.card};
  width: 100%;
  border-radius: 10px;
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  padding: 10px;
  margin-bottom: 20px;
  color: ${({theme}) => theme.colors.text};
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border-color: ${({theme}) => theme.colors.border};
  padding: 10px;
  width: 100%;
  background-color: ${({theme}) => theme.colors.card};
  border-radius: 10px;
`;

const InputText = styled.Text`
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.n4};
`;
