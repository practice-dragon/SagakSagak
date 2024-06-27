import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {
  login as kakaoLogin,
  logout as kakaoLogout,
  unlink as kakaoUnlink,
  getProfile as getKakaoProfile,
  KakaoProfile,
} from "@react-native-seoul/kakao-login";
import {supabase} from "@/lib/supabase";
import {useAuth} from "@/context/AuthContext";

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
      console.log("로그인 성공쓰", profile);
    } catch (err) {
      console.error("login err", err);
    }
  };

  const signOutWithKakao = async (): Promise<void> => {
    try {
      const message = await kakaoLogout();
      setResult(message);
      authLogout();
      console.log("로그아웃 성공쓰");
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
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={signInWithKakao}>
        <Text style={styles.text}>카카오 로그인</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={unlinkKakao}>
        <Text style={styles.text}>링크 해제</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={signOutWithKakao}>
        <Text style={styles.text}>카카오 로그아웃</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 100,
  },
  button: {
    backgroundColor: "#FEE500",
    borderRadius: 40,
    borderWidth: 1,
    width: 250,
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  text: {
    textAlign: "center",
  },
});
