import { EntitySchema } from "typeorm";

// Class definition for IntelliSense/typing
export class Department {
  id;
  name;
  description;
  managerId;
  createdAt;
  updatedAt;
  employees;
}

// Entity Schema definition for TypeORM
export const DepartmentEntity = new EntitySchema({
  name: "Department",
  target: Department,
  tableName: "departments",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    name: {
      type: "varchar",
      length: 100,
      unique: true
    },
    description: {
      type: "varchar",
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
    employees: {
      type: "one-to-many",
      target: "User",
      inverseSide: "department"
    }
  }
});