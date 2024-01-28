import {
  BACK,
  CONTENT_ACTION_ID,
  CONTENT_ID,
  CREATE_REVIEW_FORM,
  CREATE_REVIEW_SUBMIT,
  DELETE_REVIEW,
  DIFFICULTY_RATING_ACTION_ID,
  DIFFICULTY_RATING_ID,
  EDIT_REVIEW_FORM,
  LEARNING_RATING_ACTION_ID,
  LEARNING_RATING_ID,
  MODULE_ACTION_ID,
  MODULE_ID,
  NEXT_RESULTS,
  QUALITY_RATING_ACTION_ID,
  QUALITY_RATING_ID,
  READ_REVIEW,
  SEARCH_REVIEWS_FORM,
  TIME_RATING_ACTION_ID,
  TIME_RATING_ID,
  TITLE_ACTION_ID,
  TITLE_ID,
} from "../functions/generate_dashboard/constants.ts";
import { Module } from "../types/module.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";
import { Review } from "../types/review.ts";
import { ReviewEntry } from "../types/review_entry.ts";
import { averageRating } from "../utils/average_calc.ts";
import { header } from "./builders/commons.ts";

import {
  headerBlocks,
  navBarBlocks,
  paginationBlocks,
  reviewsBlocks,
} from "./builders/dashboard.ts";
import {
  actionButtonsBlock,
  generalInfoBlocks,
  ratingBreakDownBlocks,
  titleAndReviewBlocks,
} from "./builders/read_review.ts";
import {
  generateInput,
  generateSelectType1,
  generateSelectType2,
  info,
  submitAndCancelButtons,
  validationAlert,
} from "./builders/review_form.ts";

export function generateDashboardBlocks(
  reviews: Review[],
  cursor: string | undefined,
) {
  const blocks = [];

  blocks.push(...headerBlocks());
  blocks.push(
    ...navBarBlocks(CREATE_REVIEW_FORM, EDIT_REVIEW_FORM, SEARCH_REVIEWS_FORM),
  );
  blocks.push({ type: "divider" });
  blocks.push(...reviewsBlocks(READ_REVIEW, reviews));
  blocks.push(paginationBlocks(NEXT_RESULTS, cursor));

  return blocks;
}

export const generateReviewEntryFormBlocks = (
  title: string,
  modules: Module[],
  status: ReviewEntry | undefined = undefined,
) => {
  const blocks = [];

  blocks.push(...header(title));

  blocks.push(
    ...generateSelectType2(
      "Pick a course that you'd like to share thoughts on",
      "Select a module",
      modules,
      MODULE_ID,
      MODULE_ACTION_ID,
    ),
  );

  if (status?.module_id === null) blocks.push(...validationAlert());

  blocks.push(...info());

  blocks.push(
    ...generateSelectType1(
      "Quality?",
      "Rate Quality",
      rating,
      QUALITY_RATING_ID,
      QUALITY_RATING_ACTION_ID,
    ),
  );

  if (status?.rating_quality === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateSelectType1(
      "Difficulty?",
      "Rate Difficulty",
      difficultyRating,
      DIFFICULTY_RATING_ID,
      DIFFICULTY_RATING_ACTION_ID,
    ),
  );

  if (status?.rating_difficulty === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateSelectType1(
      "Learning?",
      "Rate Learning",
      rating,
      LEARNING_RATING_ID,
      LEARNING_RATING_ACTION_ID,
    ),
  );

  if (status?.rating_learning === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateSelectType2(
      "How much time did you spend on this module?",
      "Select an item",
      timeRating,
      TIME_RATING_ID,
      TIME_RATING_ACTION_ID,
    ),
  );

  if (status?.time_consumption === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateInput("Title", false, TITLE_ID, TITLE_ACTION_ID),
  );

  if (status?.title === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateInput(
      "What are your thoughts on this course?",
      true,
      CONTENT_ID,
      CONTENT_ACTION_ID,
    ),
  );

  if (status?.content === null) blocks.push(...validationAlert());

  blocks.push(
    ...submitAndCancelButtons(BACK, CREATE_REVIEW_SUBMIT, modules),
  );

  return blocks;
};

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
