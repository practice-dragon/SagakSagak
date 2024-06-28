import {supabase} from "@/lib/supabase";
import {CategoryType} from "@/types/Profile";

export const fetchCategories = async (userId: string) => {
  const {data, error} = await supabase
    .from("categories")
    .select("*, todos (*)")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return [];
  } else {
    return data as CategoryType[];
  }
};

export const addCategory = async (
  newCategoryName: string,
  userProfile: {id: string},
  selectedDate: Date,
) => {
  const formattedDate = selectedDate.toISOString();

  try {
    const {error} = await supabase.from("categories").insert([
      {
        name: newCategoryName.trim(),
        user_id: userProfile.id,
        created_at: formattedDate,
      },
    ]);

    if (error) {
      console.error("Error adding category:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error adding category:", error);
    return false;
  }
};

export const updateCategory = async (
  categoryId: string,
  updatedCategoryName: string,
  userId: string,
) => {
  try {
    const {error} = await supabase
      .from("categories")
      .update({
        name: updatedCategoryName.trim(),
      })
      .eq("id", categoryId)
      .eq("user_id", userId);
    if (error) {
      console.error("Error updating category:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error updating category:", error);
    return false;
  }
};

export const deleteCategory = async (categoryId: string, userId: string) => {
  try {
    const {error} = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting category:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};

export const addTask = async (
  userId: string,
  taskTitle: string,
  categoryId: string,
  selectedDate: Date,
) => {
  const {data, error} = await supabase
    .from("todos")
    .insert([
      {
        title: taskTitle.trim(),
        category_id: categoryId,
        user_id: userId,
        created_at: selectedDate.toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error(error);
    return null;
  } else {
    return data;
  }
};

export const deleteTask = async (taskId: number) => {
  const {error} = await supabase
    .from("todos")
    .delete()
    .eq("id", taskId.toString());

  if (error) {
    console.error("Supabase delete error", error);
    return;
  }
};

export const updateTask = async (taskId: number, newTitle: string) => {
  const {data, error} = await supabase
    .from("todos")
    .update({title: newTitle})
    .eq("id", taskId.toString())
    .single();

  if (error) {
    console.error("Supabase update error", error);
    return;
  }
  return data;
};
