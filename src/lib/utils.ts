import { AppDispatch, RootState } from "@/store";
import {
  setActiveTimer,
  setAnimationFrameId,
  updateTimerCurrentTime,
} from "@/store/timersSlice";
import { ITimer } from "@/store/timersSlice";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const startTimer = (timer: ITimer, dispatch: AppDispatch) => {
  let animationFrameId: number;
  let currentTime = 0;
  dispatch(setActiveTimer(timer.id));
  const updateTimer = (timestamp: number) => {
    const elapsedTime = Math.floor((timestamp - startTime) / 1000);
    currentTime = Math.min(timer.seconds, elapsedTime);
    dispatch(updateTimerCurrentTime({ timerId: timer.id, currentTime }));

    if (currentTime <= timer.seconds) {
      animationFrameId = requestAnimationFrame(updateTimer);
      dispatch(
        setAnimationFrameId({ timerId: timer.id, frameId: animationFrameId })
      );
    } else {
      // Timer has reached its duration, you can handle this here
      cancelAnimationFrame(animationFrameId);
      dispatch(setAnimationFrameId({ timerId: timer.id, frameId: 0 }));
    }
  };

  const startTime = performance.now();
  requestAnimationFrame(updateTimer);
};

export const activateTimers = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const timers = getState().timers.timers;

    // Call startTimer for the first timer
    startTimer(timers[0], dispatch);

    for (let i = 1; i < timers.length; i++) {
      const timer = timers[i];
      // start the delay to previous timer seconds minus this timers seconds
      const delay = timers[i - 1].seconds - timer.seconds;

      // Wait for delay before activating this timer
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      }
      startTimer(timer, dispatch);
    }
  };
};

export const resumeTimerInterval = (timer: ITimer, dispatch: AppDispatch) => {
  const resume = (startTime: number, elapsed: number) => {
    const currentTime = Math.min(timer.seconds, elapsed / 1000);

    dispatch(updateTimerCurrentTime({ timerId: timer.id, currentTime }));

    if (currentTime < timer.seconds) {
      const frameId = requestAnimationFrame((timestamp) => {
        resume(startTime, timestamp - startTime);
      });
      dispatch(setAnimationFrameId({ timerId: timer.id, frameId }));
    } else {
      // Timer has reached its duration
      dispatch(setAnimationFrameId({ timerId: timer.id, frameId: 0 }));
    }
  };

  const now = performance.now();
  resume(now, timer.currentTime * 1000); // Convert currentTime to milliseconds
};

// export const resumeTimerInterval = (timer: ITimer) => {
//   return (dispatch: AppDispatch) => {
//     cancelAnimationFrame(timer.animationFrameId);
//     dispatch(setActiveTimer(timer.id));
//     let currentTime = timer.currentTime;
//     const newInterval = setInterval(() => {
//       currentTime += 1;
//       dispatch(
//         updateTimerCurrentTime({
//           timerId: timer.id,
//           currentTime,
//         })
//       );
//       if (currentTime >= timer.seconds) {
//         cancelAnimationFrame(newInterval);
//       }
//     }, 1000);
//     dispatch(setAnimationFrameId({ timerId: timer.id, frameId: newInterval }));
//   };
// };

export const formatCounter = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = (value % 60).toFixed(0);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
