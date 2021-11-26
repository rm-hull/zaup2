import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useHarmonicIntervalFn } from "react-use";
import { OTP } from "../types";
import Card from "./Card";

type GroupProps = {
  otpParameters?: OTP[];
};

export default function Group({ otpParameters }: GroupProps): JSX.Element {
  const { group } = useParams();
  const [tick, setTick] = useState(0);
  useHarmonicIntervalFn(() => setTick((prev) => prev + 1), 1000);
  // eslint-disable-next-line no-console
  console.log({ group });
  return (
    <Box textAlign="center" fontSize="xl">
      <SimpleGrid minChildWidth="320px" spacing="10px" alignItems="start">
        {otpParameters?.map((otp, index) => (
          <Card key={index} otp={otp} tick={tick} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
