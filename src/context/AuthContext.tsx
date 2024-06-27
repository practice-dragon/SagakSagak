import {createContext, useState, useContext, ReactNode, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {supabase} from "@/lib/supabase";
import {Profile} from "@/types/Profile";

interface AuthContextProps {
  isAuthenticated: boolean;
  userProfile: Profile | null;
  login: (profile: Profile) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (profile: Profile) => {
    const {data: existingProfile, error} = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.id)
      .single();

    if (error) {
      console.error("Supabase select error", error);
      return;
    }

    if (!existingProfile) {
      try {
        await supabase.from("profiles").upsert([
          {
            id: profile.id,
            username: profile.username,
            joinedat: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error("Error inserting profile into PostgreSQL", error);
        return;
      }
    }

    setIsAuthenticated(true);
    setUserProfile(profile);
    await AsyncStorage.setItem("isAuthenticated", "true");
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    await AsyncStorage.removeItem("isAuthenticated");
    await AsyncStorage.removeItem("userProfile");
  };

  const checkAuthStatus = async () => {
    const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
    const userProfile = await AsyncStorage.getItem("userProfile");
    if (isAuthenticated && userProfile) {
      setIsAuthenticated(true);
      setUserProfile(JSON.parse(userProfile));
    }
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, userProfile, login, logout, checkAuthStatus}}>
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
