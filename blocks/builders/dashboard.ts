import { averageRating } from "../../utils/average_calc.ts";
import { convertUnixToDate } from "../../utils/converters.ts";
import { Review } from "../../types/review.ts";

export const headerBlocks = () => [
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
];

export const navBarBlocks = (
  createActionId: string,
  editActionId: string,
  searchActionId: string,
) => [
  {
    type: "actions",
    elements: [{
      type: "button",
      text: {
        type: "plain_text",
        text: "Create Review",
      },
      action_id: createActionId,
    }, {
      type: "button",
      text: {
        type: "plain_text",
        text: "Edit Review",
      },
      action_id: editActionId,
    }, {
      type: "button",
      text: {
        type: "plain_text",
        text: "Search reviews",
      },
      action_id: searchActionId,
    }],
  },
];

export const reviewsBlocks = (
  readReviewActionId: string,
  reviews: Review[],
) => {
  const blocks: any[] = [];

  reviews.forEach((review) => {
    
    // calculate module rating
    const moduleRating = averageRating(
      review.rating_difficulty,
      review.rating_learning,
      review.rating_quality,
      review.time_consumption,
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
        },
        action_id: readReviewActionId,
        value: review.id,
      },
    });
  });

  return blocks;
};

export const paginationBlocks = (
  previousResultsActionId: string,
  nextResultsActionId: string,
  previousValue: string | undefined,
  nextValue: string | undefined,
) => {
  const elements = [];

  if (previousValue !== undefined) {
    elements.push({
      type: "button",
      text: {
        type: "plain_text",
        text: "Previous results",
      },
      action_id: previousResultsActionId,
      value: previousValue,
    });
  }

  if (nextValue !== undefined) {
    elements.push({
      type: "button",
      text: {
        type: "plain_text",
        text: "Next results",
      },
      action_id: nextResultsActionId,
      value: nextValue,
    });
  }

  

  return {
    type: "actions",
    elements,
  };
};
