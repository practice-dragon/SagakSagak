import {supabase} from "@/lib/supabase";
import {Profile} from "@/types/Profile";

export const upsertProfile = async (profile: Profile) => {
  try {
    const {data, error} = await supabase.from("profiles").upsert([
      {
        id: profile.id,
        username: profile.username,
        joinedat: profile.joinedat,
        character: profile.character,
        wakeuptime: profile.wakeuptime,
        bedtimetime: profile.bedtimetime,
      },
    ]);

    console.log(data);
    if (error) {
      console.error("Error upserting profile:", error.message);
      throw new Error("Failed to upsert profile");
    }

    return data;
  } catch (error) {
    console.error("Error upserting profile:", error);
    throw new Error("Failed to upsert profile");
  }
};

export const fetchProfile = async (userId: string) => {
  try {
    const {data, error} = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return {data, error};
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {data: null, error};
  }
};

export const createProfile = async (profile: Profile) => {
  try {
    const {data, error} = await supabase.from("profiles").upsert([
      {
        id: profile.id,
        username: profile.username,
        joinedat: new Date().toISOString(),
      },
    ]);

    return {data, error};
  } catch (error) {
    console.error("Error creating profile:", error);
    return {data: null, error};
  }
};
