import { type MigrationPayload_OtpParameters } from "./gen/migration_payload_pb";

interface CustomAttributes {
  label: string;
  archived: boolean;
  tags: string[];
  lastUpdated: number;
  created: number;
  favicon: string;
  copyCount: number;
}

export type OTP = MigrationPayload_OtpParameters & Partial<CustomAttributes>;
