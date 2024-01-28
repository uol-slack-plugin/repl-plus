import { Schema } from "deno-slack-sdk/mod.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";
import {
  convertIntToDifficultyRating,
  convertIntToRating,
  convertIntToTimeRating,
} from "../utils/converters.ts";
import { InteractiveStep } from "../types/interactiveStep.ts";
import {
  CANCEL_BUTTON,
  EDIT_CONTENT_A_ID,
  EDIT_CONTENT_B_ID,
  EDIT_DIFFICULTY_RATING_A_ID,
  EDIT_DIFFICULTY_RATING_B_ID,
  EDIT_LEARNING_RATING_A_ID,
  EDIT_LEARNING_RATING_B_ID,
  EDIT_QUALITY_RATING_A_ID,
  EDIT_QUALITY_RATING_B_ID,
  EDIT_REVIEW_SUBMIT,
  EDIT_TIME_RATING_A_ID,
  EDIT_TIME_RATING_B_ID,
  SELECT_REVIEW_A_ID,
  SELECT_REVIEW_B_ID,
  SELECT_REVIEW_SUBMIT,
} from "../functions/generate_dashboard/constants.ts";
import { createOption, createOptions } from "./blockUtils.ts";

export const editReviewBlocks: InteractiveStep = (getModulesStep) => ({
  elements: [{
    name: "rating_quality",
    title: "How would you rate this course in terms of quality?",
    type: Schema.types.string,
    enum: rating,
    default: convertIntToRating(getModulesStep.outputs.rating_quality),
  }, {
    name: "rating_difficulty",
    title: "How would you rate this course in terms of difficulty?",
    type: Schema.types.string,
    enum: difficultyRating,
    default: convertIntToDifficultyRating(
      getModulesStep.outputs.rating_difficulty,
    ),
  }, {
    name: "rating_learning",
    title: "How would you rate this course in terms of learning?",
    type: Schema.types.string,
    enum: rating,
    default: convertIntToRating(getModulesStep.outputs.rating_learning),
  }, {
    name: "time_consumption",
    title: "How much time did you spend on this module?",
    type: Schema.types.string,
    enum: timeRating,
    default: convertIntToTimeRating(getModulesStep.outputs.time_consumption),
  }, {
    name: "review",
    title: "Write a review",
    description: "What are your thoughts on this course?",
    type: Schema.types.string,
    long: true,
    default: getModulesStep.outputs.review as string,
  }],
  required: [
    "time_consumption",
    "rating_learning",
    "review",
    "rating_quality",
    "rating_difficulty",
  ],
});

export const editReviewFormBlocks = (
  quality?: string,
  difficulty?: string,
  time?: string,
  learning?: string,
  title?: string,
  review?: string,
) => {
  return [
    // QUALITY
    {
      type: "input",
      block_id: EDIT_QUALITY_RATING_B_ID,
      label: {
        type: "plain_text",
        text: "Quality rating",
      },
      element: {
        type: "static_select",

        options: createOptions(rating),
        initial_option: quality ? createOption(quality) : undefined,
        action_id: EDIT_QUALITY_RATING_A_ID,
      },
    },

    // DIFFICULTY
    {
      type: "input",
      block_id: EDIT_DIFFICULTY_RATING_B_ID,
      label: {
        type: "plain_text",
        text: "Difficulty Rating",
      },
      element: {
        type: "static_select",

        options: createOptions(difficultyRating),
        initial_option: difficulty ? createOption(difficulty) : undefined,
        action_id: EDIT_DIFFICULTY_RATING_A_ID,
      },
    },

    // TIME
    {
      type: "input",
      block_id: EDIT_TIME_RATING_B_ID,
      label: {
        type: "plain_text",
        text: "Time Spent",
      },
      element: {
        type: "static_select",

        options: createOptions(timeRating),
        initial_option: time ? createOption(time) : undefined,
        action_id: EDIT_TIME_RATING_A_ID,
      },
    },

    // LEARNING
    {
      type: "input",
      block_id: EDIT_LEARNING_RATING_B_ID,
      label: {
        type: "plain_text",
        text: "Learning Rating",
      },
      element: {
        type: "static_select",
        options: createOptions(rating),
        initial_option: learning ? createOption(learning) : undefined,
        action_id: EDIT_LEARNING_RATING_A_ID,
      },
    },

    // CONTENT
    {
      type: "input",
      block_id: EDIT_CONTENT_B_ID,
      label: {
        type: "plain_text",
        text: "Write a review",
      },
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: EDIT_CONTENT_A_ID,
        initial_value: review ?? "Write something",
      },
    },

    // SUBMIT & CANCEL BUTTONS
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Cancel",
          },
          action_id: CANCEL_BUTTON,
        },

        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Submit",
          },
          action_id: EDIT_REVIEW_SUBMIT,
        },
      ],
    },
  ];
};

export const selectReviewFormBlocks = (reviews: string[]) => {
  return [
    // REVIEWS
    {
      type: "input",
      block_id: SELECT_REVIEW_B_ID,
      label: {
        type: "plain_text",
        text: "Pick a review to edit",
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: createOptions(reviews),
        action_id: SELECT_REVIEW_A_ID,
      },
    },
    // SUBMIT & CANCEL BUTTONS
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Cancel",
          },
          action_id: CANCEL_BUTTON,
        },

        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Submit",
          },
          action_id: SELECT_REVIEW_SUBMIT,
        },
      ],
    },
  ];
};
