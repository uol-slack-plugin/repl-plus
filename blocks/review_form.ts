import {
  BACK,
  CONTENT_ACTION_ID,
  CONTENT_ID,
  CREATE_REVIEW_SUBMIT,
  DIFFICULTY_RATING_ACTION_ID,
  DIFFICULTY_RATING_ID,
  EDIT_REVIEW_SUBMIT,
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
} from "../functions/generate_dashboard/constants.ts";
import { Module } from "../types/module.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";
import { Review } from "../types/review.ts";
import { ReviewEntry } from "../types/review_entry.ts";
import { renderHeader, renderSelectType2, validationAlert, generateSelectType1, generateInputField, submitAndCancelButtons } from "./utils.ts";


export const generateReviewEntryFormBlocks = (
  title: string,
  modules?: Module[],
  status?: ReviewEntry,
  review?: Review,
) => {
  const blocks = [];

  blocks.push(renderHeader(title));

  if (!review && modules) { // Select module
    blocks.push(
      renderSelectType2(
        "Pick a course that you'd like to share thoughts on",
        "Select a module",
        modules,
        MODULE_ID,
        MODULE_ACTION_ID,
      ),
    );
  } else if (review) { // Title of module
    renderHeader(review.title);
  }

  if (!review && modules && status?.module_id === null) {
    blocks.push(...validationAlert());
  }

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
    renderSelectType2(
      "How much time did you spend on this module?",
      "Select an item",
      timeRating,
      TIME_RATING_ID,
      TIME_RATING_ACTION_ID,
    ),
  );

  if (status?.time_consumption === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateInputField("Title", false, TITLE_ID, TITLE_ACTION_ID),
  );

  if (status?.title === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateInputField(
      "What are your thoughts on this course?",
      true,
      CONTENT_ID,
      CONTENT_ACTION_ID,
    ),
  );

  if (status?.content === null) blocks.push(...validationAlert());

  // blocks.push(
  //   ...submitAndCancelButtons(
  //     BACK,
  //     modules ? CREATE_REVIEW_SUBMIT : EDIT_REVIEW_SUBMIT,
  //     modules,
  //     review?.id,
  //   ),
  // );

  return blocks;
};

const info = () => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "*On a scale of one to five, with one being low and 5 being high, how would you rate this course on its:*",
    },
  },
];