import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import format from "format-duration";
import React, { useState } from "react";
import { useHarmonicIntervalFn } from "react-use";

type CountdownTimerProps = {
  duration: number;
};

const getColor = (timeLeft: number) => {
  if (timeLeft > 10 || timeLeft === 0) return "green.300";
  else if (timeLeft > 5) return "orange.300";
  else return "red.400";
};

const calcTimeLeft = (duration: number) => {
  const seconds = Math.floor(Date.now() / 1000) % 60;
  return duration - 1 - (seconds % duration);
};

export default function CountdownTimer({ duration }: CountdownTimerProps): JSX.Element {
  const [timeLeft, setTimeLeft] = useState<number>(calcTimeLeft(duration));
  useHarmonicIntervalFn(() => setTimeLeft(calcTimeLeft(duration)), 1000);

  return (
    <CircularProgress value={(timeLeft * 100) / duration} color={getColor(timeLeft)} size="70px" thickness="12px">
      <CircularProgressLabel>{format(timeLeft * 1000)}</CircularProgressLabel>
    </CircularProgress>
  );
}
