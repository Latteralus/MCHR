import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Employee } from "./Employee";

// Enum for leave types
export enum LeaveType {
  VACATION = "vacation",
  SICK = "sick",
  PERSONAL = "personal",
  BEREAVEMENT = "bereavement",
  JURY_DUTY = "jury_duty",
  MATERNITY = "maternity",
  PATERNITY = "paternity",
  UNPAID = "unpaid",
  OTHER = "other"
}

// Enum for leave status
export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  COMPLETED = "completed"
}

@Entity("leave_requests")
export class Leave {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column({
    type: "enum",
    enum: LeaveType,
    default: LeaveType.VACATION
  })
  leaveType: LeaveType;

  @Column({
    type: "enum",
    enum: LeaveStatus,
    default: LeaveStatus.PENDING
  })
  status: LeaveStatus;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: "decimal", precision: 4, scale: 2, default: 1 })
  totalDays: number;

  // Employee relationship
  @ManyToOne(() => Employee, employee => employee.leaveRequests, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employeeId" })
  employee: Employee;

  @Column()
  employeeId: string;

  // Approval details
  @Column({ nullable: true })
  approvedById: string;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  approverNotes: string;

  // System metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Document attachments (e.g., medical certificates)
  @Column({ nullable: true })
  attachments: string;

  // Half-day indicators
  @Column({ default: false })
  isFirstDayHalf: boolean;

  @Column({ default: false })
  isLastDayHalf: boolean;
}