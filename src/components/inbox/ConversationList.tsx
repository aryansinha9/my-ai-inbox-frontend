// frontend/src/components/inbox/ConversationList.tsx

import React, { useState, useEffect } from 'react';
import { type Conversation, type Platform } from '../../types';
import { fetchConversations, updateConversationAiStatus } from '../../services/api';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  platform: Platform;
  isPlatformAiEnabled: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({ platform, isPlatformAiEnabled }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchConversations(platform);
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        setError('Could not load conversations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [platform]); // This effect ONLY re-runs when the platform changes.

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
        alert('Failed to save your change. Please check your connection.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading conversations...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-lg font-semibold text-slate-700">No conversations yet</h3>
        <p className="mt-1 text-slate-500">New messages from your {platform} page will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {conversations.map((convo) => (
        <ConversationItem
          key={convo.id}
          conversation={convo}
          onToggle={handleToggle}
          // THE FIX: The `isPlatformAiEnabled` prop directly controls the disabled state
          isPlatformAiEnabled={isPlatformAiEnabled}
        />
      ))}
    </ul>
  );
};

export default ConversationList;
