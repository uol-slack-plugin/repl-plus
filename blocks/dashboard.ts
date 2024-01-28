import {
  CREATE_REVIEW_FORM,
  EDIT_REVIEW_FORM,
  NEXT_RESULTS,
  READ_REVIEW,
  SEARCH_REVIEWS_FORM,
} from "../functions/generate_dashboard/constants.ts";
import { Review } from "../types/review.ts";
import {
  headerBlocks,
  navBarBlocks,
  paginationBlocks,
  reviewsBlocks,
} from "./builders/dashboard.ts";

export function generateDashboardBlocks(
  reviews: Review[],
  cursor: string | undefined,
) {
  const blocks = [];

  blocks.push(...headerBlocks());
  blocks.push(
    ...navBarBlocks(CREATE_REVIEW_FORM, EDIT_REVIEW_FORM, SEARCH_REVIEWS_FORM),
  );
  blocks.push({ type: "divider" });
  blocks.push(...reviewsBlocks(READ_REVIEW, reviews));
  blocks.push(paginationBlocks(NEXT_RESULTS, cursor));

  return blocks;
}
