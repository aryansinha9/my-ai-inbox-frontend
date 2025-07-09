import React, { useState } from 'react';
import { type User } from '../types';
import { MessageSquareIcon } from './icons/MessageSquareIcon'; // Ensure you have this icon
import { PowerIcon } from './icons/PowerIcon'; // Ensure you have this icon

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    // A clean white header with a bottom border and shadow
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* App Logo and Title */}
          <div className="flex items-center space-x-3">
             <div className="rounded-lg bg-violet-600 p-2">
                <MessageSquareIcon className="h-6 w-6 text-white" />
             </div>
            <h1 className="text-xl font-bold text-slate-800">AI Inbox</h1>
          </div>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="flex items-center space-x-3 rounded-full p-1 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              <img className="h-9 w-9 rounded-full" src={user.avatarUrl} alt="User avatar" />
              <span className="hidden sm:inline text-sm font-medium text-slate-700">{user.name}</span>
            </button>
            
            {/* The Dropdown Menu */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="border-b px-4 py-2 text-sm text-gray-700">
                    <p className="font-medium">Signed in as</p>
                    <p className="truncate">{user.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100"
                >
                  <PowerIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;