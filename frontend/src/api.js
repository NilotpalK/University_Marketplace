import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:8000'
});

// Add request interceptor to automatically add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => {
  const formData = new FormData();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  return API.post('/auth/login', formData);
};

export const signup = (userData) => API.post('/auth/signup', userData);

export const getMyListings = () => API.get('/listings/my-listings');

export const createListing = (listingData) => API.post('/listings/create', listingData, {
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAllListings = () => API.get('/listings/all'); 