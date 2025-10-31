import { Box, HStack, Heading, Steps, useSteps } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { type Payload } from "../../api/googleDrive";
// import { ipAddress } from "../../api/ipify";
import { Button } from "../../components/ui/button";
import { toaster } from "../../components/ui/toaster";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import useGoogleDrive from "../../hooks/useGoogleDrive";
import useOtpParameters from "../../hooks/useOtpParameters";
import { merge } from "../../otp";


const steps = [
  { title: "Authenticate", description: "to Google Drive" },
  { title: "Download", description: "file" },
  { title: "Merge", description: "with local settings" },
  { title: "Upload", description: "file" },
];

async function timeout(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SyncSettings() {
  const [processing, setProcessing] = useState(false);
  const [payload, setPayload] = useState<Payload>();
  const { settings, updateSettings } = useGeneralSettings();
  const { data = [], update } = useOtpParameters({ includeArchived: true });
  const { drive, login, error } = useGoogleDrive("zaup2_sync.json");
  const { value: activeStep, setStep } = useSteps({ count: steps.length });

  const handleError = useCallback(() => {
    console.log({ error });
    setProcessing(false);
    setStep(-1);
    toaster.create({
      title: "Unable to sync with Google Drive",
      description: (error as Error).message,
      type: "error",
      duration: 9000,
      closable: true,
    });
  }, [error, setStep]);

  const process = useCallback(async (): Promise<void> => {
    if (!processing) {
      return;
    }

    if (error !== undefined) {
      throw error as Error;
    }

    if (drive !== undefined) {
      if (activeStep <= 0) {
        setStep(1);
        return;
      }

      if (activeStep === 1) {
        setPayload(await drive.download());
        setStep(2);
        return;
      }

      if (activeStep === 2) {
        await timeout(2000);
        setStep(3);
        return;
      }

      if (activeStep === 3) {
        const newSettings = { ...payload?.settings, ...settings };
        const newOTPs = merge(payload?.otp ?? [], data);
        await drive.upload({
          settings: newSettings,
          otp: newOTPs,
          lastSync: {
            on: new Date().toUTCString(),
            from: "TBC", // await ipAddress(),
            url: window.location.href,
          },
        });
        setProcessing(false);
        setStep(4);
        toaster.create({
          title: "Sync with Google Drive complete",
          description: `There were ${newOTPs.length - (payload?.otp ?? []).length} new OTPs added.`,
          type: "success",
          duration: 9000,
          closable: true,
        });
        update(...newOTPs);
        void updateSettings(newSettings);
      }
    }
  }, [
    activeStep,
    data,
    drive,
    error,
    payload?.otp,
    payload?.settings,
    processing,
    setStep,
    settings,
    update,
    updateSettings,
  ]);

  useEffect(() => {
    process().catch(handleError);
  }, [handleError, process]);

  if (!(settings?.syncToGoogleDrive ?? false)) {
    return <></>;
  }

  const handleSync = (): void => {
    setStep(0);
    setProcessing(true);
    if (drive === undefined) {
      login();
    }
    // setTimeout(() => {
    //   console.log("Timeout occurred, processing = " + processing);
    //   if (processing) {
    //     setProcessing(false);
    //     setStep(-1);
    //     toast({
    //       title: "Unable to sync with Google Drive",
    //       description: "Timeout occurred",
    //       status: "error",
    //       duration: 9000,
    //       closable: true,
    //     });
    //   }
    // }, 20000);
  };

  return (
    <>
      <Heading size="md">Sync Settings</Heading>

      <HStack alignItems="flex-start" gap={50}>
        <Steps.Root count={steps.length} colorPalette="blue">
          <Steps.List>
            {steps.map((step, index) => (
              <Steps.Item key={index} index={index} title={step.title}>
                <Steps.Indicator />
                {/* <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                </Steps.Indicator> */}

                <Box flexShrink="0">
                  <Steps.Title>{step.title}</Steps.Title>
                  <Steps.Description>{step.description}</Steps.Description>
                </Box>

                <Steps.Separator />
              </Steps.Item>
            ))}
          </Steps.List>
        </Steps.Root>
        <Button loading={processing} loadingText="Syncing..." onClick={handleSync} variant="subtle">
          Sync Data
        </Button>
      </HStack>
    </>
  );
}
