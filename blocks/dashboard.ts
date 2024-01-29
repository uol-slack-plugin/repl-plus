import {
  CREATE_REVIEW_FORM,
  EDIT_REVIEW_FORM,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ_REVIEW,
  SEARCH_REVIEWS_FORM,
  SEARCH_REVIEWS_SUBMIT,
} from "../functions/generate_dashboard/constants.ts";
import { Metadata } from "../types/metadata.ts";
import { Review } from "../types/review.ts";
import {
  headerBlocks,
  navBarBlocks,
  paginationBlocks,
  reviewsBlocks,
} from "./builders/dashboard.ts";

export function generateDashboardBlocks(
  reviews: Review[],
  metadata: Metadata,
) {
  const blocks = [];

  console.log(metadata);

  blocks.push(...headerBlocks());
  blocks.push(
    ...navBarBlocks(CREATE_REVIEW_FORM, SEARCH_REVIEWS_SUBMIT, SEARCH_REVIEWS_FORM),
  );
  blocks.push({ type: "divider" });
  blocks.push(...reviewsBlocks(READ_REVIEW, reviews));

  // Check if there exists a second-to-last element
  if (metadata.cursors[metadata.cursors.length - 1] == undefined) {
    blocks.push(
      paginationBlocks(
        PREVIOUS_RESULTS,
        NEXT_RESULTS,
        JSON.stringify(metadata),
        undefined,
      ),
    );
  } else if (metadata.cursors.length === 1) {
    blocks.push(
      paginationBlocks(
        PREVIOUS_RESULTS,
        NEXT_RESULTS,
        undefined,
        JSON.stringify(metadata),
      ),
    );
  } else if (metadata.cursors.length >= 2) {
    blocks.push(
      paginationBlocks(
        PREVIOUS_RESULTS,
        NEXT_RESULTS,
        JSON.stringify(metadata),
        JSON.stringify(metadata),
      ),
    );
  }

  return blocks;
}
