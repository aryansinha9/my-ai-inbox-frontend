// frontend/src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/ui/Login';
import Dashboard from './components/ui/Dashboard';
import SelectPage from './components/ui/SelectPage';
import EnterEmail from './components/ui/EnterEmail'; // IMPORT NEW COMPONENT
import { type User } from './types';
import { getUserById } from './services/api';

// --- NEW: Define the possible onboarding steps ---
type OnboardingStep = 'enter-email' | 'select-page' | 'none';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [onboardingSessionId, setOnboardingSessionId] = useState<string | null>(null);
  // --- NEW: State to control which onboarding screen to show ---
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('none');
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('ai-inbox-user');
    setUser(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const handleOnboardingComplete = useCallback((finalizedUser: User) => {
    localStorage.setItem('ai-inbox-user', JSON.stringify(finalizedUser));
    setUser(finalizedUser);
    setOnboardingSessionId(null);
    setOnboardingStep('none');
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname; // Get the current URL path

      const userIdFromUrl = urlParams.get('userId');
      const sessionIdFromUrl = urlParams.get('sessionId');

      // --- THIS IS THE UPDATED ROUTING LOGIC ---
      if (sessionIdFromUrl) {
        setOnboardingSessionId(sessionIdFromUrl);
        // Decide which component to show based on the URL path
        if (pathname === '/enter-email') {
          setOnboardingStep('enter-email');
        } else if (pathname === '/select-page') {
          setOnboardingStep('select-page');
        }
        setIsLoading(false);
        return;
      }
      
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

      const storedUser = localStorage.getItem('ai-inbox-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100"><p>Loading...</p></div>;
  }
  
  // --- THIS IS THE UPDATED RENDER LOGIC ---
  if (onboardingSessionId) {
    if (onboardingStep === 'enter-email') {
      return <EnterEmail sessionId={onboardingSessionId} />;
    }
    if (onboardingStep === 'select-page') {
      return <SelectPage sessionId={onboardingSessionId} onOnboardingComplete={handleOnboardingComplete} />;
    }
  }
  
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }
  
  return <Login onLogin={() => {}} isLoading={false} error={error} />;
};

export default App;
