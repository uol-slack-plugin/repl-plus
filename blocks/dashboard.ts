import { Env } from "deno-slack-sdk/types.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";
import { averageRating } from "../utils/average_calc.ts";
import { convertUnixToDate } from "../utils/converters.ts";

export const dashboardNavBlocks = (env: Env, findReviewActionId: string) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "Hello, welcome to REPL Plus Slack extension! Here you can view other students reviews on various modules and create your own! What do you want to do?",
    },
    accessory: {
      type: "image",
      image_url:
        "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
      alt_text: "cute cat",
    },
  },
  {
    type: "actions",
    elements: [{
      type: "workflow_button",
      text: {
        type: "plain_text",
        text: "Create a Review",
      },
      workflow: {
        trigger: {
          url: env["CREATE_REVIEW_WORKFLOW_URL"],
        },
      },
    }, {
      type: "workflow_button",
      text: {
        type: "plain_text",
        text: "Edit a Review",
      },
      workflow: {
        trigger: {
          url: env["EDIT_REVIEW_WORKFLOW_URL"],
        },
      },
    }, {
      type: "button",
      text: {
        type: "plain_text",
        text: "Search reviews",
        emoji: true,
      },
      action_id: findReviewActionId,
    }],
  },
];

export const dashboardReviewsBlock = (
  reviews: DatastoreItem<typeof ReviewsDatastore.definition>[],
  action_id: string,
) => {
  const blocks: any[] = [];

  reviews.forEach((review) => {
    // calculate module rating
    const moduleRating = averageRating(
      Number(review.rating_difficulty),
      Number(review.rating_learning),
      Number(review.rating_quality),
      Number(review.time_consumption),
    );

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `>*Module id: ${review.module_id} | :star: ${moduleRating}*\n> <@${review.user_id}> | ${
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
          emoji: true,
        },
        action_id: action_id,
        value: review.id,
      },
    });
  });
  return blocks;
};

export const dashboardPaginationBlocks = (
  action_id: string,
  value: string | undefined = undefined,
) => {
  return {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: `Next results`,
        },
        action_id: action_id,
        value: value,
      },
    ],
  };
};
