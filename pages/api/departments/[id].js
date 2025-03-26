import { apiHandler, throwApiError } from '../../../utils/apiHandler';
import { AppDataSource } from '../../../utils/db';
import { Department } from '../../../entities/Department';
import { Employee } from '../../../entities/Employee';

export default apiHandler(
  {
    // GET: Fetch a single department by ID
    GET: async (req, res, session) => {
      const { id } = req.query;
      
      const departmentRepository = AppDataSource.getRepository(Department);
      
      // Get the department
      const department = await departmentRepository.findOne({
        where: { id: id }
      });
      
      // Check if department exists
      if (!department) {
        throwApiError.notFound('Department not found');
      }
      
      // Get employee count for this department
      const employeeRepository = AppDataSource.getRepository(Employee);
      const employeeCount = await employeeRepository.count({
        where: { departmentId: id }
      });
      
      // Get manager if one is assigned
      let manager = null;
      if (department.managerId) {
        manager = await employeeRepository.findOne({
          where: { id: department.managerId },
          select: ['id', 'firstName', 'lastName', 'email', 'position']
        });
      }
      
      // Return department data with employee count and manager
      return res.status(200).json({
        success: true,
        data: {
          ...department,
          employeeCount,
          manager
        }
      });
    },
    
    // PUT: Update a department
    PUT: async (req, res, session) => {
      // Only admin and HR managers can update departments
      if (session.user.role !== 'admin' && session.user.role !== 'hr_manager') {
        throwApiError.forbidden('You do not have permission to update departments');
      }
      
      const { id } = req.query;
      const departmentRepository = AppDataSource.getRepository(Department);
      
      // Check if department exists
      const department = await departmentRepository.findOneBy({ id: id });
      
      if (!department) {
        throwApiError.notFound('Department not found');
      }
      
      // Check if name is changing and if it already exists
      if (req.body.name && req.body.name !== department.name) {
        const existingDepartment = await departmentRepository.findOneBy({ name: req.body.name });
        
        if (existingDepartment) {
          throwApiError.conflict('A department with this name already exists');
        }
      }
      
      // If assigning a manager, check if employee exists
      if (req.body.managerId && req.body.managerId !== department.managerId) {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const manager = await employeeRepository.findOneBy({ id: req.body.managerId });
        
        if (!manager) {
          throwApiError.badRequest('Employee not found for manager assignment');
        }
      }
      
      // Update the department
      await departmentRepository.update(id, req.body);
      
      // Get the updated department
      const updatedDepartment = await departmentRepository.findOneBy({ id: id });
      
      // Return success with updated department
      return res.status(200).json({
        success: true,
        data: updatedDepartment,
        message: 'Department updated successfully'
      });
    },
    
    // DELETE: Remove a department
    DELETE: async (req, res, session) => {
      // Only admin can delete departments
      if (session.user.role !== 'admin') {
        throwApiError.forbidden('You do not have permission to delete departments');
      }
      
      const { id } = req.query;
      
      const departmentRepository = AppDataSource.getRepository(Department);
      const employeeRepository = AppDataSource.getRepository(Employee);
      
      // Check if department exists
      const department = await departmentRepository.findOneBy({ id: id });
      
      if (!department) {
        throwApiError.notFound('Department not found');
      }
      
      // Check if department has employees
      const employeeCount = await employeeRepository.count({
        where: { departmentId: id }
      });
      
      if (employeeCount > 0) {
        throwApiError.badRequest(
          `Cannot delete department that has ${employeeCount} employees assigned. Reassign them first.`
        );
      }
      
      // Delete the department
      await departmentRepository.delete(id);
      
      // Return success
      return res.status(200).json({
        success: true,
        message: 'Department deleted successfully'
      });
    }
  },
  true, // Require authentication
  null // No specific role required (role-based checks in handlers)
);