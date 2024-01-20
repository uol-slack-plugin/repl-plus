export enum Rating {
  Poor = "Poor",
  Lacking = "Lacking",
  Ok = "Okay",
  Good = "Good",
  Excellent = "Excellent",
}

export enum TimeRating {
  NONE = "Practically none (1 - 5 hours per week)",
  LITTLE = "A little bit (5 - 10 hours per week)",
  MODERATE = "The average amount (10 - 15 hours per week)",
  ABOVE_AVERAGE = "A good amount (15 - 20 hours per week)",
  A_LOT = "A lot (20+ hours per week)",
}

export enum DifficultyRating {
  NO_EFFORT = "Easy",
  EASY = "Not a challenge",
  AVERAGE = "Moderately difficult",
  CHALLENGING = "Challenging",
  HARD = "Hard",
}

export const rating = Object.values(Rating);
export const timeRating = Object.values(TimeRating);
export const difficultyRating = Object.values(DifficultyRating);
