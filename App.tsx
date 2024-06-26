import React, {useState, useEffect} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/Login/Intro";
import MainScreen from "./src/navigation/AppNavigator";
import {supabase} from "./src/services/supabase";
import {ThemeProvider} from "styled-components/native";
import {lightTheme} from "./src/styles/theme";
import {NavigationContainer} from "@react-navigation/native";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const theme = lightTheme;
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const {data: user} = await supabase.auth.getUser();
        if (user.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setShowSplash(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          {showSplash ? (
            <SplashScreen />
          ) : isLoggedIn ? (
            <MainScreen />
          ) : (
            // <LoginScreen />
            <MainScreen />
          )}
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
