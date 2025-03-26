// entities/Compliance.js
import { EntitySchema } from "typeorm";

const Compliance = new EntitySchema({
  name: "Compliance",
  tableName: "compliances",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    licenseType: {
      type: "varchar",
      length: 255
    },
    licenseNumber: {
      type: "varchar",
      length: 100,
      nullable: true
    },
    issueDate: {
      type: "date"
    },
    expirationDate: {
      type: "date"
    },
    status: {
      type: "varchar",
      length: 50,
      default: "valid"
    },
    notes: {
      type: "text",
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

export default Compliance;