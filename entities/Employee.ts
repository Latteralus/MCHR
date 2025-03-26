import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Department } from "./Department";
import { Attendance } from "./Attendance";
import { Leave } from "./Leave";
import { Compliance } from "./Compliance";
import { Document } from "./Document";

// Enum for employment status
export enum EmploymentStatus {
  ACTIVE = "active",
  ONBOARDING = "onboarding",
  ON_LEAVE = "on_leave",
  TERMINATED = "terminated",
  SUSPENDED = "suspended"
}

// Enum for employment type
export enum EmploymentType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  TEMPORARY = "temporary",
  INTERN = "intern"
}

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true, length: 2 })
  state: string;

  @Column({ nullable: true, length: 10 })
  zipCode: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  socialSecurityNumber: string;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ nullable: true })
  emergencyContactRelationship: string;

  // Employment details
  @Column()
  hireDate: Date;

  @Column({ nullable: true })
  terminationDate: Date;

  @Column({ 
    type: "enum",
    enum: EmploymentStatus,
    default: EmploymentStatus.ONBOARDING
  })
  status: EmploymentStatus;

  @Column({ 
    type: "enum",
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME
  })
  employmentType: EmploymentType;

  @Column({ length: 100 })
  position: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  salary: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  hourlyRate: number;

  @Column({ nullable: true })
  managerNotes: string;

  // Department relationship
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: "departmentId" })
  department: Department;

  @Column({ nullable: true })
  departmentId: string;

  // Manager relationship (self-referencing)
  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: "managerId" })
  manager: Employee;

  @Column({ nullable: true })
  managerId: string;

  // Related records
  @OneToMany(() => Attendance, attendance => attendance.employee)
  attendanceRecords: Attendance[];

  @OneToMany(() => Leave, leave => leave.employee)
  leaveRequests: Leave[];

  @OneToMany(() => Compliance, compliance => compliance.employee)
  complianceRecords: Compliance[];

  @OneToMany(() => Document, document => document.employee)
  documents: Document[];

  // System metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual fields (not stored in DB)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}