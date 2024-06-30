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
    return data;
  }
};

export const addCategory = async (
  newCategoryName: string,
  userProfile: {id: string},
  selectedDate: Date,
): Promise<CategoryType | null> => {
  const formattedDate = selectedDate.toISOString();

  try {
    const {data, error} = await supabase
      .from("categories")
      .insert([
        {
          name: newCategoryName.trim(),
          user_id: userProfile.id,
          created_at: formattedDate,
        },
      ])
      .select()
      .single();
    if (error) {
      console.error("Error adding category:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error adding category:", error);
    return null;
  }
};

export const updateCategory = async (
  categoryId: number,
  updatedCategoryName: string,
  userId: string,
) => {
  try {
    const {data, error} = await supabase
      .from("categories")
      .update({
        name: updatedCategoryName.trim(),
      })
      .eq("id", categoryId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
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
      return null;
    }
    return categoryId;
  } catch (error) {
    console.error("Error deleting category:", error);
    return null;
  }
};

export const addTask = async (
  userId: string,
  categoryId: number,
  title: string,
  selectedDate: Date,
  description?: string,
  reminderTime?: Date,
  repeatInterval?: string,
  durationInterval?: string,
  deadlineTime?: Date,
): Promise<void> => {
  try {
    const isoSelectedDate = selectedDate.toISOString();
    const isoReminderTime = reminderTime
      ? reminderTime.toISOString()
      : undefined;
    const isoDeadlineTime = deadlineTime
      ? deadlineTime.toISOString()
      : undefined;

    const {data, error} = await supabase
      .from("todos")
      .insert([
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
      ])
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error adding task:", error);
    return;
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

export const updateTaskCompletedStatus = async (
  taskId: number,
  currentCompletedStatus: boolean,
) => {
  const {error} = await supabase
    .from("todos")
    .update({completed: !currentCompletedStatus})
    .eq("id", taskId.toString())
    .single();

  if (error) {
    console.error("Supabase delete error", error);
    return;
  }
};

export const updateTask = async (
  userId: string,
  categoryId: number,
  taskId: number,
  title: string,
  selectedDate: Date,
  description?: string,
  reminderTime?: Date,
  repeatInterval?: string,
  durationInterval?: string,
  deadlineTime?: Date,
  completed?: boolean,
) => {
  try {
    const isoSelectedDate = selectedDate.toISOString();
    const isoReminderTime = reminderTime
      ? reminderTime.toISOString()
      : undefined;
    const isoDeadlineTime = deadlineTime
      ? deadlineTime.toISOString()
      : undefined;

    const {error} = await supabase
      .from("todos")
      .update({
        title: title.trim(),
        category_id: categoryId,
        completed: completed || false,
        created_at: isoSelectedDate,
        description: description?.trim(),
        reminder_time: isoReminderTime,
        repeat_interval: repeatInterval,
        duration_interval: durationInterval,
        deadline_time: isoDeadlineTime,
      })
      .eq("id", taskId.toString());

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return {error};
  }
};

export const fetchTasks = async (userId: string, categoryId: number) => {
  try {
    const {data, error} = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .eq("category_id", categoryId);

    if (error) {
      console.error("Error fetching tasks:", error.message);
      throw new Error("Failed to fetch tasks");
    }
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};
