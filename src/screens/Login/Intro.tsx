import React, {useState} from "react";
import {Image, Pressable, Text} from "react-native";
import styled from "styled-components/native";
import {
  login as kakaoLogin,
  logout as kakaoLogout,
  unlink as kakaoUnlink,
  getProfile as getKakaoProfile,
  KakaoProfile,
} from "@react-native-seoul/kakao-login";
import {supabase} from "@/lib/supabase";
import {useAuth} from "@/context/AuthContext";
import {Button} from "@story/stories/Button/Button";

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 100px;
  background-color: ${({theme}) => theme.colors.background};
`;

const LogoContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled(Image).attrs({
  source: require("../../assets/images/sagak_logo.png"),
})`
  width: 138px;
  height: 50px;
`;

const TextContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin-top: 200px;
`;

const TextDescription = styled(Text)`
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h2.fontFamily};
  color: ${({theme}) => theme.colors.text};
  text-align: center;
`;

const ButtonContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const LoginScreen = () => {
  const [result, setResult] = useState<string>("");
  const {login: authLogin, logout: authLogout} = useAuth();

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await kakaoLogin();
      const profile: KakaoProfile = await getKakaoProfile();

      const {nickname, id} = profile;
      const {data: existingProfile, error} = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id.toString())
        .single();

      if (error) {
        console.error("Supabase select error", error);
        return;
      }

      if (!existingProfile) {
        const {data, error} = await supabase.from("profiles").upsert([
          {
            id: id.toString(),
            username: nickname,
            joinedat: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.error("Supabase upsert error", error);
          return;
        }
      }

      setResult(JSON.stringify(token));
      authLogin({id: id.toString(), username: nickname});
      console.log("로그인 성공", profile);
    } catch (err) {
      console.error("login err", err);
    }
  };

  const signOutWithKakao = async (): Promise<void> => {
    try {
      const message = await kakaoLogout();
      setResult(message);
      authLogout();
      console.log("로그아웃 성공");
    } catch (err) {
      console.error("signOut error", err);
    }
  };

  const unlinkKakao = async (): Promise<void> => {
    try {
      const message = await kakaoUnlink();
      setResult(message);
      authLogout();
    } catch (err) {
      console.error("unlink error", err);
    }
  };

  return (
    <Container>
      <LogoContainer>
        <LogoImage />
      </LogoContainer>
      <TextContainer>
        <TextDescription>오늘 하루를 계획해봅시다~</TextDescription>
      </TextContainer>
      <ButtonContainer>
        <Button
          size="lg"
          text="카카오 계정으로 로그인!"
          onPress={signInWithKakao}
          variant="primary"
        />
        {/* <Button onPress={signInWithKakao}>
          <ButtonText>카카오 로그인</ButtonText>
        </Button>
        <Button onPress={unlinkKakao}>
          <ButtonText>링크 해제</ButtonText>
        </Button>
        <Button onPress={signOutWithKakao}>
          <ButtonText>카카오 로그아웃</ButtonText>
        </Button> */}
      </ButtonContainer>
    </Container>
  );
};

export default LoginScreen;
