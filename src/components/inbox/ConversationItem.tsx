import React, { useState } from 'react';
import { type Conversation } from '../../types';
import ToggleSwitch from '../ui/ToggleSwitch';
import { ExternalLinkIcon } from '../icons/ExternalLinkIcon';
import TimeAgo from 'react-timeago';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CopyIcon } from '../icons/CopyIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { generateAiReply } from '../../services/api';

// --- FIX: Define the props interface correctly ---
interface ConversationItemProps {
  conversation: Conversation;
  onToggle: (conversationId: string, isEnabled: boolean) => void;
  isPlatformAiEnabled: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onToggle, isPlatformAiEnabled }) => {
  const { id, contactName, contactAvatarUrl, lastMessage, timestamp, isAiEnabled, deepLink, contactId } = conversation;

  // --- LOGIC THAT WAS MISSING ---
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

const handleGenerateReply = async () => {
    setIsGenerating(true);
    setAiReply(null);
    setError(null);
    try {
      const prompt = `As a helpful business assistant, write a short, friendly reply to this customer message: "${lastMessage}"`;
      const reply = await generateAiReply(prompt);
      
      // --- FIX: Check if reply is a valid string before setting state ---
      if (reply && typeof reply === 'string') {
        setAiReply(reply);
      } else {
        // This case handles if the API returns something unexpected
        throw new Error("Received an invalid reply from the server.");
      }

    } catch (e) {
      setError("Sorry, I couldn't generate a reply right now.");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
};

  const handleCopy = () => {
    if (!aiReply) return;
    navigator.clipboard.writeText(aiReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // --- END OF MISSING LOGIC ---

  return (
    <li className="p-4 transition-colors duration-200 hover:bg-slate-50 sm:p-6">
      <div className="flex items-start space-x-4">
        <img className="h-12 w-12 rounded-full" src={contactAvatarUrl} alt={contactName} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="truncate text-md font-semibold text-slate-800">{contactName}</p>
              <p className="truncate text-sm text-slate-500">{lastMessage}</p>
            </div>
            <time className="ml-4 whitespace-nowrap text-xs text-slate-400"><TimeAgo date={timestamp} /></time>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-y-3">
             <div className="flex items-center gap-4">
                <a
                // --- THE FIX ---
                // Use Meta's official short link for DMs. This works on both
                // mobile (opens the app) and desktop (opens the website).
                href={`https://ig.me/m/${contactId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                Open in App
              </a>
                 <button
                    onClick={handleGenerateReply}
                    disabled={isGenerating || !isAiEnabled || !isPlatformAiEnabled}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                    <SparklesIcon className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Suggest Reply'}
                </button>
             </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${isPlatformAiEnabled ? 'text-slate-600' : 'text-slate-400'}`}>AI Reply</span>
               <ToggleSwitch 
                    isEnabled={isAiEnabled} 
                    onToggle={(enabled) => onToggle(id, enabled)}
                    disabled={!isPlatformAiEnabled}
                />
            </div>
          </div>
          
           {/* AI Reply Display Area */}
           {isGenerating && (
             <div className="mt-4 h-16 w-full animate-pulse rounded-lg bg-slate-100"></div>
           )}
           {error && (
             <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
             </div>
           )}
           {aiReply && (
            <div className="relative mt-4 rounded-lg border border-violet-200 bg-violet-50 p-3">
                 <p className="whitespace-pre-wrap text-sm text-slate-800">{aiReply}</p>
                 <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-violet-100 hover:text-violet-700"
                    aria-label="Copy reply"
                 >
                    {copied ? <CheckIcon className="h-5 w-5 text-green-600" /> : <CopyIcon className="h-5 w-5" />}
                 </button>
            </div>
           )}
        </div>
      </div>
    </li>
  );
};

export default ConversationItem;