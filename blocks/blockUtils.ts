import {
  DatastoreQueryResponse,
  DatastoreSchema,
} from "deno-slack-api/typed-method-types/apps.ts";
import {
  dashboardNavBlocks,
  dashboardPaginationBlocks,
  dashboardReviewsBlock,
} from "./dashboard.ts";
import { InteractiveBlocks } from "../types/InteractiveBlock.ts";
import { Review } from "../types/review.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";

export const createOptions = (options: string[]) => {
  return options.map((option) => createOption(option));
};

export const createOption = (option: string) => ({
  text: {
    type: "plain_text",
    text: option,
    emoji: true,
  },
  value: option,
});

export const generateDashboardBlocks = (
  queryResponse: DatastoreQueryResponse<typeof ReviewsDatastore.definition>,
): InteractiveBlocks[] => {
  const blocks = [];

  // add blocks from dashboardNavBlocks
  blocks.push(...dashboardNavBlocks());
  blocks.push({ type: "divider" });

  // add blocks from dashboardReviewsBlock
  blocks.push(...dashboardReviewsBlock(queryResponse.items));
  blocks.push({ type: "divider" });

  // add blocks from dashboardPaginationBlocks
  blocks.push(
    dashboardPaginationBlocks(
      queryResponse.response_metadata?.next_cursor,
    ),
  );
  return blocks;
};
