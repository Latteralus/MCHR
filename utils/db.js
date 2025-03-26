import { DataSource } from "typeorm";
import { UserEntity } from "../entities/User";
import { DepartmentEntity } from "../entities/Department";
import { EmployeeEntity } from "../entities/Employee";
import { AttendanceEntity } from "../entities/Attendance";
import { LeaveEntity } from "../entities/Leave";
import { ComplianceEntity } from "../entities/Compliance";
import { DocumentEntity } from "../entities/Document";

// Create a TypeORM data source for PostgreSQL
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [
    UserEntity,
    DepartmentEntity,
    EmployeeEntity,
    AttendanceEntity,
    LeaveEntity,
    ComplianceEntity,
    DocumentEntity
  ],
  synchronize: process.env.NODE_ENV !== "production", // Auto-sync schema in development
  logging: process.env.NODE_ENV !== "production",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Helper function to ensure DB connection
export const ensureDbConnected = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    }
    return AppDataSource;
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    throw error;
  }
};