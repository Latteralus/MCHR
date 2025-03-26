import { EntitySchema } from "typeorm";

// Enum for document types
export const DocumentType = {
  EMPLOYEE_RECORD: "employee_record",
  POLICY: "policy",
  CONTRACT: "contract",
  HANDBOOK: "handbook",
  LICENSE: "license",
  CERTIFICATION: "certification",
  MEDICAL: "medical",
  PERFORMANCE_REVIEW: "performance_review",
  TAX_FORM: "tax_form",
  TRAINING: "training",
  OTHER: "other"
};

// Enum for document access levels
export const DocumentAccessLevel = {
  PUBLIC: "public",           // All employees can view
  DEPARTMENT: "department",   // Only department members and above
  MANAGER: "manager",         // Only managers and above
  HR: "hr",                   // Only HR staff and admins
  ADMIN: "admin",             // Only admins
  INDIVIDUAL: "individual"    // Only the specific employee
};

// Class definition for IntelliSense/typing
export class Document {
  id;
  title;
  description;
  documentType;
  accessLevel;
  fileName;
  filePath;
  fileSize;
  mimeType;
  isEncrypted;
  version;
  employee;
  employeeId;
  department;
  departmentId;
  expirationDate;
  uploadedById;
  createdAt;
  updatedAt;
  accessLog;
  retentionPeriod;
  scheduledDeletionDate;
  tags;
  externalReference;
  requiresAcknowledgment;
  acknowledgments;
}

// Entity Schema definition for TypeORM
export const DocumentEntity = new EntitySchema({
  name: "Document",
  target: Document,
  tableName: "documents",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    title: {
      type: "varchar",
      length: 255
    },
    description: {
      type: "varchar",
      nullable: true
    },
    documentType: {
      type: "enum",
      enum: Object.values(DocumentType),
      default: DocumentType.OTHER
    },
    accessLevel: {
      type: "enum",
      enum: Object.values(DocumentAccessLevel),
      default: DocumentAccessLevel.HR
    },
    fileName: {
      type: "varchar"
    },
    filePath: {
      type: "varchar"
    },
    fileSize: {
      type: "int",
      nullable: true
    },
    mimeType: {
      type: "varchar",
      nullable: true
    },
    isEncrypted: {
      type: "boolean",
      default: false
    },
    version: {
      type: "int",
      default: 1
    },
    employeeId: {
      type: "uuid",
      nullable: true
    },
    departmentId: {
      type: "uuid",
      nullable: true
    },
    expirationDate: {
      type: "date",
      nullable: true
    },
    uploadedById: {
      type: "uuid"
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
      type: "json",
      nullable: true
    },
    retentionPeriod: {
      type: "int",
      default: 0
    },
    scheduledDeletionDate: {
      type: "date",
      nullable: true
    },
    tags: {
      type: "simple-array",
      nullable: true
    },
    externalReference: {
      type: "varchar",
      nullable: true
    },
    requiresAcknowledgment: {
      type: "boolean",
      default: false
    },
    acknowledgments: {
      type: "json",
      nullable: true
    }
  },
  relations: {
    // Change property names to match column names
    employeeId: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "employeeId"
      },
      nullable: true
    },
    departmentId: {
      type: "many-to-one",
      target: "Department",
      joinColumn: {
        name: "departmentId"
      },
      nullable: true
    }
  }
});