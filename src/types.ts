import { MigrationPayload } from "./proto/migration_payload";

export type OTP = ReturnType<typeof MigrationPayload.OtpParameters.prototype.toObject>;
