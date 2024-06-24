// App.tsx
import React, {useState, useEffect} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import MainScreen from "./src/navigation/AppNavigator";
import {supabase} from "./src/services/supabase";

const queryClient = new QueryClient();

const App: React.FC = () => {
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
      {showSplash ? (
        <SplashScreen />
      ) : isLoggedIn ? (
        <MainScreen />
      ) : (
        <LoginScreen />
      )}
    </QueryClientProvider>
  );
};

export default App;
