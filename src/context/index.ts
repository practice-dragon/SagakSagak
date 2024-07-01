import {create} from "zustand";
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
  categories: any;
  tasks: any;
  daytasks: any;
  loading: any;
  error: any;
  // categories: CategoryType[];
  // tasks: TaskType[];
  // loading: boolean;
  // error: string;
}

interface Actions {
  fetchCategories: any;
  addCategory: any;
  updateCategory: any;
  deleteCategory: any;
  fetchTasks: any;
  fetchAllTasks: any;
  addTask: any;
  deleteTask: any;
  updateTaskCompletedStatus: any;
  updateTask: any;

  /*
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
  
// 이거때매 시간 다잡아먹는다...
  */
}

const useStore = create<State & Actions>()(
  devtools(set => ({
    categories: [],
    tasks: [],
    daytasks: [],
    loading: false,
    error: null,

    fetchAllTasks: async (userId: string) => {
      set({loading: true, error: null});
      try {
        const data = await fetchAllTasks(userId);
        set({daytasks: data});
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
          if (task.created_at) {
            const taskDate = new Date(task.created_at).toDateString();
            return taskDate === selectedDate.toDateString();
          }
          return false;
        });
        set({tasks: filteredTasks});
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
        set({categories: data});
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
            categories: [...state.categories, newCategory],
          }));
          const daytasksData = await fetchAllTasks(userProfile.id);
          set({daytasks: daytasksData});
          const data = await fetchCategories(userProfile.id, selectedDate);
          set({categories: data});
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
        console.log(`Updating category with ID ${categoryId}...`);
        const updatedCategory = await updateCategory(
          categoryId,
          updatedCategoryName,
          userId,
        );
        if (updatedCategory) {
          set(state => ({
            ...state,
            categories: state.categories.map((cat: {id: number}) =>
              cat.id === categoryId ? updatedCategory : cat,
            ),
          }));
          const tasks = await fetchTasks(userId, categoryId);
          set({tasks});
          const daytasksData = await fetchAllTasks(userId);
          set({daytasks: daytasksData});
          const data = await fetchCategories(userId, selectedDate);
          set({categories: data});
        }
      } catch (error) {
        console.error("Error updating category:", error);
        set({error: "Failed to update category"});
      } finally {
        console.log("Update category operation completed.");
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
              (cat: {id: number}) => cat.id !== deletedCategoryId,
            ),
          }));
          const daytasksData = await fetchAllTasks(userId);
          set({daytasks: daytasksData});
        }
        const data = await fetchCategories(userId, selectedDate);
        set({categories: data});
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
      description: string | undefined,
      reminderTime: Date | undefined,
      repeatInterval: string | undefined,
      durationInterval: string | undefined,
      deadlineTime: Date | undefined,
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
          const tasks = await fetchTasks(userId, categoryId);
          set({tasks});
          const data = await fetchCategories(userId, selectedDate);
          set({categories: data});
          const daytasksData = await fetchAllTasks(userId);
          set({daytasks: daytasksData});
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
        const tasks = await fetchTasks(userId, categoryId);
        set({tasks});
        const data = await fetchCategories(userId, selectedDate);
        set({categories: data});
        const daytasksData = await fetchAllTasks(userId);
        set({daytasks: daytasksData});
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
          tasks: state.tasks.map((task: {id: number}) =>
            task.id === taskId
              ? {...task, completed: !currentCompletedStatus}
              : task,
          ),
        }));
        const data = await fetchCategories(userId, selectedDate);
        set({categories: data});
        const daytasksData = await fetchAllTasks(userId);
        set({daytasks: daytasksData});
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
      const tasks = await fetchTasks(userId, categoryId);
      set({tasks});
      const data = await fetchCategories(userId, selectedDate);
      set({categories: data});
      const daytasksData = await fetchAllTasks(userId);
      set({daytasks: daytasksData});
    },
  })),
);

export default useStore;
