import React, { useState, useEffect, useCallback } from 'react';
import { Platform } from '../../types';
import { InstagramIcon } from '../icons/InstagramIcon';
import { FacebookIcon } from '../icons/FacebookIcon';
import ConversationList from './ConversationList';
import ToggleSwitch from '../ui/ToggleSwitch';
import { fetchPlatformAiStatus, updatePlatformAiStatus } from '../../services/api';

const platforms = [
  { id: Platform.Instagram, name: 'Instagram', icon: InstagramIcon },
  { id: Platform.Facebook, name: 'Facebook', icon: FacebookIcon },
];

const Inbox: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<Platform>(Platform.Instagram);
  const [isGlobalAiEnabled, setIsGlobalAiEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- START: THIS IS THE CRITICAL LOGIC ---

  // 1. Function to handle switching between Instagram and Facebook tabs
  const handlePlatformChange = (platform: Platform) => {
    setActivePlatform(platform);
  };

  // 2. A memoized function to fetch the current AI status from the backend
  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // Calls the real API function we fixed in api.ts
      const status = await fetchPlatformAiStatus(activePlatform);
      setIsGlobalAiEnabled(status);
    } catch (error) {
      console.error(`Failed to fetch AI status for ${activePlatform}`, error);
      setIsGlobalAiEnabled(true); // Fallback to a default state on error
    } finally {
      setIsLoading(false);
    }
  }, [activePlatform]); // This function will re-create if `activePlatform` changes

  // 3. An effect that runs when the component loads or the platform changes
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]); // This calls the fetchStatus function

  // 4. The handler for the toggle switch click
  const handleGlobalAiToggle = async (isEnabled: boolean) => {
    // This is an "optimistic update": the UI changes instantly for a snappy feel.
    setIsGlobalAiEnabled(isEnabled);
    setIsLoading(true); // Show loading state while saving

    try {
      // Call the backend to persist the change
      await updatePlatformAiStatus(activePlatform, isEnabled);
    } catch (error) {
      console.error(`Failed to update global AI status`, error);
      // If the API call fails, revert the UI to the previous state
      setIsGlobalAiEnabled(!isEnabled);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };
  // --- END: CRITICAL LOGIC ---

  const activePlatformInfo = platforms.find(p => p.id === activePlatform);

  if (!activePlatformInfo) {
    return null;
  }

  const PlatformIcon = activePlatformInfo.icon;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="border-b border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Unified Inbox</h2>
            <p className="mt-1 text-sm text-slate-500">View and manage all your conversations.</p>
          </div>
          <div className="flex space-x-1 rounded-lg bg-slate-100 p-1">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformChange(platform.id)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activePlatform === platform.id
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <platform.icon className="h-5 w-5" />
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${isGlobalAiEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <PlatformIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{activePlatformInfo.name} AI Replies</h3>
              <p className="text-sm text-slate-500">
                Enable or disable automated AI responses for all {activePlatformInfo.name} chats.
              </p>
            </div>
          </div>
          {/* This now correctly displays loading state and uses the working handler */}
          {isLoading ? <div className="h-6 w-11 animate-pulse rounded-full bg-slate-200"></div> : <ToggleSwitch isEnabled={isGlobalAiEnabled} onToggle={handleGlobalAiToggle} />}
        </div>
      </div>

      <div className="h-[calc(100vh-22rem)] overflow-y-auto">
        <ConversationList key={activePlatform} platform={activePlatform} isPlatformAiEnabled={isGlobalAiEnabled} />
      </div>
    </div>
  );
};

export default Inbox;