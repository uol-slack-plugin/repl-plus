import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";

// BLOCKS
import {
  dashboardNavBlocks,
  dashboardPaginationBlocks,
  dashboardReviewsBlock,
} from "../../blocks/dashboard.ts";

// CONSTANTS
import {
CREATE_REVIEW_FORM,
  DELETE_REVIEW,
  LIMIT_QUERY_REVIEWS,
  NEXT_PAGINATION_RESULTS,
  READ_REVIEW,
  SEARCH_FORM,
  SEARCH_REVIEWS,
} from "./constants.ts";

// HANDLERS
import { DeleteReview } from "./handlers/delete_review.ts";
import { NextPaginationResults } from "./handlers/next_results.ts";
import { ReadReview } from "./handlers/read_review.ts";
import { SearchForm } from "./handlers/search_form.ts";
import { SearchReviews } from "./handlers/search_reviews.ts";
import { CreateReviewForm } from "./handlers/create_review_form.ts";

export default SlackFunction(
  GenerateDashboardDefinition,
  async ({ inputs, client }) => {
    // get reviews
    const res = await client.apps.datastore.query<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      limit: LIMIT_QUERY_REVIEWS,
    });

    // handle error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    const blocks = [];

    // add blocks from dashboardNavBlocks
    blocks.push(...dashboardNavBlocks());
    blocks.push({ type: "divider" });

    // add blocks from dashboardReviewsBlock
    blocks.push(...dashboardReviewsBlock(res.items));
    blocks.push({ type: "divider" });

    // add blocks from dashboardPaginationBlocks
    blocks.push(
      dashboardPaginationBlocks(
        res.response_metadata?.next_cursor,
      ),
    );

    // create message
    const msgPostMessage = await client.chat.postMessage({
      channel: inputs.user_id,
      blocks,
    });

    // handle error
    if (!msgPostMessage.ok) {
      const errorMsg =
        `Error when sending message client.chat.postMessage (Error detail: ${msgPostMessage.error})`;
      return { error: errorMsg };
    }

    return { completed: false };
  },
).addBlockActionsHandler(
  NEXT_PAGINATION_RESULTS,
  NextPaginationResults,
).addBlockActionsHandler(
  READ_REVIEW,
  ReadReview,
).addBlockActionsHandler(
  DELETE_REVIEW,
  DeleteReview,
).addBlockActionsHandler(
  SEARCH_FORM,
  SearchForm,
).addBlockActionsHandler(
  SEARCH_REVIEWS,
  SearchReviews,
).addBlockActionsHandler(
  CREATE_REVIEW_FORM,
  CreateReviewForm
);
