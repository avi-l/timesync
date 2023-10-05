import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AddTimerModal } from "./AddTimerModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import useTimerActions from "@/hooks/useTimerActions";

const TimerControls: React.FC = () => {
  const [open, setOpen] = useState(false);
  const timers = useSelector((state: RootState) => state.timers.timers);
  const allTimersStopped = timers.every((timer) => !timer.isRunning);
  const isRunning = timers.some((timer) => timer.isRunning);
  const isPaused = timers.some((timer) => timer.isPaused);

  const {
    onPause,
    onStop,
    onDeleteAll,
    onReset,
    onResume,
    onRestart,
    onStart,
  } = useTimerActions();

  useEffect(() => {
    onStop();
  }, [onStop]);

  useEffect(() => {
    if (allTimersStopped) {
      onStop();
    }
  }, [allTimersStopped, onStop]);

  return (
    <div className='flex justify-between space-x-1'>
      <AddTimerModal isOpen={open} onClose={() => setOpen(false)} />
      <Button onClick={() => setOpen(true)} disabled={isRunning || isPaused}>
        Add New
      </Button>
      {timers?.length > 0 && (
        <>
          <Button onClick={isRunning ? onRestart : onReset}>
            {isRunning ? "Restart" : "Reset"}
          </Button>
          <Button onClick={isRunning && !allTimersStopped ? onStop : onStart}>
            {isRunning && !allTimersStopped ? "Stop" : "Start"}
          </Button>
          <Button disabled={!isRunning} onClick={isPaused ? onResume : onPause}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            disabled={isRunning || !timers.length}
            onClick={onDeleteAll}
            variant={"destructive"}
          >
            Delete All
          </Button>
        </>
      )}
    </div>
  );
};

export default TimerControls;
