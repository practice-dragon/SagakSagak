import {supabase} from "@/lib/supabase";
import {useQuery} from "@tanstack/react-query";

export const useGetUser = () => {
  return useQuery(["user"], async () => {
    const {data, error} = await supabase.from("users").select("*").single();
    if (error) {
      throw error;
    }
    return data;
  });
};
