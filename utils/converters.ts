import { DifficultyRating, Rating, TimeRating } from "../types/rating.ts";

export const convertRatingToInt = (rating: String | undefined) => {
  if (rating == undefined) {
    return 0;
  }
  switch (rating as Rating) {
    case Rating.Poor:
      return 1;
    case Rating.Lacking:
      return 2;
    case Rating.Ok:
      return 3;
    case Rating.Good:
      return 4;
    case Rating.Excellent:
      return 5;
    default:
      return 0;
  }
};

export const convertTimeRatingToInt = (rating: String | undefined) => {
  if (rating == undefined) {
    return 0;
  }
  switch (rating as TimeRating) {
    case TimeRating.NONE:
      return 1;
    case TimeRating.LITTLE:
      return 2;
    case TimeRating.MODERATE:
      return 3;
    case TimeRating.ABOVE_AVERAGE:
      return 4;
    case TimeRating.A_LOT:
      return 5;
    default:
      return 0;
  }
};

export const convertDifficultyRatingToInt = (rating: String | undefined) => {
  if (rating == undefined) {
    return 0;
  }
  switch (rating as DifficultyRating) {
    case DifficultyRating.NO_EFFORT:
      return 1;
    case DifficultyRating.EASY:
      return 2;
    case DifficultyRating.AVERAGE:
      return 3;
    case DifficultyRating.CHALLENGING:
      return 4;
    case DifficultyRating.HARD:
      return 5;
    default:
      return 0;
  }
};

export const convertIntToRating = (rating: number | string | undefined) => {
  const numRating = Number(rating);
  console.log(numRating)
  if(Number.isNaN(numRating) || !numRating){
    return Rating.Ok;
  }

  switch (Math.round(numRating)) {
    case 1:
      return Rating.Poor;
    case 2:
      return Rating.Lacking;
    case 3:
      return Rating.Ok;
    case 4:
      return Rating.Good;
    case 5:
      return Rating.Excellent;
    default:
      return Rating.Ok;
  }
};

export const convertIntToTimeRating = (rating: number | string | undefined) => {
  const numRating = Number(rating);
  if(Number.isNaN(numRating) || !numRating){
    return TimeRating.MODERATE;
  }
  switch (Math.round(numRating)) {
    case 1:
      return TimeRating.NONE;
    case 2:
      return TimeRating.LITTLE;
    case 3:
      return TimeRating.MODERATE;
    case 4:
      return TimeRating.ABOVE_AVERAGE;
    case 5:
      return TimeRating.A_LOT;
    default:
      return TimeRating.MODERATE;
  }
};

export const convertIntToDifficultyRating = (rating: number | string| undefined) => {
  const numRating = Number(rating);
  if(Number.isNaN(numRating) || !numRating){
    return DifficultyRating.AVERAGE;
  }
  switch (Math.round(numRating)) {
    case 1:
      return DifficultyRating.NO_EFFORT;
    case 2:
      return DifficultyRating.EASY;
    case 3:
      return DifficultyRating.AVERAGE;
    case 4:
      return DifficultyRating.CHALLENGING;
    case 5:
      return DifficultyRating.HARD;
    default:
      return DifficultyRating.AVERAGE;
  }
};