import { Box, SimpleGrid } from "@chakra-ui/react";
import autoAnimate from "@formkit/auto-animate";
import hash from "object-hash";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useHarmonicIntervalFn } from "react-use";
import useGeneralSettings from "../hooks/useGeneralSettings";
import useOtpParameters from "../hooks/useOtpParameters";
import { sortBy } from "../otp";
import { type OTP } from "../types";
import Card from "./Card";
import Search from "./Search";

interface GroupProps {
  filter?: (otp: OTP) => boolean;
  noData?: ReactNode;
}

function matches(otp: OTP, searchTerm?: string): boolean {
  if (searchTerm === undefined) {
    return true;
  }

  const searchTermLC = searchTerm.toLowerCase();
  const fieldsToSearch = [otp.name, otp.label, otp.issuer];
  return fieldsToSearch.some((field) => field?.toLowerCase().includes(searchTermLC));
}

export default function Group({ filter = () => true, noData }: GroupProps) {
  const { data = [] } = useOtpParameters();
  const [settings] = useGeneralSettings();
  const [refresh, setRefresh] = useState<number | undefined>(undefined);
  const parent = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<string | undefined>();

  const sortOrder = settings?.sortOrder ?? "name";
  const sortFn = sortBy[sortOrder];
  const filterPred = useCallback((otp: OTP) => filter(otp) && matches(otp, search), [filter, search]);
  const filtered = useMemo(() => sortFn(data)?.filter(filterPred), [data, filterPred, sortFn]);

  useEffect(() => {
    if (parent.current !== null) {
      const { enable, disable } = autoAnimate(parent.current);
      sortOrder === "name" ? disable() : enable();
    }
  }, [parent, sortOrder]);

  useHarmonicIntervalFn(() => {
    const now = Date.now();
    const seconds = Math.floor(now / 1000) % 60;
    const timeLeft = 29 - (seconds % 30);
    setRefresh(timeLeft === 0 ? now : undefined);
  }, 1000);

  if (filtered.length === 0 && noData !== undefined) {
    return noData;
  }

  return (
    <Box textAlign="center" fontSize="xl">
      <Search onChange={setSearch} />
      <SimpleGrid minChildWidth="320px" gap="10px" alignItems="start" ref={parent}>
        {filtered.map((otp: OTP) => (
          <Card key={hash(otp)} otp={otp} refresh={refresh} showQRCode={settings?.showQRCode} highlight={search} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
