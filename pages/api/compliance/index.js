import { AppDataSource } from "../../../utils/db";
import Compliance from "../../../entities/Compliance";
import { apiHandler } from "../../../utils/apiHandler";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default apiHandler({
  GET: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const complianceRepository = AppDataSource.getRepository(Compliance);
      
      // For admins and HR managers, show all records
      // For department managers, only show their department records
      // For regular employees, only show their own records
      let query = {};
      
      if (session.user.role !== 'admin' && session.user.role !== 'hr_manager') {
        if (session.user.role === 'department_manager') {
          query = { 
            department: { id: session.user.departmentId } 
          };
        } else {
          query = { 
            employee: { id: session.user.employeeId } 
          };
        }
      }
      
      const records = await complianceRepository.find({
        where: query,
        relations: ['employee', 'employee.department'],
      });
      
      return res.status(200).json(records);
    } catch (error) {
      console.error("Error fetching compliance records:", error);
      return res.status(500).json({ message: "Failed to fetch compliance records" });
    }
  },
  
  POST: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Only admin and HR managers can create compliance records
    if (session.user.role !== 'admin' && session.user.role !== 'hr_manager') {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    
    try {
      const complianceRepository = AppDataSource.getRepository(Compliance);
      const complianceData = req.body;
      
      // Create new compliance record
      const newRecord = complianceRepository.create(complianceData);
      await complianceRepository.save(newRecord);
      
      return res.status(201).json(newRecord);
    } catch (error) {
      console.error("Error creating compliance record:", error);
      return res.status(500).json({ message: "Failed to create compliance record" });
    }
  }
});