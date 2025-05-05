import { Box, SimpleGrid } from "@chakra-ui/react";
import format from "format-duration";
import autoAnimate from "@formkit/auto-animate";
import hash from "object-hash";
import { useCallback, useEffect, useMemo, useRef, useState, type JSX } from "react";
import { useHarmonicIntervalFn } from "react-use";
import { getCachedFavicon } from "../favicons";
import useGeneralSettings from "../hooks/useGeneralSettings";
import useOtpParameters from "../hooks/useOtpParameters";
import { getEncodedSecret, getTotp, sortBy } from "../otp";
import { type OTP } from "../types";
import Card from "./Card";
import Search from "./Search";

interface GroupProps {
  filter?: (otp: OTP) => boolean;
  noData?: JSX.Element;
}

function matches(otp: OTP, searchTerm?: string): boolean {
  if (searchTerm === undefined) {
    return true;
  }

  const searchTermLC = searchTerm.toLowerCase();
  const fieldsToSearch = [otp.name, otp.label, otp.issuer];
  return fieldsToSearch.some((field) => field?.toLowerCase().includes(searchTermLC));
}

export default function Group({ filter = () => true, noData }: GroupProps): JSX.Element {
  const { data = [] } = useOtpParameters();
  const [settings] = useGeneralSettings();
  const [refresh, setRefresh] = useState<number | undefined>(undefined);
  const [otp, setOtp] = useState<OTP | undefined>(undefined);
  const encodedSecret = useMemo(() => getEncodedSecret(otp), [otp]);
  const totp = useMemo(() => getTotp(otp, encodedSecret), [otp, encodedSecret]);
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
    const overdue = now - (refresh ?? 0) > 40000;
    setRefresh(timeLeft === 0 || overdue ? now : undefined);

    if (settings?.enableNotifications === true && otp !== undefined) {
      const notification = new Notification(`${otp.issuer}: ${otp.name}`, {
        body: `${totp?.generate()} (${format(timeLeft * 1000)})`,
        tag: `zaup2`,
        icon: getCachedFavicon(otp),
        requireInteraction: true,
      });
      // notification.onclose = (event) => {
      //   console.log("onclose called", { event });
      //   setOtp(undefined);
      //   notification.close();
      // };
    }
  }, 1000);

  if (filtered.length === 0 && noData !== undefined) {
    return noData;
  }

  return (
    <Box textAlign="center" fontSize="xl">
      <Search onChange={setSearch} />
      <SimpleGrid minChildWidth="320px" spacing="10px" alignItems="start" ref={parent}>
        {filtered.map((otp: OTP) => (
          <Card
            key={hash(otp)}
            otp={otp}
            refresh={refresh}
            showQRCode={settings?.showQRCode}
            enableNotifications={settings?.enableNotifications}
            onNotify={() => {
              setOtp(otp);
            }}
            highlight={search}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
