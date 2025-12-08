import { Question, AppSettings, Article } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  appName: 'HealthyGuide',
  primaryColor: '#10B981', // Emerald 500
  secondaryColor: '#3B82F6', // Blue 500
  logoText: 'HealthyGuide',
  welcomeTitle: 'Your Personal Health Journey',
  welcomeSubtitle: 'Take our 10-step assessment to get personalized diet and activity recommendations.',
  darkMode: false,
};

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'How many meals do you typically eat per day?',
    type: 'single_choice',
    category: 'diet',
    options: [
      { id: 'opt1', label: '1-2 meals', value: '1-2' },
      { id: 'opt2', label: '3 balanced meals', value: '3' },
      { id: 'opt3', label: '3 meals + snacks', value: '3+' },
      { id: 'opt4', label: 'Frequent small meals', value: 'grazing' },
    ],
  },
  {
    id: 'q2',
    text: 'How much water do you drink daily?',
    type: 'single_choice',
    category: 'diet',
    options: [
      { id: 'opt1', label: 'Less than 2 glasses', value: '<2' },
      { id: 'opt2', label: '2-4 glasses', value: '2-4' },
      { id: 'opt3', label: '5-8 glasses', value: '5-8' },
      { id: 'opt4', label: 'More than 8 glasses', value: '>8' },
    ],
  },
  {
    id: 'q3',
    text: 'How often do you eat fresh fruits and vegetables?',
    type: 'single_choice',
    category: 'diet',
    options: [
      { id: 'opt1', label: 'Rarely', value: 'rarely' },
      { id: 'opt2', label: 'A few times a week', value: 'weekly' },
      { id: 'opt3', label: 'Once a day', value: 'daily_once' },
      { id: 'opt4', label: 'With every meal', value: 'daily_multi' },
    ],
  },
  {
    id: 'q4',
    text: 'How often do you consume processed foods or sugary drinks?',
    type: 'single_choice',
    category: 'diet',
    options: [
      { id: 'opt1', label: 'Daily', value: 'daily' },
      { id: 'opt2', label: 'Several times a week', value: 'frequent' },
      { id: 'opt3', label: 'Occasionally', value: 'occasional' },
      { id: 'opt4', label: 'Almost never', value: 'rarely' },
    ],
  },
  {
    id: 'q5',
    text: 'Which best describes your typical portion sizes?',
    type: 'single_choice',
    category: 'diet',
    options: [
      { id: 'opt1', label: 'Small', value: 'small' },
      { id: 'opt2', label: 'Moderate', value: 'moderate' },
      { id: 'opt3', label: 'Large', value: 'large' },
      { id: 'opt4', label: 'I often overeat', value: 'excessive' },
    ],
  },
  {
    id: 'q6',
    text: 'How many days a week do you engage in intentional exercise?',
    type: 'single_choice',
    category: 'activity',
    options: [
      { id: 'opt1', label: '0 days', value: '0' },
      { id: 'opt2', label: '1-2 days', value: '1-2' },
      { id: 'opt3', label: '3-4 days', value: '3-4' },
      { id: 'opt4', label: '5+ days', value: '5+' },
    ],
  },
  {
    id: 'q7',
    text: 'What type of physical activity do you prefer?',
    type: 'single_choice',
    category: 'activity',
    options: [
      { id: 'opt1', label: 'Walking / Light Jogging', value: 'light_cardio' },
      { id: 'opt2', label: 'Strength Training / Weights', value: 'strength' },
      { id: 'opt3', label: 'High Intensity / Sports', value: 'hiit' },
      { id: 'opt4', label: 'None / Sedentary', value: 'none' },
    ],
  },
  {
    id: 'q8',
    text: 'How many hours do you spend sitting per day (work, TV, etc.)?',
    type: 'single_choice',
    category: 'activity',
    options: [
      { id: 'opt1', label: 'Less than 4 hours', value: '<4' },
      { id: 'opt2', label: '4-6 hours', value: '4-6' },
      { id: 'opt3', label: '6-8 hours', value: '6-8' },
      { id: 'opt4', label: 'More than 8 hours', value: '>8' },
    ],
  },
  {
    id: 'q9',
    text: 'Do you incorporate stretching or mobility work into your routine?',
    type: 'single_choice',
    category: 'activity',
    options: [
      { id: 'opt1', label: 'Never', value: 'never' },
      { id: 'opt2', label: 'Sometimes', value: 'sometimes' },
      { id: 'opt3', label: 'Always before/after exercise', value: 'regularly' },
      { id: 'opt4', label: 'Daily dedicated session', value: 'daily' },
    ],
  },
  {
    id: 'q10',
    text: 'How would you rate your overall sleep quality?',
    type: 'single_choice',
    category: 'lifestyle',
    options: [
      { id: 'opt1', label: 'Poor (Frequent waking, <6 hrs)', value: 'poor' },
      { id: 'opt2', label: 'Fair (Sometimes tired)', value: 'fair' },
      { id: 'opt3', label: 'Good (Mostly rested)', value: 'good' },
      { id: 'opt4', label: 'Excellent (7-9 hrs solid sleep)', value: 'excellent' },
    ],
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'The Benefits of Morning Hydration',
    summary: 'Why drinking water first thing in the morning boosts your metabolism.',
    imageUrl: 'https://picsum.photos/400/250?random=1',
    date: 'Oct 24, 2023'
  },
  {
    id: 'a2',
    title: '5-Minute Desk Stretches',
    summary: 'Simple movements to keep your joints healthy while working.',
    imageUrl: 'https://picsum.photos/400/250?random=2',
    date: 'Nov 12, 2023'
  },
  {
    id: 'a3',
    title: 'Understanding Macronutrients',
    summary: 'A beginner guide to protein, fats, and carbohydrates.',
    imageUrl: 'https://picsum.photos/400/250?random=3',
    date: 'Dec 05, 2023'
  }
];