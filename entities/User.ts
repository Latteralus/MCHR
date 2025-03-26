import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Department } from "./Department";

// Enum for user roles
export enum UserRole {
  ADMIN = "admin",
  HR_MANAGER = "hr_manager", 
  DEPARTMENT_HEAD = "department_head",
  EMPLOYEE = "employee"
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.EMPLOYEE
  })
  role: UserRole;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: "departmentId" })
  department: Department;

  @Column({ nullable: true })
  departmentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Additional optional fields for password reset, etc.
  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ default: true })
  isActive: boolean;
}