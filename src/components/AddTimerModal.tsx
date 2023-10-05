import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTimer } from "@/store/timersSlice";

interface IAddTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTimerModal: React.FC<IAddTimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [seconds, setSeconds] = useState(0);
  const dispatch = useDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(event.target.value, 10);
    setSeconds(inputValue);
  };
  const saveTimer = () => {
    dispatch(addTimer(seconds));
    setSeconds(0);
    onClose();
  };
  return (
    <Modal
      title='Add Timer'
      description='Enter the number of seconds for timer'
      isOpen={isOpen}
      onClose={onClose}
    >
      {" "}
      <div className='flex items-center justify-center'>
        <Input
          className='w-[100px] '
          min={0}
          type='number'
          onChange={handleInputChange}
          value={seconds}
        />
      </div>
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button variant='ghost' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='default' onClick={saveTimer} disabled={!seconds}>
          Save Timer
        </Button>
      </div>
    </Modal>
  );
};
