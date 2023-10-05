import { ITimer } from "@/store/timersSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCounter } from "@/lib/utils";
import Clock from "@/components/ui/circle";
import RemoveTimerBtn from "./RemoveTimerBtn";

const Timer: React.FC<ITimer> = ({ id, seconds, currentTime }) => {
  return (
    <Card className='m-1'>
      <CardHeader>
        <CardTitle> {formatCounter(seconds)} </CardTitle>
      </CardHeader>
      <CardContent className='flex items-center justify-center '>
        <div className='flex items-center justify-center'>
          <Clock
            currentSeconds={currentTime}
            color={"#3b82f6"}
            totalSeconds={seconds}
          />
        </div>
      </CardContent>
      <CardFooter className='flex items-center justify-center '>
        <RemoveTimerBtn id={id} />
      </CardFooter>
    </Card>
  );
};

export default Timer;
