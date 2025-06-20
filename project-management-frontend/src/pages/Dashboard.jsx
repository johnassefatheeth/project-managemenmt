import React from 'react';
import { useAuth } from '../hooks/useAuth';
import ProjectManagerDashboard from '../components/dashboard/ProjectManagerDashboard';
import DeveloperDashboard from '../components/dashboard/DeveloperDashboard';

const Dashboard = () => {
  const { isProjectManager } = useAuth();

  return (
    <div>
      {isProjectManager ? <ProjectManagerDashboard /> : <DeveloperDashboard />}
    </div>
  );
};

export default Dashboard;