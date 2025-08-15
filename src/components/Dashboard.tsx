import React, { useState } from 'react';
import { UserRole } from '../types';
import { CoupleDashboard } from './dashboards/CoupleDashboard';
import { VendorDashboard } from './dashboards/VendorDashboard';
import { GuestDashboard } from './dashboards/GuestDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { GeneralDashboard } from './dashboards/GeneralDashboard';

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const renderDashboard = () => {
    switch (user.role) {
      case 'couple':
        return <CoupleDashboard user={user} />;
      case 'vendor':
        return <VendorDashboard user={user} />;
      case 'guest':
        return <GuestDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'general':
        return <GeneralDashboard user={user} />;
      default:
        return <CoupleDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
};