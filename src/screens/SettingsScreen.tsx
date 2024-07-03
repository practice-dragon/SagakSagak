import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import styled from "styled-components/native";
import ChangeIcon from "@/assets/icons/ChangeIcon";
import ChatIcon from "@/assets/icons/ChatIcon";
import NotificationIcon from "@/assets/icons/NotificationIcon";
import ArrowIcon from "@/assets/icons/ArrowIcon";
import {SettingsStackParamList} from "@/types/route";
import {useNavigation, NavigationProp} from "@react-navigation/native";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

const SectionContainer = styled.View`
  padding: 16px;
  margin: 8px 0;
`;

const SectionTitle = styled.Text`
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 8px;
`;

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top-width: 1px;
  border-top-color: ${({theme}) => theme.colors.n2};
`;

const LeftContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const ItemText = styled.Text`
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.text};
`;

const ArrowContainer = styled.View``;

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp<SettingsStackParamList>>();

  const handleChangeConnectedAccounts = () => {
    navigation.navigate("ChangeConnectedAccounts");
  };

  const handleAdjustPushNotifications = () => {
    navigation.navigate("Notifications");
  };

  const handleSendFeedback = () => {
    Linking.openURL("https://forms.gle/L47oUi2mt6NP48AF7");
  };

  return (
    <Container>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{flex: 1}}>
        <SectionContainer>
          <SectionTitle>계정</SectionTitle>
          <TouchableOpacity onPress={handleChangeConnectedAccounts}>
            <ItemContainer>
              <LeftContainer>
                <ChangeIcon width={16} height={16} />
                <ItemText>계정 설정하기</ItemText>
              </LeftContainer>
              <ArrowContainer>
                <ArrowIcon width={16} height={16} />
              </ArrowContainer>
            </ItemContainer>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAdjustPushNotifications}>
            <ItemContainer>
              <LeftContainer>
                <NotificationIcon width={16} height={16} />
                <ItemText>알림 설정하기</ItemText>
              </LeftContainer>
              <ArrowContainer>
                <ArrowIcon width={16} height={16} />
              </ArrowContainer>
            </ItemContainer>
          </TouchableOpacity>
        </SectionContainer>
        <SectionContainer>
          <SectionTitle>고객 지원</SectionTitle>
          <TouchableOpacity onPress={handleSendFeedback}>
            <ItemContainer>
              <LeftContainer>
                <ChatIcon width={16} height={16} />
                <ItemText>건의하기</ItemText>
              </LeftContainer>
              <ArrowContainer>
                <ArrowIcon width={16} height={16} />
              </ArrowContainer>
            </ItemContainer>
          </TouchableOpacity>
        </SectionContainer>
      </ScrollView>
    </Container>
  );
};

export default SettingsScreen;
