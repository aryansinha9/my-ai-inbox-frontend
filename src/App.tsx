// frontend/src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SelectPage from './components/SelectPage'; // IMPORT NEW COMPONENT
import { type User } from './types';
import { login, getUserById } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // NEW STATE for the onboarding flow
  const [onboardingSessionId, setOnboardingSessionId] = useState<string | null>(null);

  const handleLogin = useCallback(async (email: string) => {
    setIsLoading(true);
    setError('');
    try {
      const loggedInUser = await login(email);
      localStorage.setItem('ai-inbox-user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('ai-inbox-user');
    setUser(null);
  }, []);

  // NEW HANDLER for when page selection is complete
  const handleOnboardingComplete = useCallback((finalizedUser: User) => {
    localStorage.setItem('ai-inbox-user', JSON.stringify(finalizedUser));
    setUser(finalizedUser);
    setOnboardingSessionId(null); // Clear the session ID to show the dashboard
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  // This hook now handles ALL initial authentication checks, including the new step
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const userIdFromUrl = urlParams.get('userId');
      const sessionIdFromUrl = urlParams.get('sessionId'); // LOOK FOR SESSION ID

      // Case 1: Returning from OAuth to select a page
      if (sessionIdFromUrl) {
        setOnboardingSessionId(sessionIdFromUrl);
        setIsLoading(false);
        return; // Stop further checks, render SelectPage component
      }

      // Case 2: Returning from OAuth with finalized user ID
      if (userIdFromUrl) {
        try {
          const loggedInUser = await getUserById(userIdFromUrl);
          localStorage.setItem('ai-inbox-user', JSON.stringify(loggedInUser));
          setUser(loggedInUser);
        } catch (err) {
          setError('Failed to complete login. Please try again.');
        } finally {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setIsLoading(false);
        return;
      }

      // Case 3: Check for stored session in local storage
      try {
        const storedUser = localStorage.getItem('ai-inbox-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('ai-inbox-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // UPDATED RENDER LOGIC
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p>Loading...</p>
      </div>
    );
  }

  // Show page selection screen if onboarding session exists
  if (onboardingSessionId) {
    return (
      <SelectPage
        sessionId={onboardingSessionId}
        onOnboardingComplete={handleOnboardingComplete}
      />
    );
  }

  // Show dashboard for finalized users
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Show main login page
  return <Login onLogin={handleLogin} isLoading={false} error={error} />;
};

export default App;
