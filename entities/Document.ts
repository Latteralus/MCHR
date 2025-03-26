import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Employee } from "./Employee";
import { Department } from "./Department";

// Enum for document types
export enum DocumentType {
  EMPLOYEE_RECORD = "employee_record",
  POLICY = "policy",
  CONTRACT = "contract",
  HANDBOOK = "handbook",
  LICENSE = "license",
  CERTIFICATION = "certification",
  MEDICAL = "medical",
  PERFORMANCE_REVIEW = "performance_review",
  TAX_FORM = "tax_form",
  TRAINING = "training",
  OTHER = "other"
}

// Enum for document access levels
export enum DocumentAccessLevel {
  PUBLIC = "public",           // All employees can view
  DEPARTMENT = "department",   // Only department members and above
  MANAGER = "manager",         // Only managers and above
  HR = "hr",                   // Only HR staff and admins
  ADMIN = "admin",             // Only admins
  INDIVIDUAL = "individual"    // Only the specific employee
}

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: DocumentType,
    default: DocumentType.OTHER
  })
  documentType: DocumentType;

  @Column({
    type: "enum",
    enum: DocumentAccessLevel,
    default: DocumentAccessLevel.HR
  })
  accessLevel: DocumentAccessLevel;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ default: false })
  isEncrypted: boolean;

  @Column({ default: 1 })
  version: number;

  // Employee relationship (if this document belongs to a specific employee)
  @ManyToOne(() => Employee, employee => employee.documents, { nullable: true })
  @JoinColumn({ name: "employeeId" })
  employee: Employee;

  @Column({ nullable: true })
  employeeId: string;

  // Department relationship (if this document belongs to a department)
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: "departmentId" })
  department: Department;

  @Column({ nullable: true })
  departmentId: string;

  // Expiration date (for licenses, certifications, etc.)
  @Column({ nullable: true })
  expirationDate: Date;

  // Document uploader
  @Column()
  uploadedById: string;

  // Document metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Document access tracking for HIPAA compliance
  @Column({ type: "jsonb", nullable: true })
  accessLog: any;

  // Retention period in days (0 means indefinite)
  @Column({ default: 0 })
  retentionPeriod: number;

  // Calculated deletion date based on retention period
  @Column({ nullable: true })
  scheduledDeletionDate: Date;

  // Tags for easy searching
  @Column({ type: "simple-array", nullable: true })
  tags: string[];

  // External reference (e.g., for documents from external systems)
  @Column({ nullable: true })
  externalReference: string;

  // Whether document requires acknowledgment
  @Column({ default: false })
  requiresAcknowledgment: boolean;

  // Acknowledgment tracking
  @Column({ type: "jsonb", nullable: true })
  acknowledgments: any;
}