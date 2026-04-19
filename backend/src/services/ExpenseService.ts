import DatabaseManager from '../database/db';
import { Expense } from '../models/Expense';

export class ExpenseService {
  public async getExpenses(userId: number): Promise<Expense[]> {
    const db = await DatabaseManager.getInstance().getDb();
    const rows = await db.all('SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows.map(r => new Expense(r.id, r.amount, r.category, r.created_at, r.user_id));
  }

  public validateAmount(amount: number): boolean {
    return !isNaN(amount) && amount > 0;
  }

  public async processTransaction(amount: number, category: string, userId: number): Promise<Expense> {
    if (!this.validateAmount(amount)) {
      throw new Error('Invalid amount');
    }

    const db = await DatabaseManager.getInstance().getDb();
    const result = await db.run(
      'INSERT INTO expenses (amount, category, user_id) VALUES (?, ?, ?)',
      [amount, category, userId]
    );

    const row = await db.get('SELECT * FROM expenses WHERE id = ?', [result.lastID]);
    return new Expense(row.id, row.amount, row.category, row.created_at, row.user_id);
  }

  public async deleteExpense(id: number, userId: number): Promise<void> {
    const db = await DatabaseManager.getInstance().getDb();
    await db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
  }
}
