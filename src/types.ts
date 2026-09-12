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

// Convert counter from bigint to number for JSON compatibility
export type OTP = Omit<MigrationPayload_OtpParameters, "counter"> & {
  counter?: number;
} & Partial<CustomAttributes>;
