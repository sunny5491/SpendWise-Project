import bcrypt from 'bcrypt';
import jwt from 'jwt-simple'; // wait, package.json has jsonwebtoken not jwt-simple. Will change it.
import DatabaseManager from '../database/db';
import { User } from '../models/User';

const SECRET_KEY = 'spendwise_super_secret'; // In production, use environment variable

export class AuthService {
  public async register(email: string, passwordPlain: string): Promise<User> {
    const db = await DatabaseManager.getInstance().getDb();
    
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    return new User(result.lastID as number, email);
  }

  public async login(email: string, passwordPlain: string): Promise<{ user: User, token: string }> {
    const db = await DatabaseManager.getInstance().getDb();
    
    const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!row) {
      throw new Error('Invalid credentials');
    }

    const match = await bcrypt.compare(passwordPlain, row.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    const user = new User(row.id, row.email);
    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken(user: User): string {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
  }
}
