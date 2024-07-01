import {create, StateCreator} from "zustand";
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
  fetchAllTasks,
} from "@/lib/supabaseAPI";
import {CategoryType, TaskType} from "@/types/Profile";

interface State {
  categories: CategoryType[];
  tasks: TaskType[];
  daytasks: TaskType[];
  loading: boolean;
  error: string | null;
}

interface Actions {
  fetchCategories: (userId: string, selectedDate: Date) => Promise<void>;
  addCategory: (
    newCategoryName: string,
    userProfile: {id: string},
    selectedDate: Date,
  ) => Promise<void>;
  updateCategory: (
    categoryId: number,
    updatedCategoryName: string,
    userId: string,
    selectedDate: Date,
  ) => Promise<void>;
  deleteCategory: (
    categoryId: number,
    userId: string,
    selectedDate: Date,
  ) => Promise<void>;
  fetchTasks: (
    userId: string,
    categoryId: number,
    selectedDate: Date,
  ) => Promise<void>;
  fetchAllTasks: (userId: string) => Promise<void>;
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
  deleteTask: (
    taskId: number,
    userId: string,
    categoryId: number,
    selectedDate: Date,
  ) => Promise<void>;
  updateTaskCompletedStatus: (
    taskId: number,
    userId: string,
    currentCompletedStatus: boolean,
    selectedDate: Date,
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

const createStore: StateCreator<State & Actions> = (set, get) => ({
  categories: [],
  tasks: [],
  daytasks: [],
  loading: false,
  error: null,

  fetchAllTasks: async (userId: string) => {
    set({loading: true, error: null});
    try {
      const data = await fetchAllTasks(userId);
      set(state => ({...state, daytasks: data}));
    } catch (error) {
      set({error: "Failed to fetch tasks"});
    } finally {
      set({loading: false});
    }
  },

  fetchTasks: async (
    userId: string,
    categoryId: number,
    selectedDate: Date,
  ) => {
    set({loading: true, error: null});
    try {
      const allTasks = await fetchTasks(userId, categoryId);
      const filteredTasks = allTasks.filter((task: TaskType) => {
        const taskDate = new Date(task.created_at || "").toDateString();
        return taskDate === selectedDate.toDateString();
      });
      set(state => ({...state, tasks: filteredTasks}));
    } catch (error) {
      set({error: "Failed to fetch tasks"});
    } finally {
      set({loading: false});
    }
  },

  fetchCategories: async (userId: string, selectedDate: Date) => {
    set({loading: true, error: null});
    try {
      const data = await fetchCategories(userId, selectedDate);
      set(state => ({...state, categories: data}));
    } catch (error) {
      set({error: "Failed to fetch categories"});
    } finally {
      set({loading: false});
    }
  },

  addCategory: async (
    newCategoryName: string,
    userProfile: {id: string},
    selectedDate: Date,
  ) => {
    set({loading: true, error: null});
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
        updateDayTasks(set, userProfile.id);
        const data = await fetchCategories(userProfile.id, selectedDate);
        set(state => ({...state, categories: data}));
      }
    } catch (error) {
      set({error: "Failed to add category"});
    } finally {
      set({loading: false});
    }
  },

  updateCategory: async (
    categoryId: number,
    updatedCategoryName: string,
    userId: string,
    selectedDate: Date,
  ) => {
    set({loading: true, error: null});
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
        updateTasksAndCategoriesAndDayTasks(
          set,
          userId,
          categoryId,
          selectedDate,
        );
      }
    } catch (error) {
      set({error: "Failed to update category"});
    } finally {
      set({loading: false});
    }
  },

  deleteCategory: async (
    categoryId: number,
    userId: string,
    selectedDate: Date,
  ) => {
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
        updateDayTasks(set, userId);
      }
      const data = await fetchCategories(userId, selectedDate);
      set(state => ({...state, categories: data}));
    } catch (error) {
      set({error: "Failed to delete category"});
    } finally {
      set({loading: false});
    }
  },

  addTask: async (
    userId: string,
    categoryId: number,
    title: string,
    selectedDate: Date,
    description?: string,
    reminderTime?: Date,
    repeatInterval?: string,
    durationInterval?: string,
    deadlineTime?: Date,
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
      if (success != null) {
        updateTasksAndCategoriesAndDayTasks(
          set,
          userId,
          categoryId,
          selectedDate,
        );
      }
    } catch (error) {
      set({error: "Failed to add task"});
    } finally {
      set({loading: false});
    }
  },

  deleteTask: async (
    taskId: number,
    userId: string,
    categoryId: number,
    selectedDate: Date,
  ) => {
    set({loading: true, error: null});
    try {
      await deleteTask(taskId);
      updateTasksAndCategoriesAndDayTasks(
        set,
        userId,
        categoryId,
        selectedDate,
      );
    } catch (error) {
      set({error: "Failed to delete task"});
    } finally {
      set({loading: false});
    }
  },

  updateTaskCompletedStatus: async (
    taskId: number,
    userId: string,
    currentCompletedStatus: boolean,
    selectedDate: Date,
  ) => {
    set({loading: true, error: null});
    try {
      await updateTaskCompletedStatus(taskId, currentCompletedStatus);
      set(state => ({
        ...state,
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? {...task, completed: !currentCompletedStatus}
            : task,
        ),
      }));
      updateTasksAndCategoriesAndDayTasks(set, userId, taskId, selectedDate);
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
    completed?: boolean,
  ) => {
    set({loading: true, error: null});
    try {
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
        completed,
      );
      updateTasksAndCategoriesAndDayTasks(
        set,
        userId,
        categoryId,
        selectedDate,
      );
    } catch (error) {
      set({error: "Failed to update task"});
    } finally {
      set({loading: false});
    }
  },
});

const updateTasksAndCategoriesAndDayTasks = async (
  set: any,
  userId: string,
  categoryId: number,
  selectedDate: Date,
) => {
  const tasks = await fetchTasks(userId, categoryId);
  set((state: State & Actions) => ({...state, tasks}));
  updateDayTasks(set, userId);
  const data = await fetchCategories(userId, selectedDate);
  set((state: State & Actions) => ({...state, categories: data}));
};

const updateDayTasks = async (set: any, userId: string) => {
  const daytasksData = await fetchAllTasks(userId);
  set((state: State & Actions) => ({...state, daytasks: daytasksData}));
};

const useStore = create<State & Actions, any>(devtools(createStore));

export default useStore;
