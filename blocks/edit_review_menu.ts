import {
  BACK,
  EDIT_REVIEW_FORM,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ_REVIEW,
  SELECT_REVIEW_ACTION_ID,
  SELECT_REVIEW_ID,
} from "../functions/generate_dashboard/constants.ts";
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

export function generateEditReviewMenuBlocks(
  allReviews: Review[],
  reviews: Review[],
  metadata: Metadata,
) {

  const blocks = [];

  blocks.push(renderHeader("Edit Menu"));
  blocks.push(renderSelectType2(
    "Select a module that you'd like to edit",
    "Select a module",
    allReviews,
    SELECT_REVIEW_ID,
    SELECT_REVIEW_ACTION_ID,
  ));
  blocks.push(submitAndCancelButtons(BACK, EDIT_REVIEW_FORM, metadata));
  blocks.push(divider);
  blocks.push(...renderReviews(reviews, READ_REVIEW,metadata));
  blocks.push(renderPaginationButtons(PREVIOUS_RESULTS,NEXT_RESULTS,metadata));


  return blocks;
}
