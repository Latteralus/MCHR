import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Employee } from "./Employee";

// Enum for attendance status
export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  TARDY = "tardy",
  HALF_DAY = "half_day",
  ON_LEAVE = "on_leave",
  HOLIDAY = "holiday",
  WEEKEND = "weekend"
}

@Entity("attendance")
export class Attendance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "time", nullable: true })
  timeIn: Date;

  @Column({ type: "time", nullable: true })
  timeOut: Date;

  @Column({
    type: "enum",
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT
  })
  status: AttendanceStatus;

  @Column({ type: "decimal", precision: 4, scale: 2, default: 0 })
  hoursWorked: number;

  @Column({ nullable: true })
  notes: string;

  // Employee relationship
  @ManyToOne(() => Employee, employee => employee.attendanceRecords, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employeeId" })
  employee: Employee;

  @Column()
  employeeId: string;

  // System metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Optional: who recorded this attendance
  @Column({ nullable: true })
  recordedById: string;

  // Remote work indicator
  @Column({ default: false })
  isRemoteWork: boolean;

  // Overtime indicator
  @Column({ default: false })
  isOvertime: boolean;

  // Additional metadata for compliance
  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  deviceInfo: string;
}