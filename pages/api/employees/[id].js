import { apiHandler, validateDepartmentAccess, throwApiError } from '../../../utils/apiHandler';
import { AppDataSource } from '../../../utils/db';
import { Employee } from '../../../entities/Employee';
import { Department } from '../../../entities/Department';

export default apiHandler(
  {
    // GET: Fetch a single employee by ID
    GET: async (req, res, session) => {
      const { id } = req.query;
      
      // Get employee with department
      const employeeRepository = AppDataSource.getRepository(Employee);
      const employee = await employeeRepository.findOne({
        where: { id: id },
        relations: ['department', 'manager']
      });
      
      // Check if employee exists
      if (!employee) {
        throwApiError.notFound('Employee not found');
      }
      
      // Check access based on role
      if (session.user.role === 'department_head' && 
          session.user.departmentId !== employee.departmentId) {
        throwApiError.forbidden('You do not have access to this employee record');
      }
      
      // Return the employee data
      return res.status(200).json({
        success: true,
        data: employee
      });
    },
    
    // PUT: Update an employee
    PUT: async (req, res, session) => {
      const { id } = req.query;
      const employeeRepository = AppDataSource.getRepository(Employee);
      
      // Find the employee to update
      const employee = await employeeRepository.findOne({
        where: { id: id },
        relations: ['department']
      });
      
      // Check if employee exists
      if (!employee) {
        throwApiError.notFound('Employee not found');
      }
      
      // Check access based on role
      if (session.user.role === 'department_head' && 
          session.user.departmentId !== employee.departmentId) {
        throwApiError.forbidden('You do not have access to this employee record');
      }
      
      // Check if department is changing and validate access
      if (req.body.departmentId && 
          req.body.departmentId !== employee.departmentId && 
          !validateDepartmentAccess(session, req.body.departmentId)) {
        throwApiError.forbidden('You do not have access to the target department');
      }
      
      // If department ID is changing, check if it exists
      if (req.body.departmentId && req.body.departmentId !== employee.departmentId) {
        const departmentRepository = AppDataSource.getRepository(Department);
        const department = await departmentRepository.findOneBy({ id: req.body.departmentId });
        
        if (!department) {
          throwApiError.badRequest('Department not found');
        }
      }
      
      // Check if email is changing and if it's already in use
      if (req.body.email && req.body.email !== employee.email) {
        const existingEmployee = await employeeRepository.findOneBy({ email: req.body.email });
        
        if (existingEmployee) {
          throwApiError.conflict('An employee with this email already exists');
        }
      }
      
      // Prepare update data (parse date strings into Date objects)
      const updateData = {
        ...req.body,
        hireDate: req.body.hireDate ? new Date(req.body.hireDate) : employee.hireDate,
        terminationDate: req.body.terminationDate ? new Date(req.body.terminationDate) : employee.terminationDate,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : employee.dateOfBirth
      };
      
      // Update the employee
      await employeeRepository.update(id, updateData);
      
      // Get the updated employee
      const updatedEmployee = await employeeRepository.findOne({
        where: { id: id },
        relations: ['department', 'manager']
      });
      
      // Return success with the updated employee
      return res.status(200).json({
        success: true,
        data: updatedEmployee,
        message: 'Employee updated successfully'
      });
    },
    
    // DELETE: Remove an employee
    DELETE: async (req, res, session) => {
      const { id } = req.query;
      
      // Only admin and HR managers can delete employees
      if (session.user.role !== 'admin' && session.user.role !== 'hr_manager') {
        throwApiError.forbidden('You do not have permission to delete employees');
      }
      
      const employeeRepository = AppDataSource.getRepository(Employee);
      
      // Find the employee to delete
      const employee = await employeeRepository.findOne({
        where: { id: id },
        relations: ['department']
      });
      
      // Check if employee exists
      if (!employee) {
        throwApiError.notFound('Employee not found');
      }
      
      // Delete the employee
      await employeeRepository.remove(employee);
      
      // Return success
      return res.status(200).json({
        success: true,
        message: 'Employee deleted successfully'
      });
    }
  },
  true, // Require authentication
  null // No specific role required (role-based checks are handled within the handlers)
);