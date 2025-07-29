// frontend/src/components/Login.tsx

import React from 'react';

// You can create a more detailed SVG icon for Meta if you like
const MetaIcon = () => (
  <svg fill="white" viewBox="0 0 24 24" className="h-6 w-6">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.142v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
  </svg>
);

const Login: React.FC = () => {
  
  const handleMetaLogin = () => {
    // This function remains the same, pointing to your backend OAuth endpoint
    const authUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/instagram`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600">
          <span className="text-3xl font-bold text-white">AI</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome to AI Inbox
        </h1>
        <p className="mt-2 text-slate-600">
          Transform your Instagram into a smart customer service agent.
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={handleMetaLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 py-3 px-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <MetaIcon />
            Continue with Meta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
