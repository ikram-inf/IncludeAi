export type ActiveModal = 'timer' | 'todo' | 'chat' | 'garden' | 'settings' | 'parkingLot' | null;

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export type RarityTier = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface ParkedThought {
  id: string;
  text: string;
  createdAt: string;
  resolved: boolean;
}

export type CompletionChime = 'softGong' | 'singingBowl' | 'gentleBell' | 'chime' | 'none';

export interface Butterfly {
  id: string;
  species: string;
  description: string;
  rarity: RarityTier;
  primaryColor: string;
  secondaryColor: string;
  wingPattern: 'monarch' | 'swallowtail' | 'morpho' | 'dream' | 'prism';
  earnedAt: string; // ISO date string
  sessionGoal: string;
  sessionDuration: number; // in minutes
  x: number; // position percentage 0-100
  y: number; // position percentage 0-100
  size: number;
}

export interface MicroStep {
  id: string;
  text: string;
  completed: boolean;
}

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  priority: PriorityLevel;
  microSteps: MicroStep[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type AmbientSound = 'none' | 'rain' | 'forest' | 'brownNoise' | 'cafe';
