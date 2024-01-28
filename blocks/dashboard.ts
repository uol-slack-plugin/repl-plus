import {
  CREATE_REVIEW_FORM,
  EDIT_REVIEW_FORM,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
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
  cursors: string[],
) {
  const blocks = [];

  blocks.push(...headerBlocks());
  blocks.push(
    ...navBarBlocks(CREATE_REVIEW_FORM, EDIT_REVIEW_FORM, SEARCH_REVIEWS_FORM),
  );
  blocks.push({ type: "divider" });
  blocks.push(...reviewsBlocks(READ_REVIEW, reviews));

  // Check if there exists a second-to-last element
  if (cursors[cursors.length - 1] == undefined) {
    blocks.push(
      paginationBlocks(
        PREVIOUS_RESULTS,
        NEXT_RESULTS,
        JSON.stringify(cursors),
        undefined,
      ),
    );
  } else if (cursors.length === 1) {
    blocks.push(
      paginationBlocks(
        PREVIOUS_RESULTS,
        NEXT_RESULTS,
        undefined,
        JSON.stringify(cursors),
      ),
    );
  } else if (cursors.length >= 2) {
    blocks.push(
      paginationBlocks(
        PREVIOUS_RESULTS,
        NEXT_RESULTS,
        JSON.stringify(cursors),
        JSON.stringify(cursors),
      ),
    );
  }

  return blocks;
}
