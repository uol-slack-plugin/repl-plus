import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { ReviewEntry } from "../../../types/review_entry.ts";
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
import { Review } from "../../../types/review.ts";
import { Body } from "../../../types/body.ts";
import { fetchReview, updateReview } from "../../../datastores/functions.ts";
import { handleResError } from "../../../utils/errors.ts";
export default async function UpdateReviewController(
  body: Body,
  client: SlackAPIClient,
  reviewId: string,
): Promise<Validation | { error: string }> {
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

  // validate entry
  const validation: Validation = {
    pass: !ReviewEntry.allAttributesNull(reviewEntry),
    reviewEntry: reviewEntry,
  };
  if (!validation.pass) return validation;
  else { // update entry
    const getRes = await fetchReview(client, reviewId);
    if (!getRes.ok) return handleResError(getRes,"UpdateReviewController::Error at fetchReview()");

    const review: Review = {
      id: getRes.item.id,
      user_id: getRes.item.user_id,
      module_id: reviewEntry.module_id ?? getRes.item.module_id,
      title: reviewEntry.title ?? getRes.item.title,
      content: reviewEntry.content ?? getRes.item.content,
      time_consumption: reviewEntry.time_consumption ?? getRes.item.time_consumption,
      rating_quality: reviewEntry.rating_quality ?? getRes.item.rating_quality,
      rating_difficulty: reviewEntry.rating_difficulty ?? getRes.item.rating_difficulty,
      rating_learning: reviewEntry.rating_learning ?? getRes.item.rating_learning,
      helpful_votes: getRes.item.helpful_votes,
      unhelpful_votes: getRes.item.unhelpful_votes,
      created_at: getRes.item.created_at,
      updated_at: Date.now(),

    };

    const updateRes = await updateReview(client,review);
    if (!updateRes.ok) return handleResError(updateRes,"UpdateReviewController::Error at updateReview()");
    
    return validation;
  }
}
