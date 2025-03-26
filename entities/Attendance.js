// entities/Attendance.js
const { EntitySchema } = require("typeorm");

class Attendance {
  constructor() {
    this.id = undefined;
    this.employeeId = undefined;
    this.employee = undefined;
    this.date = undefined;
    this.timeIn = undefined;
    this.timeOut = undefined;
    this.status = undefined;
    this.notes = undefined;
    this.createdAt = undefined;
    this.updatedAt = undefined;
  }
}

module.exports.Attendance = new EntitySchema({
  name: "Attendance",
  target: Attendance,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    employeeId: {
      type: "int"
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
      type: "varchar",
      default: "present"
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
      target: "Employee",
      type: "many-to-one",
      joinColumn: {
        name: "employeeId"
      },
      onDelete: "CASCADE"
    }
  },
  indices: [
    {
      name: "attendance_employee_date",
      columns: ["employeeId", "date"],
      unique: true
    }
  ]
});