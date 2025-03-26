import { apiHandler, throwApiError } from '../../../utils/apiHandler';
import { AppDataSource } from '../../../utils/db';
import { Department } from '../../../entities/Department';

export default apiHandler(
  {
    // GET: List all departments
    GET: async (req, res, session) => {
      const departmentRepository = AppDataSource.getRepository(Department);
      
      // Build query options
      const options = {
        order: {
          name: 'ASC' // Sort by name by default
        }
      };
      
      // Add relations if requested
      if (req.query.withManager === 'true') {
        options.relations = ['employees'];
        options.where = {
          managerId: !null, // Only get departments with managers
        };
      }
      
      // Get departments
      const departments = await departmentRepository.find(options);
      
      // Transform to include employee count
      const departmentsWithStats = departments.map(dept => {
        const employeeCount = dept.employees ? dept.employees.length : 0;
        
        // Remove employees array from response to avoid bloating
        const { employees, ...departmentData } = dept;
        
        return {
          ...departmentData,
          employeeCount
        };
      });
      
      // Return the results
      return res.status(200).json({
        success: true,
        data: departmentsWithStats
      });
    },
    
    // POST: Create a new department (admin and HR only)
    POST: async (req, res, session) => {
      // Check permissions
      if (session.user.role !== 'admin' && session.user.role !== 'hr_manager') {
        throwApiError.forbidden('You do not have permission to create departments');
      }
      
      // Validate required fields
      const { name } = req.body;
      
      if (!name) {
        throwApiError.badRequest('Department name is required');
      }
      
      const departmentRepository = AppDataSource.getRepository(Department);
      
      // Check if department already exists
      const existingDepartment = await departmentRepository.findOneBy({ name });
      
      if (existingDepartment) {
        throwApiError.conflict('A department with this name already exists');
      }
      
      // Create the department
      const department = departmentRepository.create(req.body);
      const savedDepartment = await departmentRepository.save(department);
      
      // Return success with the created department
      return res.status(201).json({
        success: true,
        data: savedDepartment,
        message: 'Department created successfully'
      });
    }
  },
  true, // Require authentication
  null // No specific role required (role-based checks in the handlers)
);