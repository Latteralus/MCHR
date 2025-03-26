import { EntitySchema } from "typeorm";

// Enum for leave types
export const LeaveType = {
  VACATION: "vacation",
  SICK: "sick",
  PERSONAL: "personal",
  BEREAVEMENT: "bereavement",
  JURY_DUTY: "jury_duty",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
  UNPAID: "unpaid",
  OTHER: "other"
};

// Enum for leave status
export const LeaveStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  COMPLETED: "completed"
};

// Class definition for IntelliSense/typing
export class Leave {
  id;
  startDate;
  endDate;
  leaveType;
  status;
  reason;
  totalDays;
  employee;
  employeeId;
  approvedById;
  approvedAt;
  approverNotes;
  createdAt;
  updatedAt;
  attachments;
  isFirstDayHalf;
  isLastDayHalf;
}

// Entity Schema definition for TypeORM
export const LeaveEntity = new EntitySchema({
  name: "Leave",
  target: Leave,
  tableName: "leave_requests",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    startDate: {
      type: "date"
    },
    endDate: {
      type: "date"
    },
    leaveType: {
      type: "enum",
      enum: Object.values(LeaveType),
      default: LeaveType.VACATION
    },
    status: {
      type: "enum",
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING
    },
    reason: {
      type: "varchar",
      nullable: true
    },
    totalDays: {
      type: "decimal",
      precision: 4,
      scale: 2,
      default: 1
    },
    employeeId: {
      type: "uuid"
    },
    approvedById: {
      type: "uuid",
      nullable: true
    },
    approvedAt: {
      type: "timestamp",
      nullable: true
    },
    approverNotes: {
      type: "varchar",
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
    attachments: {
      type: "varchar",
      nullable: true
    },
    isFirstDayHalf: {
      type: "boolean",
      default: false
    },
    isLastDayHalf: {
      type: "boolean",
      default: false
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