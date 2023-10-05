import { useTheme } from "@/hooks/useTheme";
import { formatCounter } from "@/lib/utils";

interface ICircleProps {
  color: string;
  percentage?: number;
}
export const Circle: React.FC<ICircleProps> = ({ color, percentage = 0 }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - percentage) * circ) / 100;
  return (
    <circle
      r={r}
      cx={100}
      cy={100}
      fill='transparent'
      stroke={strokePct !== circ ? color : "#20293a"} // remove color as 0% sets full circumference
      strokeWidth={".6rem"}
      strokeDasharray={circ}
      strokeDashoffset={percentage ? strokePct : 0}
      strokeLinecap='round'
    ></circle>
  );
};

interface IClockProps {
  currentSeconds: number;
  totalSeconds: number;
  color: string;
}
export const Clock: React.FC<IClockProps> = ({
  currentSeconds = 0,
  color,
  totalSeconds,
}) => {
  const percentage = (currentSeconds / totalSeconds) * 100;
  // Ensure the percentage is within the valid range [0, 100]
  const cleanPercentage = Math.min(100, Math.max(0, percentage));
  return (
    <svg width={200} height={200}>
      <g transform={`rotate(-90 ${"100 100"})`}>
        <Circle color='black' />
        <Circle color={color} percentage={cleanPercentage} />
      </g>
      <CircleText percentage={currentSeconds} />
    </svg>
  );
};

interface ITextProps {
  percentage: number;
}
export const CircleText: React.FC<ITextProps> = ({ percentage }) => {
  const { theme } = useTheme();
  return (
    <text
      x='50%'
      y='50%'
      dominantBaseline='central'
      textAnchor='middle'
      fontSize={"1em"}
      fill={theme === "light" ? "black" : "white"}
    >
      {formatCounter(percentage)}
    </text>
  );
};

export default Clock;
