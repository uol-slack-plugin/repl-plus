import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";
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

export const actionButtonsBlock = (
  cancelActionId: string,
) => [{
  type: "actions",
  elements: [
    {
      type: "button",
      text: {
        type: "plain_text",
        text: "Go Back",
      },
      action_id: cancelActionId,
    },
  ],
}];
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
