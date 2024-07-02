import React, {useState, useEffect} from "react";
import {TouchableOpacity, Alert} from "react-native";
import styled from "styled-components/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from "@/components/common/Button";
import {format} from "date-fns";
import {updateProfileTimes} from "@/lib/Profile";
import useStore from "@/context";
import {useAuthStore} from "@/context/authStore";
import {OneSignal} from "react-native-onesignal";

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
      schedulePushNotification();
    } catch (error) {
      console.error("Failed to update profile times:", error);
    }
  };

  const schedulePushNotification = async () => {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic YzI1ZDllNmEtMmQ2My00MTU4LTliNmQtNzQxNWY4MzRhNzVj",
      },
      body: JSON.stringify({
        app_id: "7804ee6b-77fe-4e0f-a2e5-874cb0f02fdf",
        included_segments: ["All"],
        contents: {en: "Happy New Year!"},
        send_after: "2024-07-02 11:00:15 GMT-0830",
      }),
    });
    const data = await response.json();
    console.log(data);
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
