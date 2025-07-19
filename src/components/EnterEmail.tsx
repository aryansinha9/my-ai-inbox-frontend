// frontend/src/components/EnterEmail.tsx

import React, { useState } from 'react';
import { addOnboardingEmail } from '../services/api';

interface EnterEmailProps {
  sessionId: string;
}

const EnterEmail: React.FC<EnterEmailProps> = ({ sessionId }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await addOnboardingEmail(sessionId, email);
      // On success, redirect to the page selection screen
      window.location.href = `/select-page?sessionId=${sessionId}`;
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            One Last Step
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            We couldn't retrieve an email from your social profile. Please provide a contact email to continue.
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-violet-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterEmail;
