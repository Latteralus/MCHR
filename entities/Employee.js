import { EntitySchema } from "typeorm";

// Enum for employment status
export const EmploymentStatus = {
  ACTIVE: "active",
  ONBOARDING: "onboarding",
  ON_LEAVE: "on_leave",
  TERMINATED: "terminated",
  SUSPENDED: "suspended"
};

// Enum for employment type
export const EmploymentType = {
  FULL_TIME: "full_time",
  PART_TIME: "part_time",
  CONTRACT: "contract",
  TEMPORARY: "temporary",
  INTERN: "intern"
};

// Class definition for IntelliSense/typing
export class Employee {
  id;
  firstName;
  lastName;
  email;
  phone;
  address;
  city;
  state;
  zipCode;
  dateOfBirth;
  socialSecurityNumber;
  emergencyContactName;
  emergencyContactPhone;
  emergencyContactRelationship;
  hireDate;
  terminationDate;
  status;
  employmentType;
  position;
  salary;
  hourlyRate;
  managerNotes;
  department;
  departmentId;
  manager;
  managerId;
  attendanceRecords;
  leaveRequests;
  complianceRecords;
  documents;
  createdAt;
  updatedAt;
  
  // Virtual property (not stored in DB)
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// Entity Schema definition for TypeORM
export const EmployeeEntity = new EntitySchema({
  name: "Employee",
  target: Employee,
  tableName: "employees",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    firstName: {
      type: "varchar",
      length: 100
    },
    lastName: {
      type: "varchar",
      length: 100
    },
    email: {
      type: "varchar",
      unique: true
    },
    phone: {
      type: "varchar",
      length: 20,
      nullable: true
    },
    address: {
      type: "varchar",
      nullable: true
    },
    city: {
      type: "varchar",
      nullable: true
    },
    state: {
      type: "varchar",
      length: 2,
      nullable: true
    },
    zipCode: {
      type: "varchar",
      length: 10,
      nullable: true
    },
    dateOfBirth: {
      type: "date",
      nullable: true
    },
    socialSecurityNumber: {
      type: "varchar",
      nullable: true
    },
    emergencyContactName: {
      type: "varchar",
      nullable: true
    },
    emergencyContactPhone: {
      type: "varchar",
      nullable: true
    },
    emergencyContactRelationship: {
      type: "varchar",
      nullable: true
    },
    hireDate: {
      type: "date"
    },
    terminationDate: {
      type: "date",
      nullable: true
    },
    status: {
      type: "enum",
      enum: Object.values(EmploymentStatus),
      default: EmploymentStatus.ONBOARDING
    },
    employmentType: {
      type: "enum",
      enum: Object.values(EmploymentType),
      default: EmploymentType.FULL_TIME
    },
    position: {
      type: "varchar",
      length: 100
    },
    salary: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0
    },
    hourlyRate: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: true
    },
    managerNotes: {
      type: "varchar",
      nullable: true
    },
    departmentId: {
      type: "uuid",
      nullable: true
    },
    managerId: {
      type: "uuid",
      nullable: true
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  },
  relations: {
    // Change relation property names to match column names
    departmentId: {
      type: "many-to-one",
      target: "Department",
      joinColumn: {
        name: "departmentId"
      },
      nullable: true
    },
    managerId: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "managerId"
      },
      nullable: true
    },
    attendanceRecords: {
      type: "one-to-many",
      target: "Attendance",
      inverseSide: "employeeId"
    },
    leaveRequests: {
      type: "one-to-many",
      target: "Leave",
      inverseSide: "employeeId"
    },
    complianceRecords: {
      type: "one-to-many",
      target: "Compliance",
      inverseSide: "employeeId"
    },
    documents: {
      type: "one-to-many",
      target: "Document",
      inverseSide: "employeeId"
    }
  }
});