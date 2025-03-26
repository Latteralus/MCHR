import { apiHandler, parseQueryParams, validateDepartmentAccess, throwApiError } from '../../../utils/apiHandler';
import { AppDataSource } from '../../../utils/db';
import { Employee } from '../../../entities/Employee';
import { Department } from '../../../entities/Department';

export default apiHandler(
  {
    // GET: List employees with filtering, pagination, and sorting
    GET: async (req, res, session) => {
      const employeeRepository = AppDataSource.getRepository(Employee);
      const params = parseQueryParams(req.query);
      
      // Build the query
      const queryBuilder = employeeRepository.createQueryBuilder('employee')
        .leftJoinAndSelect('employee.department', 'department')
        .skip(params.skip)
        .take(params.take);
      
      // Apply department filter based on user role
      if (session.user.role === 'department_head') {
        // Department heads can only see employees in their department
        queryBuilder.andWhere('employee.departmentId = :departmentId', { 
          departmentId: session.user.departmentId 
        });
      } else if (params.departmentId) {
        // Only apply explicit department filter if user has access
        if (!validateDepartmentAccess(session, params.departmentId)) {
          throwApiError.forbidden('You do not have access to this department');
        }
        queryBuilder.andWhere('employee.departmentId = :departmentId', { 
          departmentId: params.departmentId 
        });
      }
      
      // Apply search if provided
      if (params.search) {
        queryBuilder.andWhere(
          '(employee.firstName ILIKE :search OR employee.lastName ILIKE :search OR employee.email ILIKE :search OR employee.position ILIKE :search)',
          { search: `%${params.search}%` }
        );
      }
      
      // Apply status filter if provided
      if (req.query.status) {
        queryBuilder.andWhere('employee.status = :status', { status: req.query.status });
      }
      
      // Apply sorting
      if (params.order) {
        const [sortField, sortOrder] = Object.entries(params.order)[0];
        queryBuilder.orderBy(`employee.${sortField}`, sortOrder);
      } else {
        // Default sort by last name
        queryBuilder.orderBy('employee.lastName', 'ASC');
      }
      
      // Get total count for pagination
      const total = await queryBuilder.getCount();
      
      // Execute the query
      const employees = await queryBuilder.getMany();
      
      // Return the results
      return res.status(200).json({
        success: true,
        data: {
          employees,
          pagination: {
            total,
            skip: params.skip,
            take: params.take,
            pages: Math.ceil(total / params.take)
          }
        }
      });
    },
    
    // POST: Create a new employee
    POST: async (req, res, session) => {
      // Validate required fields
      const { firstName, lastName, email, position, hireDate, departmentId } = req.body;
      
      if (!firstName || !lastName || !email || !position || !hireDate) {
        throwApiError.badRequest('Missing required fields');
      }
      
      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throwApiError.badRequest('Invalid email format');
      }
      
      // Validate department access if provided
      if (departmentId && !validateDepartmentAccess(session, departmentId)) {
        throwApiError.forbidden('You do not have access to this department');
      }
      
      // If department ID is provided, check if it exists
      if (departmentId) {
        const departmentRepository = AppDataSource.getRepository(Department);
        const department = await departmentRepository.findOneBy({ id: departmentId });
        
        if (!department) {
          throwApiError.badRequest('Department not found');
        }
      }
      
      // Check if employee with this email already exists
      const employeeRepository = AppDataSource.getRepository(Employee);
      const existingEmployee = await employeeRepository.findOneBy({ email });
      
      if (existingEmployee) {
        throwApiError.conflict('An employee with this email already exists');
      }
      
      // Create the new employee
      const employee = employeeRepository.create({
        ...req.body,
        // Parse date strings into Date objects
        hireDate: new Date(hireDate),
        terminationDate: req.body.terminationDate ? new Date(req.body.terminationDate) : null,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null
      });
      
      // Save to database
      const savedEmployee = await employeeRepository.save(employee);
      
      // Return success with the created employee
      return res.status(201).json({
        success: true,
        data: savedEmployee,
        message: 'Employee created successfully'
      });
    }
  },
  true, // Require authentication
  null // No specific role required (role-based checks are handled within the handlers)
);