import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Employee } from "./Employee";

// Enum for compliance type
export enum ComplianceType {
  LICENSE = "license",
  CERTIFICATION = "certification",
  TRAINING = "training",
  BACKGROUND_CHECK = "background_check",
  POLICY_ACKNOWLEDGEMENT = "policy_acknowledgement",
  HEALTH_SCREENING = "health_screening",
  HIPAA_TRAINING = "hipaa_training",
  REVIEW = "review",
  OTHER = "other"
}

// Enum for compliance status
export enum ComplianceStatus {
  VALID = "valid",
  EXPIRING_SOON = "expiring_soon",
  EXPIRED = "expired",
  PENDING = "pending",
  INCOMPLETE = "incomplete",
  NOT_REQUIRED = "not_required"
}

@Entity("compliance_records")
export class Compliance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({
    type: "enum",
    enum: ComplianceType,
    default: ComplianceType.LICENSE
  })
  type: ComplianceType;

  @Column({
    type: "enum",
    enum: ComplianceStatus,
    default: ComplianceStatus.PENDING
  })
  status: ComplianceStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  issueDate: Date;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  issuingAuthority: string;

  @Column({ nullable: true })
  licenseNumber: string;

  // Employee relationship
  @ManyToOne(() => Employee, employee => employee.complianceRecords, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employeeId" })
  employee: Employee;

  @Column()
  employeeId: string;

  // Document reference
  @Column({ nullable: true })
  documentId: string;

  // HIPAA specific fields - with potential encryption flags
  @Column({ nullable: true })
  healthData: string;

  @Column({ default: false })
  requiresEncryption: boolean;

  // Reminder settings
  @Column({ default: 30 })
  reminderDays: number;

  @Column({ default: false })
  remindersEnabled: boolean;

  @Column({ nullable: true })
  lastReminderSent: Date;

  // Tracking who verified this compliance
  @Column({ nullable: true })
  verifiedById: string;

  @Column({ nullable: true })
  verifiedAt: Date;

  // System metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Audit log field for HIPAA compliance
  @Column({ nullable: true })
  accessLog: string;
}