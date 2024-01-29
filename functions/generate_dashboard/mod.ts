import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import { Review } from "../../types/review.ts";
import { queryReviewDatastore } from "../../datastores/functions.ts";
import { generateDashboardBlocks } from "../../blocks/dashboard.ts";
import {
  BACK,
  CREATE_REVIEW_FORM,
  CREATE_REVIEW_SUBMIT,
  DELETE_REVIEW,
  EDIT_REVIEW_FORM,
  EDIT_REVIEW_SUBMIT,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ_REVIEW,
  SEARCH_REVIEWS_SUBMIT,
} from "./constants.ts";
import { CreateReviewForm } from "./handlers/create_review_form.ts";
import { CreateReviewSubmit } from "./handlers/create_review_submit.ts";
import { Back } from "./handlers/back.ts";
import { ReadReview } from "./handlers/read_review.ts";
import { DeleteReview } from "./handlers/delete_review.ts";
import { EditReviewForm } from "./handlers/edit_review_form.ts";
import { EditReviewSubmit } from "./handlers/edit_review_submit.ts";
import { NextResults } from "./handlers/next_results.ts";
import { PreviousResults } from "./handlers/previous_results.ts";
import { SearchReviewsSubmit } from "./handlers/search_reviews_submit.ts";
import { Metadata } from "../../types/metadata.ts";

export default SlackFunction(
  GenerateDashboardDefinition,
  async ({ inputs, client }) => {

    const metadata: Metadata = {
      cursors: [],
      expression: undefined
    }

    // query reviews
    const reviewsResponse = await queryReviewDatastore(client);

    // handle error
    if (!reviewsResponse.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${reviewsResponse.error})`;
      return { error: queryErrorMsg };
    }

    // store cursor
    metadata.cursors.push(reviewsResponse.response_metadata?.next_cursor)

    // generate blocks
    const blocks = generateDashboardBlocks(
      Review.constructReviewsFromDatastore(reviewsResponse.items),
      metadata,
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
)
.addBlockActionsHandler(
  CREATE_REVIEW_FORM,
  CreateReviewForm,
).addBlockActionsHandler(
  CREATE_REVIEW_SUBMIT,
  CreateReviewSubmit,
).addBlockActionsHandler(
  EDIT_REVIEW_FORM,
  EditReviewForm,
).addBlockActionsHandler(
  EDIT_REVIEW_SUBMIT,
  EditReviewSubmit,
).addBlockActionsHandler(
  BACK,
  Back,
).addBlockActionsHandler(
  READ_REVIEW,
  ReadReview,
).addBlockActionsHandler(
  DELETE_REVIEW,
  DeleteReview,
).addBlockActionsHandler(
  NEXT_RESULTS,
  NextResults,
).addBlockActionsHandler(
  PREVIOUS_RESULTS,
  PreviousResults,
).addBlockActionsHandler(
  SEARCH_REVIEWS_SUBMIT,
  SearchReviewsSubmit,
);

// ).addBlockActionsHandler(
//   SEARCH_REVIEWS_FORM,
//   SearchForm,
// ).addBlockActionsHandler(
//   SEARCH_REVIEWS_SUBMIT,
//   SearchReviews,
// )
