import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";
import { averageRating } from "../utils/average_calc.ts";
import { convertUnixToDate } from "../utils/converters.ts";
import {
  CREATE_REVIEW_FORM,
  NEXT_PAGINATION_RESULTS,
  READ_REVIEW,
  SEARCH_FORM,
  START_EDIT_REVIEW,
} from "../functions/generate_dashboard/constants.ts";

export const dashboardNavBlocks = () => [
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
      type: "button",
      text: {
        type: "plain_text",
        text: "Create Review",
      },
      action_id: CREATE_REVIEW_FORM,
    }, {
      type: "button",
      text: {
        type: "plain_text",
        text: "Edit Review",
      },
      action_id: START_EDIT_REVIEW,
    }, {
      type: "button",
      text: {
        type: "plain_text",
        text: "Search reviews",
      },
      action_id: SEARCH_FORM,
    }],
  },
];

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
        action_id: READ_REVIEW,
        value: review.id,
      },
    });
  });
  return blocks;
};

export const dashboardPaginationBlocks = (
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
        action_id: NEXT_PAGINATION_RESULTS,
        value: value,
      },
    ],
  };
};
