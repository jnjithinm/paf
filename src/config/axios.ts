import axios, {AxiosInstance, AxiosError} from 'axios';

import endPoints from './endPoints';
import { getToken } from '../utils/functions/localStorageOperations';


const api: AxiosInstance = axios.create({
  baseURL: 'http://65.1.32.205:8080',
  timeout: 100,
});

api.interceptors.request.use(
  async config => {
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
  response => response,
  async (error: AxiosError) => {
    if (!error.response) {
      let message = 'Network error, please try again later.';

      if (
        error.code === 'ECONNABORTED' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNREFUSED'
      ) {
        message = 'Server not available, please try again later.';
      } else if (error.message === 'Network Error') {
        message = 'Please check your internet connection.';
      }
      // store.dispatch(setShowMessage({status: 'Error', message}));
      return Promise.reject(error); // Return the errorMessage
    } else {
      // const status = error.response.status;
      // let message = 'An error occurred. Please try again.';

      // if (status >= 500) {
      //   message = 'Server error, please try again later.';
      // } else if (status === 401) {
      //   message = 'Unauthorized access. Please log in again.';
      // } else if (status === 403) {
      //   message = 'Forbidden. You do not have permission to perform this action.';
      // } else if (status === 404) {
      //   message = 'Resource not found.';
      // } else if (status >= 400) {
      //   message = 'Client error, please try again.';
      // }

      return Promise.reject(error);
    }
  },
);

export default api;
