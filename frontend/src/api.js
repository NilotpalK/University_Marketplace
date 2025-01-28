import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/auth',
});

export const login = (credentials) => {
  const formData = new FormData();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  return API.post('/login', formData);
};

export const signup = (userData) => API.post('/signup', userData); 