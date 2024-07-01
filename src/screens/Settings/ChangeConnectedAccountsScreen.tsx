import LogoutIcon from "@/assets/icons/LogoutIcon";
import React from "react";
import {SafeAreaView, Text, TouchableOpacity, Alert} from "react-native";
import styled from "styled-components/native";
import {logout as kakaoLogout} from "@react-native-seoul/kakao-login";
import {useAuthStore} from "@/context/authStore";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

const LogoutButton = styled.View`
  flex-direction: row;
  padding: 12px 16px;
  gap: 5px;
  align-items: center;
`;

const LogoutButtonText = styled.Text`
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.text};
`;

const ChangeConnectedAccountsScreen = () => {
  const {logout: authLogout, isAuthenticated} = useAuthStore();

  const handleLogout = async () => {
    if (!isAuthenticated) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const message = await kakaoLogout();
      console.log("Kakao Logout Message:", message);
      await authLogout();
      console.log("로그아웃 성공");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container>
      <TouchableOpacity onPress={handleLogout}>
        <LogoutButton>
          <LogoutIcon width={16} height={16} />
          <LogoutButtonText>로그아웃하기</LogoutButtonText>
        </LogoutButton>
      </TouchableOpacity>
    </Container>
  );
};

export default ChangeConnectedAccountsScreen;
