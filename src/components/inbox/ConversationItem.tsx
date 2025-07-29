// frontend/src/components/inbox/ConversationItem.tsx

import React, { useState } from 'react';
import { type Conversation } from '../../types';
import ToggleSwitch from '../ui/ToggleSwitch';
import TimeAgo from 'react-timeago';
import { SparklesIcon } from '../icons/SparklesIcon';

interface ConversationItemProps {
  conversation: Conversation;
  onToggle: (conversationId: string, isEnabled: boolean) => void;
  isPlatformAiEnabled: boolean; // This prop is now critical
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onToggle, isPlatformAiEnabled }) => {
  const { id, contactName, contactAvatarUrl, lastMessage, timestamp, isAiEnabled } = conversation;

  // No changes needed for the AI reply suggestion logic
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateReply = async () => { /* ... your existing logic here ... */ };
  const handleCopy = () => { /* ... your existing logic here ... */ };
  
  return (
    <li className={`p-4 transition-colors duration-200 ${!isPlatformAiEnabled ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
      <div className="flex items-start space-x-4">
        <img className="h-10 w-10 rounded-full" src={contactAvatarUrl || 'https://picsum.photos/100'} alt={contactName} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate font-semibold text-slate-800">{contactName}</p>
            <time className="ml-4 flex-shrink-0 text-xs text-slate-400">
              <TimeAgo date={timestamp} />
            </time>
          </div>
          <p className="truncate text-sm text-slate-500">{lastMessage}</p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-y-3">
             <div className="flex items-center gap-4">
               <button
                  disabled={!isPlatformAiEnabled || isGenerating}
                  onClick={handleGenerateReply}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                  <SparklesIcon className="h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Suggest Reply'}
              </button>
             </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${isPlatformAiEnabled ? 'text-slate-600' : 'text-slate-400'}`}>
                AI Active
              </span>
              <ToggleSwitch 
                // THE FIX: The toggle's state is a combination of its own state AND the global one
                isEnabled={isPlatformAiEnabled && isAiEnabled} 
                onToggle={(enabled) => onToggle(id, enabled)}
                // THE FIX: The toggle is disabled if the platform AI is off
                disabled={!isPlatformAiEnabled}
              />
            </div>
          </div>
          
           {/* The AI Reply Display Area (no changes needed here) */}
        </div>
      </div>
    </li>
  );
};

export default ConversationItem;
