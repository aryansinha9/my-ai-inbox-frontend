import React, { useState, useEffect } from 'react';
import { getOnboardingSession, finalizeOnboarding } from '../services/api';
import { type User } from '../types';

interface SelectPageProps {
  sessionId: string;
  onOnboardingComplete: (sessionId: string, selectedPageId: string) => void;
}

const SelectPage: React.FC<SelectPageProps> = ({ sessionId, onOnboardingComplete }) => {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getOnboardingSession(sessionId);
        setPages(sessionData.pages || []);
      } catch (err) {
        setError('Could not load your pages. The session may have expired. Please try logging in again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  const handleFinalize = async () => {
    if (!selectedPageId) {
      setError('Please select a page to continue.');
      return;
    }
    setIsFinalizing(true);
    setError('');
    try {
      const finalUser = await finalizeOnboarding(sessionId, selectedPageId);
      onOnboardingComplete(sessionId, selectedPageId);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setIsFinalizing(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100"><p>Loading your pages...</p></div>;
  }

  if (error) {
     return <div className="flex min-h-screen items-center justify-center bg-slate-100"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">Connect an Instagram Page</h2>
          <p className="mt-2 text-center text-sm text-slate-600">Choose which business page you want to use with the AI.</p>
        </div>
        <div className="space-y-4">
          {pages.map((page) => (
            <div key={page.id}>
              <label
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                  selectedPageId === page.id ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="font-medium text-slate-800">{page.name}</span>
                <input
                  type="radio"
                  name="page-selection"
                  value={page.id}
                  checked={selectedPageId === page.id}
                  onChange={() => setSelectedPageId(page.id)}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                />
              </label>
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={handleFinalize}
            disabled={!selectedPageId || isFinalizing}
            className="flex w-full justify-center rounded-lg bg-violet-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isFinalizing ? 'Finalizing...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPage;
