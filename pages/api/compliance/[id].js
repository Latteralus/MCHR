import { AppDataSource } from "../../../utils/db";
import Compliance from "../../../entities/Compliance";
import { apiHandler } from "../../../utils/apiHandler";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default apiHandler({
  GET: async (req, res) => {
    const { id } = req.query;
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const complianceRepository = AppDataSource.getRepository(Compliance);
      
      const record = await complianceRepository.findOne({
        where: { id },
        relations: ['employee', 'employee.department'],
      });
      
      if (!record) {
        return res.status(404).json({ message: "Compliance record not found" });
      }
      
      // Check permission based on role
      if (
        session.user.role !== 'admin' && 
        session.user.role !== 'hr_manager' &&
        (session.user.role === 'department_manager' && 
         record.employee.department.id !== session.user.departmentId) &&
        (session.user.role === 'employee' && 
         record.employee.id !== session.user.employeeId)
      ) {
        return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
      }
      
      return res.status(200).json(record);
    } catch (error) {
      console.error("Error fetching compliance record:", error);
      return res.status(500).json({ message: "Failed to fetch compliance record" });
    }
  },
  
  PUT: async (req, res) => {
    const { id } = req.query;
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Only admin and HR managers can update compliance records
    if (session.user.role !== 'admin' && session.user.role !== 'hr_manager') {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    
    try {
      const complianceRepository = AppDataSource.getRepository(Compliance);
      
      const record = await complianceRepository.findOne({
        where: { id }
      });
      
      if (!record) {
        return res.status(404).json({ message: "Compliance record not found" });
      }
      
      // Update record
      complianceRepository.merge(record, req.body);
      const updatedRecord = await complianceRepository.save(record);
      
      return res.status(200).json(updatedRecord);
    } catch (error) {
      console.error("Error updating compliance record:", error);
      return res.status(500).json({ message: "Failed to update compliance record" });
    }
  },
  
  DELETE: async (req, res) => {
    const { id } = req.query;
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Only admin and HR managers can delete compliance records
    if (session.user.role !== 'admin' && session.user.role !== 'hr_manager') {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    
    try {
      const complianceRepository = AppDataSource.getRepository(Compliance);
      
      const record = await complianceRepository.findOne({
        where: { id }
      });
      
      if (!record) {
        return res.status(404).json({ message: "Compliance record not found" });
      }
      
      await complianceRepository.remove(record);
      
      return res.status(200).json({ message: "Compliance record deleted successfully" });
    } catch (error) {
      console.error("Error deleting compliance record:", error);
      return res.status(500).json({ message: "Failed to delete compliance record" });
    }
  }
});