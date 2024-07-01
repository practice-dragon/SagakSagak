import create from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Profile} from "@/types/Profile";
import {createProfile, fetchProfile} from "@/lib/Profile";

interface AuthStore {
  isAuthenticated: boolean;
  userProfile: Profile | null;
  bedtimeExists: boolean;
  login: (profile: Profile) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>(set => ({
  isAuthenticated: false,
  userProfile: null,
  bedtimeExists: false,

  login: async (profile: Profile) => {
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

        set(state => ({
          isAuthenticated: true,
          userProfile: newProfile,
          bedtimeExists: false,
        }));
      } else {
        set(state => ({
          isAuthenticated: true,
          userProfile: existingProfile,
          bedtimeExists: !!existingProfile.bedtimetime,
        }));
      }

      await AsyncStorage.setItem("isAuthenticated", "true");
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    } catch (error) {
      console.error("Login error:", error);
    }
  },

  logout: async () => {
    set({
      isAuthenticated: false,
      userProfile: null,
      bedtimeExists: false,
    });

    await AsyncStorage.removeItem("isAuthenticated");
    await AsyncStorage.removeItem("userProfile");
  },

  checkAuthStatus: async () => {
    try {
      const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
      const userProfileJson = await AsyncStorage.getItem("userProfile");

      if (isAuthenticated === "true" && userProfileJson) {
        const userProfile = JSON.parse(userProfileJson);

        set(state => ({
          isAuthenticated: true,
          userProfile,
          bedtimeExists: !!userProfile.bedtimetime,
        }));
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  },
}));
