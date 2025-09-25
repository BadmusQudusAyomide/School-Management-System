import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-white/10 text-white',
    green: 'bg-white/10 text-white',
    yellow: 'bg-white/10 text-white',
    red: 'bg-white/10 text-white',
    purple: 'bg-white/10 text-white'
  };

  return (
    <div className="card-glassmorphism">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-200">from last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color].split(' ')[0]} backdrop-blur-md border border-white/20 flex items-center justify-center`}>
          <Icon className={colorClasses[color].split(' ')[1]} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
