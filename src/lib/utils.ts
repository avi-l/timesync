import { AppDispatch, RootState } from "@/store";
import {
  setActiveTimer,
  setTimerInterval,
  updateTimerCurrentTime,
} from "@/store/timersSlice";
import { ITimer } from "@/store/timersSlice";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const activateTimers = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const timers = getState().timers.timers;
    dispatch(setActiveTimer(timers[0].id));
    let currentTime = 0;
    const interval = setInterval(() => {
      currentTime += 1;
      dispatch(updateTimerCurrentTime({ timerId: timers[0].id, currentTime }));

      if (currentTime >= timers[0].seconds) {
        clearInterval(interval);
      }
    }, 1000);
    dispatch(setTimerInterval({ timerId: timers[0].id, intervalId: interval }));
    //add the next timers
    for (let i = 1; i < timers.length; i++) {
      const timer = timers[i];
      // start the delay to previous timer seconds minus this timers seconds
      const delay = timers[i - 1].seconds - timer.seconds;

      // Wait for delay before activating this timer
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      }

      dispatch(setActiveTimer(timer.id)); //activate this timer
      let currentTime = 0;
      const interval = setInterval(() => {
        currentTime += 1;
        dispatch(updateTimerCurrentTime({ timerId: timer.id, currentTime }));

        if (currentTime >= timer.seconds) {
          clearInterval(interval);
        }
      }, 1000);
      // Dispatch the setTimerInterval action to store the interval ID
      dispatch(setTimerInterval({ timerId: timer.id, intervalId: interval }));
    }
  };
};

export const resumeTimerInterval = (timer: ITimer) => {
  return (dispatch: AppDispatch) => {
    clearInterval(timer.timerInterval);
    dispatch(setActiveTimer(timer.id));
    let currentTime = timer.currentTime;
    const newInterval = setInterval(() => {
      currentTime += 1;
      dispatch(
        updateTimerCurrentTime({
          timerId: timer.id,
          currentTime,
        })
      );
      if (currentTime >= timer.seconds) {
        clearInterval(newInterval);
      }
    }, 1000);
    dispatch(setTimerInterval({ timerId: timer.id, intervalId: newInterval }));
  };
};

export const formatCounter = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
