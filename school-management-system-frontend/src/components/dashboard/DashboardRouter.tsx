import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from '../../pages/dashboard/AdminDashboard';
import TeacherDashboard from '../../pages/dashboard/TeacherDashboard';
import StudentDashboard from '../../pages/dashboard/StudentDashboard';
import ParentDashboard from '../../pages/dashboard/ParentDashboard';
import AccountantDashboard from '../../pages/dashboard/AccountantDashboard';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'accountant':
      return <AccountantDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-white/70">Your role does not have access to a dashboard.</p>
          </div>
        </div>
      );
  }
};

export default DashboardRouter;
