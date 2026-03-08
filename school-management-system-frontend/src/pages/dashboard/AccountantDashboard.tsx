import React, { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, FileText } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import DashboardState from '../../components/dashboard/DashboardState';
import { api } from '../../lib/api';

const getId = (value: { id?: string; _id?: string } | null | undefined) => value?._id ?? value?.id ?? '';

const AccountantDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('');
  const [stats, setStats] = useState({ totalRevenue: 0, outstandingFees: 0, collectionRate: 0, reportCount: 0 });
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<Array<{ name: string; revenue: number }>>([]);
  const [feeForm, setFeeForm] = useState({ student: '', amount: '', paid: '', status: 'pending', dueDate: '' });
  const [reportForm, setReportForm] = useState({ title: '', type: 'finance', period: '', summary: '' });

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const [feesRes, studentsRes, reportsRes] = await Promise.all([
        api.get('/fees'),
        api.get('/students'),
        api.get('/reports'),
      ]);

      const feeRecords = feesRes.data.data ?? [];
      const studentRecords = studentsRes.data.data ?? [];
      const reportRecords = reportsRes.data.data ?? [];

      const totalRevenue = feeRecords.reduce((sum: number, item: { paid?: number }) => sum + (item.paid ?? 0), 0);
      const outstandingFees = feeRecords.reduce((sum: number, item: { amount?: number; paid?: number }) => sum + Math.max((item.amount ?? 0) - (item.paid ?? 0), 0), 0);
      const totalBilled = feeRecords.reduce((sum: number, item: { amount?: number }) => sum + (item.amount ?? 0), 0);

      const groupedRevenue = new Map<string, number>();
      feeRecords.forEach((item: { dueDate?: string; paid?: number }) => {
        const date = item.dueDate ? new Date(item.dueDate) : new Date();
        const key = date.toLocaleDateString('en-US', { month: 'short' });
        groupedRevenue.set(key, (groupedRevenue.get(key) ?? 0) + (item.paid ?? 0));
      });

      setStats({
        totalRevenue,
        outstandingFees,
        collectionRate: totalBilled ? (totalRevenue / totalBilled) * 100 : 0,
        reportCount: reportRecords.length,
      });
      setFees(feeRecords);
      setStudents(studentRecords);
      setReports(reportRecords);
      setRevenueData(Array.from(groupedRevenue.entries()).map(([name, revenue]) => ({ name, revenue })));
      if (studentRecords[0]) {
        setFeeForm((current) => ({ ...current, student: getId(studentRecords[0]) }));
      }
    } catch (fetchError) {
      console.error(fetchError);
      setError('Failed to load accountant dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const submitFee = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('fee');
    try {
      await api.post('/fees', {
        ...feeForm,
        amount: Number(feeForm.amount),
        paid: Number(feeForm.paid),
      });
      setFeeForm((current) => ({ ...current, amount: '', paid: '', dueDate: '' }));
      await loadDashboard();
    } catch (submitError) {
      console.error(submitError);
      setError('Failed to create fee record.');
    } finally {
      setSaving('');
    }
  };

  const submitReport = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('report');
    try {
      await api.post('/reports', reportForm);
      setReportForm({ title: '', type: 'finance', period: '', summary: '' });
      await loadDashboard();
    } catch (submitError) {
      console.error(submitError);
      setError('Failed to create financial report.');
    } finally {
      setSaving('');
    }
  };

  if (loading) {
    return <DashboardState title="Loading dashboard" message="Preparing fee, payment, and report data..." />;
  }

  if (error && !fees.length && !reports.length) {
    return <DashboardState title="Dashboard unavailable" message={error} actionLabel="Retry" onAction={() => void loadDashboard()} />;
  }

  return (
    <div className="space-y-6">
      <div className="card-glassmorphism">
        <h1 className="text-2xl font-bold text-white">Accountant Dashboard</h1>
        <p className="text-white/70 mt-2">Manage school fees, track payments, and maintain financial reports.</p>
      </div>

      {error && <DashboardState title="Update warning" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="blue" />
        <StatCard title="Outstanding Fees" value={`$${stats.outstandingFees.toLocaleString()}`} icon={CreditCard} color="yellow" />
        <StatCard title="Collection Rate" value={`${stats.collectionRate.toFixed(1)}%`} icon={TrendingUp} color="green" />
        <StatCard title="Reports" value={stats.reportCount} icon={FileText} color="purple" />
      </div>

      <div className="card-glassmorphism">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Analytics</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#34d399" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Manage School Fees</h3>
          <form className="space-y-4" onSubmit={submitFee}>
            <select className="input-glassmorphism w-full" value={feeForm.student} onChange={(event) => setFeeForm((current) => ({ ...current, student: event.target.value }))}>
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={getId(student)} value={getId(student)} className="bg-gray-900">
                  {student.userId?.name ?? 'Student'}
                </option>
              ))}
            </select>
            <input className="input-glassmorphism w-full" type="number" placeholder="Amount" value={feeForm.amount} onChange={(event) => setFeeForm((current) => ({ ...current, amount: event.target.value }))} required />
            <input className="input-glassmorphism w-full" type="number" placeholder="Paid" value={feeForm.paid} onChange={(event) => setFeeForm((current) => ({ ...current, paid: event.target.value }))} required />
            <select className="input-glassmorphism w-full" value={feeForm.status} onChange={(event) => setFeeForm((current) => ({ ...current, status: event.target.value }))}>
              {['pending', 'partial', 'paid', 'overdue'].map((status) => <option key={status} value={status} className="bg-gray-900">{status}</option>)}
            </select>
            <input className="input-glassmorphism w-full" type="date" value={feeForm.dueDate} onChange={(event) => setFeeForm((current) => ({ ...current, dueDate: event.target.value }))} required />
            <button type="submit" disabled={saving === 'fee'} className="btn-primary px-4 py-2 rounded-lg">
              {saving === 'fee' ? 'Saving...' : 'Create Fee Record'}
            </button>
          </form>
        </div>

        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Reports</h3>
          <form className="space-y-4 mb-6" onSubmit={submitReport}>
            <input className="input-glassmorphism w-full" placeholder="Report title" value={reportForm.title} onChange={(event) => setReportForm((current) => ({ ...current, title: event.target.value }))} required />
            <select className="input-glassmorphism w-full" value={reportForm.type} onChange={(event) => setReportForm((current) => ({ ...current, type: event.target.value }))}>
              {['finance', 'attendance', 'academic', 'custom'].map((type) => <option key={type} value={type} className="bg-gray-900">{type}</option>)}
            </select>
            <input className="input-glassmorphism w-full" placeholder="Period" value={reportForm.period} onChange={(event) => setReportForm((current) => ({ ...current, period: event.target.value }))} />
            <textarea className="input-glassmorphism w-full min-h-28" placeholder="Summary" value={reportForm.summary} onChange={(event) => setReportForm((current) => ({ ...current, summary: event.target.value }))} />
            <button type="submit" disabled={saving === 'report'} className="btn-primary px-4 py-2 rounded-lg">
              {saving === 'report' ? 'Saving...' : 'Create Report'}
            </button>
          </form>

          <div className="space-y-3">
            {reports.length ? reports.map((report) => (
              <div key={report._id ?? report.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-medium">{report.title}</p>
                <p className="text-white/60 text-xs mt-1 capitalize">{report.type} • {report.period || 'No period set'}</p>
              </div>
            )) : <p className="text-white/70">No reports available.</p>}
          </div>
        </div>
      </div>

      <div className="card-glassmorphism">
        <h3 className="text-lg font-semibold text-white mb-4">Track Payments</h3>
        <div className="space-y-3">
          {fees.length ? fees.map((fee) => (
            <div key={fee._id ?? fee.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="text-white">{fee.student?.userId?.name ?? 'Student'}</p>
                <p className="text-white/60 text-xs">Due {new Date(fee.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">${fee.amount}</p>
                <p className="text-white/60 text-xs capitalize">{fee.status}</p>
              </div>
            </div>
          )) : <p className="text-white/70">No fee records available.</p>}
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
