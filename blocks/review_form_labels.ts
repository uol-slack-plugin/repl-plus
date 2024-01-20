import { Rating } from "../types/Rating.ts";

export const reviewFormLabels = {
  timeRating: {
    [Rating.Poor]: "Practically none (1 - 5 hours per week)",
    [Rating.Lacking]: "A little bit (5 - 10 hours per week)",
    [Rating.Ok]: "The average amount (10 - 15 hours per week)",
    [Rating.Good]: "A good amount (15 - 20 hours per week)",
    [Rating.Excellent]: "A lot (20+ hours per week)",
  },
  difficultyRating: {
    [Rating.Poor]: "Easy",
    [Rating.Lacking]: "Not a challenge",
    [Rating.Ok]: "Moderately difficult",
    [Rating.Good]: "Challenging",
    [Rating.Excellent]: "Hard",
  },
  rating: {
    [Rating.Poor]: "Poor",
    [Rating.Lacking]: "Lacking",
    [Rating.Ok]: "Okay",
    [Rating.Good]: "Good",
    [Rating.Excellent]: "Excellent",
  },
};
