import format from "format-duration";
import { useState, type JSX } from "react";
import { useHarmonicIntervalFn } from "react-use";
import { useColorModeValue } from "@/components/ui/color-mode";
import { ProgressCircleRing, ProgressCircleRoot, ProgressCircleValueText } from "@/components/ui/progress-circle";

interface CountdownTimerProps {
  duration: number;
}

const getColor = (timeLeft: number): string => {
  if (timeLeft > 10 || timeLeft === 0) return "green.300";
  else if (timeLeft > 5) return "orange.300";
  else return "red.400";
};

const calcTimeLeft = (duration: number): number => {
  const seconds = Math.floor(Date.now() / 1000) % 60;
  return duration - 1 - (seconds % duration);
};

export default function CountdownTimer({ duration }: CountdownTimerProps): JSX.Element {
  const [timeLeft, setTimeLeft] = useState<number>(calcTimeLeft(duration));
  useHarmonicIntervalFn(() => {
    setTimeLeft(calcTimeLeft(duration));
  }, 500);

  return (
    <ProgressCircleRoot value={timeLeft} size="md" css={{ "--thickness": "12px" }}>
      <ProgressCircleRing
        trackColor={useColorModeValue("gray.100", "gray.600")}
        max={duration}
        color={getColor(timeLeft)}
      />
      <ProgressCircleValueText>{format(timeLeft * 1000)}</ProgressCircleValueText>
    </ProgressCircleRoot>
  );
}
