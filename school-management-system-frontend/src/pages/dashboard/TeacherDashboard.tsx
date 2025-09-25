import React from 'react';
import { Users, BookOpen, Clock, CheckCircle, Calendar, Bell } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const stats = {
    totalClasses: 6,
    totalStudents: 180,
    pendingGrading: 24,
    attendanceToMark: 3
  };

  const todayClasses = [
    { id: 1, subject: 'Mathematics', class: 'Grade 10-A', time: '09:00 AM', room: 'Room 101' },
    { id: 2, subject: 'Mathematics', class: 'Grade 10-B', time: '11:00 AM', room: 'Room 102' },
    { id: 3, subject: 'Algebra', class: 'Grade 11-A', time: '02:00 PM', room: 'Room 101' },
    { id: 4, subject: 'Calculus', class: 'Grade 12-A', time: '03:30 PM', room: 'Room 103' }
  ];

  const recentActivities = [
    { id: 1, message: 'Graded Mathematics test for Grade 10-A', time: '2 hours ago' },
    { id: 2, message: 'Marked attendance for Grade 10-B', time: '4 hours ago' },
    { id: 3, message: 'Updated lesson plan for Algebra', time: '6 hours ago' },
    { id: 4, message: 'Submitted monthly report', time: '1 day ago' }
  ];

  const pendingTasks = [
    { id: 1, task: 'Grade Physics assignments for Grade 11-A', priority: 'high' },
    { id: 2, task: 'Prepare quiz for Grade 10-B', priority: 'medium' },
    { id: 3, task: 'Update parent meeting notes', priority: 'low' },
    { id: 4, task: 'Submit attendance report', priority: 'high' }
  ];

  const quickActions = [
    { icon: CheckCircle, label: 'Mark Attendance', path: '/attendance', color: 'blue' as const },
    { icon: BookOpen, label: 'Grade Assignments', path: '/grades', color: 'green' as const },
    { icon: Calendar, label: 'View Timetable', path: '/timetable', color: 'purple' as const },
    { icon: Bell, label: 'Send Notice', path: '/notices/add', color: 'yellow' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-glassmorphism">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.firstName}!</h1>
            <p className="text-gray-200 mt-1">Ready to inspire young minds today?</p>
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
          title="My Classes"
          value={stats.totalClasses}
          icon={BookOpen}
          trend={{ value: 0, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          trend={{ value: 2.1, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Pending Grading"
          value={stats.pendingGrading}
          icon={Clock}
          trend={{ value: -15.3, isPositive: true }}
          color="yellow"
        />
        <StatCard
          title="Attendance to Mark"
          value={stats.attendanceToMark}
          icon={CheckCircle}
          trend={{ value: 0, isPositive: true }}
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

        {/* Today's Classes */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Classes</h3>
          <div className="space-y-3">
            {todayClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
                <div>
                  <p className="text-sm font-medium text-white">{classItem.subject}</p>
                  <p className="text-xs text-gray-200">{classItem.class} • {classItem.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-200">{classItem.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View full timetable
          </button>
        </div>

        {/* Pending Tasks */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Pending Tasks</h3>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  task.priority === 'high' ? 'bg-red-400' : 
                  task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{task.task}</p>
                  <p className="text-xs text-gray-200 mt-1 capitalize">{task.priority} priority</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View all tasks
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card-glassmorphism">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-gray-200 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
