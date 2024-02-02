import { Review } from "../types/classes/review.ts";
import { Module } from "../types/module.ts";
import {
  Actions,
  Button,
  Header,
  Option,
  ReviewBlock,
  SelectType2,
} from "../types/blocks.ts";
// utils
import { averageRating } from "../utils/average_calc.ts";
import { convertUnixToDate } from "../utils/converters.ts";
import { findModuleNameById } from "../utils/modules.ts";

export const divider = { type: "divider" };

export const header = (title: string): Header => ({
  type: "header",
  text: { type: "plain_text", text: title },
});

export const createReviews = (
  readReviewActionId: string,
  modules: Module[],
  reviews: Review[],
  metadata: string,
): ReviewBlock[] => {
  return reviews.map((review) =>
    createReview(
      readReviewActionId,
      modules,
      review,
      metadata,
    )
  );
};

export const pagination = (
  previousResultsActionId: string,
  nextResultsActionId: string,
  metadata: string,
  cursors: (string | null)[],
): Actions => {
  const actions: Actions = { type: "actions", elements: [] };
  const previousButton: Button = {
    type: "button",
    text: { type: "plain_text", text: "Previous results" },
    action_id: previousResultsActionId,
    value: metadata,
  };
  const nextButton: Button = {
    type: "button",
    text: { type: "plain_text", text: "Next results" },
    action_id: nextResultsActionId,
    value: metadata,
  };

  //hide next button
  if (cursors[cursors.length - 1] == null) {
    actions.elements.push(previousButton);
  } // hide previous button
  else if (cursors.length === 1) {
    actions.elements.push(nextButton);
  } // show both
  else if (cursors.length >= 2) {
    actions.elements.push(previousButton);
    actions.elements.push(nextButton);
  }
  return actions;
};

const createOptions = (
  options: string[] | Module[] | Review[],
  modules?: Module[],
): Option[] => {
  return options.map((option) => createOption(option, modules));
};

const createOption = (
  option: string | Module | Review,
  modules?: Module[],
): Option => {
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
      text: {
        type: "plain_text",
        text: modules
          ? findModuleNameById(modules, option.module_id)
          : option.title,
      },
      value: option.id,
    };
  }
};

