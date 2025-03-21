export interface ReviewDTO{
  difficulty: number;
  next_review: string;
}


export enum DifficultyLevel {
  Easy = "easy",
  Medium = "normal",
  Hard = "hard",
}