import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import { Review } from "../../types/review.ts";
import { queryReviewDatastore } from "../../datastores/functions.ts";
import {
  BACK,
  CREATE_REVIEW_FORM,
  CREATE_REVIEW_SUBMIT,
  DELETE_REVIEW,
  EDIT_REVIEW_FORM,
  EDIT_REVIEW_SUBMIT,
  READ_REVIEW,
} from "./constants.ts";
import { CreateReviewForm } from "./handlers/create_review_form.ts";
import { CreateReviewSubmit } from "./handlers/create_review_submit.ts";
import { Back } from "./handlers/back.ts";
import { ReadReview } from "./handlers/read_review.ts";
import { DeleteReview } from "./handlers/delete_review.ts";
import { EditReviewForm } from "./handlers/edit_review_form.ts";
import { EditReviewSubmit } from "./handlers/edit_review_submit.ts";
import { generateDashboardBlocks } from "../../blocks/dashboard.ts";

// HANDLERS

export default SlackFunction(
  GenerateDashboardDefinition,
  async ({ inputs, client }) => {
    // query reviews
    const reviewsResponse = await queryReviewDatastore(client);

    // handle error
    if (!reviewsResponse.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${reviewsResponse.error})`;
      return { error: queryErrorMsg };
    }

    // generate blocks
    const blocks = generateDashboardBlocks(
      Review.constructReviewsFromDatastore(reviewsResponse.items),
      reviewsResponse.response_metadata?.next_cursor,
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
);

// .addBlockActionsHandler(
//   NEXT_RESULTS,
//   NextPaginationResults,
// )
// ).addBlockActionsHandler(
//   SEARCH_REVIEWS_FORM,
//   SearchForm,
// ).addBlockActionsHandler(
//   SEARCH_REVIEWS_SUBMIT,
//   SearchReviews,
// )
