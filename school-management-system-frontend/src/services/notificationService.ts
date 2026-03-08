import { api } from '../lib/api';
import type { ApiResponse, Notification } from '../types';

export const notificationService = {
  async list() {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');
    return response.data.data ?? [];
  },

  async markAsRead(notificationId: string) {
    const response = await api.put<ApiResponse<Notification>>(`/notifications/${notificationId}/read`);
    return response.data.data;
  },
};
