import { deleteTimer } from "@/store/timersSlice";

import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";

interface IRemoveTimerBtnProps {
  id: number;
}
const RemoveTimerBtn: React.FC<IRemoveTimerBtnProps> = ({ id }) => {
  const dispatch = useDispatch();
  const onRemove = () => {
    dispatch(deleteTimer(id));
  };
  return (
    <Button onClick={onRemove} variant={"destructive"}>
      Remove Timer
    </Button>
  );
};

export default RemoveTimerBtn;
