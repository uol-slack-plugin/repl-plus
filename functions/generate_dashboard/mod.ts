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
  CANCEL_BUTTON,
  CREATE_REVIEW_FORM,
  CREATE_REVIEW_SUBMIT,
  DELETE_REVIEW,
  EDIT_REVIEW_SUBMIT,
  LIMIT_QUERY_REVIEWS,
  NEXT_PAGINATION_RESULTS,
  READ_REVIEW,
  SEARCH_FORM,
  SEARCH_REVIEWS,
  SELECT_REVIEW_SUBMIT,
  START_EDIT_REVIEW,
  START_EDIT_REVIEW_FROM_REVIEW,
} from "./constants.ts";

// HANDLERS
import { DeleteReview } from "./handlers/delete_review.ts";
import { NextPaginationResults } from "./handlers/next_results.ts";
import { ReadReview } from "./handlers/read_review.ts";
import { SearchForm } from "./handlers/search_form.ts";
import { SearchReviews } from "./handlers/search_reviews.ts";
import { CreateReviewForm } from "./handlers/create_review_form.ts";
import { CreateReview } from "./handlers/create_review.ts";
import { CancelButton } from "./handlers/cancel_button.ts";
import { EditReview } from "./handlers/edit_review.ts";
import { SelectReviewForm } from "./handlers/select_review_form.ts";
import { EditReviewForm } from "./handlers/edit_review_form.ts";

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
  CreateReviewForm,
).addBlockActionsHandler(
  CREATE_REVIEW_SUBMIT,
  CreateReview,
).addBlockActionsHandler(
  CANCEL_BUTTON,
  CancelButton,
).addBlockActionsHandler(START_EDIT_REVIEW, SelectReviewForm)
  .addBlockActionsHandler(SELECT_REVIEW_SUBMIT, EditReviewForm)
  .addBlockActionsHandler(EDIT_REVIEW_SUBMIT, EditReview)
  .addBlockActionsHandler(START_EDIT_REVIEW_FROM_REVIEW, EditReviewForm);
