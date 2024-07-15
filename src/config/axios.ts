import axios, { AxiosInstance } from 'axios';
import Config from 'react-native-config'

import endPoints from './endPoints';
import { getToken } from '../utils/functions/localStorageOperations';




const api: AxiosInstance = axios.create({
  baseURL: Config.BASE_URL,
  timeout: 5000,
});




api.interceptors.request.use(
  async config => {
    console.log("dfsf",Config.BASE_URL)
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = config.url?.includes(
      endPoints.SAVE_EVIDENCE_CARD,
    )
      ? 'multipart/form-data'
      : 'application/json';

    console.log(
      `[API] Request: ${config.method?.toUpperCase()} ${config.url}`,
      config.method?.toUpperCase() === 'GET' ? '' : config.data,
    );

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    console.log('[API] Response:', response.data);
    return response;
  },
);

export default api;
