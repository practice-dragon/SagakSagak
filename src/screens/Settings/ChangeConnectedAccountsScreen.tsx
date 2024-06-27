import LogoutIcon from "@/assets/icons/LogoutIcon";
import {useAuth} from "@/context/AuthContext";
import React from "react";
import {SafeAreaView, Text, TouchableOpacity} from "react-native";
import styled from "styled-components/native";

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
  const {logout} = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
