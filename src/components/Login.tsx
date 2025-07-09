// frontend/src/components/Login.tsx

import React, { useState } from 'react';
import { FacebookIcon } from './icons/FacebookIcon';

interface LoginProps {
  onLogin: (email: string) => void;
  isLoading: boolean;
  error: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState<string>('jane.doe@example.com');
  const [password, setPassword] = useState<string>('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };
  
  const handleMetaLogin = () => {
    window.location.href = 'http://localhost:4000/api/auth/instagram';
  };

  return (
    // CHANGE: Lighter background for a softer feel
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      
      {/* The Login Card - Increased internal spacing with space-y-6 */}
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        
        {/* Header Text - Added tracking-tight for a more compact look */}
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Sign in to your dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Manage your AI, all in one place.
          </p>
        </div>
        
        {/* The Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* CHANGE: Inputs are now in a container with spacing, not stacked. */}
          <div className="space-y-4">
            {/* Email Input - Now fully rounded */}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                placeholder="jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Input - Also fully rounded */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          {/* Sign In Button - CHANGE: New violet color and larger rounding */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-violet-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* Sign in with Meta Button */}
        <div>
          <button
            type="button"
            onClick={handleMetaLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2 px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <FacebookIcon className="h-5 w-5" />
            Sign in with Meta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;