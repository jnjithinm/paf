import axios, {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api: AxiosInstance = axios.create({
  baseURL: 'http://65.1.32.205:8080',
  // timeout: 15000,
});
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if(token){
      config.headers['Authorization'] =`Bearer ${token}`;
    }
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    if (config.method?.toUpperCase() === 'GET') {
      console.log(
        `[API] Request: ${config.method?.toUpperCase()} ${config.url}  ${
          config.headers
        } `,
      );
    } else {
      console.log(
        `[API] Request: ${config.method?.toUpperCase()} ${config.url}  ${
          config.headers
        } `,
        config.data,
      );
    }
    return config;
  },
  error => {
    const {config, response} = error;
    const retries = config?.retries?.count || 3;
    if (response?.status === 503) {
      if (retries < MAX_RETRIES) {
        const delay = Math.pow(2, retries) * RETRY_DELAY;
        return new Promise(resolve =>
          setTimeout(() => resolve(api(config)), delay),
        );
      }
    }
    return Promise.reject(error);
  },
);
export default api;
