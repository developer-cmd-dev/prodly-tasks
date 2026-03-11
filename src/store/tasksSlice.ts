import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TasksState {
  items: Task[];
}

const loadFromStorage = (): Task[] => {
  try {
    const data = localStorage.getItem('monotask-tasks');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (tasks: Task[]) => {
  localStorage.setItem('monotask-tasks', JSON.stringify(tasks));
};

const initialState: TasksState = {
  items: loadFromStorage(),
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<string>) {
      const task: Task = {
        id: crypto.randomUUID(),
        text: action.payload,
        completed: false,
        createdAt: Date.now(),
      };
      state.items.push(task);
      saveToStorage(state.items);
    },
    toggleTask(state, action: PayloadAction<string>) {
      const task = state.items.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveToStorage(state.items);
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter(t => t.id !== action.payload);
      saveToStorage(state.items);
    },
    updateTask(state, action: PayloadAction<{ id: string; text: string }>) {
      const task = state.items.find(t => t.id === action.payload.id);
      if (task) {
        task.text = action.payload.text;
        saveToStorage(state.items);
      }
    },
  },
});

export const { addTask, toggleTask, deleteTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
