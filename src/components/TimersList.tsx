import { RootState } from "@/store";
import { ITimer } from "@/store/timersSlice";
import { useSelector } from "react-redux";
import Timer from "@/components/Timer";

const TimersList: React.FC = () => {
  const timers = useSelector((state: RootState) => state.timers.timers);
  return (
    <div className='flex flex-wrap pt-10'>
      {timers?.map(
        ({ id, seconds, currentTime, isPaused, isRunning }: ITimer) => (
          <div key={id}>
            <Timer
              id={id}
              seconds={seconds}
              currentTime={currentTime}
              isPaused={isPaused}
              isRunning={isRunning}
            />
          </div>
        )
      )}
    </div>
  );
};

export default TimersList;
