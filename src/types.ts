import { MigrationPayload } from "./proto/migration_payload";

type CustomAttributes = {
  label: string;
  archived: boolean;
  tags: string[];
  lastUpdated: number;
  created: number;
  favicon: string;
  copyCount: number;
};

export type OTP = ReturnType<typeof MigrationPayload.OtpParameters.prototype.toObject> & Partial<CustomAttributes>;
