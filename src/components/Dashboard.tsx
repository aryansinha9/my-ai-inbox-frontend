
import React from 'react';
import Header from './Header';
import Inbox from './inbox/Inbox';
import { type User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    // Set the light gray-blue background for the entire screen
    <div className="min-h-screen bg-slate-100">
      <Header user={user} onLogout={onLogout} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
           <Inbox />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;