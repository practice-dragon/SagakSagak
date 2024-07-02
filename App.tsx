import React, {useEffect} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createStackNavigator} from "@react-navigation/stack";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/Login/Intro";
import MainScreen from "./src/navigation/AppNavigator";
import {ThemeProvider} from "styled-components/native";
import {lightTheme} from "./src/styles/theme";
import {NavigationContainer} from "@react-navigation/native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useAuthStore} from "./src/context/authStore";
import useStore from "./src/context";
import {OneSignal} from "react-native-onesignal";

const App = () => {
  OneSignal.initialize("7804ee6b-77fe-4e0f-a2e5-874cb0f02fdf");
  OneSignal.Notifications.requestPermission(true);

  const queryClient = new QueryClient();
  const Stack = createStackNavigator();
  const {isAuthenticated, checkAuthStatus, bedtimeExists, userProfile} =
    useAuthStore();
  const {fetchAllTasks, fetchCategories} = useStore(state => ({
    fetchAllTasks: state.fetchAllTasks,
    fetchCategories: state.fetchCategories,
  }));
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      setIsCheckingAuth(false);
    };

    initializeAuth();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      fetchAllTasks(userProfile.id);
      fetchCategories(userProfile.id, new Date());
    }
  }, [isAuthenticated, fetchAllTasks, fetchCategories, userProfile]);

  if (isCheckingAuth) {
    return (
      <ThemeProvider theme={lightTheme}>
        <GestureHandlerRootView>
          <SplashScreen />
        </GestureHandlerRootView>
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <NavigationContainer>
          <GestureHandlerRootView>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              {!isAuthenticated ? (
                <Stack.Screen name="Login" component={LoginScreen} />
              ) : (
                <Stack.Screen
                  name={bedtimeExists ? "Main" : "Splash"}
                  component={bedtimeExists ? MainScreen : SplashScreen}
                />
              )}
            </Stack.Navigator>
          </GestureHandlerRootView>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
