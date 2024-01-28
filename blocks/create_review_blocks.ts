import {
  CANCEL_BUTTON,
  CREATE_CONTENT_FOR_REVIEW_A_ID,
  CREATE_CONTENT_FOR_REVIEW_B_ID,
  CREATE_DIFFICULTY_RATING_FOR_REVIEW_A_ID,
  CREATE_DIFFICULTY_RATING_FOR_REVIEW_B_ID,
  CREATE_LEARNING_RATING_FOR_REVIEW_A_ID,
  CREATE_LEARNING_RATING_FOR_REVIEW_B_ID,
  CREATE_MODULE_FOR_REVIEW_A_ID,
  CREATE_MODULE_FOR_REVIEW_B_ID,
  CREATE_QUALITY_RATING_FOR_REVIEW_A_ID,
  CREATE_QUALITY_RATING_FOR_REVIEW_B_ID,
  CREATE_REVIEW_SUBMIT,
  CREATE_TIME_RATING_FOR_REVIEW_A_ID,
  CREATE_TIME_RATING_FOR_REVIEW_B_ID,
  CREATE_TITLE_FOR_REVIEW_A_ID,
  CREATE_TITLE_FOR_REVIEW_B_ID,
} from "../functions/generate_dashboard/constants.ts";
import { createOptions } from "./blockUtils.ts";

export const createReviewFormBlocks = (
  modules: string[],
  quality: string[],
  difficulty: string[],
  time: string[],
  learning: string[],
) => {
  return [
    // MODULE
    {
      type: "input",
      block_id: CREATE_MODULE_FOR_REVIEW_B_ID,
      label: {
        type: "plain_text",
        text: "Select Module",
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: createOptions(modules),
        action_id: CREATE_MODULE_FOR_REVIEW_A_ID,
      },
    },

    // QUALITY
    {
      type: "input",
      block_id: CREATE_QUALITY_RATING_FOR_REVIEW_B_ID,
      label: {
        type: "plain_text",
        text: "Quality rating",
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: createOptions(modules),
        action_id: CREATE_QUALITY_RATING_FOR_REVIEW_A_ID,
      },
    },

    // DIFFICULTY
    {
      type: "input",
      block_id: CREATE_DIFFICULTY_RATING_FOR_REVIEW_B_ID,
      label: {
        type: "plain_text",
        text: "Difficulty Rating",
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: createOptions(modules),
        action_id: CREATE_DIFFICULTY_RATING_FOR_REVIEW_A_ID,
      },
    },

    // TIME
    {
      type: "input",
      block_id: CREATE_TIME_RATING_FOR_REVIEW_B_ID,
      label: {
        type: "plain_text",
        text: "Time Spent",
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: createOptions(modules),
        action_id: CREATE_TIME_RATING_FOR_REVIEW_A_ID,
      },
    },

    // LEARNING
    {
      type: "input",
      block_id: CREATE_LEARNING_RATING_FOR_REVIEW_B_ID,
      label: {
        type: "plain_text",
        text: "Learning Rating",
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: createOptions(modules),
        action_id: CREATE_LEARNING_RATING_FOR_REVIEW_A_ID,
      },
    },

    // TITLE
    {
      type: "input",
      block_id: CREATE_TITLE_FOR_REVIEW_B_ID,
      label: {
        type: "plain_text",
        text: "Title",
      },
      element: {
        type: "plain_text_input",
        action_id: CREATE_TITLE_FOR_REVIEW_A_ID,
      },
    },

    // CONTENT
    {
      type: "input",
      block_id: CREATE_CONTENT_FOR_REVIEW_B_ID,
      label: {
        type: "plain_text",
        text: "Write a review",
      },
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: CREATE_CONTENT_FOR_REVIEW_A_ID,
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
          action_id: CREATE_REVIEW_SUBMIT,
        },
      ],
    },
  ];
};
