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
  categoryId: number,
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

export const deleteCategory = async (categoryId: number, userId: string) => {
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
  title: string,
  categoryId: number,
  selectedDate: Date,
) => {
  const formattedDate = selectedDate.toISOString();

  try {
    const {data, error} = await supabase.from("todos").insert([
      {
        title: title.trim(),
        user_id: userId,
        category_id: categoryId,
        completed: false,
        created_at: formattedDate,
      },
    ]);

    if (error) {
      console.error("Error adding task:", error.message);
      return null;
    }

    if (data && data.length > 0) {
      console.log("Task added successfully:", data[0]);
      return data[0]; // Return the inserted task data
    } else {
      console.error("Failed to add task.");
      return null;
    }
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
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
