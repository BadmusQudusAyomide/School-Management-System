import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import type { ApiResponse, User } from '../types';
import {
  clearAuthStorage,
  getStoredAccessToken,
  setStoredAccessToken,
  setStoredUser,
} from './authStorage';

interface AuthPayload {
  user: User;
  accessToken: string;
  tokenType: 'Bearer';
  accessTokenExpiresIn: string;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post<ApiResponse<AuthPayload>>('/auth/refresh')
      .then((response) => {
        const payload = response.data.data;
        setStoredAccessToken(payload.accessToken);
        setStoredUser(payload.user);
        return payload.accessToken;
      })
      .catch((error) => {
        clearAuthStorage();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const requestPath = originalRequest?.url ?? '';
    const isAuthRequest =
      requestPath.includes('/auth/login') ||
      requestPath.includes('/auth/register') ||
      requestPath.includes('/auth/refresh') ||
      requestPath.includes('/auth/logout');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      const nextToken = await refreshAccessToken();
      if (nextToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      }

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export type { AuthPayload };
