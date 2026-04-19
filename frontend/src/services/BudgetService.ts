import ApiService from './ApiService';

export interface BudgetStatus {
  limit: number;
  spent: number;
  remaining: number;
}

class BudgetService extends ApiService {
  public async setBudget(amount_limit: number, month: string): Promise<any> {
    const response = await this.http.post('/budgets', { amount_limit, month });
    return response.data;
  }

  public async getBudgetStatus(month: string): Promise<BudgetStatus> {
    const response = await this.http.get(`/budgets/${month}`);
    return response.data;
  }
}

export default new BudgetService();
