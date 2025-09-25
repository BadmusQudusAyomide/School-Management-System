import React from 'react';
import { DollarSign, TrendingUp, CreditCard, AlertCircle, FileText } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';

const AccountantDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const stats = {
    totalRevenue: 125600,
    outstandingFees: 45600,
    collectionRate: 73.2,
    overduePayments: 28
  };

  const recentTransactions = [
    { id: 1, student: 'Qudus Ayomide', type: 'Tuition Fee', amount: 800, status: 'completed', date: '2024-01-15' },
    { id: 2, student: 'Fatima Badmus', type: 'Transport Fee', amount: 200, status: 'completed', date: '2024-01-15' },
    { id: 3, student: 'Ahmed Hassan', type: 'Library Fee', amount: 100, status: 'pending', date: '2024-01-14' },
    { id: 4, student: 'Sarah Johnson', type: 'Lab Fee', amount: 150, status: 'completed', date: '2024-01-14' }
  ];

  const pendingPayments = [
    { id: 1, student: 'John Smith', class: 'Grade 10-A', amount: 1200, dueDate: '2024-01-20', daysOverdue: 5 },
    { id: 2, student: 'Emma Wilson', class: 'Grade 9-B', amount: 800, dueDate: '2024-01-18', daysOverdue: 7 },
    { id: 3, student: 'Michael Brown', class: 'Grade 11-A', amount: 1500, dueDate: '2024-01-15', daysOverdue: 10 },
    { id: 4, student: 'Lisa Davis', class: 'Grade 8-C', amount: 600, dueDate: '2024-01-22', daysOverdue: 3 }
  ];

  const monthlyCollection = [
    { month: 'Jan', collected: 45600, target: 60000 },
    { month: 'Dec', collected: 52000, target: 60000 },
    { month: 'Nov', collected: 48000, target: 55000 },
    { month: 'Oct', collected: 51000, target: 55000 }
  ];

  const feeCategories = [
    { category: 'Tuition Fee', collected: 85600, pending: 25400, total: 111000 },
    { category: 'Transport Fee', collected: 18200, pending: 8800, total: 27000 },
    { category: 'Library Fee', collected: 12400, pending: 3600, total: 16000 },
    { category: 'Lab Fee', collected: 9400, pending: 7800, total: 17200 }
  ];

  const quickActions = [
    { icon: DollarSign, label: 'Record Payment', path: '/payments/add', color: 'blue' as const },
    { icon: FileText, label: 'Generate Report', path: '/reports', color: 'green' as const },
    { icon: AlertCircle, label: 'Send Reminders', path: '/reminders', color: 'yellow' as const },
    { icon: CreditCard, label: 'Fee Structure', path: '/fees/structure', color: 'purple' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-glassmorphism">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.firstName}!</h1>
            <p className="text-gray-200 mt-1">Manage school finances and fee collections.</p>
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
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 8.2, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Outstanding Fees"
          value={`$${stats.outstandingFees.toLocaleString()}`}
          icon={AlertCircle}
          trend={{ value: -5.3, isPositive: true }}
          color="yellow"
        />
        <StatCard
          title="Collection Rate"
          value={`${stats.collectionRate}%`}
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Overdue Payments"
          value={stats.overduePayments}
          icon={CreditCard}
          trend={{ value: -12.5, isPositive: true }}
          color="red"
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

        {/* Recent Transactions */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
                <div>
                  <p className="text-sm font-medium text-white">{transaction.student}</p>
                  <p className="text-xs text-gray-200">{transaction.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${transaction.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View all transactions
          </button>
        </div>

        {/* Pending Payments */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Overdue Payments</h3>
          <div className="space-y-3">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
                <div>
                  <p className="text-sm font-medium text-white">{payment.student}</p>
                  <p className="text-xs text-gray-200">{payment.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${payment.amount}</p>
                  <p className="text-xs text-red-300">{payment.daysOverdue} days overdue</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-200 hover:text-white font-medium transition-colors">
            View all overdue
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collection */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Collection</h3>
          <div className="space-y-4">
            {monthlyCollection.map((month) => (
              <div key={month.month} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{month.month}</span>
                  <span className="text-sm text-gray-200">
                    ${month.collected.toLocaleString()} / ${month.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(month.collected / month.target) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-200">
                  {((month.collected / month.target) * 100).toFixed(1)}% of target
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Categories */}
        <div className="card-glassmorphism">
          <h3 className="text-lg font-semibold text-white mb-4">Fee Categories</h3>
          <div className="space-y-4">
            {feeCategories.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{category.category}</span>
                  <span className="text-sm text-gray-200">
                    ${category.collected.toLocaleString()} / ${category.total.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(category.collected / category.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-200">
                  <span>Collected: {((category.collected / category.total) * 100).toFixed(1)}%</span>
                  <span>Pending: ${category.pending.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
