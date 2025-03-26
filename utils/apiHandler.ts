import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { AppDataSource } from './db';

/**
 * A wrapper for API route handlers to provide consistent error handling and response format
 * @param {Object} handlers - Object containing handler functions for different HTTP methods
 * @param {boolean} requireAuth - Whether the endpoint requires authentication
 * @param {string} requiredRole - Optional role required to access this endpoint
 */
export const apiHandler = (
  handlers,
  requireAuth = true,
  requiredRole = null
) => {
  return async (req, res) => {
    // Ensure database connection
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      return res.status(500).json({
        success: false,
        error: 'Database connection failed',
      });
    }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Check request method is supported
    const handler = handlers[req.method];
    if (!handler) {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }

    // Authenticate request if required
    let session = null;
    if (requireAuth) {
      session = await getServerSession(req, res, authOptions);
      
      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      // Check required role if specified
      if (requiredRole && session.user.role !== requiredRole) {
        // Allow if user role is admin (they can access everything)
        if (session.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            error: 'Forbidden - Insufficient permissions',
          });
        }
      }
    }

    try {
      // Execute the handler function
      await handler(req, res, session);
    } catch (error) {
      console.error(`API Error [${req.method} ${req.url}]:`, error);

      // Handle specific TypeORM errors
      if (error.code === '23505') {
        // Duplicate key error
        return res.status(409).json({
          success: false,
          error: 'A record with this information already exists',
        });
      }

      // Return appropriate error response
      const status = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      return res.status(status).json({
        success: false,
        error: message,
      });
    }
  };
};

// Helper function to parse query parameters
export const parseQueryParams = (query) => {
  const params = {};
  
  // Handle pagination
  params.skip = query.skip ? parseInt(query.skip, 10) : 0;
  params.take = query.take ? parseInt(query.take, 10) : 10;
  
  // Handle sorting
  if (query.sortBy) {
    params.order = {
      [query.sortBy]: (query.order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC'),
    };
  }
  
  // Handle search and filters (basic implementation, can be expanded)
  if (query.search) {
    params.search = query.search;
  }
  
  // Department filter
  if (query.departmentId) {
    params.departmentId = query.departmentId;
  }
  
  return params;
};

// Helper function to validate access to department data
export const validateDepartmentAccess = (session, departmentId) => {
  // Skip validation if no department ID is provided
  if (!departmentId) return true;
  
  // Admins and HR managers can access all departments
  if (session.user.role === 'admin' || session.user.role === 'hr_manager') {
    return true;
  }
  
  // Department heads can only access their own department
  if (session.user.role === 'department_head') {
    return session.user.departmentId === departmentId;
  }
  
  // Regular employees can't access department data
  return false;
};

// Error class for API errors
export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Helper to throw common API errors
export const throwApiError = {
  notFound: (message = 'Resource not found') => {
    throw new ApiError(message, 404);
  },
  badRequest: (message = 'Bad request') => {
    throw new ApiError(message, 400);
  },
  unauthorized: (message = 'Unauthorized') => {
    throw new ApiError(message, 401);
  },
  forbidden: (message = 'Forbidden') => {
    throw new ApiError(message, 403);
  },
  conflict: (message = 'Resource already exists') => {
    throw new ApiError(message, 409);
  },
};