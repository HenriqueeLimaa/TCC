import axios from 'axios';
import { API_URL } from '@/constants/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to the request headers
apiClient.interceptors.request.use(async (config) => {
  const token = 'token';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export default apiClient;