
export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  downloadUrl?: string;
  year: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export enum ChatSender {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: Date;
}

export interface ProjectComment {
  id: string;
  projectId: number;
  author: string;
  text: string;
  timestamp: Date;
}