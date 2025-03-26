// pages/api/attendance/[id].js
import { getSession } from 'next-auth/react';
import { getDataSource } from '../../../utils/db';
import { Attendance } from '../../../entities/Attendance';
import { Employee } from '../../../entities/Employee';

// API handler for operations on a specific attendance record
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get the attendance record ID from the URL
  const { id } = req.query;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid attendance record ID' });
  }
  
  // Connect to database
  const dataSource = await getDataSource();
  const attendanceRepository = dataSource.getRepository(Attendance);
  const employeeRepository = dataSource.getRepository(Employee);

  // Route handler based on HTTP method
  switch (req.method) {
    case 'GET':
      return getAttendanceRecord(req, res, attendanceRepository, employeeRepository, session, parseInt(id));
    case 'PUT':
      return updateAttendanceRecord(req, res, attendanceRepository, employeeRepository, session, parseInt(id));
    case 'DELETE':
      return deleteAttendanceRecord(req, res, attendanceRepository, employeeRepository, session, parseInt(id));
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get a specific attendance record
async function getAttendanceRecord(req, res, attendanceRepository, employeeRepository, session, recordId) {
  try {
    // Find the attendance record
    const attendanceRecord = await attendanceRepository.findOne({
      where: { id: recordId },
      relations: ['employee']
    });
    
    if (!attendanceRecord) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    // Apply role-based access control
    if (session.user.role !== 'admin' && session.user.role !== 'hr') {
      // Department heads can only view attendance for their department
      if (session.user.role === 'manager') {
        const employee = await employeeRepository.findOne({
          where: { id: attendanceRecord.employeeId }
        });
        
        if (!employee || employee.departmentId !== session.user.departmentId) {
          return res.status(403).json({ error: 'Access denied to this attendance record' });
        }
      } else {
        // Regular employees can only view their own attendance
        const userEmployee = await employeeRepository.findOne({
          where: { email: session.user.email }
        });
        
        if (!userEmployee || userEmployee.id !== attendanceRecord.employeeId) {
          return res.status(403).json({ error: 'Access denied to this attendance record' });
        }
      }
    }
    
    return res.status(200).json(attendanceRecord);
  } catch (error) {
    console.error('Error fetching attendance record:', error);
    return res.status(500).json({ error: 'Failed to fetch attendance record' });
  }
}

// Update an existing attendance record
async function updateAttendanceRecord(req, res, attendanceRepository, employeeRepository, session, recordId) {
  try {
    // Find the attendance record
    const attendanceRecord = await attendanceRepository.findOne({
      where: { id: recordId }
    });
    
    if (!attendanceRecord) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    // Apply role-based access control
    if (session.user.role !== 'admin' && session.user.role !== 'hr') {
      // Department heads can only update attendance for their department
      if (session.user.role === 'manager') {
        const employee = await employeeRepository.findOne({
          where: { id: attendanceRecord.employeeId }
        });
        
        if (!employee || employee.departmentId !== session.user.departmentId) {
          return res.status(403).json({ error: 'You can only update attendance for your department' });
        }
      } else {
        // Regular employees can only update their own attendance on the same day
        // (to allow for clock-in/out functionality)
        const userEmployee = await employeeRepository.findOne({
          where: { email: session.user.email }
        });
        
        if (!userEmployee || userEmployee.id !== attendanceRecord.employeeId) {
          return res.status(403).json({ error: 'You can only update your own attendance' });
        }
        
        // Check if the record is for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const recordDate = new Date(attendanceRecord.date);
        recordDate.setHours(0, 0, 0, 0);
        
        if (recordDate.getTime() !== today.getTime()) {
          return res.status(403).json({ error: 'You can only update attendance for the current day' });
        }
        
        // Employees can only update timeIn and timeOut
        const { timeIn, timeOut } = req.body;
        req.body = { timeIn, timeOut };
      }
    }
    
    // Update attendance record
    const { timeIn, timeOut, status, notes } = req.body;
    
    // Update only changed fields
    if (timeIn !== undefined) attendanceRecord.timeIn = timeIn;
    if (timeOut !== undefined) attendanceRecord.timeOut = timeOut;
    if (status !== undefined) attendanceRecord.status = status;
    if (notes !== undefined) attendanceRecord.notes = notes;
    
    const updatedRecord = await attendanceRepository.save(attendanceRecord);
    
    return res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    return res.status(500).json({ error: 'Failed to update attendance record' });
  }
}

// Delete an attendance record
async function deleteAttendanceRecord(req, res, attendanceRepository, employeeRepository, session, recordId) {
  try {
    // Find the attendance record
    const attendanceRecord = await attendanceRepository.findOne({
      where: { id: recordId }
    });
    
    if (!attendanceRecord) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    // Apply role-based access control (only admins and HR can delete)
    if (session.user.role !== 'admin' && session.user.role !== 'hr') {
      return res.status(403).json({ error: 'Only administrators and HR personnel can delete attendance records' });
    }
    
    // Delete the attendance record
    await attendanceRepository.remove(attendanceRecord);
    
    return res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    return res.status(500).json({ error: 'Failed to delete attendance record' });
  }
}