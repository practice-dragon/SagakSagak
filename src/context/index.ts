import {create} from "zustand";
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
  daytasks: TaskType[];
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
  deleteTask: (
    taskId: number,
    userId: string,
    categoryId: number,
  ) => Promise<void>;
  updateTaskCompletedStatus: (
    taskId: number,
    userId: string,
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

const useStore = create(
  persist<State & Actions>(
    (set, get) => ({
      categories: [],
      tasks: [],
      daytasks: [],
      loading: false,
      error: null,

      fetchAllTasks: async (userId: string) => {
        set(state => ({...state, loading: true, error: null}));
        try {
          const data = await fetchAllTasks(userId);
          set(state => ({...state, daytasks: data}));
        } catch (error) {
          set(state => ({...state, error: "Failed to fetch tasks"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      fetchTasks: async (userId: string, categoryId: number) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
          const allTasks = await fetchTasks(userId, categoryId);
          const filteredTasks = allTasks.filter(
            (task: TaskType) =>
              new Date(task.created_at || "").toDateString() ===
              selectedDate.toDateString(),
          );
          set(state => ({...state, tasks: filteredTasks}));
        } catch (error) {
          set(state => ({...state, error: "Failed to fetch tasks"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      fetchCategories: async (userId: string) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
          const data = await fetchCategories(userId, selectedDate);
          set(state => ({...state, categories: data}));
        } catch (error) {
          set(state => ({...state, error: "Failed to fetch categories"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      addCategory: async (
        newCategoryName: string,
        userProfile: {id: string},
      ) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
          const newCategory = await addCategory(
            newCategoryName,
            userProfile,
            selectedDate,
          );
          if (newCategory) {
            set(state => ({
              ...state,
              categories: [...state.categories, newCategory],
            }));

            updateDayTasks(set, userProfile.id, selectedDate);
            const data = await fetchCategories(userProfile.id, selectedDate);
            set(state => ({...state, categories: data}));
          }
        } catch (error) {
          set(state => ({...state, error: "Failed to add category"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      updateCategory: async (
        categoryId: number,
        updatedCategoryName: string,
        userId: string,
      ) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
          const updatedCategory = await updateCategory(
            categoryId,
            updatedCategoryName,
            userId,
          );
          if (updatedCategory) {
            set(state => ({
              ...state,
              categories: state.categories.map(cat =>
                cat.id === categoryId ? updatedCategory : cat,
              ),
            }));
            updateTasksAndCategoriesAndDayTasks(set, userId, categoryId);
          }
        } catch (error) {
          set(state => ({...state, error: "Failed to update category"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      deleteCategory: async (categoryId: number, userId: string) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
          const deletedCategoryId = await deleteCategory(categoryId, userId);
          if (deletedCategoryId !== null) {
            set(state => ({
              ...state,
              categories: state.categories.filter(
                cat => cat.id !== deletedCategoryId,
              ),
            }));
            updateDayTasks(set, userId, selectedDate);
          }
          const data = await fetchCategories(userId, selectedDate);
          set(state => ({...state, categories: data}));
        } catch (error) {
          set(state => ({...state, error: "Failed to delete category"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      addTask: async (
        userId: string,
        categoryId: number,
        title: string,
        description?: string,
        reminderTime?: Date,
        repeatInterval?: string,
        durationInterval?: string,
        deadlineTime?: Date,
      ) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
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
            set(state => ({
              ...state,
              tasks: [...state.tasks, newTask],
            }));
            updateDayTasks(set, userId, selectedDate);
          }
        } catch (error) {
          set(state => ({...state, error: "Failed to add task"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      deleteTask: async (
        taskId: number,
        userId: string,
        categoryId: number,
      ) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
          const deletedTask = await deleteTask(taskId);
          if (deletedTask) {
            set(state => ({
              ...state,
              tasks: state.tasks.filter(task => task.id !== deletedTask.id),
            }));
            updateDayTasks(set, userId, selectedDate);
          }
        } catch (error) {
          set(state => ({...state, error: "Failed to delete task"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      updateTaskCompletedStatus: async (
        taskId: number,
        userId: string,
        currentCompletedStatus: boolean,
      ) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
          const updatedTask = await updateTaskCompletedStatus(
            taskId,
            currentCompletedStatus,
          );
          if (updatedTask) {
            set(state => ({
              ...state,
              tasks: state.tasks.map(task =>
                task.id === taskId ? updatedTask : task,
              ),
            }));
            updateDayTasks(set, userId, selectedDate);
          }
        } catch (error) {
          set(state => ({...state, error: "Failed to update task status"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },

      updateTask: async (
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
      ) => {
        const {selectedDate} = useDateStore.getState();
        set(state => ({...state, loading: true, error: null}));
        try {
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
            set(state => ({
              ...state,
              tasks: state.tasks.map(task =>
                task.id === taskId ? updatedTask : task,
              ),
            }));
            updateDayTasks(set, userId, selectedDate);
          }
        } catch (error) {
          set(state => ({...state, error: "Failed to update task"}));
        } finally {
          set(state => ({...state, loading: false}));
        }
      },
    }),
    {
      name: "dailyTask",
      getStorage: () => AsyncStorage,
    },
  ),
);

export default useStore;

const updateDayTasks = async (set: any, userId: string, selectedDate: Date) => {
  const {selectedDate: currentDate} = useDateStore.getState();
  set((state: any) => ({...state, loading: true, error: null}));
  try {
    const data = await fetchCategories(userId, currentDate);
    set((state: any) => ({
      ...state,
      categories: data,
    }));
  } catch (error) {
    set((state: any) => ({...state, error: "Failed to fetch day tasks"}));
  } finally {
    set((state: any) => ({...state, loading: false}));
  }
};

const updateTasksAndCategoriesAndDayTasks = async (
  set: any,
  userId: string,
  categoryId: number,
) => {
  const {selectedDate} = useDateStore.getState();
  set((state: any) => ({...state, loading: true, error: null}));
  try {
    const data = await fetchTasks(userId, categoryId);
    set((state: any) => ({
      ...state,
      tasks: data,
    }));
    updateDayTasks(set, userId, selectedDate);
  } catch (error) {
    set((state: any) => ({
      ...state,
      error: "Failed to update tasks, categories and day tasks",
    }));
  } finally {
    set((state: any) => ({...state, loading: false}));
  }
};
