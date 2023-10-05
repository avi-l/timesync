import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITimer {
  id: number;
  seconds: number;
  currentTime: number;
  isRunning: boolean;
  isPaused: boolean;
  timerInterval?: NodeJS.Timeout;
}

interface TimersState {
  timers: ITimer[];
  activeTimerIds: number[];
}
const STORAGE_KEY = "timersData";

export const saveTimersToLocalStorage = (timers: ITimer[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
};

export const loadTimersFromLocalStorage = () => {
  const timersJSON = localStorage.getItem(STORAGE_KEY);
  return timersJSON ? JSON.parse(timersJSON) : [];
};

const initialState: TimersState = {
  timers: loadTimersFromLocalStorage() || [],
  activeTimerIds: [],
};

const timersSlice = createSlice({
  name: "timers",
  initialState,
  reducers: {
    addTimer: (state, action: PayloadAction<number>) => {
      const newTimer: ITimer = {
        id: Date.now(),
        seconds: action.payload,
        currentTime: 0,
        isRunning: false,
        isPaused: false,
      };
      state.timers.push(newTimer);
      state.timers.sort((a, b) => b.seconds - a.seconds);
      saveTimersToLocalStorage(state.timers);
    },
    startTimers: (state) => {
      state.timers.forEach((timer) => {
        timer.isRunning = true;
      });
    },
    setTimerInterval: (
      state,
      action: PayloadAction<{ timerId: number; intervalId: NodeJS.Timeout }>
    ) => {
      const { timerId, intervalId } = action.payload;
      const timer = state.timers.find((t) => t.id === timerId);
      if (timer) {
        timer.timerInterval = intervalId;
      }
    },

    pauseTimers: (state) => {
      state.activeTimerIds.forEach((timerId) => {
        const timerToPause = state.timers.find((timer) => timer.id === timerId);
        if (timerToPause) {
          timerToPause.isPaused = true;
          clearInterval(timerToPause.timerInterval);
        }
      });
    },
    resumeTimers: (state) => {
      state.activeTimerIds.forEach(async (timerId) => {
        const timerToResume = state.timers.find(
          (timer) => timer.id === timerId
        );
        if (timerToResume) timerToResume.isPaused = false;
      });
    },
    stopTimers: (state) => {
      state.timers.forEach((timer) => {
        timer.isRunning = false;
        timer.isPaused = false;
        timer.currentTime = 0;
        clearInterval(timer.timerInterval);
      });
      state.activeTimerIds = [];
      saveTimersToLocalStorage(state.timers);
    },
    restartTimers: (state) => {
      state.timers.forEach((timer) => {
        timer.isRunning = false;
        timer.isPaused = false;
        timer.currentTime = 0;
        clearInterval(timer.timerInterval);
      });
    },
    updateTimerCurrentTime: (
      state,
      action: PayloadAction<{ timerId: number; currentTime: number }>
    ) => {
      const { timerId, currentTime } = action.payload;
      const timer = state.timers.find((t) => t.id === timerId);

      if (timer) {
        timer.currentTime = currentTime;
        timer.isRunning = currentTime < timer.seconds;
      }
      saveTimersToLocalStorage(state.timers);
    },
    setActiveTimer: (state, action: PayloadAction<number>) => {
      state.activeTimerIds = state.activeTimerIds
        ? [...state.activeTimerIds, action.payload]
        : [action.payload];
    },

    deleteTimer: (state, action: PayloadAction<number>) => {
      state.timers = state.timers
        .filter((timer) => timer.id !== action.payload)
        .sort((a, b) => b.seconds - a.seconds);
      saveTimersToLocalStorage(state.timers);
    },
    deleteAllTimers: (state) => {
      saveTimersToLocalStorage([]);
      state.timers = [];
    },
  },
});

export const {
  addTimer,
  startTimers,
  pauseTimers,
  resumeTimers,
  stopTimers,
  restartTimers,
  deleteTimer,
  deleteAllTimers,
  updateTimerCurrentTime,
  setActiveTimer,
  setTimerInterval,
} = timersSlice.actions;

export default timersSlice.reducer;
