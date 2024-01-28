import { convertUnixToDate } from "../../utils/converters.ts";

export const generalInfoBlocks = (
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

export const ratingBreakDownBlocks = (
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

export const titleAndReviewBlocks = (
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

export const actionButtonsBlock = (
  reviewUserId: string,
  currentUserID: string,
  cancelActionId: string,
  editActionId: string,
  deleteActionId: string,
) => {
  const actions = {
    type: "actions",
    elements: [{
      type: "button",
      text: {
        type: "plain_text",
        text: "Go Back",
      },
      action_id: cancelActionId,
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
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Delete",
        },
        action_id: deleteActionId,
      },
    );
  }

  return [actions];
};
