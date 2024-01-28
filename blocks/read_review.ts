import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";
import { convertUnixToDate } from "../utils/converters.ts";
import {
  CANCEL_BUTTON,
  START_EDIT_REVIEW,
  START_EDIT_REVIEW_FROM_REVIEW,
} from "../functions/generate_dashboard/constants.ts";

export const readReviewBlocks = (
  review: DatastoreItem<typeof ReviewsDatastore.definition>,
  deleteActionId: string,
) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `>*Module id: ${review.module_id} | *\n> <@${review.user_id}> | ${
        convertUnixToDate(review.created_at)
      }\n\n>:thumbsup: ${review.helpful_votes || 0} | :thumbsdown: ${
        review.unhelpful_votes || 0
      }`,
    },
  },
  {
    type: "section",
    text: {
      type: "plain_text",
      text: review.review,
      emoji: true,
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Edit",
          emoji: true,
        },
        value: review.id ?? undefined,
        action_id: START_EDIT_REVIEW_FROM_REVIEW,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Delete",
          emoji: true,
        },
        value: review.id,
        action_id: deleteActionId,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        value: review.id,
        action_id: CANCEL_BUTTON,
      },
    ],
  },
];
