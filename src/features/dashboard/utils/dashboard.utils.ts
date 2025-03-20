import { StudySession } from '../types/dashboard.types';

export const generateMockStudySessions = (): StudySession[] => {
  const sessions = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    sessions.push({
      date: date.toISOString().split('T')[0],
      duration: Math.floor(Math.random() * 120) + 30
    });
  }
  
  return sessions;
};

export const calculateTotalStudyHours = (sessions: StudySession[]): number => {
  return Math.round(sessions.reduce((total, session) => total + session.duration, 0) / 60);
};

export const calculateAchievements = (materialsCount: number, flashcardsCount: number): number => {
  let achievements = 0;
  if (materialsCount >= 5) achievements++;
  if (materialsCount >= 10) achievements++;
  if (flashcardsCount >= 50) achievements++;
  if (flashcardsCount >= 100) achievements++;
  return achievements;
};

export const calculateStreak = (sessions: StudySession[]): number => {
  let streak = 0;
//   const today = new Date().toISOString().split('T')[0];
  
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].duration >= 30) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};
