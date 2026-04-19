import { Request, Response } from 'express';
import { ExpenseService } from '../services/ExpenseService';

export class ExpenseController {
  private expenseService: ExpenseService;

  constructor() {
    this.expenseService = new ExpenseService();
  }

  public getExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const expenses = await this.expenseService.getExpenses(userId);
      res.status(200).json(expenses);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { amount, category } = req.body;
      const expense = await this.expenseService.processTransaction(amount, category, userId);
      res.status(201).json(expense);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public deleteExpense = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const expenseId = parseInt(req.params.id, 10);
      await this.expenseService.deleteExpense(expenseId, userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
