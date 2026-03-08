import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, DollarSign, School } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatCard from '../../components/dashboard/StatCard';
import DashboardState from '../../components/dashboard/DashboardState';
import { api } from '../../lib/api';
import { analyticsService } from '../../services/analyticsService';

const attendanceColors = ['#34d399', '#f87171', '#fbbf24', '#60a5fa'];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    feeRevenue: 0,
  });
  const [attendanceData, setAttendanceData] = useState<Array<{ name: string; value: number }>>([]);
  const [revenueData, setRevenueData] = useState<Array<{ name: string; revenue: number }>>([]);
  const [studentGrowthData, setStudentGrowthData] = useState<Array<{ name: string; students: number }>>([]);
  const [recentActivities, setRecentActivities] = useState<Array<{ id: string; message: string; time: string }>>([]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const [studentsRes, teachersRes, classesRes, attendanceRes, feesRes, noticesRes] = await Promise.all([
        api.get('/students'),
        api.get('/teachers'),
        api.get('/classes'),
        api.get('/attendance'),
        api.get('/fees'),
        api.get('/notices'),
      ]);

      const students = studentsRes.data.data ?? [];
      const teachers = teachersRes.data.data ?? [];
      const classes = classesRes.data.data ?? [];
      const attendance = attendanceRes.data.data ?? [];
      const fees = feesRes.data.data ?? [];
      const notices = noticesRes.data.data ?? [];

      const feeRevenue = fees.reduce((sum: number, fee: { paid?: number }) => sum + (fee.paid ?? 0), 0);

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: classes.length,
        feeRevenue,
      });

      setAttendanceData(analyticsService.buildAttendanceBreakdown(attendance));
      setRevenueData(analyticsService.buildRevenueSeries(fees));
      setStudentGrowthData(analyticsService.buildStudentGrowthSeries(students));

      setRecentActivities([
        ...students.slice(0, 2).map((student: { _id?: string; admissionNumber?: string; userId?: { name?: string } }) => ({
          id: student._id ?? crypto.randomUUID(),
          message: `${student.userId?.name ?? 'Student'} joined with admission number ${student.admissionNumber ?? 'N/A'}`,
          time: 'Student onboarding',
        })),
        ...notices.slice(0, 2).map((notice: { _id?: string; title?: string; createdAt?: string }) => ({
          id: notice._id ?? crypto.randomUUID(),
          message: `Notice published: ${notice.title ?? 'Untitled notice'}`,
          time: notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : 'Recently',
        })),
      ]);
    } catch (fetchError) {
      console.error(fetchError);
      setError('Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (loading) {
    return <DashboardState title="Loading dashboard" message="Preparing analytics and live metrics..." />;
  }

  if (error) {
    return <DashboardState title="Dashboard unavailable" message={error} actionLabel="Retry" onAction={() => void loadDashboard()} />;
  }

  return (
    <div className="space-y-6">
      <div className="card-glassmorphism">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-200 mt-1">Overview of enrollment, staffing, classes, fee revenue, and attendance analytics.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Today</p>
            <p className="text-lg font-semibold text-white">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="blue" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} icon={GraduationCap} color="green" />
        <StatCard title="Total Classes" value={stats.totalClasses} icon={School} color="purple" />
        <StatCard title="Fee Revenue" value={`$${stats.feeRevenue.toLocaleString()}`} icon={DollarSign} color="yellow" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Attendance Analytics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attendanceData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {attendanceData.map((entry, index) => (
                    <Cell key={entry.name} fill={attendanceColors[index % attendanceColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="#d1d5db" />
                <YAxis stroke="#d1d5db" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-glassmorphism">
        <h3 className="text-lg font-semibold text-white mb-4">Student Growth</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#a78bfa" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-glassmorphism">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentActivities.length ? recentActivities.map((activity) => (
            <div key={activity.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-white/60 text-xs mt-2">{activity.time}</p>
            </div>
          )) : <p className="text-white/70">No recent activity found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
