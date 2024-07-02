import React, {useState, useEffect} from "react";
import {TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from "@/components/common/Button";
import {format} from "date-fns";
import {updateProfileTimes} from "@/lib/Profile";
import useStore from "@/context";
import {useAuthStore} from "@/context/authStore";

const parseTimeString = (timeString: string) => {
  const [time, offset] = timeString.split("+");
  const [hours, minutes, seconds] = time.split(":");
  const date = new Date();
  date.setUTCHours(parseInt(hours, 10));
  date.setUTCMinutes(parseInt(minutes, 10));
  date.setUTCSeconds(parseInt(seconds, 10));
  return date;
};

const ChangeTimeScreen = () => {
  const {userProfile} = useAuthStore();
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [bedTime, setBedTime] = useState(new Date());
  const [isWakeUpTimePickerVisible, setIsWakeUpTimePickerVisible] =
    useState(false);
  const [isBedTimePickerVisible, setIsBedTimePickerVisible] = useState(false);

  const {fetchCategories} = useStore(state => ({
    fetchCategories: state.fetchCategories,
  }));

  useEffect(() => {
    if (userProfile) {
      try {
        if (userProfile.wakeuptime) {
          setWakeUpTime(parseTimeString(userProfile.wakeuptime));
        }
        if (userProfile.bedtimetime) {
          setBedTime(parseTimeString(userProfile.bedtimetime));
        }
      } catch (error) {
        console.error("Failed to parse wakeup or bedtime:", error);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    fetchCategories("userId", new Date());
  }, [fetchCategories, wakeUpTime, bedTime]);

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
      await updateProfileTimes("userId", wakeUpTime, bedTime);
      console.log("Updated profile times successfully");
      // scheduleNotification(
      //   "일어날 시간입니다!",
      //   "오늘도 하루를 계획해보는 건 어때요?",
      //   wakeUpTime,
      // );
      // scheduleNotification(
      //   "잘 시간입니다!",
      //   "오늘 달성한 목표를 기록해봐요!",
      //   bedTime,
      // );
    } catch (error) {
      console.error("Failed to update profile times:", error);
    }
  };

  return (
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
