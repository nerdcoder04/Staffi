import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '/'
  }
});

export const loginHR = async (walletAddress: string) => {
  try {
    const response = await api.post('/auth/hr-login', { walletAddress });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to login'
    };
  }
};

export default api; 