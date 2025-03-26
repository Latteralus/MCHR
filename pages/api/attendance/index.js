// pages/api/attendance/index.js
import { getSession } from 'next-auth/react';
import { getDataSource } from '../../../utils/db';
import { Attendance } from '../../../entities/Attendance';
import { Employee } from '../../../entities/Employee';

// API handler for attendance-related operations
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Connect to database
  const dataSource = await getDataSource();
  const attendanceRepository = dataSource.getRepository(Attendance);
  const employeeRepository = dataSource.getRepository(Employee);

  // Route handler based on HTTP method
  switch (req.method) {
    case 'GET':
      return getAttendanceRecords(req, res, attendanceRepository, employeeRepository, session);
    case 'POST':
      return createAttendanceRecord(req, res, attendanceRepository, employeeRepository, session);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get attendance records with filtering options
async function getAttendanceRecords(req, res, attendanceRepository, employeeRepository, session) {
  try {
    const { employeeId, startDate, endDate, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query filters
    const whereClause = {};
    
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }
    
    if (startDate && endDate) {
      whereClause.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      whereClause.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      whereClause.date = { $lte: new Date(endDate) };
    }
    
    // Apply role-based access control
    if (session.user.role !== 'admin' && session.user.role !== 'hr') {
      // Department heads can only see attendance for their department
      if (session.user.role === 'manager') {
        const departmentEmployees = await employeeRepository.find({
          where: { departmentId: session.user.departmentId }
        });
        
        const departmentEmployeeIds = departmentEmployees.map(emp => emp.id);
        
        if (employeeId && !departmentEmployeeIds.includes(parseInt(employeeId))) {
          return res.status(403).json({ error: 'Access denied to this employee\'s records' });
        }
        
        if (!employeeId) {
          whereClause.employeeId = { $in: departmentEmployeeIds };
        }
      } else {
        // Regular employees can only see their own attendance
        const userEmployee = await employeeRepository.findOne({
          where: { email: session.user.email }
        });
        
        if (!userEmployee) {
          return res.status(404).json({ error: 'Employee record not found' });
        }
        
        whereClause.employeeId = userEmployee.id;
      }
    }
    
    // Execute query with pagination
    const [records, total] = await Promise.all([
      attendanceRepository.find({
        where: whereClause,
        skip,
        take: parseInt(limit),
        order: { date: 'DESC', timeIn: 'DESC' },
        relations: ['employee']
      }),
      attendanceRepository.count({ where: whereClause })
    ]);
    
    // Return paginated results with metadata
    return res.status(200).json({
      records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
}

// Create a new attendance record
async function createAttendanceRecord(req, res, attendanceRepository, employeeRepository, session) {
  try {
    const { employeeId, date, timeIn, timeOut, status, notes } = req.body;
    
    if (!employeeId || !date) {
      return res.status(400).json({ error: 'Employee ID and date are required' });
    }
    
    // Validate employee exists
    const employee = await employeeRepository.findOne({
      where: { id: employeeId }
    });
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Check permissions for creating attendance records
    if (session.user.role !== 'admin' && session.user.role !== 'hr') {
      // Department heads can only manage attendance for their department
      if (session.user.role === 'manager') {
        if (employee.departmentId !== session.user.departmentId) {
          return res.status(403).json({ error: 'You can only manage attendance for your department' });
        }
      } else {
        // Regular employees can only log their own attendance
        const userEmployee = await employeeRepository.findOne({
          where: { email: session.user.email }
        });
        
        if (!userEmployee || userEmployee.id !== parseInt(employeeId)) {
          return res.status(403).json({ error: 'You can only log your own attendance' });
        }
      }
    }
    
    // Check for existing attendance record for the same date and employee
    const existingRecord = await attendanceRepository.findOne({
      where: {
        employeeId,
        date: new Date(date)
      }
    });
    
    if (existingRecord) {
      return res.status(409).json({ error: 'An attendance record already exists for this employee on this date' });
    }
    
    // Create new attendance record
    const newAttendance = attendanceRepository.create({
      employeeId,
      date: new Date(date),
      timeIn: timeIn || null,
      timeOut: timeOut || null,
      status: status || 'present',
      notes: notes || ''
    });
    
    const savedRecord = await attendanceRepository.save(newAttendance);
    
    return res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating attendance record:', error);
    return res.status(500).json({ error: 'Failed to create attendance record' });
  }
}