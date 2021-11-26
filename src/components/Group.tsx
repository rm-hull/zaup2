import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import { useHarmonicIntervalFn } from "react-use";
import { OTP } from "../types";
import Card from "./Card";

type GroupProps = {
  otpParameters?: OTP[];
};

export default function Group({ otpParameters }: GroupProps): JSX.Element {
  // const { group } = useParams();
  const [refresh, setRefresh] = useState<number | undefined>(undefined);
  useHarmonicIntervalFn(() => {
    const seconds = Math.floor(Date.now() / 1000) % 60;
    const timeLeft = 29 - (seconds % 30);
    setRefresh(timeLeft === 0 ? Date.now() : undefined);
  }, 1000);

  return (
    <Box textAlign="center" fontSize="xl">
      <SimpleGrid minChildWidth="320px" spacing="10px" alignItems="start">
        {otpParameters?.map((otp, index) => (
          <Card key={index} otp={otp} refresh={refresh} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
