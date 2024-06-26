import React, {useState, useEffect} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/Login/Intro";
import MainScreen from "./src/navigation/AppNavigator";
import {supabase} from "./src/services/supabase";
import {ThemeProvider} from "styled-components/native";
import {lightTheme} from "./src/styles/theme";

const queryClient = new QueryClient();
const Stack = createStackNavigator();

const App = () => {
  const theme = lightTheme;
  const [showLogin, setShowLogin] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const {data: user} = await supabase.auth.getUser();
        if (user) {
          setIsLoggedIn(true);
          setShowSplash(true);
        } else {
          setIsLoggedIn(false);
          setShowLogin(true);
        }
      } catch (error) {
        console.error("Supabase 세션 체크 오류:", error.message);
        setShowLogin(true);
      }
    };

    checkLogin();
  }, []);

  const onProfileRegistered = () => {
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {showLogin ? (
              <Stack.Screen name="Login" component={LoginScreen} />
            ) : showSplash ? (
              <Stack.Screen name="Splash" component={SplashScreen} />
            ) : (
              <Stack.Screen name="Main" component={MainScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
