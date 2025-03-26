import { DataSource } from "typeorm";
import path from "path";

// Create a TypeORM data source for PostgreSQL
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [path.join(process.cwd(), "entities", "*.ts")],
  migrations: [path.join(process.cwd(), "migrations", "*.ts")],
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