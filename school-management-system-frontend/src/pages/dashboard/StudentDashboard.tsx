import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, TrendingUp, DollarSign } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import DashboardState from '../../components/dashboard/DashboardState';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ attendanceRate: 0, averageGrade: 0, feeStatus: 'pending', noticeCount: 0 });
  const [timetable, setTimetable] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);

  const loadDashboard = async () => {
    if (!user?.profileId || !user?.classId) {
      setError('Student profile is not linked to this account yet.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [timetableRes, gradesRes, attendanceRes, feesRes, noticesRes] = await Promise.all([
        api.get('/timetables'),
        api.get(`/grades/student/${user.profileId}`),
        api.get(`/attendance/class/${user.classId}`),
        api.get(`/fees/student/${user.profileId}`),
        api.get('/notices'),
      ]);

      const timetableEntries = (timetableRes.data.data ?? []).filter(
        (entry: { class?: { _id?: string; id?: string } }) => (entry.class?._id ?? entry.class?.id) === user.classId
      );
      const gradeEntries = gradesRes.data.data ?? [];
      const attendanceEntries = (attendanceRes.data.data ?? []).filter(
        (entry: { student?: { _id?: string; id?: string } }) => (entry.student?._id ?? entry.student?.id) === user.profileId
      );
      const feeEntries = feesRes.data.data ?? [];
      const noticeEntries = noticesRes.data.data ?? [];

      const averageGrade = gradeEntries.length
        ? gradeEntries.reduce((sum: number, entry: { score?: number }) => sum + (entry.score ?? 0), 0) / gradeEntries.length
        : 0;
      const attendanceRate = attendanceEntries.length
        ? (attendanceEntries.filter((entry: { status?: string }) => entry.status === 'present').length / attendanceEntries.length) * 100
        : 0;
      const feeStatus = feeEntries.find((entry: { status?: string }) => entry.status !== 'paid')?.status ?? 'paid';

      setTimetable(timetableEntries);
      setGrades(gradeEntries);
      setAttendance(attendanceEntries);
      setFees(feeEntries);
      setNotices(noticeEntries);
      setStats({
        attendanceRate,
        averageGrade,
        feeStatus,
        noticeCount: noticeEntries.length,
      });
    } catch (fetchError) {
      console.error(fetchError);
      setError('Failed to load student dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, [user?.profileId, user?.classId]);

  if (loading) {
    return <DashboardState title="Loading dashboard" message="Fetching timetable, grades, attendance, fees, and notices..." />;
  }

  if (error) {
    return <DashboardState title="Dashboard unavailable" message={error} actionLabel="Retry" onAction={() => void loadDashboard()} />;
  }

  return (
    <div className="space-y-6">
      <div className="card-glassmorphism">
        <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
        <p className="text-white/70 mt-2">View your timetable, grades, attendance, fee status, and school notices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Attendance" value={`${stats.attendanceRate.toFixed(1)}%`} icon={Clock} color="blue" />
        <StatCard title="Average Grade" value={`${stats.averageGrade.toFixed(1)}%`} icon={TrendingUp} color="green" />
        <StatCard title="Fee Status" value={stats.feeStatus} icon={DollarSign} color="yellow" />
        <StatCard title="Notices" value={stats.noticeCount} icon={BookOpen} color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Timetable</h3>
          <div className="space-y-3">
            {timetable.length ? timetable.map((entry) => (
              <div key={entry._id ?? entry.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-medium">{entry.subject}</p>
                <p className="text-white/60 text-sm mt-1">
                  Day {entry.dayOfWeek} • {entry.startTime} - {entry.endTime} • {entry.room || 'Room pending'}
                </p>
              </div>
            )) : <p className="text-white/70">No timetable entries available.</p>}
          </div>
        </div>

        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">School Notices</h3>
          <div className="space-y-3">
            {notices.length ? notices.map((notice) => (
              <div key={notice._id ?? notice.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-medium">{notice.title}</p>
                <p className="text-white/70 text-sm mt-2">{notice.description}</p>
              </div>
            )) : <p className="text-white/70">No notices available.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Grades</h3>
          <div className="space-y-3">
            {grades.length ? grades.map((entry) => (
              <div key={entry._id ?? entry.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-white">{entry.subject}</p>
                  <p className="text-white/60 text-xs">{entry.exam?.name ?? 'Exam'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{entry.grade}</p>
                  <p className="text-white/60 text-xs">{entry.score}/100</p>
                </div>
              </div>
            )) : <p className="text-white/70">No grades available.</p>}
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

        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Fee Status</h3>
          <div className="space-y-3">
            {fees.length ? fees.map((entry) => (
              <div key={entry._id ?? entry.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-white">${entry.amount}</p>
                  <p className="text-white/60 text-xs">Due {new Date(entry.dueDate).toLocaleDateString()}</p>
                </div>
                <span className="text-white/80 capitalize">{entry.status}</span>
              </div>
            )) : <p className="text-white/70">No fee records available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
