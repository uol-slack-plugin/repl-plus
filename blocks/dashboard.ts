import {
CREATE_REVIEW,
  EDIT_MENU,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ,
  SEARCH_REVIEWS_FORM,
} from "../functions/generate_dashboard/constants.ts";
import { Metadata } from "../types/metadata.ts";
import { Review } from "../types/review.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Module } from "../types/module.ts";
import {
  createReviews,
  dashboardHeader,
  dashboardNavbar,
  divider,
  pagination,
} from "./blocks.ts";

export function generateDashboardBlocks(
  metadata: Metadata,
  modules: Module[],
  reviews: Review[],
): InteractiveBlock[] {
  const blocks = [];
  const metadataString = JSON.stringify(metadata);
  const cursors: (string|null)[] = metadata.cursors;

  blocks.push(dashboardHeader());
  blocks.push(dashboardNavbar(
    CREATE_REVIEW,
    EDIT_MENU,
    SEARCH_REVIEWS_FORM,
    metadataString,
  ));
  blocks.push(divider);
  blocks.push(...createReviews(
    READ,
    modules,
    reviews,
    metadataString,
  ));
  blocks.push(pagination(
    PREVIOUS_RESULTS,
    NEXT_RESULTS,
    metadataString,
    cursors,
  ));
  return blocks;
}
