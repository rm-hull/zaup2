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

// We convert the protobuf int64 counter (bigint) to number to prevent issues
// with JSON serialization in use-local-storage
export type OTP = Omit<MigrationPayload_OtpParameters, "counter"> & {
  counter?: number;
} & Partial<CustomAttributes>;
