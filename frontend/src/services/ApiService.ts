import axios, { type AxiosInstance } from 'axios';

class ApiService {
  protected http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.http.interceptors.request.use((config) => {
      const token = localStorage.getItem('spendwise_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
}

export default ApiService;
