import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import DashboardState from '../../components/dashboard/DashboardState';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [performance, setPerformance] = useState<Array<{ subject: string; score: number }>>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [stats, setStats] = useState({ averageGrade: 0, attendanceRate: 0, pendingFees: 0 });

  useEffect(() => {
    const loadChildren = async () => {
      if (!user?.childIds?.length) {
        setError('No children linked to this parent account.');
        setLoading(false);
        return;
      }

      try {
        const responses = await Promise.all(user.childIds.map((id) => api.get(`/students/${id}`)));
        const data = responses.map((response) => response.data.data);
        setChildren(data);
        setSelectedChildId(data[0]?._id ?? data[0]?.id ?? '');
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load child profiles.');
      } finally {
        setLoading(false);
      }
    };

    void loadChildren();
  }, [user?.childIds]);

  useEffect(() => {
    const loadChildData = async () => {
      const child = children.find((item) => (item._id ?? item.id) === selectedChildId);
      if (!child) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [gradesRes, attendanceRes, feesRes] = await Promise.all([
          api.get(`/grades/student/${child._id ?? child.id}`),
          api.get(`/attendance/class/${child.class?._id ?? child.class?.id}`),
          api.get(`/fees/student/${child._id ?? child.id}`),
        ]);

        const grades = gradesRes.data.data ?? [];
        const childAttendance = (attendanceRes.data.data ?? []).filter(
          (entry: { student?: { _id?: string; id?: string } }) => (entry.student?._id ?? entry.student?.id) === (child._id ?? child.id)
        );
        const childFees = feesRes.data.data ?? [];

        const averageGrade = grades.length
          ? grades.reduce((sum: number, item: { score?: number }) => sum + (item.score ?? 0), 0) / grades.length
          : 0;
        const attendanceRate = childAttendance.length
          ? (childAttendance.filter((item: { status?: string }) => item.status === 'present').length / childAttendance.length) * 100
          : 0;
        const pendingFees = childFees.reduce((sum: number, item: { amount?: number; paid?: number }) => sum + Math.max((item.amount ?? 0) - (item.paid ?? 0), 0), 0);

        setPerformance(grades.map((item: { _id?: string; subject?: string; score?: number }) => ({
          subject: item.subject ?? item._id ?? 'Subject',
          score: item.score ?? 0,
        })));
        setAttendance(childAttendance);
        setFees(childFees);
        setStats({ averageGrade, attendanceRate, pendingFees });
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load child performance data.');
      } finally {
        setLoading(false);
      }
    };

    void loadChildData();
  }, [children, selectedChildId]);

  if (loading && !children.length) {
    return <DashboardState title="Loading dashboard" message="Fetching child performance, attendance, and fee payments..." />;
  }

  if (error && !children.length) {
    return <DashboardState title="Dashboard unavailable" message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="card-glassmorphism">
        <h1 className="text-2xl font-bold text-white">Parent Dashboard</h1>
        <p className="text-white/70 mt-2">Track child performance, attendance, and fee payments.</p>
      </div>

      {error && <DashboardState title="Update warning" message={error} />}

      <div className="card-glassmorphism">
        <label className="block text-sm text-white/70 mb-2">Child</label>
        <select value={selectedChildId} onChange={(event) => setSelectedChildId(event.target.value)} className="input-glassmorphism w-full max-w-md">
          {children.map((child) => (
            <option key={child._id ?? child.id} value={child._id ?? child.id} className="bg-gray-900">
              {child.userId?.name ?? 'Student'} - {child.class?.name ?? 'Class'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Average Grade" value={`${stats.averageGrade.toFixed(1)}%`} icon={TrendingUp} color="green" />
        <StatCard title="Attendance" value={`${stats.attendanceRate.toFixed(1)}%`} icon={Clock} color="blue" />
        <StatCard title="Pending Fees" value={`$${stats.pendingFees.toLocaleString()}`} icon={DollarSign} color="yellow" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Child Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="subject" stroke="#d1d5db" />
                <YAxis stroke="#d1d5db" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#34d399" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Attendance</h3>
          <div className="space-y-3">
            {attendance.length ? attendance.map((entry) => (
              <div key={entry._id ?? entry.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white">{new Date(entry.date).toLocaleDateString()}</p>
                <span className="text-white/80 capitalize">{entry.status}</span>
              </div>
            )) : <p className="text-white/70">No attendance records available.</p>}
          </div>
        </div>
      </div>

      <div className="card-glassmorphism">
        <h3 className="text-lg font-semibold text-white mb-4">Fee Payments</h3>
        <div className="space-y-3">
          {fees.length ? fees.map((entry) => (
            <div key={entry._id ?? entry.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="text-white">${entry.amount}</p>
                <p className="text-white/60 text-xs">Paid ${entry.paid ?? 0}</p>
              </div>
              <span className="text-white/80 capitalize">{entry.status}</span>
            </div>
          )) : <p className="text-white/70">No fee payments available.</p>}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
