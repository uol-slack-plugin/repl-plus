import { Env } from "deno-slack-sdk/types.ts";
import { Schema } from "deno-slack-sdk/mod.ts";
import { TypedWorkflowStepDefinition } from "deno-slack-sdk/workflows/workflow-step.ts";
import { ParameterDefinition } from "deno-slack-sdk/parameters/definition_types.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "deno-slack-sdk/parameters/types.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";
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

type InteractiveStep = <
  T extends ParameterSetDefinition,
  S extends ParameterSetDefinition,
  U extends PossibleParameterKeys<T>,
  V extends PossibleParameterKeys<S>,
>(filterUserModulesStep: TypedWorkflowStepDefinition<T, S, U, V>) => any;
// TODO: Create type for blocks

//
export const createReview: InteractiveStep = (filterUserModulesStep) => ({
  elements: [{
    name: "module_name",
    title: "Which module are you reviewing?",
    description:
      "Computer Science modules offer by Goldsmith's University of London",
    type: Schema.types.string,
    enum: filterUserModulesStep.outputs.modules_not_reviewed,
  }, {
    name: "rating_quality",
    title: "How would you rate this course in terms of quality?",
    type: Schema.types.string,
    enum: rating,
  }, {
    name: "rating_difficulty",
    title: "How would you rate this course in terms of difficulty?",
    type: Schema.types.string,
    enum: difficultyRating,
  }, {
    name: "rating_learning",
    title: "How would you rate this course in terms of learning?",
    type: Schema.types.string,
    enum: rating,
  }, {
    name: "time_consumption",
    title: "How much time did you spend on this module?",
    type: Schema.types.string,
    enum: timeRating,
  }, {
    name: "review",
    title: "Write a review",
    description: "What are your thoughts on this course?",
    type: Schema.types.string,
    long: true,
  }],
  required: [
    "module_name",
    "time_consumption",
    "rating_learning",
    "review",
    "rating_quality",
    "rating_difficulty",
  ],
});

export const createReviewFormBlocks = (modules: string[], quality: string[], difficulty: string[], time:string[], learning: string[]) => {
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
          //action_id: searchReviewsActionId,
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

const createOptions = (options: string[])=>{
  return options.map((option)=>{
    return {
      text: {
        type: "plain_text",
        text: option,
        emoji: true,
      },
      value: option,
    }
  })
}