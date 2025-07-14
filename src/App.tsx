// frontend/src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SelectPage from './components/SelectPage';
import { type User } from './types';
// Make sure finalizeOnboarding is imported
import { login, getUserById, finalizeOnboarding } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // This state remains the same, it's the trigger for showing the SelectPage component.
  const [onboardingSessionId, setOnboardingSessionId] = useState<string | null>(null);
  

  const handleLogout = useCallback(() => {
    localStorage.removeItem('ai-inbox-user');
    setUser(null);
  }, []);

  // --- THIS IS THE CORRECTED HANDLER ---
  // Its job is now to finalize the process by calling the API.
  const handleOnboardingComplete = useCallback(async (sessionId: string, selectedPageId: string) => {
    setIsLoading(true);
    setError('');
    try {
      // It calls the API with the data it receives from the SelectPage component.
      const finalizedUser = await finalizeOnboarding(sessionId, selectedPageId);
      
      // On success, it saves the user and moves to the dashboard.
      localStorage.setItem('ai-inbox-user', JSON.stringify(finalizedUser));
      setUser(finalizedUser);
      setOnboardingSessionId(null); // Clear the session ID to show the dashboard
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError('Failed to complete your setup. Please try logging in again.');
      // If the API call fails, reset the flow.
      setOnboardingSessionId(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // This callback has no dependencies.
  
  // This hook remains the same, as its logic is correct for starting the flow.
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const userIdFromUrl = urlParams.get('userId');
      const sessionIdFromUrl = urlParams.get('sessionId');

      // Case 1: Returning from OAuth to select a page
      if (sessionIdFromUrl) {
        setOnboardingSessionId(sessionIdFromUrl);
        setIsLoading(false);
        return;
      }
      
      // Case 2: An alternative login flow (can be kept)
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

      // Case 3: Check for a stored session in local storage
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

  // The render logic determines what to show the user.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p>Loading...</p>
      </div>
    );
  }
  
  // If we have an onboarding session ID, the user needs to select their page.
  if (onboardingSessionId) {
    return (
      <SelectPage 
        sessionId={onboardingSessionId} 
        // Pass the new handler to the SelectPage component.
        // It's up to SelectPage to call this function with the correct arguments when the user is done.
        onOnboardingComplete={handleOnboardingComplete} 
      />
    );
  }
  
  // If we have a finalized user object, show them the dashboard.
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }
  
  // Otherwise, the user needs to log in.
  return <Login onLogin={handleLogin} isLoading={false} error={error} />;
};

export default App;
