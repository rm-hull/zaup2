import { Box, SimpleGrid } from "@chakra-ui/react";
import hash from "object-hash";
import React, { useMemo, useState } from "react";
import { useHarmonicIntervalFn } from "react-use";
import useGeneralSettings from "../hooks/useGeneralSettings";
import useOtpParameters from "../hooks/useOtpParameters";
import { sort } from "../otp";
import { OTP } from "../types";
import Card from "./Card";

type GroupProps = {
  filter?: (otp: OTP) => boolean;
};

export default function Group({ filter = () => true }: GroupProps): JSX.Element {
  const { data } = useOtpParameters();
  const [settings] = useGeneralSettings();
  const [refresh, setRefresh] = useState<number | undefined>(undefined);
  useHarmonicIntervalFn(() => {
    const now = Date.now();
    const seconds = Math.floor(now / 1000) % 60;
    const timeLeft = 29 - (seconds % 30);
    const overdue = now - (refresh ?? 0) > 40000;
    setRefresh(timeLeft === 0 || overdue ? now : undefined);
  }, 1000);

  const filtered = useMemo(() => sort(data)?.filter(filter), [data, filter]);

  return (
    <Box textAlign="center" fontSize="xl">
      <SimpleGrid minChildWidth="320px" spacing="10px" alignItems="start">
        {filtered.map((otp) => (
          <Card key={hash(otp)} otp={otp} refresh={refresh} showQRCode={settings?.showQRCode} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
