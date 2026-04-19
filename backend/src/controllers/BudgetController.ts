import { Request, Response } from 'express';
import { BudgetService } from '../services/BudgetService';

export class BudgetController {
  private budgetService: BudgetService;

  constructor() {
    this.budgetService = new BudgetService();
  }

  public setBudget = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { amount_limit, month } = req.body; // month format: 'YYYY-MM'
      const budget = await this.budgetService.setBudget(amount_limit, month, userId);
      res.status(200).json(budget);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public getBudgetStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { month } = req.params;
      const status = await this.budgetService.calculateRemaining(userId, month);
      
      if (!status) {
        res.status(404).json({ error: 'Budget not found for this month' });
        return;
      }
      
      res.status(200).json(status);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
