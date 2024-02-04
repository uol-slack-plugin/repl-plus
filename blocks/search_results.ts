import {
  BACK,
  CREATE_REVIEW,
  DASHBOARD,
  READ,
} from "../functions/generate_dashboard/constants.ts";
import { Metadata } from "../types/metadata.ts";
import { Review } from "../types/classes/review.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Module } from "../types/module.ts";
import {
  cancelAndDashboardButtons,
  createReviews,
  divider,
  footer,
  header,
  noReviewsFound,
} from "./blocks.ts";
import { Confirm } from "../types/blocks.ts";

export function generateSearchResultsBlocks(
  metadata: Metadata,
  modules: Module[],
  reviews: Review[],
): InteractiveBlock[] {
  if (!metadata || !modules || !reviews) {
    throw new Error("Invalid input data"); // Throw an error if input data is invalid or missing
  }

  const blocks: InteractiveBlock[] = [];
  const metadataString: string = JSON.stringify(metadata);

  blocks.push(header("Search Results"));
  blocks.push(divider);
  (reviews.length === 0)
    ? blocks.push(noReviewsFound(
      CREATE_REVIEW,
      metadataString,
    ))
    : blocks.push(...createReviews(
      READ,
      modules,
      reviews,
      metadataString,
    ));


  blocks.push(cancelAndDashboardButtons(BACK, DASHBOARD, metadataString));
  blocks.push(divider);
  blocks.push(footer());

  return blocks;
}
