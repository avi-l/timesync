import { activateTimers } from "@/lib/utils";
import { AppDispatch } from "@/store";
import {
  pauseTimers,
  stopTimers,
  deleteAllTimers,
  resumeTimers,
  startTimers,
} from "@/store/timersSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

const useTimerActions = () => {
  const dispatch = useDispatch();
  const onStop = useCallback(() => {
    dispatch(stopTimers());
  }, [dispatch]);

  const onPause = () => dispatch(pauseTimers());
  const onDeleteAll = () => dispatch(deleteAllTimers());
  const onReset = () => onStop();

  const onResume = () => dispatch(resumeTimers());

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
