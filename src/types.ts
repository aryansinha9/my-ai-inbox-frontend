
export enum Platform {
  Instagram = 'instagram',
  Facebook = 'facebook',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Conversation {
  id: string;
  platform: Platform;
  contactName: string;
  contactAvatarUrl: string;
  lastMessage: string;
  timestamp: string;
  isAiEnabled: boolean;
  deepLink: string;
  contactId: string;
}
