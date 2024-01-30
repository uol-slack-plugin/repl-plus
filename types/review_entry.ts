import {
  convertIntToDifficultyRating,
  convertIntToRating,
  convertIntToTimeRating,
} from "../utils/converters.ts";
import { getOptionValue, getValue } from "../utils/state.ts";
import { Review } from "./review.ts";
import { Validation } from "./validation.ts";

export enum EntryType {
  Create,
  Edit,
}

export class ReviewEntry {
  module_id: string | null;
  rating_quality: string | null;
  rating_difficulty: string | null;
  time_consumption: string | null;
  rating_learning: string | null;
  title: string | null;
  content: string | null;
  type: EntryType;

  constructor(
    module_id: string | null,
    rating_quality: string | null,
    rating_difficulty: string | null,
    time_consumption: string | null,
    rating_learning: string | null,
    title: string | null,
    content: string | null,
    type: EntryType,
  ) {
    this.module_id = module_id;
    this.rating_quality = rating_quality;
    this.rating_difficulty = rating_difficulty;
    this.time_consumption = time_consumption;
    this.rating_learning = rating_learning;
    this.title = title;
    this.content = content;
    this.type = type;
  }
  public static constructReviewEntryFromStatus(
    // deno-lint-ignore no-explicit-any
    body: any,
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
    type: EntryType,
    review?: Review,
  ): ReviewEntry {
    const moduleValue = getOptionValue(moduleID, moduleActionID, body) ??
      review?.module_id ?? null;
    const qualityValue =
      getOptionValue(qualityRatingID, qualityRatingActionID, body) ??
        convertIntToRating(review?.rating_quality) ?? null;
    const difficultyValue =
      getOptionValue(difficultyRatingID, difficultyRatingActionID, body) ??
        convertIntToDifficultyRating(review?.rating_difficulty) ?? null;
    const timeValue = getOptionValue(timeRatingID, timeRatingActionID, body) ??
      convertIntToTimeRating(review?.time_consumption) ?? null;
    const learningValue =
      getOptionValue(learningRatingID, learningRatingActionID, body) ??
        convertIntToRating(review?.rating_learning) ?? null;
    const titleValue = getValue(titleID, titleActionID, body) ??
      review?.title ?? null;
    const contentValue = getValue(contentID, contentActionID, body) ??
      review?.content ?? null;

    return new ReviewEntry(
      moduleValue,
      qualityValue,
      difficultyValue,
      timeValue,
      learningValue,
      titleValue,
      contentValue,
      type,
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
      // Skip validation for module_id if it's editing
      if (
        key === "module_id" && reviewEntry.type === EntryType.Edit &&
        reviewEntry[key as keyof ReviewEntry] === null
      ) continue;

      if (reviewEntry[key as keyof ReviewEntry] === null) {
        pass = false;
      }
    }
    return { pass, reviewEntry };
  }
}
