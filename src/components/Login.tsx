// frontend/src/components/ui/Login.tsx

import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';

// This component now has fewer responsibilities.
interface LoginProps {
  isLoading: boolean;
}

const Login: React.FC<LoginProps> = ({ isLoading }) => {
  
  const handleMetaLogin = () => {
    const authUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/instagram`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Sign in to your dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Manage your AI, all in one place.
          </p>
        </div>
        
        {/*
          THE FORM IS NOW REMOVED.
          We are commenting it out, but you can also delete it entirely.
        
          <form className="space-y-6" onSubmit={handleSubmit}>
            ... all the input fields and the old sign in button ...
          </form>

          THE DIVIDER IS ALSO REMOVED.
          
          <div className="relative">
            ...
          </div>
        */}

        {/* The ONLY login option is now with Meta */}
        <div>
          <button
            type="button"
            onClick={handleMetaLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white py-3 px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
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
