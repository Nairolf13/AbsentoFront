import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

let authToken = localStorage.getItem('auth_token');

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

if (authToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      setAuthToken(null);
    }
    return Promise.reject(error);
  }
);