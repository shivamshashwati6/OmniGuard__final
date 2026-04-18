import React from 'react';
import Dashboard from './Dashboard';

export default function CoordinatorDashboard({ incidents, onUpdateStatus }) {
  return (
    <div className="h-full">
      <Dashboard incidents={incidents} onUpdateStatus={onUpdateStatus} />
    </div>
  );
}
