import React, {useEffect, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createStackNavigator} from "@react-navigation/stack";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/Login/Intro";
import MainScreen from "./src/navigation/AppNavigator";
import {AuthProvider, useAuth} from "./src/context/AuthContext";
import {ThemeProvider} from "styled-components/native";
import {lightTheme} from "./src/styles/theme";
import {NavigationContainer} from "@react-navigation/native";

const App = () => {
  const queryClient = new QueryClient();
  const Stack = createStackNavigator();

  const AuthNavigator = () => {
    const {isAuthenticated, checkAuthStatus} = useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
      const initializeAuth = async () => {
        await checkAuthStatus();
        setIsCheckingAuth(false);
        console.log("isCheckingAuth", isCheckingAuth);
      };

      initializeAuth();
    }, []);

    if (isCheckingAuth) {
      return <SplashScreen />;
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // headerTitleStyle: {fontSize: 45, backgroundColor: "red"},
        }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={lightTheme}>
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
