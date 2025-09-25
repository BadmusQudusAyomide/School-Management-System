import React, { useState } from 'react';
import { TrendingUp, Clock, DollarSign, Calendar, Bell, ChevronDown } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';

interface Child {
  id: string;
  name: string;
  class: string;
  grade: string;
  attendanceRate: number;
  averageGrade: number;
  avatar: string;
}

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string>('1');

  // Mock data for children - this would come from API based on parent ID
  const children: Child[] = [
    {
      id: '1',
      name: 'Qudus Ayomide',
      class: 'Grade 10-A',
      grade: '10th',
      attendanceRate: 92.5,
      averageGrade: 85.2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: '2',
      name: 'Fatima Ayomide',
      class: 'Grade 8-B',
      grade: '8th',
      attendanceRate: 95.8,
      averageGrade: 91.4,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    }
  ];

  const currentChild = children.find(child => child.id === selectedChild) || children[0];

  // Mock data - replace with actual API calls based on selected child
  const stats = {
    attendanceRate: currentChild.attendanceRate,
    averageGrade: currentChild.averageGrade,
    upcomingExams: 3,
    pendingFees: 1200
  };

  const recentGrades = [
    { id: 1, subject: 'Mathematics', assessment: 'Mid-term Exam', grade: 'A', marks: '92/100', date: '2024-01-15' },
    { id: 2, subject: 'Physics', assessment: 'Lab Report', grade: 'B+', marks: '87/100', date: '2024-01-12' },
    { id: 3, subject: 'English', assessment: 'Essay Assignment', grade: 'A-', marks: '89/100', date: '2024-01-10' },
    { id: 4, subject: 'Chemistry', assessment: 'Quiz', grade: 'B', marks: '82/100', date: '2024-01-08' }
  ];

  const attendanceData = [
    { date: '2024-01-15', status: 'present' },
    { date: '2024-01-16', status: 'present' },
    { date: '2024-01-17', status: 'absent' },
    { date: '2024-01-18', status: 'present' },
    { date: '2024-01-19', status: 'present' },
    { date: '2024-01-22', status: 'present' },
    { date: '2024-01-23', status: 'late' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2024-02-15', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Mathematics Exam', date: '2024-02-18', time: '09:00 AM', type: 'exam' },
    { id: 3, title: 'Science Fair', date: '2024-02-20', time: '02:00 PM', type: 'event' },
    { id: 4, title: 'Sports Day', date: '2024-02-25', time: '08:00 AM', type: 'event' }
  ];

  const feeDetails = [
    { id: 1, type: 'Tuition Fee', amount: 800, status: 'paid', dueDate: '2024-01-15' },
    { id: 2, type: 'Transport Fee', amount: 200, status: 'pending', dueDate: '2024-02-15' },
    { id: 3, type: 'Library Fee', amount: 100, status: 'pending', dueDate: '2024-02-15' },
    { id: 4, type: 'Lab Fee', amount: 150, status: 'paid', dueDate: '2024-01-15' }
  ];

  const quickActions = [
    { icon: TrendingUp, label: 'View Grades', path: '/grades', color: 'blue' as const },
    { icon: Clock, label: 'Check Attendance', path: '/attendance', color: 'green' as const },
    { icon: DollarSign, label: 'Pay Fees', path: '/fees', color: 'yellow' as const },
    { icon: Bell, label: 'Messages', path: '/messages', color: 'purple' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section with Child Selector */}
      <div className="card-glassmorphism">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.firstName}!</h1>
            <p className="text-gray-200 mt-1">Monitor your children's academic progress.</p>
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

      {/* Child Selector */}
      <div className="card-glassmorphism">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Select Child</h3>
          <div className="relative">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/25"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id} className="bg-gray-800 text-white">
                  {child.name} - {child.class}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
          </div>
        </div>
        
        {/* Selected Child Info */}
        <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
          <img
            src={currentChild.avatar}
            alt={currentChild.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <h4 className="text-lg font-semibold text-white">{currentChild.name}</h4>
            <p className="text-gray-200">{currentChild.class}</p>
            <p className="text-sm text-white/60">Grade {currentChild.grade}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={Clock}
          trend={{ value: 2.3, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon={TrendingUp}
          trend={{ value: 3.2, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Upcoming Exams"
          value={stats.upcomingExams}
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
          color="purple"
        />
        <StatCard
          title="Pending Fees"
          value={`$${stats.pendingFees}`}
          icon={DollarSign}
          trend={{ value: -15.2, isPositive: true }}
          color="yellow"
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

        {/* Recent Grades */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Grades</h3>
          <div className="space-y-3">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
                <div>
                  <p className="text-sm font-medium text-white">{grade.subject}</p>
                  <p className="text-xs text-gray-200">{grade.assessment}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{grade.grade}</p>
                  <p className="text-xs text-gray-200">{grade.marks}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View all grades
          </button>
        </div>

        {/* Recent Attendance */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Attendance</h3>
          <div className="space-y-3">
            {attendanceData.slice(0, 4).map((attendance, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
                <div>
                  <p className="text-sm font-medium text-white">
                    {new Date(attendance.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    attendance.status === 'present' 
                      ? 'bg-green-500/20 text-green-300' 
                      : attendance.status === 'late'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {attendance.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View full attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Details */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Fee Details</h3>
          <div className="space-y-3">
            {feeDetails.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{fee.type}</p>
                  <p className="text-xs text-gray-200">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${fee.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    fee.status === 'paid' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {fee.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View all fees
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
                  <p className="text-xs text-gray-200 capitalize">{event.type} • {event.time}</p>
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
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
