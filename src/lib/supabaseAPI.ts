import {supabase} from "@/lib/supabase";
import {CategoryType, TaskType} from "@/types/Profile";

export const fetchCategories = async (userId: string, selectedDate: Date) => {
  try {
    const {data: categories, error: categoriesError} = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId);

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError.message);
      throw new Error("Failed to fetch categories");
    }

    const categoriesWithTodos = await Promise.all(
      categories.map(async (category: {id: number}) => {
        const {data: todos, error: todosError} = await supabase
          .from("todos")
          .select("*")
          .eq("category_id", category.id)
          .gte(
            "created_at",
            new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString(),
          )
          .lte(
            "created_at",
            new Date(selectedDate.setHours(23, 59, 59, 999)).toISOString(),
          );

        if (todosError) {
          console.error(
            "Error fetching todos for category:",
            todosError.message,
          );
          return {...category, todos: []};
        }
        return {...category, todos};
      }),
    );

    return categoriesWithTodos;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
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
      .single()
      .select();

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
): Promise<CategoryType | null> => {
  try {
    const {data, error} = await supabase
      .from("categories")
      .update({name: updatedCategoryName.trim()})
      .eq("id", categoryId)
      .eq("user_id", userId)
      .single()
      .select();
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
): Promise<TaskType | null> => {
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
      .single();

    if (error) {
      console.error("Error adding task:", error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    const {error} = await supabase
      .from("todos")
      .delete()
      .eq("id", taskId.toString())
      .single();

    if (error) {
      console.error("Error deleting task:", error.message);
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
};

export const updateTaskCompletedStatus = async (
  taskId: number,
  currentCompletedStatus: boolean,
): Promise<void> => {
  try {
    const {data, error} = await supabase
      .from("todos")
      .update({completed: !currentCompletedStatus})
      .eq("id", taskId)
      .single();
    return data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw new Error("Failed to update task status");
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
): Promise<void> => {
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
      .eq("id", taskId)
      .single();

    if (error) {
      console.error("Error updating task:", error.message);
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
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
    return data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const fetchAllTasks = async (userId: string) => {
  try {
    const {data, error} = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching all tasks:", error.message);
      throw new Error("Failed to fetch all tasks");
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    throw new Error("Failed to fetch all tasks");
  }
};
