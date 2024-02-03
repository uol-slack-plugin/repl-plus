import {
  CREATE_REVIEW,
  EDIT_REVIEWS,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ,
  SEARCH_REVIEWS,
} from "../functions/generate_dashboard/constants.ts";
import {
  createReviews,
  dashboardHeader,
  dashboardNavbar,
  divider,
  noReviewsFound,
  pagination,
} from "./blocks.ts";
import { Metadata } from "../types/metadata.ts";
import { Review } from "../types/classes/review.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Module } from "../types/module.ts";
import { isNullElement } from "../utils/checks.ts";

export function generateDashboardBlocks(
  metadata: Metadata,
  modules: Module[],
  reviews: Review[],
): InteractiveBlock[] {
  // Defensive check for metadata, modules, and reviews
  if (!metadata || !Array.isArray(modules) || !Array.isArray(reviews)) {
    throw new Error("Invalid input data"); // Throw an error if input data is invalid
  }

  const blocks: InteractiveBlock[] = [];
  const metadataString: string = JSON.stringify(metadata);
  const cursors: (string|null)[] = metadata.cursors || []; // Default to empty array if cursors are not present

  // Generate dashboard blocks
  blocks.push(dashboardHeader());
  blocks.push(dashboardNavbar(
    CREATE_REVIEW,
    EDIT_REVIEWS,
    SEARCH_REVIEWS,
    metadataString,
  ));
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

  if (!isNullElement(cursors)) {
    blocks.push(pagination(
      PREVIOUS_RESULTS,
      NEXT_RESULTS,
      metadataString,
      cursors,
    ));
  }
  return blocks;
}
