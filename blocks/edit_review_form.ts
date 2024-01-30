import { QUALITY_RATING_ID, QUALITY_RATING_ACTION_ID, DIFFICULTY_RATING_ID, DIFFICULTY_RATING_ACTION_ID, TIME_RATING_ID, TIME_RATING_ACTION_ID, LEARNING_RATING_ID, LEARNING_RATING_ACTION_ID, CONTENT_ID, CONTENT_ACTION_ID, BACK, SUBMIT } from "../functions/generate_dashboard/constants.ts";
import { rating, difficultyRating, timeRating } from "../types/rating.ts";

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
      block_id: QUALITY_RATING_ID,
      label: {
        type: "plain_text",
        text: "Quality rating",
      },
      element: {
        type: "static_select",

        options: createOptions(rating),
        initial_option: quality ? createOption(quality) : undefined,
        action_id: QUALITY_RATING_ACTION_ID,
      },
    },

    // DIFFICULTY
    {
      type: "input",
      block_id: DIFFICULTY_RATING_ID,
      label: {
        type: "plain_text",
        text: "Difficulty Rating",
      },
      element: {
        type: "static_select",

        options: createOptions(difficultyRating),
        initial_option: difficulty ? createOption(difficulty) : undefined,
        action_id: DIFFICULTY_RATING_ACTION_ID,
      },
    },

    // TIME
    {
      type: "input",
      block_id: TIME_RATING_ID,
      label: {
        type: "plain_text",
        text: "Time Spent",
      },
      element: {
        type: "static_select",

        options: createOptions(timeRating),
        initial_option: time ? createOption(time) : undefined,
        action_id: TIME_RATING_ACTION_ID,
      },
    },

    // LEARNING
    {
      type: "input",
      block_id: LEARNING_RATING_ID,
      label: {
        type: "plain_text",
        text: "Learning Rating",
      },
      element: {
        type: "static_select",
        options: createOptions(rating),
        initial_option: learning ? createOption(learning) : undefined,
        action_id: LEARNING_RATING_ACTION_ID,
      },
    },

    // CONTENT
    {
      type: "input",
      block_id: CONTENT_ID,
      label: {
        type: "plain_text",
        text: "Write a review",
      },
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: CONTENT_ACTION_ID,
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
          action_id: BACK,
        },

        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Submit",
          },
          action_id: SUBMIT,
        },
      ],
    },
  ];
};

function createOptions(rating: any) {
  throw new Error("Function not implemented.");
}


function createOption(quality: string) {
  throw new Error("Function not implemented.");
}
