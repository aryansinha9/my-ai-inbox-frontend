
import React, { useState, useEffect } from 'react';
import { type Conversation, type Platform } from '../../types';
import { fetchConversations, updateConversationAiStatus } from '../../services/api';
import ConversationItem from './ConversationItem';
import Spinner from '../ui/Spinner';

interface ConversationListProps {
  platform: Platform;
  isPlatformAiEnabled: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({ platform, isPlatformAiEnabled }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        const data = await fetchConversations(platform);
        // If platform AI is disabled, all conversation toggles should reflect that initially.
        const adjustedData = data.map(c => ({
            ...c,
            isAiEnabled: isPlatformAiEnabled ? c.isAiEnabled : false,
        }));
        setConversations(adjustedData);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [platform, isPlatformAiEnabled]);
  
// --- NEW & CRITICAL FIX ---
  // This effect updates the display when the global toggle is flipped
  useEffect(() => {
    // If the global AI is disabled, we want to visually update all toggles to "off"
    // without actually changing their state in the database.
    setConversations(currentConversations =>
      currentConversations.map(c => ({
        ...c,
        // The individual toggle's enabled state is now a combination of its own state AND the global state
        isAiEnabledForDisplay: isPlatformAiEnabled ? c.isAiEnabled : false,
      }))
    );
  }, [isPlatformAiEnabled]);

  const handleToggle = async (conversationId: string, isEnabled: boolean) => {
    // Optimistic update
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, isAiEnabled: isEnabled } : c))
    );
    try {
        await updateConversationAiStatus(conversationId, isEnabled);
    } catch (error) {
        console.error('Failed to update conversation status:', error);
        // Revert on failure
        setConversations(prev =>
            prev.map(c => (c.id === conversationId ? { ...c, isAiEnabled: !isEnabled } : c))
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-10">
        <Spinner />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <h3 className="text-lg font-semibold text-slate-700">No conversations yet</h3>
        <p className="text-slate-500 mt-1">New messages from {platform} will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-200">
      {conversations.map((convo) => (
        <ConversationItem
          key={convo.id}
          conversation={convo}
          onToggle={handleToggle}
          isPlatformAiEnabled={isPlatformAiEnabled}
        />
      ))}
    </ul>
  );
};

export default ConversationList;
