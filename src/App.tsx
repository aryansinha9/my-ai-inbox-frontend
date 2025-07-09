// frontend/src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { type User } from './types';
import { login, getUserById } from './services/api'; // Import getUserById

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // This function is now ONLY for the email/password form
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

  // This hook handles ALL initial authentication checks
  useEffect(() => {
    const checkAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userIdFromUrl = urlParams.get('userId');

      // Case 1: The user is returning from the OAuth flow with a user ID
      if (userIdFromUrl) {
        try {
          const loggedInUser = await getUserById(userIdFromUrl);
          localStorage.setItem('ai-inbox-user', JSON.stringify(loggedInUser));
          setUser(loggedInUser);
        } catch (err) {
          console.error("Failed to fetch user by ID after OAuth redirect", err);
          setError('Failed to complete login. Please try again.');
        } finally {
          // Clean the URL so a refresh doesn't re-trigger this
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setIsLoading(false);
        return; // Stop further checks
      }

      // Case 2: The user is returning to the site, check for a stored session
      try {
        const storedUser = localStorage.getItem('ai-inbox-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        // Clear corrupted data
        localStorage.removeItem('ai-inbox-user');
      } finally {
        setIsLoading(false); // Stop loading after all checks are complete
      }
    };
    
    checkAuth();
  }, []); // Empty dependency array means this runs only once on initial mount

  // Display a loading indicator while authentication checks are in progress
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p>Loading...</p> {/* You can replace this with your Spinner component */}
      </div>
    );
  }

  // If after all checks there is no user, show the Login page
  if (!user) {
    return <Login onLogin={handleLogin} isLoading={isLoading} error={error} />;
  }

  // If there is a user, show the Dashboard
  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default App;