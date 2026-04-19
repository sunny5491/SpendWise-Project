import DatabaseManager from '../database/db';
import { Budget } from '../models/Budget';

export class BudgetService {
  public async setBudget(amountLimit: number, month: string, userId: number): Promise<Budget> {
    const db = await DatabaseManager.getInstance().getDb();
    
    // Upsert budget logic
    const existing = await db.get('SELECT * FROM budgets WHERE user_id = ? AND month = ?', [userId, month]);
    
    if (existing) {
      await db.run('UPDATE budgets SET amount_limit = ? WHERE id = ?', [amountLimit, existing.id]);
      return new Budget(existing.id, amountLimit, month, userId);
    } else {
      const result = await db.run(
        'INSERT INTO budgets (amount_limit, month, user_id) VALUES (?, ?, ?)',
        [amountLimit, month, userId]
      );
      return new Budget(result.lastID as number, amountLimit, month, userId);
    }
  }

  public async getBudget(userId: number, month: string): Promise<Budget | null> {
    const db = await DatabaseManager.getInstance().getDb();
    const row = await db.get('SELECT * FROM budgets WHERE user_id = ? AND month = ?', [userId, month]);
    
    if (!row) return null;
    return new Budget(row.id, row.amount_limit, row.month, row.user_id);
  }

  public async calculateRemaining(userId: number, month: string): Promise<{ limit: number, spent: number, remaining: number } | null> {
    const budget = await this.getBudget(userId, month);
    if (!budget) return null;

    const db = await DatabaseManager.getInstance().getDb();
    
    // In SQLite, datetime('now') and date parsing might be tricky with "month", 
    // assuming month is in "YYYY-MM" format.
    const row = await db.get(
      "SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND strftime('%Y-%m', created_at) = ?",
      [userId, month]
    );

    const spent = row?.total || 0;
    const remaining = budget.calculateRemaining(spent);

    return {
      limit: budget.amount_limit,
      spent: spent,
      remaining: remaining
    };
  }
}
