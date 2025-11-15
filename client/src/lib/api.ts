/**
 * API Client using Axios
 * 
 * Centralized API communication layer for the frontend.
 * This module handles all HTTP requests to the backend API.
 * 
 * Architectural Decision: Using Axios for consistent error handling
 * and request/response interceptors.
 */

import axios from "axios";

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api" || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  
  getCurrentUser: () =>
    api.get("/auth/me"),
};

// Reports API endpoints
export const reportsAPI = {
  getAll: (params?: { category?: string; status?: string; search?: string }) =>
    api.get("/reports", { params }),
  
  getById: (id: string) =>
    api.get(`/reports/${id}`),
  
  create: (data: {
    title: string;
    description: string;
    category: string;
    location: string;
    imageUrl?: string;
  }) =>
    api.post("/reports", data),
  
  update: (id: string, data: { status: string }) =>
    api.put(`/reports/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/reports/${id}`),
  
  getMyReports: () =>
    api.get("/reports/my/reports"),
  
  getStats: () =>
    api.get("/reports/admin/stats"),
};

// Upload API endpoint
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
