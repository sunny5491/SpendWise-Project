import ApiService from './ApiService';

class AuthService extends ApiService {
  public async register(email: string, password: string):Promise<any> {
    const response = await this.http.post('/register', { email, password });
    return response.data;
  }

  public async login(email: string, password: string): Promise<any> {
    const response = await this.http.post('/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('spendwise_token', response.data.token);
    }
    return response.data;
  }

  public logout(): void {
    localStorage.removeItem('spendwise_token');
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('spendwise_token');
  }
}

export default new AuthService();
