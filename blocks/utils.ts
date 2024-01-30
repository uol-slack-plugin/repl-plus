import { Review } from "../types/review.ts";
import { Module } from "../types/module.ts";
import { Metadata } from "../types/metadata.ts";
import { averageRating } from "../utils/average_calc.ts";
import { convertUnixToDate } from "../utils/converters.ts";
import {
  Actions,
  Button,
  Header,
  Option,
  ReviewBlock,
  SelectType2,
} from "../types/block.ts";

export const divider = { type: "divider" };

export const renderHeader = (title: string): Header => ({
  type: "header",
  text: { type: "plain_text", text: title },
});

export const renderReviews = (
  reviews: Review[],
  readReviewActionId: string,
  metadata: Metadata,
): ReviewBlock[] => {
  return reviews.map((review) =>
    createReview(review, readReviewActionId, metadata)
  );
};

export const renderPaginationButtons = (
  previousResultsActionId: string,
  nextResultsActionId: string,
  metadata: Metadata,
): Actions => {
  const actions: Actions = { type: "actions", elements: [] };
  const previousButton: Button = {
    type: "button",
    text: { type: "plain_text", text: "Previous results" },
    action_id: previousResultsActionId,
    value: JSON.stringify(metadata),
  };
  const nextButton: Button = {
    type: "button",
    text: { type: "plain_text", text: "Next results" },
    action_id: nextResultsActionId,
    value: JSON.stringify(metadata),
  };

  //hide next button
  if (metadata.cursors[metadata.cursors.length - 1] == undefined) {
    actions.elements.push(previousButton);
  } // hide previous button
  else if (metadata.cursors.length === 1) {
    actions.elements.push(nextButton);
  } // show both
  else if (metadata.cursors.length >= 2) {
    actions.elements.push(previousButton);
    actions.elements.push(nextButton);
  }
  return actions;
};

const createOptions = (options: string[] | Module[] | Review[]): Option[] => {
  return options.map((option) => createOption(option));
};

const createOption = (option: string | Module | Review): Option => {
  if (typeof option === "string") {
    return {
      text: { type: "plain_text", text: option },
      value: option,
    };
  } else if ("code" in option) { // it's a module
    return {
      text: { type: "plain_text", text: option.name },
      value: option.id,
    };
  } else { // it's review
    return {
      text: { type: "plain_text", text: option.title },
      value: option.id,
    };
  }
};

const createReview = (
  review: Review,
  readReviewActionId: string,
  metadata: Metadata,
): ReviewBlock => {
  metadata.payload = { reviewId: review.id };

  const moduleRating = averageRating(
    review.rating_difficulty,
    review.rating_learning,
    review.rating_quality,
    review.time_consumption,
  );

  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        `>*${review.title}*\n*Module id: ${review.module_id} | :star: ${moduleRating}*\n> <@${review.user_id}> | ${
          convertUnixToDate(review.created_at)
        }\n\n>:thumbsup: ${review.helpful_votes || 0} | :thumbsdown: ${
          review.unhelpful_votes || 0
        }`,
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Read more",
      },
      action_id: readReviewActionId,
      value: JSON.stringify(metadata),
    },
  };
};

export const generateSelectType1 = (
  text: string,
  placeholder: string,
  options: string[] | Module[],
  blockId: string,
  actionId: string,
  initialOption?: string | Module | Review,
) => {
  return [
    {
      type: "section",
      block_id: blockId,
      text: {
        type: "mrkdwn",
        text: text,
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: placeholder,
        },
        options: createOptions(options),
        initial_option: initialOption? createOption(initialOption): undefined,
        action_id: actionId,
      },
    },
  ];
};

export const renderSelectType2 = (
  label: string,
  placeholder: string,
  options: string[] | Module[] | Review[],
  blockId: string,
  actionId: string,
  initialOption? : string | Module | Review
  
): SelectType2 => ({
  type: "input",
  block_id: blockId,
  element: {
    type: "static_select",
    placeholder: {
      "type": "plain_text",
      "text": placeholder,
    },
    options: createOptions(options),
    initial_option: initialOption? createOption(initialOption): undefined,
    action_id: actionId,
  },
  label: {
    type: "plain_text",
    text: label,
  },
});

export const generateInputField = (
  label: string,
  multiline: boolean,
  blockId: string,
  actionId: string,
  initialValue?: string,
) => [
  {
    type: "input",
    block_id: blockId,
    label: {
      type: "plain_text",
      text: label,
    },
    element: {
      type: "plain_text_input",
      multiline: multiline,
      action_id: actionId,
      initial_value: initialValue ?? undefined,
    },
  },
];

export const submitAndCancelButtons = (
  cancelActionId: string,
  submitActionId: string,
  metadata: Metadata,
  // modules: Module[] | undefined,
  //reviewId: string | undefined,
) => {

  const cancelMeta:Metadata = {...metadata};
  cancelMeta.cursors = [...metadata.temp];

  return {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Go Back",
        },
        action_id: cancelActionId,
        value: JSON.stringify(cancelMeta),
        confirm: {
          title: {
            type: "plain_text",
            text: "Are you sure?",
          },
          text: {
            type: "mrkdwn",
            text: "Wouldn't you prefer to share your thoughts about a module?",
          },
          confirm: {
            type: "plain_text",
            text: "Do it",
          },
          deny: {
            type: "plain_text",
            text: "Stop, I've changed my mind!",
          },
        },
      },

      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Submit",
        },
        action_id: submitActionId,
        value: JSON.stringify(metadata),
        //modules ? JSON.stringify(modules) : reviewId,
      },
    ],
  };
};

export const validationAlert = () => [{
  type: "context",
  elements: [
    {
      type: "plain_text",
      text: "Please fill out the required field *",
    },
  ],
}];
