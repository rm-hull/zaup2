import { useEffect, useState, type JSX } from "react";
import { GoogleDrive, type Payload } from "../../api/googleDrive";
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
} from "@chakra-ui/react";
import useAccessToken from "../../hooks/useAccessToken";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import useOtpParameters from "../../hooks/useOtpParameters";

const steps = [
  { title: "Authenticate", description: "to Google Drive" },
  { title: "Download", description: "file" },
  { title: "Merge", description: "with local settings" },
  { title: "Upload", description: "file" },
];

async function timeout(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export default function TestUpload(): JSX.Element {
  const [processing, setProcessing] = useState(false);
  const [payload, setPayload] = useState<Payload>();
  const [settings] = useGeneralSettings();
  const { data = [] } = useOtpParameters();
  const { accessToken, login } = useAccessToken("https://www.googleapis.com/auth/drive.file");

  const { activeStep, setActiveStep } = useSteps({
    index: -1,
    count: steps.length,
  });

  useEffect(() => {
    const process = async (): Promise<void> => {
      if (accessToken !== undefined) {
        if (activeStep <= 0) {
          setActiveStep(1);
          return;
        }

        const drive = new GoogleDrive(accessToken, "zaup2_sync.json");

        if (activeStep === 1) {
          setPayload(await drive.download());
          setActiveStep(2);
          return;
        }

        if (activeStep === 2) {
          await timeout(5000);
          setActiveStep(3);
          return;
        }

        if (activeStep === 3) {
          await drive.upload({
            settings: { ...payload?.settings, ...settings },
            otp: [...(payload?.otp ?? []), ...data],
            lastSync: {
              on: new Date().toUTCString(),
              from: "TBC", // await ipAddress(),
              url: window.location.href,
            },
          });
          setProcessing(false);
          setActiveStep(4);
        }
      }
    };
    process().catch(console.error);
  }, [data, setProcessing, setActiveStep, activeStep, accessToken, settings, payload]);

  if (!(settings?.syncToGoogleDrive ?? false)) {
    return <></>;
  }

  const handleSync = (): void => {
    setActiveStep(-1);
    setProcessing(true);
    if (accessToken === undefined) {
      login();
    }
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
