import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITimer {
  id: number;
  seconds: number;
  currentTime: number;
  isRunning: boolean;
  isPaused: boolean;
  animationFrameId?: number;
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
    stopTimers: (state) => {
      state.activeTimerIds = [];
      state.timers.forEach((timer) => {
        timer.isRunning = false;
        timer.isPaused = false;
        timer.currentTime = 0;
        const frameId = timer?.animationFrameId;
        console.log("frameId", frameId);
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
        timer.animationFrameId = undefined;
      });

      saveTimersToLocalStorage(state.timers);
    },
    setAnimationFrameId: (
      state,
      action: PayloadAction<{
        timerId: number;
        frameId: number | undefined;
      }>
    ) => {
      const { timerId, frameId } = action.payload;
      const timer = state.timers.find((t) => t.id === timerId);
      if (timer) {
        timer.animationFrameId = frameId;
      }
    },

    pauseTimers: (state) => {
      state.activeTimerIds.forEach((timerId) => {
        const timerToPause = state.timers.find((timer) => timer.id === timerId);
        if (timerToPause) {
          timerToPause.isPaused = true;
          cancelAnimationFrame(timerToPause.animationFrameId as number);
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

    restartTimers: (state) => {
      state.timers.forEach((timer) => {
        timer.isRunning = false;
        timer.isPaused = false;
        timer.currentTime = 0;
        cancelAnimationFrame(timer.animationFrameId as number);
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
  setAnimationFrameId,
} = timersSlice.actions;

export default timersSlice.reducer;
