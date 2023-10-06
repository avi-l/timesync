import { resumeTimerInterval, activateTimers } from "@/lib/utils";
import { AppDispatch, RootState } from "@/store";
import {
  pauseTimers,
  stopTimers,
  deleteAllTimers,
  resumeTimers,
  startTimers,
} from "@/store/timersSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useTimerActions = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: RootState) => state.timers.timers);

  const onStop = useCallback(() => {
    dispatch(stopTimers());
  }, [dispatch]);

  const onPause = () => dispatch(pauseTimers());
  const onDeleteAll = () => dispatch(deleteAllTimers());
  const onReset = () => onStop();

  const onResume = () => {
    dispatch(resumeTimers());
    timers.forEach((timer) => {
      resumeTimerInterval(timer, dispatch);
    });
  };

  const onRestart = () => {
    onStop();
    onStart();
  };

  const onStart = async () => {
    dispatch(startTimers());
    (dispatch as AppDispatch)(activateTimers());
  };

  return {
    onPause,
    onStop,
    onDeleteAll,
    onReset,
    onResume,
    onRestart,
    onStart,
  };
};

export default useTimerActions;
