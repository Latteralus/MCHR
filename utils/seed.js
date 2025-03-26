import { AppDataSource } from "./db";
import bcrypt from "bcryptjs";
import { User, UserRole } from "../entities/User";
import { Department } from "../entities/Department";
import { Employee, EmploymentStatus, EmploymentType } from "../entities/Employee";
import { format, subYears, subMonths, addDays } from "date-fns";

/**
 * Utility to seed the database with initial data for development
 */

// Initialize the database connection
const initializeDb = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection initialized");
    }
    return AppDataSource;
  } catch (error) {
    console.error("Error initializing database connection:", error);
    throw error;
  }
};

// Seed departments
const seedDepartments = async () => {
  const departmentRepository = AppDataSource.getRepository(Department);
  
  // Check if departments already exist
  const count = await departmentRepository.count();
  if (count > 0) {
    console.log(`Skipping department seeding - ${count} departments already exist`);
    return;
  }
  
  // Create departments
  const departments = [
    { name: "Executive", description: "Leadership and strategic direction" },
    { name: "Human Resources", description: "Employee management and company culture" },
    { name: "Finance", description: "Financial planning and accounting" },
    { name: "Information Technology", description: "Technology infrastructure and support" },
    { name: "Operations", description: "Day-to-day business operations" },
    { name: "Marketing", description: "Brand management and marketing campaigns" },
    { name: "Sales", description: "Customer acquisition and account management" },
    { name: "Customer Support", description: "Customer service and support" },
    { name: "Legal", description: "Legal compliance and risk management" },
    { name: "Research & Development", description: "Product and service innovation" }
  ];
  
  for (const dept of departments) {
    const department = departmentRepository.create(dept);
    await departmentRepository.save(department);
  }
  
  console.log(`Created ${departments.length} departments`);
};

// Seed users
const seedUsers = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const departmentRepository = AppDataSource.getRepository(Department);
  
  // Check if users already exist
  const count = await userRepository.count();
  if (count > 0) {
    console.log(`Skipping user seeding - ${count} users already exist`);
    return;
  }
  
  // Get all departments
  const departments = await departmentRepository.find();
  
  // Create admin user
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = userRepository.create({
    name: "System Administrator",
    email: "admin@mountaincare.com",
    passwordHash: adminPasswordHash,
    role: UserRole.ADMIN,
    department: departments.find(d => d.name === "Information Technology")
  });
  
  await userRepository.save(admin);
  
  // Create HR manager
  const hrPasswordHash = await bcrypt.hash("hr123", 10);
  const hrManager = userRepository.create({
    name: "Faith Calkins",
    email: "faith@mountaincare.com",
    passwordHash: hrPasswordHash,
    role: UserRole.HR_MANAGER,
    department: departments.find(d => d.name === "Human Resources")
  });
  
  await userRepository.save(hrManager);
  
  // Create department heads
  for (const dept of departments) {
    if (dept.name !== "Human Resources") {
      const managerPasswordHash = await bcrypt.hash("manager123", 10);
      const deptHead = userRepository.create({
        name: `${dept.name} Manager`,
        email: `manager.${dept.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@mountaincare.com`,
        passwordHash: managerPasswordHash,
        role: UserRole.DEPARTMENT_HEAD,
        department: dept
      });
      
      await userRepository.save(deptHead);
      
      // Update department with manager ID
      dept.managerId = deptHead.id;
      await departmentRepository.save(dept);
    }
  }
  
  // Create a few regular employees
  const employeePasswordHash = await bcrypt.hash("employee123", 10);
  for (let i = 1; i <= 5; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    const employee = userRepository.create({
      name: `Test Employee ${i}`,
      email: `employee${i}@mountaincare.com`,
      passwordHash: employeePasswordHash,
      role: UserRole.EMPLOYEE,
      department: department
    });
    
    await userRepository.save(employee);
  }
  
  console.log("Created users: 1 admin, 1 HR manager, department heads, and 5 employees");
};

// Seed employees
const seedEmployees = async () => {
  const employeeRepository = AppDataSource.getRepository(Employee);
  const userRepository = AppDataSource.getRepository(User);
  const departmentRepository = AppDataSource.getRepository(Department);
  
  // Check if employees already exist
  const count = await employeeRepository.count();
  if (count > 0) {
    console.log(`Skipping employee seeding - ${count} employees already exist`);
    return;
  }
  
  // Get all users and departments
  const users = await userRepository.find({ relations: ["department"] });
  const departments = await departmentRepository.find();
  
  // Create an employee record for each user
  for (const user of users) {
    // Skip the admin user
    if (user.role === UserRole.ADMIN) {
      continue;
    }
    
    // Generate a hire date between 1-5 years ago
    const yearsAgo = Math.floor(Math.random() * 5) + 1;
    const hireDate = subYears(new Date(), yearsAgo);
    
    // Set position based on role
    let position = "Staff Member";
    if (user.role === UserRole.HR_MANAGER) {
      position = "HR Director";
    } else if (user.role === UserRole.DEPARTMENT_HEAD) {
      position = `${user.department?.name} Manager`;
    }
    
    // Create employee
    const employee = employeeRepository.create({
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ").slice(1).join(" "),
      email: user.email,
      phone: `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      address: `${Math.floor(100 + Math.random() * 9900)} Main St`,
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      hireDate,
      status: EmploymentStatus.ACTIVE,
      employmentType: EmploymentType.FULL_TIME,
      position,
      salary: position.includes("Manager") ? 85000 + Math.random() * 40000 : 50000 + Math.random() * 30000,
      department: user.department,
      departmentId: user.department?.id
    });
    
    await employeeRepository.save(employee);
  }
  
  console.log(`Created ${users.length - 1} employee records`);
};

// Run the seeding process
const runSeed = async () => {
  try {
    const dataSource = await initializeDb();
    
    // Seed in order of dependencies
    await seedDepartments();
    await seedUsers();
    await seedEmployees();
    
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  runSeed().catch(error => {
    console.error("Unhandled error during seeding:", error);
    process.exit(1);
  });
}