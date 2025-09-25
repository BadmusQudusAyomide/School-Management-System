import React from 'react';
import { BookOpen, Clock, TrendingUp, Calendar, FileText, Bell } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const stats = {
    attendanceRate: 92.5,
    upcomingExams: 3,
    averageGrade: 85.2,
    assignmentsDue: 2
  };

  const todayClasses = [
    { id: 1, subject: 'Mathematics', teacher: 'Ms. Johnson', time: '09:00 AM', room: 'Room 101' },
    { id: 2, subject: 'Physics', teacher: 'Mr. Smith', time: '11:00 AM', room: 'Lab 1' },
    { id: 3, subject: 'English', teacher: 'Mrs. Brown', time: '02:00 PM', room: 'Room 205' },
    { id: 4, subject: 'Chemistry', teacher: 'Dr. Wilson', time: '03:30 PM', room: 'Lab 2' }
  ];

  const recentGrades = [
    { id: 1, subject: 'Mathematics', assessment: 'Mid-term Exam', grade: 'A', marks: '92/100', date: '2024-01-15' },
    { id: 2, subject: 'Physics', assessment: 'Lab Report', grade: 'B+', marks: '87/100', date: '2024-01-12' },
    { id: 3, subject: 'English', assessment: 'Essay Assignment', grade: 'A-', marks: '89/100', date: '2024-01-10' },
    { id: 4, subject: 'Chemistry', assessment: 'Quiz', grade: 'B', marks: '82/100', date: '2024-01-08' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Mathematics Exam', date: '2024-02-15', time: '10:00 AM', type: 'exam' },
    { id: 2, title: 'Science Fair Project Due', date: '2024-02-18', time: '11:59 PM', type: 'assignment' },
    { id: 3, title: 'Parent-Teacher Meeting', date: '2024-02-20', time: '02:00 PM', type: 'meeting' },
    { id: 4, title: 'Sports Day', date: '2024-02-25', time: '08:00 AM', type: 'event' }
  ];

  const assignments = [
    { id: 1, subject: 'Mathematics', title: 'Calculus Problem Set', dueDate: '2024-02-10', status: 'pending' },
    { id: 2, subject: 'English', title: 'Literature Review', dueDate: '2024-02-12', status: 'pending' },
    { id: 3, subject: 'Physics', title: 'Lab Report - Motion', dueDate: '2024-02-08', status: 'submitted' },
    { id: 4, subject: 'Chemistry', title: 'Organic Chemistry Quiz', dueDate: '2024-02-14', status: 'pending' }
  ];

  const quickActions = [
    { icon: FileText, label: 'View Assignments', path: '/assignments', color: 'blue' as const },
    { icon: TrendingUp, label: 'Check Grades', path: '/grades', color: 'green' as const },
    { icon: Calendar, label: 'View Timetable', path: '/timetable', color: 'purple' as const },
    { icon: Bell, label: 'Notifications', path: '/notifications', color: 'yellow' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-glassmorphism">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.firstName}!</h1>
            <p className="text-gray-200 mt-1">Ready to learn something new today?</p>
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
          icon={BookOpen}
          trend={{ value: 0, isPositive: true }}
          color="yellow"
        />
        <StatCard
          title="Assignments Due"
          value={stats.assignmentsDue}
          icon={FileText}
          trend={{ value: -25, isPositive: true }}
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
                  <p className="text-xs text-gray-200">{classItem.teacher} • {classItem.room}</p>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Assignments</h3>
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{assignment.title}</p>
                  <p className="text-xs text-gray-200">{assignment.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-200">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'submitted' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
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

export default StudentDashboard;
