import {
  BACK,
  DELETE_REVIEW,
  EDIT_REVIEW_FORM,
} from "../functions/generate_dashboard/constants.ts";
import { Review } from "../types/review.ts";
import { averageRating } from "../utils/average_calc.ts";
import { header } from "./builders/commons.ts";
import {
  actionButtonsBlock,
  generalInfoBlocks,
  ratingBreakDownBlocks,
  titleAndReviewBlocks,
} from "./builders/read_review.ts";

export const generateReadReviewBlocks = (
  review: Review,
  currentUserId: string,
) => {
  const blocks = [];

  blocks.push(...header(review.module_id));
  blocks.push(...generalInfoBlocks(
    review.user_id,
    averageRating(
      review.rating_difficulty,
      review.rating_learning,
      review.rating_quality,
      review.time_consumption,
    ),
    review.created_at,
  ));
  blocks.push(
    ...ratingBreakDownBlocks(
      review.rating_quality,
      review.rating_difficulty,
      review.time_consumption,
      review.rating_learning,
    ),
  );
  blocks.push(...titleAndReviewBlocks(review.title, review.content));
  blocks.push(
    ...actionButtonsBlock(
      review.id,
      review.user_id,
      currentUserId,
      BACK,
      EDIT_REVIEW_FORM,
      DELETE_REVIEW,
    ),
  );

  return blocks;
};
