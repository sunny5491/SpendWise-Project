import express from 'express';
import cors from 'cors';
import { AuthController } from './controllers/AuthController';
import { ExpenseController } from './controllers/ExpenseController';
import { BudgetController } from './controllers/BudgetController';
import { authMiddleware } from './middleware/authMiddleware';
import DatabaseManager from './database/db';

class App {
  public app: express.Application;
  private authController: AuthController;
  private expenseController: ExpenseController;
  private budgetController: BudgetController;

  constructor() {
    this.app = express();
    this.authController = new AuthController();
    this.expenseController = new ExpenseController();
    this.budgetController = new BudgetController();
    
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    // Auth routes
    this.app.post('/api/register', this.authController.register);
    this.app.post('/api/login', this.authController.login);

    // Expense routes
    this.app.get('/api/expenses', authMiddleware, this.expenseController.getExpenses);
    this.app.post('/api/expenses', authMiddleware, this.expenseController.createExpense);
    this.app.delete('/api/expenses/:id', authMiddleware, this.expenseController.deleteExpense);

    // Budget routes
    this.app.post('/api/budgets', authMiddleware, this.budgetController.setBudget);
    this.app.get('/api/budgets/:month', authMiddleware, this.budgetController.getBudgetStatus);
  }

  public async listen(port: number) {
    // Initialize DB before starting server
    await DatabaseManager.getInstance().getDb();
    
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }
}

const app = new App();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.listen(PORT);
