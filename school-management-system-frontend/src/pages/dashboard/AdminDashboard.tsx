import React from 'react';
import { Users, GraduationCap, DollarSign, TrendingUp, Calendar, Bell } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const AdminDashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalStudents: 1248,
    totalTeachers: 87,
    outstandingFees: 45600,
    attendanceRate: 94.2
  };

  const recentActivities = [
    { id: 1, type: 'student', message: 'New student Qudus Ayomide enrolled in Grade 10-A', time: '2 hours ago' },
    { id: 2, type: 'fee', message: 'Fee payment of $500 received from Badmus', time: '4 hours ago' },
    { id: 3, type: 'teacher', message: 'Teacher Codestream updated Grade 9-B timetable', time: '6 hours ago' },
    { id: 4, type: 'notice', message: 'New notice published: Parent-Teacher Meeting', time: '1 day ago' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2024-02-15', time: '10:00 AM' },
    { id: 2, title: 'Science Fair', date: '2024-02-20', time: '9:00 AM' },
    { id: 3, title: 'Sports Day', date: '2024-02-25', time: '8:00 AM' },
    { id: 4, title: 'Annual Exam', date: '2024-03-01', time: 'All Day' }
  ];

  const quickActions = [
    { icon: Users, label: 'Add Student', path: '/students/add', color: 'blue' as const },
    { icon: GraduationCap, label: 'Add Teacher', path: '/teachers/add', color: 'green' as const },
    { icon: Calendar, label: 'Schedule Event', path: '/events/add', color: 'purple' as const },
    { icon: Bell, label: 'Send Notice', path: '/notices/add', color: 'yellow' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-glassmorphism">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, Admin!</h1>
            <p className="text-gray-200 mt-1">Here's what's happening at your school today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Today</p>
            <p className="text-lg font-semibold text-white">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={GraduationCap}
          trend={{ value: 2.1, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Outstanding Fees"
          value={`$${stats.outstandingFees.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: -8.3, isPositive: false }}
          color="red"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={TrendingUp}
          trend={{ value: 1.2, isPositive: true }}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <action.icon className="text-white" size={20} />
                </div>
                <span className="text-sm font-medium text-white">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-gray-200 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View all activities
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
                <div>
                  <p className="text-sm font-medium text-white">{event.title}</p>
                  <p className="text-xs text-gray-200">{event.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-200">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View calendar
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart Placeholder */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Attendance Overview</h3>
          <div className="h-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center shadow-inner">
            <p className="text-gray-200">Attendance Chart Placeholder</p>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Fee Collection</h3>
          <div className="h-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center shadow-inner">
            <p className="text-gray-200">Revenue Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
