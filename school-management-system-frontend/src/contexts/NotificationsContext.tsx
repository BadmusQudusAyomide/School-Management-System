import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import type { Notification } from '../types';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const getNotificationId = (notification: Notification) => notification._id ?? notification.id ?? '';

export const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }

  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setNotifications(await notificationService.list());
    } catch (fetchError) {
      console.error(fetchError);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshNotifications();
  }, [isAuthenticated]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((current) =>
        current.map((notification) =>
          getNotificationId(notification) === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (updateError) {
      console.error(updateError);
      setError('Failed to update notification state.');
    }
  };

  const value: NotificationsContextType = {
    notifications,
    unreadCount: notifications.filter((notification) => !notification.isRead).length,
    loading,
    error,
    refreshNotifications,
    markAsRead,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};