const createReview = (
  readReviewActionId: string,
  modules: Module[],
  review: Review,
  metadata: string,
): ReviewBlock => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: `>*${review.title}*\n*>${
      findModuleNameById(modules, review.module_id)
    } | :star: ${
      averageRating( // TO DO: real average rating
        review.rating_difficulty,
        review.rating_learning,
        review.rating_quality,
      ).toFixed(2)
    }*\n><@${review.user_id}> | ${
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
    value: `${metadata}\\${review.id}`,
  },
});

export const selectType1 = (
  blockId: string,
  actionId: string,
  text: string,
  placeholder: string,
  options: string[] | Module[],
  initialOption?: string | Module | Review,
) => ({
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
    initial_option: initialOption ? createOption(initialOption) : undefined,
    action_id: actionId,
  },
});

export const selectType2 = (
  blockId: string,
  actionId: string,
  label: string,
  placeholder: string,
  options: string[] | Module[] | Review[],
  initialOption?: string | Module | Review,
  modules?: Module[],
): SelectType2 => ({
  type: "input",
  block_id: blockId,
  element: {
    type: "static_select",
    placeholder: {
      "type": "plain_text",
      "text": placeholder,
    },
    options: createOptions(options, modules),
    initial_option: initialOption ? createOption(initialOption) : undefined,
    action_id: actionId,
  },
  label: {
    type: "plain_text",
    text: label,
  },
});

export const inputField = (
  blockId: string,
  actionId: string,
  label: string,
  multiline: boolean,
  initialValue?: string,
) => ({
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
});

export const submitAndCancelButtons = (
  cancelActionId: string,
  submitActionId: string,
  metadata: string,
  id?: string,
) => ({
  type: "actions",
  elements: [
    {
      type: "button",
      text: {
        type: "plain_text",
        text: "Go Back",
      },
      action_id: cancelActionId,
      value: id ? `${metadata}\\${id}` : metadata,
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
      value: id ? `${metadata}\\${id}` : metadata,
    },
  ],
});

export const cancelAndDashboardButtons = (
  cancelActionId: string,
  dashboardActionId: string,
  metadata: string,
  id?: string,
) => ({
  type: "actions",
  elements: [
    {
      type: "button",
      text: {
        type: "plain_text",
        text: "Go Back",
      },
      action_id: cancelActionId,
      value: id ? `${metadata}\\${id}` : metadata,
    },
    {
      type: "button",
      text: {
        type: "plain_text",
        text: "Dashboard",
      },
      action_id: dashboardActionId,
      value: id ? `${metadata}\\${id}` : metadata,
    },
  ],
});

export const validationAlert = () => ({
  type: "context",
  elements: [
    {
      type: "plain_text",
      text: "Please fill out the required field *",
    },
  ],
});

export const dashboardHeader = () => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text:
      "Welcome to REPL Plus!\n Here you can create and view reviews on the various modules from the University Of London's Distance-learning Computer Science course.",
  },
  accessory: {
    type: "image",
    image_url:
      "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
    alt_text: "cute cat",
  },
});

export const dashboardNavbar = (
  createActionId: string,
  editActionId: string,
  searchActionId: string,
  metadata: string,
): Actions => ({
  type: "actions",
  elements: [{
    type: "button",
    text: { type: "plain_text", text: "Create Review" },
    action_id: createActionId,
    value: metadata,
  }, {
    type: "button",
    text: { type: "plain_text", text: "Edit Review" },
    action_id: editActionId,
    value: metadata,
  }, {
    type: "button",
    text: { type: "plain_text", text: "Search reviews" },
    action_id: searchActionId,
    value: metadata,
  }],
});

export const readGeneralInfo = (
  userId: string,
  generalRating: number,
  createdAt: number,
) => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: `*:star: ${generalRating.toFixed(2)} | <@${userId}> | ${
      convertUnixToDate(createdAt)
    }*`,
  },
});

export const readRatingBreakDown = (
  qualityRating: number,
  difficultyRating: number,
  timeConsumption: number,
  learningRating: number,
) => ({
  type: "section",
  fields: [
    {
      type: "mrkdwn",
      text:
        `\n\n>*Quality* - :star: ${qualityRating}.0\n>\n>*Difficulty* - :star: ${difficultyRating}.0`,
    },
    {
      type: "mrkdwn",
      text:
        ` \n>*Hours studied per week* - ${timeConsumption}+\n>\n>*Learning* - :star: ${learningRating}.0`,
    },
  ],
});

export const readTitleAndReview = (
  title: string,
  review: string,
) => ({
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": `*${title}*\n\n${review}`,
  },
});

export const readActionButtons = (
  reviewId: string,
  reviewUserId: string,
  currentUserID: string,
  cancelActionId: string,
  editActionId: string,
  deleteActionId: string,
  metadata: string,
): Actions => {
  const actions: Actions = {
    type: "actions",
    elements: [{
      type: "button",
      text: {
        type: "plain_text",
        text: "Go Back",
      },
      action_id: cancelActionId,
      value: metadata,
    }],
  };

  // Check if the current user matches the user ID from the review
  if (reviewUserId === currentUserID) {
    actions.elements.push(
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Edit",
        },
        action_id: editActionId,
        value: `${metadata}\\${reviewId}`,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Delete",
        },
        action_id: deleteActionId,
        value: `${metadata}\\${reviewId}`,
      },
    );
  }
  return actions;
};

export const reviewFormInfo = () => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text:
      "*On a scale of one to five, with one being low and 5 being high, how would you rate this course on its:*",
  },
});

export const mrkdwnSection = (mrkdwn: string) => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: mrkdwn,
  },
});

export const datePicker = (
  blockId: string,
  actionId: string,
  label: string,
  initDate: string,
) => ({
  type: "section",
  block_id: blockId,
  text: {
    type: "mrkdwn",
    text: label,
  },
  accessory: {
    type: "datepicker",
    initial_date: initDate,
    placeholder: {
      type: "plain_text",
      text: "Select a date",
    },
    action_id: actionId,
  },
});

export const generateStarRating = (rating: number) => {
  return ":star:".repeat(rating) + "☆".repeat(5 - rating);
};
