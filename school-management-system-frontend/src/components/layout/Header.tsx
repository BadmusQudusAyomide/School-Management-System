import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationsContext';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-white"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 w-80 shadow-lg">
            <Search size={18} className="text-white/60" />
            <input
              type="text"
              placeholder="Search students, teachers, classes..."
              className="bg-transparent flex-1 outline-none text-sm text-white placeholder-white/60"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <Bell size={20} className="text-white" />
            {unreadCount ? (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-white text-black text-xs rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : null}
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <img
              src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
              alt={user?.name || 'User avatar'}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">
                {user?.name}
              </p>
              <p className="text-xs text-white/60 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
