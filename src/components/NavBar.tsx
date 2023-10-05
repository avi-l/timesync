import TimerControls from "./TimerControls";
import { ModeToggle } from "./ModeToggle";
import BrandLogo from "./BrandLogo";

const NavBar: React.FC = () => {
  return (
    <div className='flex justify-between items-center space-x-4 lg:space-x-6'>
      <BrandLogo />
      <TimerControls />
      <ModeToggle />
    </div>
  );
};

export default NavBar;
