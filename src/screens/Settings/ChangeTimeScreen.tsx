import React, {useState, useEffect} from "react";
import {TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from "@/components/common/Button";
import {AuthProvider, useAuth} from "@/context/AuthContext";
import {updateProfileTimes} from "@/lib/Profile";
import {format, isValid, parseISO} from "date-fns";

const ChangeTimeScreen = () => {
  const {userProfile} = useAuth();
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [bedTime, setBedTime] = useState(new Date());
  const [isWakeUpTimePickerVisible, setIsWakeUpTimePickerVisible] =
    useState(false);
  const [isBedTimePickerVisible, setIsBedTimePickerVisible] = useState(false);

  useEffect(() => {
    if (userProfile?.wakeuptime) {
      const [hour, minute] = userProfile.wakeuptime.split(":");
      const parsedWakeUpTime = new Date();
      parsedWakeUpTime.setHours(parseInt(hour, 10));
      parsedWakeUpTime.setMinutes(parseInt(minute, 10));
      setWakeUpTime(parsedWakeUpTime);
    }
  }, [userProfile?.wakeuptime]);

  useEffect(() => {
    if (userProfile?.bedtimetime) {
      const [hour, minute] = userProfile.bedtimetime.split(":");
      const parsedBedTime = new Date();
      parsedBedTime.setHours(parseInt(hour, 10));
      parsedBedTime.setMinutes(parseInt(minute, 10));
      setBedTime(parsedBedTime);
    }
  }, [userProfile?.bedtimetime]);

  const handleWakeUpTimeConfirm = (time: Date) => {
    setWakeUpTime(time);
    hideWakeUpTimePicker();
  };

  const handleBedTimeConfirm = (time: Date) => {
    setBedTime(time);
    hideBedTimePicker();
  };

  const showWakeUpTimePicker = () => setIsWakeUpTimePickerVisible(true);
  const hideWakeUpTimePicker = () => setIsWakeUpTimePickerVisible(false);

  const showBedTimePicker = () => setIsBedTimePickerVisible(true);
  const hideBedTimePicker = () => setIsBedTimePickerVisible(false);

  const handleUpdateProfile = async () => {
    try {
      if (!userProfile) {
        console.error("User profile not found.");
        return;
      }

      const data = await updateProfileTimes(
        userProfile.id,
        wakeUpTime,
        bedTime,
      );
      console.log("Updated profile times:", data);
    } catch (error) {
      console.error("Failed to update profile times:", error);
    }
  };

  return (
    <AuthProvider>
      <Container>
        <InputWrapper>
          <Label>일어날 시간</Label>
          <TouchableOpacity onPress={showWakeUpTimePicker}>
            <InputText>{format(wakeUpTime, "HH:mm")}</InputText>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isWakeUpTimePickerVisible}
            mode="time"
            onConfirm={handleWakeUpTimeConfirm}
            onCancel={hideWakeUpTimePicker}
          />
          <Label>잘 시간</Label>
          <TouchableOpacity onPress={showBedTimePicker}>
            <InputText>{format(bedTime, "HH:mm")}</InputText>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isBedTimePickerVisible}
            mode="time"
            onConfirm={handleBedTimeConfirm}
            onCancel={hideBedTimePicker}
          />
        </InputWrapper>
        <Button size="lg" text="시간 수정하기" onPress={handleUpdateProfile} />
      </Container>
    </AuthProvider>
  );
};

export default ChangeTimeScreen;

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background};
  gap: 20px;
`;

const InputWrapper = styled.View`
  width: 80%;
  margin-top: 10px;
  gap: 20px;
`;

const InputText = styled.Text`
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.text};
  padding: 10px;
  background-color: ${({theme}) => theme.colors.card};
  border-radius: 10px;
`;

const Label = styled.Text`
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h2.fontFamily};
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 8px;
`;
