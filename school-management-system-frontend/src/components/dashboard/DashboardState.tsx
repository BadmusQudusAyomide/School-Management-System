import React from 'react';

interface DashboardStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const DashboardState: React.FC<DashboardStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <div className="card-glassmorphism">
    <div className="text-center py-10">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-white/70 mt-2">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 btn-primary px-5 py-2 rounded-lg"
        >
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

export default DashboardState;
