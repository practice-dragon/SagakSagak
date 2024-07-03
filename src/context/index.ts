import {create, StateCreator} from "zustand";
import {persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  fetchAllTasks,
} from "@/lib/supabaseAPI";
import {CategoryType, TaskType} from "@/types/Profile";
import {useDateStore} from "./DateStore";

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
  ) => Promise<void>;
  updateCategory: (
    categoryId: number,
    updatedCategoryName: string,
    userId: string,
  ) => Promise<void>;
  deleteCategory: (categoryId: number, userId: string) => Promise<void>;
  fetchTasks: (userId: string, categoryId: number) => Promise<void>;
  fetchAllTasks: (userId: string) => Promise<void>;
  addTask: (
    userId: string,
    categoryId: number,
    title: string,
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
    description?: string,
    reminderTime?: Date,
    repeatInterval?: string,
    durationInterval?: string,
    deadlineTime?: Date,
    completed?: boolean,
  ) => Promise<void>;
}

const useStore = create<State & Actions>(
  persist<State & Actions>(
    (set, get) => ({
      categories: [],
      tasks: [],
      loading: false,
      error: null,

      fetchCategories: async userId => {
        set({loading: true, error: null});
        try {
          const {selectedDate} = useDateStore.getState();
          const data = await fetchCategories(userId, selectedDate);
          set((state: State) => ({...state, categories: data}));
        } catch (error) {
          set({error: "Failed to fetch categories"});
        } finally {
          set({loading: false});
        }
      },

      addCategory: async (newCategoryName, userProfile) => {
        set({loading: true, error: null});
        try {
          const {selectedDate} = useDateStore.getState();
          const newCategory = await addCategory(
            newCategoryName,
            userProfile,
            selectedDate,
          );
          if (newCategory) {
            set((state: State) => ({
              ...state,
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
          const updatedCategory = await updateCategory(
            categoryId,
            updatedCategoryName,
            userId,
          );
          if (updatedCategory) {
            set((state: State) => ({
              ...state,
              categories: state.categories.map(cat =>
                cat.id === categoryId ? updatedCategory : cat,
              ),
            }));
          }
        } catch (error) {
          set({error: "Failed to update category"});
        } finally {
          set({loading: false});
        }
      },

      deleteCategory: async (categoryId, userId) => {
        set({loading: true, error: null});
        try {
          await deleteCategory(categoryId, userId);
          set((state: State) => ({
            ...state,
            categories: state.categories.filter(cat => cat.id !== categoryId),
          }));
        } catch (error) {
          set({error: "Failed to delete category"});
        } finally {
          set({loading: false});
        }
      },

      fetchTasks: async (userId, categoryId) => {
        set({loading: true, error: null});
        try {
          const allTasks = await fetchTasks(userId, categoryId);
          const {selectedDate} = useDateStore.getState();
          const filteredTasks = allTasks.filter(
            (task: {created_at: any}) =>
              new Date(task.created_at || "").toDateString() ===
              selectedDate.toDateString(),
          );
          set((state: State) => ({...state, tasks: filteredTasks}));
        } catch (error) {
          set({error: "Failed to fetch tasks"});
        } finally {
          set({loading: false});
        }
      },

      fetchAllTasks: async userId => {
        set({loading: true, error: null});
        try {
          const data = await fetchAllTasks(userId);
          set((state: State) => ({...state, tasks: data}));
        } catch (error) {
          set({error: "Failed to fetch tasks"});
        } finally {
          set({loading: false});
        }
      },

      addTask: async (
        userId,
        categoryId,
        title,
        description,
        reminderTime,
        repeatInterval,
        durationInterval,
        deadlineTime,
      ) => {
        set({loading: true, error: null});
        try {
          const {selectedDate} = useDateStore.getState();
          const newTask = await addTask(
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
          if (newTask) {
            set((state: State) => ({
              ...state,
              tasks: [...state.tasks, newTask],
            }));
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
          set((state: State) => ({
            ...state,
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
          const updatedTask = await updateTaskCompletedStatus(
            taskId,
            currentCompletedStatus,
          );
          if (updatedTask) {
            set((state: State) => ({
              ...state,
              tasks: state.tasks.map(task =>
                task.id === taskId ? updatedTask : task,
              ),
            }));
          }
        } catch (error) {
          set({error: "Failed to update task status"});
        } finally {
          set({loading: false});
        }
      },

      updateTask: async (
        userId,
        categoryId,
        taskId,
        title,
        description,
        reminderTime,
        repeatInterval,
        durationInterval,
        deadlineTime,
        completed,
      ) => {
        set({loading: true, error: null});
        try {
          const {selectedDate} = useDateStore.getState();
          const updatedTask = await updateTask(
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
            completed,
          );
          if (updatedTask) {
            set((state: State) => ({
              ...state,
              tasks: state.tasks.map(task =>
                task.id === taskId ? updatedTask : task,
              ),
            }));
          }
        } catch (error) {
          set({error: "Failed to update task"});
        } finally {
          set({loading: false});
        }
      },
    }),
    {
      name: "gogo",
      getStorage: () => AsyncStorage,
    },
  ) as unknown as StateCreator<State & Actions>,
);

export default useStore;
