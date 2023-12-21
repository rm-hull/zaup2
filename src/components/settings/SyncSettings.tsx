import { useEffect, useState, type JSX } from "react";
import { type Payload } from "../../api/googleDrive";
// import { ipAddress } from "../../api/ipify";
import {
  Box,
  Button,
  HStack,
  Heading,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useToast,
} from "@chakra-ui/react";
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

export default function SyncSettings(): JSX.Element {
  const [processing, setProcessing] = useState(false);
  const [payload, setPayload] = useState<Payload>();
  const [settings, updateSettings] = useGeneralSettings();
  const { data = [], update } = useOtpParameters({ includeArchived: true });
  const { drive, login, error } = useGoogleDrive("zaup2_sync.json");
  const toast = useToast();
  const { activeStep, setActiveStep } = useSteps({ index: -1, count: steps.length });

  useEffect(() => {
    const process = async (): Promise<void> => {
      if (!processing) {
        return;
      }

      if (error !== undefined) {
        console.log({ error });
        setProcessing(false);
        setActiveStep(-1);
        toast({
          title: "Unable to sync with Google Drive",
          description: (error as Error).message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      if (drive !== undefined) {
        if (activeStep <= 0) {
          setActiveStep(1);
          return;
        }

        if (activeStep === 1) {
          setPayload(await drive.download());
          setActiveStep(2);
          return;
        }

        if (activeStep === 2) {
          await timeout(2000);
          setActiveStep(3);
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
          setActiveStep(4);
          toast({
            title: "Sync with Google Drive complete",
            description: `There were ${newOTPs.length - (payload?.otp ?? []).length} new OTPs added.`,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          update(...newOTPs);
          updateSettings(newSettings);
        }
      }
    };
    process().catch(console.error);
  }, [
    data,
    setProcessing,
    processing,
    error,
    toast,
    drive,
    setActiveStep,
    activeStep,
    settings,
    payload,
    update,
    updateSettings,
  ]);

  if (!(settings?.syncToGoogleDrive ?? false)) {
    return <></>;
  }

  const handleSync = (): void => {
    setActiveStep(0);
    setProcessing(true);
    if (drive === undefined) {
      login();
    }
    // setTimeout(() => {
    //   console.log("Timeout occurred, processing = " + processing);
    //   if (processing) {
    //     setProcessing(false);
    //     setActiveStep(-1);
    //     toast({
    //       title: "Unable to sync with Google Drive",
    //       description: "Timeout occurred",
    //       status: "error",
    //       duration: 9000,
    //       isClosable: true,
    //     });
    //   }
    // }, 20000);
  };

  return (
    <>
      <Heading size="md">Sync Settings</Heading>

      <HStack alignItems="flex-start" gap={50}>
        <Stepper index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        <Button isLoading={processing} loadingText="Syncing..." onClick={handleSync}>
          Sync Data
        </Button>
      </HStack>
    </>
  );
}
