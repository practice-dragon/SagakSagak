import {supabase} from "@/services/supabase";
import React, {useState} from "react";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Input = styled.TextInput`
  width: 80%;
  height: 40px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 0 10px;
  margin: 10px 0;
`;

const LoginButton = styled.Button``;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Input value={email} onChangeText={setEmail} placeholder="Email" />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <LoginButton title="Login" onPress={handleLogin} />
    </Container>
  );
};

export default LoginScreen;
