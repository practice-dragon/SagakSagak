import {supabase} from "@/lib/supabase";
import {CategoryType, TaskType} from "@/types/Profile";

export const fetchCategories = async (
  userId: string,
): Promise<CategoryType[]> => {
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

    return data as CategoryType;
  } catch (error) {
    console.error("Error adding category:", error);
    return null;
  }
};

export const updateCategory = async (
  categoryId: number,
  updatedCategoryName: string,
  userId: string,
): Promise<CategoryType | null> => {
  try {
    const {data, error} = await supabase
      .from("categories")
      .update({
        name: updatedCategoryName.trim(),
      })
      .eq("id", categoryId)
      .eq("user_id", userId)
      .select() // select()를 추가하여 업데이트된 데이터를 반환합니다.
      .single();

    if (error) {
      console.error("Error updating category:", error.message);
      return null;
    }
    return data as CategoryType;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
};

export const deleteCategory = async (
  categoryId: number,
  userId: string,
): Promise<number | null> => {
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
    return categoryId; // 삭제된 카테고리의 ID를 반환합니다.
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
): Promise<boolean> => {
  try {
    const isoSelectedDate = selectedDate;
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
    return true;
  } catch (error) {
    console.error("Error adding task:", error);
    return false;
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
    const isoSelectedDate = selectedDate;
    const isoReminderTime = reminderTime
      ? reminderTime.toISOString()
      : undefined;
    const isoDeadlineTime = deadlineTime
      ? deadlineTime.toISOString()
      : undefined;

    const {error} = await supabase
      .from("todos")
      .update({
        id: taskId,
        user_id: userId,
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
      return [];
    }

    return data as TaskType[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
