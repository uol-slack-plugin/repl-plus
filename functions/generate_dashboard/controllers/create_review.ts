import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { ReviewEntry } from "../../../types/classes/review_entry.ts";
import {
  CONTENT_ACTION_ID,
  CONTENT_ID,
  DIFFICULTY_RATING_ACTION_ID,
  DIFFICULTY_RATING_ID,
  LEARNING_RATING_ACTION_ID,
  LEARNING_RATING_ID,
  MODULE_ACTION_ID,
  MODULE_ID,
  QUALITY_RATING_ACTION_ID,
  QUALITY_RATING_ID,
  TIME_RATING_ACTION_ID,
  TIME_RATING_ID,
  TITLE_ACTION_ID,
  TITLE_ID,
} from "../constants.ts";
import { Validation } from "../../../types/validation.ts";
import { Review } from "../../../types/classes/review.ts";
import { Body } from "../../../types/body.ts";
import { createReview } from "../../../datastores/functions.ts";
import {
  convertDifficultyRatingToInt,
  convertIntToDifficultyRating,
  convertIntToRating,
  convertIntToTimeRating,
  convertRatingToInt,
  convertTimeRatingToInt,
} from "../../../utils/converters.ts";
export default async function CreateReviewController(
  body: Body,
  client: SlackAPIClient,
  userId: string,
): Promise<Validation> {
  if (!body || !client || !userId) {
    throw new Error("Invalid input parameters");
  }

  // get state from fields
  const reviewEntry = ReviewEntry.constructReviewEntry(
    body,
    MODULE_ID,
    MODULE_ACTION_ID,
    QUALITY_RATING_ID,
    QUALITY_RATING_ACTION_ID,
    DIFFICULTY_RATING_ID,
    DIFFICULTY_RATING_ACTION_ID,
    TIME_RATING_ID,
    TIME_RATING_ACTION_ID,
    LEARNING_RATING_ID,
    LEARNING_RATING_ACTION_ID,
    TITLE_ID,
    TITLE_ACTION_ID,
    CONTENT_ID,
    CONTENT_ACTION_ID,
  );

  // update default values if null
  reviewEntry.rating_difficulty = reviewEntry.rating_difficulty ??
    convertDifficultyRatingToInt(
      convertIntToDifficultyRating(reviewEntry.rating_difficulty),
    );
  reviewEntry.rating_learning = reviewEntry.rating_learning ??
    convertRatingToInt(convertIntToRating(reviewEntry.rating_learning));
  reviewEntry.rating_quality = reviewEntry.rating_quality ??
    convertRatingToInt(convertIntToRating(reviewEntry.rating_quality));
  reviewEntry.time_consumption = reviewEntry.time_consumption ??
    convertTimeRatingToInt(
      convertIntToTimeRating(reviewEntry.time_consumption),
    );

  // validate data
  const validation: Validation = ReviewEntry.validateReviewEntry(reviewEntry);
  if (!validation.pass) return validation;
  else { // create review
    if (
      validation.reviewEntry.module_id === null ||
      validation.reviewEntry.title === null ||
      validation.reviewEntry.content === null ||
      validation.reviewEntry.time_consumption === null ||
      validation.reviewEntry.rating_quality === null ||
      validation.reviewEntry.rating_difficulty === null ||
      validation.reviewEntry.rating_learning === null
    ) throw new Error("Validation cannot be null");

    const review: Review = {
      id: String(crypto.randomUUID()),
      user_id: String(userId),
      module_id: String(validation.reviewEntry.module_id),
      title: String(validation.reviewEntry.title),
      content: String(validation.reviewEntry.content),
      time_consumption: Number(validation.reviewEntry.time_consumption),
      rating_quality: Number(validation.reviewEntry.rating_quality),
      rating_difficulty: Number(validation.reviewEntry.rating_difficulty),
      rating_learning: Number(validation.reviewEntry.rating_learning),
      helpful_votes: 0,
      unhelpful_votes: 0,
      created_at: String(Date.now()),
      updated_at: String(Date.now()),
    };

    const res = await createReview(client, review);
    if (!res.ok) throw new Error(res.error);
    return validation;
  }
}
