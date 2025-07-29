// frontend/src/components/inbox/Inbox.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Platform } from '../../types';
import { InstagramIcon } from '../icons/InstagramIcon';
import { FacebookIcon } from '../icons/FacebookIcon';
import ConversationList from './ConversationList';
import { fetchPlatformAiStatus, updatePlatformAiStatus } from '../../services/api';
import ToggleSwitch from '../ui/ToggleSwitch'; // Your existing ToggleSwitch component

const platforms = [
  { id: Platform.Instagram, name: 'Instagram', icon: InstagramIcon },
  { id: Platform.Facebook, name: 'Facebook', icon: FacebookIcon },
];

const Inbox: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<Platform>(Platform.Instagram);
  const [isGlobalAiEnabled, setIsGlobalAiEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await fetchPlatformAiStatus(activePlatform);
      setIsGlobalAiEnabled(status);
    } catch (error) {
      console.error(`Failed to fetch AI status for ${activePlatform}`, error);
      setIsGlobalAiEnabled(true); // Default to on if there's an error
    } finally {
      setIsLoading(false);
    }
  }, [activePlatform]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleGlobalAiToggle = async (isEnabled: boolean) => {
    // Optimistic update for a snappy UI
    setIsGlobalAiEnabled(isEnabled);
    
    try {
      // Persist the change to the backend
      await updatePlatformAiStatus(activePlatform, isEnabled);
    } catch (error) {
      console.error(`Failed to update global AI status`, error);
      // Revert the UI if the API call fails
      setIsGlobalAiEnabled(!isEnabled);
    }
  };

  const activePlatformInfo = platforms.find(p => p.id === activePlatform);
  if (!activePlatformInfo) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {platforms.map((platform) => {
            const isActive = activePlatform === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                <platform.icon className="h-5 w-5" />
                <span>{platform.name}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">{activePlatformInfo.name} AI Assistant</h2>
              <p className="text-sm text-slate-500 mt-1">
                Enable or disable AI responses for all {activePlatformInfo.name} conversations.
              </p>
            </div>
            {isLoading ? 
              <div className="h-6 w-11 animate-pulse rounded-full bg-slate-200"></div> 
              : <ToggleSwitch isEnabled={isGlobalAiEnabled} onToggle={handleGlobalAiToggle} />
            }
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-24rem)] overflow-y-auto">
        <ConversationList 
          key={activePlatform} // Re-mounts the component on platform change
          platform={activePlatform} 
          isPlatformAiEnabled={isGlobalAiEnabled} 
        />
      </div>
    </div>
  );
};

export default Inbox;
