import {
  CREATE_REVIEW_FORM,
  EDIT_REVIEW_MENU,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ_REVIEW,
  SEARCH_REVIEWS_FORM,
} from "../functions/generate_dashboard/constants.ts";
import { divider, renderPaginationButtons, renderReviews } from "./utils.ts";
import { Metadata } from "../types/metadata.ts";
import { Review } from "../types/review.ts";
import { Actions } from "../types/block.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";

export function generateDashboardBlocks(
  reviews: Review[],
  metadata: Metadata,
): InteractiveBlock[] {
  const blocks = [];

  blocks.push(renderMainHeader());
  blocks.push(renderNavbar(
    CREATE_REVIEW_FORM,
    EDIT_REVIEW_MENU,
    SEARCH_REVIEWS_FORM,
    JSON.stringify(metadata),
  ));
  blocks.push(divider);
  blocks.push(...renderReviews(reviews, READ_REVIEW,metadata));
  blocks.push(renderPaginationButtons(
    PREVIOUS_RESULTS,
    NEXT_RESULTS,
    metadata,
  ));
  return blocks;
}

const renderMainHeader = () => ({
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
});

const renderNavbar = (
  createActionId: string,
  editActionId: string,
  searchActionId: string,
  metadata: string,
): Actions => (
  {
    type: "actions",
    elements: [{
      type: "button",
      text: { type: "plain_text", text: "Create Review" },
      action_id: createActionId,
      value: metadata
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
  }
);
