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
import {
  confirm,
  divider,
  footer,
  header,
  inputField,
  reviewFormInfo,
  sectionMrkdwn,
  selectType1,
  selectType2,
  submitAndCancelButtons,
  validationAlert,
} from "./blocks.ts";
import {
  convertIntToDifficultyRating,
  convertIntToRating,
  convertIntToTimeRating,
} from "../utils/converters.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Metadata } from "../types/metadata.ts";
import { Module } from "../types/module.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";
import { Review } from "../types/classes/review.ts";
import { ReviewEntry } from "../types/classes/review_entry.ts";
import { findModuleById } from "../utils/modules.ts";

export const generateReviewFormBlocks = (
  metadata: Metadata,
  modules: Module[],
  title: string,
  review?: Review,
  state?: ReviewEntry,
): InteractiveBlock[] => {
  const blocks = [];
  const metadataString = JSON.stringify(metadata);

  blocks.push(header(title));
  blocks.push(
    sectionMrkdwn(
      "Hey! 🤠 Ready to dish out the scoop on this module? Don't be shy now, spill the beans! 🌟 We promise not to judge (well, maybe just a little). Let's turn this review into a wild ride! 🚀📚",
    ),
  );
  blocks.push(divider);

  blocks.push(selectType2(
    MODULE_ID,
    MODULE_ACTION_ID,
    "Pick a course that you'd like to share thoughts on",
    "Select a module",
    modules,
    findModuleById(modules, review?.module_id),
  ));

  if (state?.module_id === null) blocks.push(validationAlert());

  blocks.push(divider);
  blocks.push(reviewFormInfo());
  blocks.push(selectType1(
    QUALITY_RATING_ID,
    QUALITY_RATING_ACTION_ID,
    "Quality?",
    "Rate Quality",
    rating,
    convertIntToRating(review?.rating_quality),
  ));

  if (state?.rating_quality === null) blocks.push(validationAlert());

  blocks.push(selectType1(
    DIFFICULTY_RATING_ID,
    DIFFICULTY_RATING_ACTION_ID,
    "Difficulty?",
    "Rate Difficulty",
    difficultyRating,
    convertIntToDifficultyRating(review?.rating_difficulty),
  ));

  if (state?.rating_difficulty === null) blocks.push(validationAlert());

  blocks.push(selectType1(
    LEARNING_RATING_ID,
    LEARNING_RATING_ACTION_ID,
    "Learning?",
    "Rate Learning",
    rating,
    convertIntToRating(review?.rating_learning),
  ));

  if (state?.rating_learning === null) blocks.push(validationAlert());

  blocks.push(selectType2(
    TIME_RATING_ID,
    TIME_RATING_ACTION_ID,
    "How much time did you spend on this module?",
    "Select an item",
    timeRating,
    convertIntToTimeRating(review?.time_consumption),
  ));

  if (state?.time_consumption === null) blocks.push(validationAlert());
  
  blocks.push(divider);
  blocks.push(inputField(
    TITLE_ID,
    TITLE_ACTION_ID,
    "Title",
    false,
    review?.title,
  ));

  if (state?.title === null) blocks.push(validationAlert());

  blocks.push(inputField(
    CONTENT_ID,
    CONTENT_ACTION_ID,
    "What are your thoughts on this course?",
    true,
    review?.content,
  ));

  if (state?.content === null) blocks.push(validationAlert());

  blocks.push(submitAndCancelButtons(
    BACK,
    SUBMIT,
    metadataString,
    review?.id,
    confirm(
      "Are you sure?",
      "Got any juicy thoughts on this module you'd like to share?",
      "Do it",
      "Stop, I've changed my mind!",
    ),
  ));
  blocks.push(divider);
  blocks.push(footer());

  return blocks;
};
