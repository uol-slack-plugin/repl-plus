import {
  BACK,
  DELETE_REVIEW,
  EDIT_REVIEW_FORM,
} from "../functions/generate_dashboard/constants.ts";
import { Review } from "../types/review.ts";
import { averageRating } from "../utils/average_calc.ts";
import { renderHeader } from "./utils.ts";
import { convertUnixToDate } from "../utils/converters.ts";
import { Actions } from "../types/block.ts";
import { Metadata } from "../types/metadata.ts";


export const generateReadReviewBlocks = (
  review: Review,
  currentUserId: string,
  metadata: Metadata,
) => {
  const blocks = [];
  metadata.payload = {reviewId:review.id};

  blocks.push(renderHeader(review.module_id)); // TO DO: Parse module name
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
  blocks.push( actionButtonsBlock(
      review.id,
      review.user_id,
      currentUserId,
      BACK,
      EDIT_REVIEW_FORM,
      DELETE_REVIEW,
      metadata
    ),
  );

  return blocks;
};


const generalInfoBlocks = (
  userId: string,
  generalRating: number,
  createdAt: number,
) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*:star: ${generalRating} | <@${userId}> | ${
        convertUnixToDate(createdAt)
      }*`,
    },
  },
  {
    type: "divider",
  },
];

const ratingBreakDownBlocks = (
  qualityRating: number,
  difficultyRating: number,
  timeConsumption: number,
  learningRating: number,
) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Rating breakdown*",
    },
  },
  {
    type: "section",
    fields: [
      {
        type: "mrkdwn",
        text:
          `>*Quality* - :star: ${qualityRating}.0\n>\n>*Difficulty* - :star: ${difficultyRating}.0`,
      },
      {
        type: "mrkdwn",
        text:
          `>*Hours studied per week* - ${timeConsumption}+\n>\n>*Learning* - :star: ${learningRating}.0`,
      },
    ],
  },
  {
    type: "divider",
  },
];

const titleAndReviewBlocks = (
  title: string,
  review: string,
) => [
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `*${title}*\n\n${review}`,
    },
  },
];

const actionButtonsBlock = (
  reviewId: string,
  reviewUserId: string,
  currentUserID: string,
  cancelActionId: string,
  editActionId: string,
  deleteActionId: string,
  metadata: Metadata,
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
      value: JSON.stringify(metadata),
    }],
  };

  // Check if the current user matches the user ID from the review
  if (reviewUserId === currentUserID) {
    metadata.payload = {reviewId}
    actions.elements.push(
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Edit",
        },
        action_id: editActionId,
        value: JSON.stringify(metadata),
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Delete",
        },
        action_id: deleteActionId,
        value: JSON.stringify(metadata),
      },
    );
  }

  return actions;
};