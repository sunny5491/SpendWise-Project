import ApiService from './ApiService';

export interface ExpenseData {
  id: number;
  amount: number;
  category: string;
  created_at: string;
  user_id: number;
}

class ExpenseService extends ApiService {
  public async getExpenses(): Promise<ExpenseData[]> {
    const response = await this.http.get('/expenses');
    return response.data;
  }

  public async addExpense(amount: number, category: string): Promise<ExpenseData> {
    const response = await this.http.post('/expenses', { amount, category });
    return response.data;
  }

  public async deleteExpense(id: number): Promise<void> {
    await this.http.delete(`/expenses/${id}`);
  }
}

export default new ExpenseService();
