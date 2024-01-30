import {
  BACK,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ,
  SELECT_REVIEW_ACTION_ID,
  SELECT_REVIEW_ID,
  SUBMIT,
} from "../functions/generate_dashboard/constants.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Metadata } from "../types/metadata.ts";
import { Review } from "../types/review.ts";
import {
  divider,
  renderHeader,
  renderPaginationButtons,
  renderReviews,
  renderSelectType2,
  submitAndCancelButtons,
} from "./utils.ts";

export function generateEditMenuBlocks(
  allReviews: Review[],
  reviews: Review[],
  metadata: Metadata,
): InteractiveBlock[] {
  const blocks = [];

  blocks.push(renderHeader("Edit Menu"));
  blocks.push(renderSelectType2(
    "Select a module that you'd like to edit",
    "Select a module",
    allReviews,
    SELECT_REVIEW_ID,
    SELECT_REVIEW_ACTION_ID,
  ));
  blocks.push(submitAndCancelButtons(BACK, SUBMIT, metadata));
  blocks.push(divider);
  blocks.push(...renderReviews(reviews, READ, metadata));
  blocks.push(
    renderPaginationButtons(PREVIOUS_RESULTS, NEXT_RESULTS, metadata),
  );

  return blocks;
}
