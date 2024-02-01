import {
  convertDifficultyRatingToInt,
  convertRatingToInt,
  convertTimeRatingToInt,
} from "../utils/converters.ts";
import { getOptionValue, getValue } from "../utils/state.ts";
import { Validation } from "./validation.ts";
import { Body } from "./body.ts";

export class ReviewEntry {
  module_id: string | null;
  rating_quality: number | null;
  rating_difficulty: number | null;
  time_consumption: number | null;
  rating_learning: number | null;
  title: string | null;
  content: string | null;

  constructor(
    module_id: string | null,
    rating_quality: number | null,
    rating_difficulty: number | null,
    time_consumption: number | null,
    rating_learning: number | null,
    title: string | null,
    content: string | null,
  ) {
    this.module_id = module_id;
    this.rating_quality = rating_quality;
    this.rating_difficulty = rating_difficulty;
    this.time_consumption = time_consumption;
    this.rating_learning = rating_learning;
    this.title = title;
    this.content = content;
  }
  public static constructReviewEntry(
    body: Body,
    moduleID: string,
    moduleActionID: string,
    qualityRatingID: string,
    qualityRatingActionID: string,
    difficultyRatingID: string,
    difficultyRatingActionID: string,
    timeRatingID: string,
    timeRatingActionID: string,
    learningRatingID: string,
    learningRatingActionID: string,
    titleID: string,
    titleActionID: string,
    contentID: string,
    contentActionID: string,
  ): ReviewEntry {
    const moduleValue = getOptionValue(
      moduleID,
      moduleActionID,
      body,
    );

    const qualityValue = getOptionValue(
      qualityRatingID,
      qualityRatingActionID,
      body,
    );

    const difficultyValue = getOptionValue(
      difficultyRatingID,
      difficultyRatingActionID,
      body,
    );

    const timeValue = getOptionValue(
      timeRatingID,
      timeRatingActionID,
      body,
    );

    const learningValue = getOptionValue(
      learningRatingID,
      learningRatingActionID,
      body,
    );

    const titleValue = getValue(
      titleID,
      titleActionID,
      body,
    );

    const contentValue = getValue(
      contentID,
      contentActionID,
      body,
    );

    return new ReviewEntry(
      moduleValue,
      convertRatingToInt(qualityValue),
      convertDifficultyRatingToInt(difficultyValue),
      convertTimeRatingToInt(timeValue),
      convertRatingToInt(learningValue),
      titleValue,
      contentValue,
    );
  }

  /**
   * Check if the entry passes the following conditions:
   * - not empty strings
   * - not undefined values
   * - parse to null
   * @param reviewEntry
   * @returns
   */
  public static validateReviewEntry(
    reviewEntry: ReviewEntry,
  ): Validation {
    let pass = true;

    // not empty strings
    if (reviewEntry.title === "") pass = false;
    if (reviewEntry.content === "") pass = false;

    // not null values
    for (const key in reviewEntry) {
      if (reviewEntry[key as keyof ReviewEntry] === null) {
        pass = false;
      }
    }
    return { pass, reviewEntry };
  }

  public static allAttributesNull(reviewEntry: ReviewEntry) {
    for (const key in reviewEntry) {
      if (reviewEntry[key as keyof ReviewEntry] !== null) {
        return false;
      }
    }
    return true;
  }
}
