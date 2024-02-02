import {
  BACK,
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
  header,
} from "./blocks.ts";

export function generateSearchResultsBlocks(
  metadata: Metadata,
  modules: Module[],
  reviews: Review[],
): InteractiveBlock[] {
  const blocks = [];
  const metadataString = JSON.stringify(metadata);

  blocks.push(header("Search Results"));
  blocks.push(divider);
  blocks.push(...createReviews(
    READ,
    modules,
    reviews,
    metadataString,
  ));
  blocks.push(cancelAndDashboardButtons(BACK, DASHBOARD, metadataString));

  return blocks;
}
