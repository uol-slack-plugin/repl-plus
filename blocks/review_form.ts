import {
  BACK,
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
  SUBMIT,
  TIME_RATING_ACTION_ID,
  TIME_RATING_ID,
  TITLE_ACTION_ID,
  TITLE_ID,
} from "../functions/generate_dashboard/constants.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Metadata } from "../types/metadata.ts";
import { Module } from "../types/module.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";
import { Review } from "../types/review.ts";
import { ReviewEntry } from "../types/review_entry.ts";
import {
  convertIntToDifficultyRating,
  convertIntToRating,
  convertIntToTimeRating,
} from "../utils/converters.ts";
import { findModuleById } from "../utils/modules.ts";
import {
  generateInputField,
  generateSelectType1,
  renderHeader,
  renderSelectType2,
  submitAndCancelButtons,
  validationAlert,
} from "./utils.ts";

export const generateReviewFormBlocks = (
  metadata: Metadata,
  title: string,
  modules: Module[],
  review?: Review,
  status?: ReviewEntry,
): InteractiveBlock[] => {
  const blocks = [];

  console.log(review)

  blocks.push(renderHeader(title));

  blocks.push(
    renderSelectType2(
      "Pick a course that you'd like to share thoughts on",
      "Select a module",
      modules,
      MODULE_ID,
      MODULE_ACTION_ID,
      findModuleById(modules, review?.module_id),
    ),
  );

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
      convertIntToRating(review?.rating_quality),
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
      convertIntToDifficultyRating(review?.rating_difficulty),
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
      convertIntToRating(review?.rating_learning),
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
      convertIntToTimeRating(review?.time_consumption),
    ),
  );

  if (status?.time_consumption === null) blocks.push(...validationAlert());

  blocks.push(...generateInputField(
    "Title",
    false,
    TITLE_ID,
    TITLE_ACTION_ID,
    review?.title,
  ));

  if (status?.title === null) blocks.push(...validationAlert());

  blocks.push(...generateInputField(
    "What are your thoughts on this course?",
    true,
    CONTENT_ID,
    CONTENT_ACTION_ID,
    review?.content,
  ));

  if (status?.content === null) blocks.push(...validationAlert());

  blocks.push(submitAndCancelButtons(
    BACK,
    SUBMIT,
    metadata,
  ));

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
