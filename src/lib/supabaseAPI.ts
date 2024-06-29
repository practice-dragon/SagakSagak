import {supabase} from "@/lib/supabase";
import {CategoryType, TaskType} from "@/types/Profile";

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
  description?: string,
  reminderTime?: Date,
  repeatInterval?: string,
  durationInterval?: string,
  deadlineTime?: Date,
) => {
  try {
    const isoSelectedDate = selectedDate.toISOString();
    const isoReminderTime = reminderTime
      ? reminderTime.toISOString()
      : undefined;
    const isoDeadlineTime = deadlineTime
      ? deadlineTime.toISOString()
      : undefined;
    const {data, error} = await supabase.from("todos").insert([
      {
        title: title.trim(),
        user_id: userId,
        category_id: categoryId,
        completed: false,
        created_at: isoSelectedDate,
        description: description?.trim(),
        reminder_time: isoReminderTime,
        repeat_interval: repeatInterval,
        duration_interval: durationInterval,
        deadline_time: isoDeadlineTime,
      },
    ]);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error adding task:", error);
    return {error};
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
