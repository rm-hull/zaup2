import { Box, SimpleGrid } from "@chakra-ui/react";
import hash from "object-hash";
import React, { useState } from "react";
import { useHarmonicIntervalFn } from "react-use";
import useOtpParameters from "../hooks/useOtpParameters";
import { sort } from "../otp";
import { OTP } from "../types";
import Card from "./Card";

type GroupProps = {
  filter?: (otp: OTP) => boolean;
};

export default function Group({ filter = () => true }: GroupProps): JSX.Element {
  const [otpParameters] = useOtpParameters();
  const [refresh, setRefresh] = useState<number | undefined>(undefined);
  useHarmonicIntervalFn(() => {
    const seconds = Math.floor(Date.now() / 1000) % 60;
    const timeLeft = 29 - (seconds % 30);
    setRefresh(timeLeft === 0 ? Date.now() : undefined);
  }, 1000);

  return (
    <Box textAlign="center" fontSize="xl">
      <SimpleGrid minChildWidth="320px" spacing="10px" alignItems="start">
        {sort(otpParameters)
          ?.filter(filter)
          .filter((otp) => !otp.archived)
          .map((otp) => (
            <Card key={hash(otp)} otp={otp} refresh={refresh} />
          ))}
      </SimpleGrid>
    </Box>
  );
}
