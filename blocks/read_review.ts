import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";
import { convertUnixToDate } from "../utils/converters.ts";

export const readReviewBlocks = (
  review: DatastoreItem<typeof ReviewsDatastore.definition>,
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
        value: "click_me_123",
        action_id: "actionId-0",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Delete",
          emoji: true,
        },
        value: "click_me_123",
        action_id: "actionId-",
      },
    ],
  },
];
