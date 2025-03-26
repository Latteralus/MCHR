import { EntitySchema } from "typeorm";

// Enum for compliance type
export const ComplianceType = {
  LICENSE: "license",
  CERTIFICATION: "certification",
  TRAINING: "training",
  BACKGROUND_CHECK: "background_check",
  POLICY_ACKNOWLEDGEMENT: "policy_acknowledgement",
  HEALTH_SCREENING: "health_screening",
  HIPAA_TRAINING: "hipaa_training",
  REVIEW: "review",
  OTHER: "other"
};

// Enum for compliance status
export const ComplianceStatus = {
  VALID: "valid",
  EXPIRING_SOON: "expiring_soon",
  EXPIRED: "expired",
  PENDING: "pending",
  INCOMPLETE: "incomplete",
  NOT_REQUIRED: "not_required"
};

// Class definition for IntelliSense/typing
export class Compliance {
  id;
  title;
  type;
  status;
  description;
  issueDate;
  expirationDate;
  issuingAuthority;
  licenseNumber;
  employee;
  employeeId;
  documentId;
  healthData;
  requiresEncryption;
  reminderDays;
  remindersEnabled;
  lastReminderSent;
  verifiedById;
  verifiedAt;
  createdAt;
  updatedAt;
  accessLog;
}

// Entity Schema definition for TypeORM
export const ComplianceEntity = new EntitySchema({
  name: "Compliance",
  target: Compliance,
  tableName: "compliance_records",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    title: {
      type: "varchar",
      length: 100
    },
    type: {
      type: "enum",
      enum: Object.values(ComplianceType),
      default: ComplianceType.LICENSE
    },
    status: {
      type: "enum",
      enum: Object.values(ComplianceStatus),
      default: ComplianceStatus.PENDING
    },
    description: {
      type: "varchar",
      nullable: true
    },
    issueDate: {
      type: "date",
      nullable: true
    },
    expirationDate: {
      type: "date",
      nullable: true
    },
    issuingAuthority: {
      type: "varchar",
      nullable: true
    },
    licenseNumber: {
      type: "varchar",
      nullable: true
    },
    employeeId: {
      type: "uuid"
    },
    documentId: {
      type: "uuid",
      nullable: true
    },
    healthData: {
      type: "varchar",
      nullable: true
    },
    requiresEncryption: {
      type: "boolean",
      default: false
    },
    reminderDays: {
      type: "int",
      default: 30
    },
    remindersEnabled: {
      type: "boolean",
      default: false
    },
    lastReminderSent: {
      type: "timestamp",
      nullable: true
    },
    verifiedById: {
      type: "uuid",
      nullable: true
    },
    verifiedAt: {
      type: "timestamp",
      nullable: true
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    },
    accessLog: {
      type: "varchar",
      nullable: true
    }
  },
  relations: {
    employee: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "employeeId"
      },
      onDelete: "CASCADE"
    }
  }
});