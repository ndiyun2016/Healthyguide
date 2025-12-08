export interface Option {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'single_choice' | 'text' | 'rating';
  options?: Option[];
  category: 'diet' | 'activity' | 'lifestyle';
}

export interface AppSettings {
  appName: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  darkMode: boolean;
}

export interface UserResponse {
  questionId: string;
  answer: string | number;
}

export interface HealthTip {
  title: string;
  description: string;
  category: 'diet' | 'activity' | 'lifestyle';
  icon?: string;
}

export interface AssessmentResult {
  summary: string;
  score: number;
  tips: HealthTip[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  date: string;
}

export type ViewState = 'welcome' | 'assessment' | 'results' | 'history' | 'settings' | 'admin' | 'articles';
