import { Env } from "deno-slack-sdk/types.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";
import { averageRating } from "../utils/average_calc.ts";
import { convertUnixToDate } from "../utils/converters.ts";

export const dashboardNavBlocks = (env: Env) => (
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
      type: "workflow_button",
      text: {
        type: "plain_text",
        text: "Find a Review",
      },
      workflow: {
        trigger: {
          url: env["FIND_REVIEW_WORKFLOW_URL"],
        },
      },
    }],
  }
);

export const dashboardReviewsBlock = (
  reviews: DatastoreItem<typeof ReviewsDatastore.definition>[],
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
        text:`>*Module id: ${review.module_id} | :star: ${moduleRating}*\n> <@${review.user_id}> | ${convertUnixToDate(review.created_at)}\n\n>:thumbsup: ${review.helpful_votes || 0} | :thumbsdown: ${review.unhelpful_votes || 0}`,
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Read more",
          emoji: true,
        },
        value: "click_me_123",
      },
    });
  });
  return blocks;
};

export const dashboardPaginationBlocks = (action_id: string, value: string | undefined) => {
  return {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: "Next 3 Results",
        },
        action_id: action_id,
        value: value,
      },
    ],
  };
};
