import { EntitySchema } from "typeorm";

// Enum for attendance status
export const AttendanceStatus = {
  PRESENT: "present",
  ABSENT: "absent",
  TARDY: "tardy",
  HALF_DAY: "half_day",
  ON_LEAVE: "on_leave",
  HOLIDAY: "holiday",
  WEEKEND: "weekend"
};

// Class definition for IntelliSense/typing
export class Attendance {
  id;
  date;
  timeIn;
  timeOut;
  status;
  hoursWorked;
  notes;
  employee;
  employeeId;
  createdAt;
  updatedAt;
  recordedById;
  isRemoteWork;
  isOvertime;
  ipAddress;
  deviceInfo;
}

// Entity Schema definition for TypeORM
export const AttendanceEntity = new EntitySchema({
  name: "Attendance",
  target: Attendance,
  tableName: "attendance",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    date: {
      type: "date"
    },
    timeIn: {
      type: "time",
      nullable: true
    },
    timeOut: {
      type: "time",
      nullable: true
    },
    status: {
      type: "enum",
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PRESENT
    },
    hoursWorked: {
      type: "decimal",
      precision: 4,
      scale: 2,
      default: 0
    },
    notes: {
      type: "varchar",
      nullable: true
    },
    employeeId: {
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
    recordedById: {
      type: "uuid",
      nullable: true
    },
    isRemoteWork: {
      type: "boolean",
      default: false
    },
    isOvertime: {
      type: "boolean",
      default: false
    },
    ipAddress: {
      type: "varchar",
      nullable: true
    },
    deviceInfo: {
      type: "varchar",
      nullable: true
    }
  },
  relations: {
    // Change from 'employee' to match property name in the class
    employeeId: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "employeeId"
      },
      onDelete: "CASCADE"
    }
  }
});