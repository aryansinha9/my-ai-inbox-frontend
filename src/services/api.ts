// frontend/src/services/api.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Your backend URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- AUTHENTICATION FUNCTIONS ---

export const login = async (email: string) => {
  const response = await apiClient.post('/login', { email });
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
};

// --- CONVERSATION FUNCTIONS ---

export const fetchConversations = async (platform: string) => {
  const storedUser = localStorage.getItem('ai-inbox-user');
  if (!storedUser) {
    console.error("No user found in localStorage to fetch conversations for.");
    return [];
  }

  const user = JSON.parse(storedUser);
  const userId = user._id;

  try {
    const response = await apiClient.get(`/conversations/${platform}`, {
      params: { userId: userId }
    });

    return response.data.map((c: any) => ({
      ...c,
      id: c._id
    }));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const updateConversationAiStatus = async (conversationId: string, isEnabled: boolean) => {
  const response = await apiClient.patch(`/conversations/${conversationId}/toggle-ai`, { isEnabled });
  return response.data.isEnabled;
};

// --- PLATFORM STATUS FUNCTIONS ---

export const fetchPlatformAiStatus = async (platform: string) => {
  try {
    const response = await apiClient.get(`/platform/${platform}/status`);
    return response.data.isEnabled;
  } catch (error) {
    console.error(`Error fetching platform AI status for ${platform}:`, error);
    return true;
  }
};

export const updatePlatformAiStatus = async (platform: string, isEnabled: boolean) => {
  const response = await apiClient.patch(`/platform/${platform}/toggle-ai`, { isEnabled });
  return response.data.isEnabled;
};

// --- UPDATED AI REPLY FUNCTION ---
export const generateAiReply = async (prompt: string) => {
  try {
    const response = await apiClient.post('/suggest-reply', { prompt });
    return response.data.reply; // Return the 'reply' field from the JSON response
  } catch (error) {
    console.error("Error generating AI reply:", error);
    throw new Error("Failed to generate suggestion. Please try again.");
  }
};

// --- ONBOARDING FUNCTIONS ---

export const getOnboardingSession = async (sessionId: string) => {
  try {
    const response = await apiClient.get(`/onboarding-session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching onboarding session:', error);
    throw new Error('Failed to load onboarding session');
  }
};

export const finalizeOnboarding = async (sessionId: string, selectedPageId: string) => {
  try {
    const response = await apiClient.post('/finalize-onboarding', {
      sessionId,
      selectedPageId,
      agreedToTerms
    });
    return response.data;
  } catch (error) {
    console.error('Error finalizing onboarding:', error);
    throw new Error('Failed to complete onboarding');
  }
};
