import create from "zustand";
import {devtools} from "zustand/middleware";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addTask,
  deleteTask,
  updateTaskCompletedStatus,
  updateTask,
  fetchTasks,
} from "@/lib/supabaseAPI";
import {CategoryType, TaskType} from "@/types/Profile";

interface State {
  categories: CategoryType[];
  tasks: TaskType[];
  loading: boolean;
  error: string | null;
}

interface Actions {
  fetchCategories: (userId: string) => Promise<void>;
  addCategory: (
    newCategoryName: string,
    userProfile: {id: string},
    selectedDate: Date,
  ) => Promise<void>;
  updateCategory: (
    categoryId: number,
    updatedCategoryName: string,
    userId: string,
  ) => Promise<void>;
  deleteCategory: (categoryId: number, userId: string) => Promise<void>;

  fetchTasks: (userId: string, categoryId: number) => Promise<void>;
  addTask: (
    userId: string,
    categoryId: number,
    title: string,
    selectedDate: Date,
    description?: string,
    reminderTime?: Date,
    repeatInterval?: string,
    durationInterval?: string,
    deadlineTime?: Date,
  ) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  updateTaskCompletedStatus: (
    taskId: number,
    currentCompletedStatus: boolean,
  ) => Promise<void>;
  updateTask: (
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
  ) => Promise<void>;
}

const useStore = create<State & Actions>()(
  devtools(set => ({
    categories: [],
    tasks: [],
    loading: false,
    error: null,

    fetchTasks: async (userId: string, categoryId: number) => {
      set({loading: true, error: null});
      try {
        const data = await fetchTasks(userId, categoryId);
        set({tasks: data});
      } catch (error) {
        set({error: "Failed to fetch tasks"});
      } finally {
        set({loading: false});
      }
    },

    fetchCategories: async (userId: string) => {
      set({loading: true, error: null});
      try {
        const data = await fetchCategories(userId);
        set({categories: data});
      } catch (error) {
        set({error: "Failed to fetch categories"});
      } finally {
        set({loading: false});
      }
    },

    addCategory: async (newCategoryName, userProfile, selectedDate) => {
      set({loading: true, error: null});
      try {
        const newCategory = await addCategory(
          newCategoryName,
          userProfile,
          selectedDate,
        );
        if (newCategory) {
          set(state => ({
            categories: [...state.categories, newCategory],
          }));
        }
      } catch (error) {
        set({error: "Failed to add category"});
      } finally {
        set({loading: false});
      }
    },

    updateCategory: async (categoryId, updatedCategoryName, userId) => {
      set({loading: true, error: null});
      try {
        console.log(`Updating category with ID ${categoryId}...`);
        const updatedCategory = await updateCategory(
          categoryId,
          updatedCategoryName,
          userId,
        );
        console.log(`Updated category:`, updatedCategory);
        if (updatedCategory) {
          set(state => ({
            ...state,
            categories: state.categories.map(cat =>
              cat.id === categoryId ? updatedCategory : cat,
            ),
          }));
          const tasks = await fetchTasks(userId, categoryId);
          set({tasks});
        }
      } catch (error) {
        console.error("Error updating category:", error);
        set({error: "Failed to update category"});
      } finally {
        console.log("Update category operation completed.");
        set({loading: false});
      }
    },

    deleteCategory: async (categoryId, userId) => {
      set({loading: true, error: null});
      try {
        const deletedCategoryId = await deleteCategory(categoryId, userId);
        if (deletedCategoryId !== null) {
          set(state => ({
            ...state,
            categories: state.categories.filter(
              cat => cat.id !== deletedCategoryId,
            ),
          }));
        }
      } catch (error) {
        set({error: "Failed to delete category"});
      } finally {
        set({loading: false});
      }
    },

    addTask: async (
      userId,
      categoryId,
      title,
      selectedDate,
      description,
      reminderTime,
      repeatInterval,
      durationInterval,
      deadlineTime,
    ) => {
      set({loading: true, error: null});
      try {
        const success = await addTask(
          userId,
          categoryId,
          title,
          selectedDate,
          description,
          reminderTime,
          repeatInterval,
          durationInterval,
          deadlineTime,
        );
        if (success) {
          const tasks = await fetchTasks(userId, categoryId);
          set({tasks});
        }
      } catch (error) {
        set({error: "Failed to add task"});
      } finally {
        set({loading: false});
      }
    },

    deleteTask: async taskId => {
      set({loading: true, error: null});
      try {
        await deleteTask(taskId);
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== taskId),
        }));
      } catch (error) {
        set({error: "Failed to delete task"});
      } finally {
        set({loading: false});
      }
    },

    updateTaskCompletedStatus: async (taskId, currentCompletedStatus) => {
      set({loading: true, error: null});
      try {
        await updateTaskCompletedStatus(taskId, currentCompletedStatus);
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? {...task, completed: !currentCompletedStatus}
              : task,
          ),
        }));
      } catch (error) {
        set({error: "Failed to update task status"});
      } finally {
        set({loading: false});
      }
    },

    updateTask: async (
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
    ) => {
      await updateTask(
        userId,
        categoryId,
        taskId,
        title,
        selectedDate,
        description,
        reminderTime,
        repeatInterval,
        durationInterval,
        deadlineTime,
      );
      const tasks = await fetchTasks(userId, categoryId);
      set({tasks});
    },
  })),
);

export default useStore;
