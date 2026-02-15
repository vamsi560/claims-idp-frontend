import React from 'react';
import FNOLDashboard from './FNOLDashboard';

export default function DashboardPage({ claims }) {
  return (
    <div style={{ padding: '32px' }}>
      <FNOLDashboard claims={claims} />
    </div>
  );
}
