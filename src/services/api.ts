// frontend/src/services/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Your backend URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- AUTHENTICATION FUNCTIONS ---

export const login = async (email) => {
  // This is for the form-based login, which currently just gets the mock user
  const response = await apiClient.post('/login', { email });
  return response.data;
};

export const getUserById = async (userId) => {
  // Fetches user data after a successful social login
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
};


// --- CONVERSATION FUNCTIONS ---

export const fetchConversations = async (platform) => {
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

        // --- THE FIX ---
        // This takes ALL properties from the backend object (`...c`)
        // and just renames `_id` to `id` for the frontend.
        // This ensures that new fields like `contactId` are automatically included.
        return response.data.map(c => ({
            ...c, // Spread all properties from the source object
            id: c._id // Overwrite/add the 'id' property
        }));

    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
};

export const updateConversationAiStatus = async (conversationId, isEnabled) => {
  const response = await apiClient.patch(`/conversations/${conversationId}/toggle-ai`, { isEnabled });
  return response.data.isAiEnabled;
};


// --- PLATFORM STATUS FUNCTIONS (FIX FOR Inbox.tsx) ---

export const fetchPlatformAiStatus = async (platform) => {
  // --- THIS IS THE FIX ---
  // We are replacing the mocked implementation with a real API call
  // to the new endpoint we just created on the backend.
  try {
    const response = await apiClient.get(`/platform/${platform}/status`);
    return response.data.isEnabled;
  } catch (error) {
    console.error(`Error fetching platform AI status for ${platform}:`, error);
    // Return a default value in case of an error to prevent crashing
    return true; 
  }
};

export const updatePlatformAiStatus = async (platform, isEnabled) => {
  const response = await apiClient.patch(`/platform/${platform}/toggle-ai`, { isEnabled });
  return response.data.isEnabled;
};


// --- AI REPLY FUNCTION (FIX FOR ConversationItem.tsx) ---

export const generateAiReply = async (prompt) => {
  // NOTE: The "Suggest Reply" button is a manual feature. The automated replies
  // happen on the backend via webhooks. We can build a real endpoint for this
  // later if we want to keep the manual suggestion feature.
  console.log("Mocking AI reply generation for prompt:", prompt);
  return new Promise(resolve => 
    setTimeout(() => resolve(`This is a mock AI reply to: "${prompt}"`), 1000)
  );
};