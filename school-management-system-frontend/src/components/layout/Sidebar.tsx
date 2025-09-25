import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  GraduationCap, 
  Calendar, 
  ClipboardCheck, 
  BookOpen, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Settings, 
  Bell,
  LogOut,
  School
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    icon: <Home size={20} />,
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['admin', 'teacher', 'student', 'parent', 'accountant']
  },
  {
    icon: <Users size={20} />,
    label: 'Students',
    path: '/students',
    roles: ['admin', 'teacher']
  },
  {
    icon: <GraduationCap size={20} />,
    label: 'Teachers',
    path: '/teachers',
    roles: ['admin']
  },
  {
    icon: <School size={20} />,
    label: 'Classes',
    path: '/classes',
    roles: ['admin', 'teacher']
  },
  {
    icon: <Calendar size={20} />,
    label: 'Timetable',
    path: '/timetable',
    roles: ['admin', 'teacher', 'student']
  },
  {
    icon: <ClipboardCheck size={20} />,
    label: 'Attendance',
    path: '/attendance',
    roles: ['admin', 'teacher', 'student', 'parent']
  },
  {
    icon: <BookOpen size={20} />,
    label: 'Grades',
    path: '/grades',
    roles: ['admin', 'teacher', 'student', 'parent']
  },
  {
    icon: <DollarSign size={20} />,
    label: 'Fees',
    path: '/fees',
    roles: ['admin', 'accountant', 'parent']
  },
  {
    icon: <FileText size={20} />,
    label: 'Notices',
    path: '/notices',
    roles: ['admin', 'teacher', 'student', 'parent']
  },
  {
    icon: <BarChart3 size={20} />,
    label: 'Reports',
    path: '/reports',
    roles: ['admin', 'teacher', 'accountant']
  },
  {
    icon: <Settings size={20} />,
    label: 'Settings',
    path: '/settings',
    roles: ['admin']
  }
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="w-64 h-screen bg-white/5 backdrop-blur-lg border-r border-white/20 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
            <School className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">EduManage</h1>
            <p className="text-sm text-white/60">School System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white backdrop-blur-md border border-white/20'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-white/60 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <NavLink
            to="/notifications"
            className="flex items-center space-x-3 px-4 py-2 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
          >
            <Bell size={18} />
            <span className="text-sm">Notifications</span>
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
