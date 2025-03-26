import { EntitySchema } from "typeorm";

// Enum for user roles
export const UserRole = {
  ADMIN: "admin",
  HR_MANAGER: "hr_manager",
  DEPARTMENT_HEAD: "department_head",
  EMPLOYEE: "employee"
};

// Class definition for IntelliSense/typing
export class User {
  id;
  name;
  email;
  passwordHash;
  role;
  department;
  departmentId;
  createdAt;
  updatedAt;
  resetPasswordToken;
  resetPasswordExpires;
  isActive;
}

// Entity Schema definition for TypeORM
export const UserEntity = new EntitySchema({
  name: "User",
  target: User,
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    name: {
      type: "varchar",
      length: 100
    },
    email: {
      type: "varchar",
      unique: true
    },
    passwordHash: {
      type: "varchar"
    },
    role: {
      type: "enum",
      enum: Object.values(UserRole),
      default: UserRole.EMPLOYEE
    },
    departmentId: {
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
    },
    resetPasswordToken: {
      type: "varchar",
      nullable: true
    },
    resetPasswordExpires: {
      type: "timestamp",
      nullable: true
    },
    isActive: {
      type: "boolean",
      default: true
    }
  },
  relations: {
    // Change property name to match column name
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