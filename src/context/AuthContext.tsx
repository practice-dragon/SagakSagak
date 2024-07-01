import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Profile} from "@/types/Profile";
import {createProfile, fetchProfile} from "@/lib/Profile";

interface AuthContextProps {
  isAuthenticated: boolean;
  userProfile: Profile | null;
  login: (profile: Profile) => void;
  logout: () => void;
  checkAuthStatus: () => void;
  bedtimeExists: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [bedtimeExists, setBedtimeExists] = useState<boolean>(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (profile: Profile) => {
    try {
      const {data: existingProfile, error} = await fetchProfile(profile.id);

      if (error) {
        console.error("Supabase select error", error);
        return;
      }

      if (!existingProfile) {
        const {data: newProfile, error: insertError} = await createProfile(
          profile,
        );

        if (insertError) {
          console.error("Error inserting profile into PostgreSQL", insertError);
          return;
        }

        setUserProfile(newProfile);
        setBedtimeExists(false);
      } else {
        setUserProfile(existingProfile);
        setBedtimeExists(!!existingProfile.bedtimetime);
      }

      setIsAuthenticated(true);
      await AsyncStorage.setItem("isAuthenticated", "true");
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
      const userProfileJson = await AsyncStorage.getItem("userProfile");
      if (isAuthenticated === "true" && userProfileJson) {
        const userProfile = JSON.parse(userProfileJson);
        setIsAuthenticated(true);
        setUserProfile(userProfile);
        setBedtimeExists(!!userProfile.bedtimetime);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    await AsyncStorage.removeItem("isAuthenticated");
    await AsyncStorage.removeItem("userProfile");
    setBedtimeExists(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        login,
        logout,
        checkAuthStatus,
        bedtimeExists,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
