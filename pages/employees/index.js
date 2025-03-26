import { useState } from 'react';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import { AppDataSource } from '../../utils/db';
import { Employee } from '../../entities/Employee';
import EmployeeList from '../../components/employee/EmployeeList';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';

// Import Layout component
import Layout from '../../components/common/Layout';

export default function EmployeesPage({ initialEmployees, initialPagination, initialFilters }) {
  const { user } = useAuth();
  
  return (
    <Layout>
      <Head>
        <title>Employees | Mountain Care HR</title>
        <meta name="description" content="Employee management for Mountain Care HR" />
      </Head>

      <div className="header">
        <div className="page-title">
          <h1>Employees</h1>
          <div className="page-subtitle">Manage your organization's workforce</div>
        </div>
        {(user?.role === 'admin' || user?.role === 'hr_manager') && (
          <div className="header-actions">
            <Link href="/employees/new" className="btn btn-primary">
              <i className="fas fa-plus"></i> New Employee
            </Link>
          </div>
        )}
      </div>

      <EmployeeList 
        initialEmployees={initialEmployees} 
        initialPagination={initialPagination}
        initialFilters={initialFilters}
      />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // Check authentication
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Parse query parameters
    const { search, departmentId, status, sortBy = 'lastName', order = 'asc', skip = '0', take = '10' } = context.query;
    
    // Create query builder
    const queryBuilder = AppDataSource.getRepository(Employee)
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .skip(parseInt(skip, 10))
      .take(parseInt(take, 10));
    
    // Apply filters
    // Apply department filter based on user role
    if (session.user.role === 'department_head') {
      // Department heads can only see employees in their department
      queryBuilder.andWhere('employee.departmentId = :departmentId', { 
        departmentId: session.user.departmentId 
      });
    } else if (departmentId) {
      queryBuilder.andWhere('employee.departmentId = :departmentId', { departmentId });
    }
    
    // Apply search if provided
    if (search) {
      queryBuilder.andWhere(
        '(employee.firstName ILIKE :search OR employee.lastName ILIKE :search OR employee.email ILIKE :search OR employee.position ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    // Apply status filter if provided
    if (status) {
      queryBuilder.andWhere('employee.status = :status', { status });
    }
    
    // Apply sorting
    queryBuilder.orderBy(`employee.${sortBy}`, order.toUpperCase());
    
    // Get total count for pagination
    const total = await queryBuilder.getCount();
    
    // Execute the query
    const employees = await queryBuilder.getMany();
    
    // Return props
    return {
      props: {
        initialEmployees: JSON.parse(JSON.stringify(employees)),
        initialPagination: {
          total,
          skip: parseInt(skip, 10),
          take: parseInt(take, 10),
          pages: Math.ceil(total / parseInt(take, 10))
        },
        initialFilters: {
          search: search || '',
          departmentId: departmentId || '',
          status: status || '',
          sortBy,
          order
        }
      },
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    
    // Return empty data on error
    return {
      props: {
        initialEmployees: [],
        initialPagination: {
          total: 0,
          skip: 0,
          take: 10,
          pages: 0
        },
        initialFilters: {
          search: '',
          departmentId: '',
          status: '',
          sortBy: 'lastName',
          order: 'asc'
        }
      },
    };
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      // Leave connection open for other requests
      // await AppDataSource.destroy();
    }
  }
}