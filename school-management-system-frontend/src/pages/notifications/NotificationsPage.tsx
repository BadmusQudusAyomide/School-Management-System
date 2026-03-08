import React from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

import DashboardState from '../../components/dashboard/DashboardState';
import { useNotifications } from '../../contexts/NotificationsContext';
import type { Notification } from '../../types';

const getNotificationId = (notification: Notification) => notification._id ?? notification.id ?? '';

const getNotificationAccent = (type: Notification['type']) => {
  switch (type) {
    case 'notice':
      return 'text-sky-300 border-sky-400/30 bg-sky-500/10';
    case 'payment':
      return 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10';
    case 'report':
      return 'text-amber-300 border-amber-400/30 bg-amber-500/10';
    default:
      return 'text-white border-white/15 bg-white/5';
  }
};

const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, loading, error, refreshNotifications, markAsRead } = useNotifications();

  if (loading && !notifications.length) {
    return <DashboardState title="Loading notifications" message="Fetching in-app alerts and updates..." />;
  }

  if (error && !notifications.length) {
    return <DashboardState title="Notifications unavailable" message={error} actionLabel="Retry" onAction={() => void refreshNotifications()} />;
  }

  return (
    <div className="space-y-6">
      <div className="card-glassmorphism">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="mt-2 text-white/70">View school notices, payment alerts, reports, and system messages.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-sm text-white/60">Unread</p>
            <p className="text-3xl font-semibold text-white">{unreadCount}</p>
          </div>
        </div>
      </div>

      {error && notifications.length ? (
        <DashboardState title="Notification warning" message={error} actionLabel="Refresh" onAction={() => void refreshNotifications()} />
      ) : null}

      <div className="space-y-4">
        {notifications.length ? (
          notifications.map((notification) => {
            const notificationId = getNotificationId(notification);
            const accent = getNotificationAccent(notification.type);

            return (
              <div
                key={notificationId}
                className={`card-glassmorphism border ${notification.isRead ? 'border-white/10' : 'border-white/20'} transition-colors`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${accent}`}>
                      <Bell size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                        {!notification.isRead ? (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-200">
                            New
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/75">{notification.message}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/50">
                        <span className="capitalize">{notification.type}</span>
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {!notification.isRead ? (
                    <button
                      type="button"
                      onClick={() => void markAsRead(notificationId)}
                      className="inline-flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/15"
                    >
                      <CheckCircle2 size={16} />
                      Mark as read
                    </button>
                  ) : (
                    <span className="text-sm text-white/50">Read</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="card-glassmorphism py-12 text-center">
            <h2 className="text-xl font-semibold text-white">No notifications yet</h2>
            <p className="mt-2 text-white/65">Email and in-app alerts will appear here when notices or updates are published.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
