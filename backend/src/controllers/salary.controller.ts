import { Request, Response } from 'express';
import salaryService from '../services/salary.service';
import billingService from '../services/billing.service';
import pdfService from '../services/pdf.service';

class SalaryController {
  async lookup(req: Request, res: Response) {
    try {
      const params = req.body;

      // Validate required fields
      if (!params.job_title || !params.country_code || !params.currency) {
        return res.status(400).json({
          error: 'Missing Fields',
          message: 'job_title, country_code, and currency are required',
        });
      }

      const intelligence = await salaryService.lookup(params);

      res.status(200).json({
        success: true,
        data: intelligence,
      });
    } catch (error) {
      console.error('Error looking up salary:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to look up salary data',
      });
    }
  }

  async submitSalary(req: Request, res: Response) {
    try {
      const salaryData = req.body;

      // Validate required fields
      const requiredFields = ['job_title', 'total_comp', 'base_salary', 'currency', 'city', 'country', 'employment_type', 'offer_year'];
      const missingFields = requiredFields.filter(field => !salaryData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: 'Missing Fields',
          message: `Required fields missing: ${missingFields.join(', ')}`,
        });
      }

      const result = await salaryService.submitSalary(salaryData);

      // If user is authenticated, apply credits
      const user = (req as any).user;
      if (user && result.credits_earned > 0) {
        await billingService.applyCredit(user.id, result.credits_earned);
      }

      res.status(200).json({
        success: true,
        message: 'Salary submitted successfully',
        credits_earned: result.credits_earned,
      });
    } catch (error: any) {
      console.error('Error submitting salary:', error);
      
      if (error.message.includes('duplicate')) {
        res.status(409).json({
          error: 'Duplicate Submission',
          message: 'This salary has already been submitted',
        });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to submit salary data',
        });
      }
    }
  }

  async generatePDF(req: Request, res: Response) {
    try {
      const salaryData = req.body;

      // Validate required fields
      if (!salaryData.role_detected || !salaryData.range) {
        return res.status(400).json({
          error: 'Missing Fields',
          message: 'role_detected and range are required',
        });
      }

      const pdfBuffer = await pdfService.generateSalaryReport(salaryData);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="paygrade-report-${Date.now()}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to generate PDF report',
      });
    }
  }
}

export default new SalaryController();