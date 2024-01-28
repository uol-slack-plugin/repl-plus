import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import { Review } from "../../types/review.ts";
import { queryReviewDatastore } from "../../datastores/functions.ts";
import { generateDashboardBlocks } from "../../blocks/main.ts";
import {
  BACK,
  CREATE_REVIEW_FORM,
  CREATE_REVIEW_SUBMIT,
  READ_REVIEW,
} from "./constants.ts";
import { CreateReviewForm } from "./handlers/create_review_form.ts";
import { CreateReviewSubmit } from "./handlers/create_review_submit.ts";
import { Back } from "./handlers/back.ts";
import { ReadReview } from "./handlers/read_review.ts";

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
)

.addBlockActionsHandler(
  CREATE_REVIEW_FORM,
  CreateReviewForm,
).addBlockActionsHandler(
  CREATE_REVIEW_SUBMIT,
  CreateReviewSubmit,
).addBlockActionsHandler(
  BACK,
  Back,
).addBlockActionsHandler(
    READ_REVIEW,
    ReadReview,
);

// .addBlockActionsHandler(
//   NEXT_RESULTS,
//   NextPaginationResults,
// ).addBlockActionsHandler(
//   READ_REVIEW,
//   ReadReview,
// ).addBlockActionsHandler(
//   DELETE_REVIEW,
//   DeleteReview,
// ).addBlockActionsHandler(
//   SEARCH_REVIEWS_FORM,
//   SearchForm,
// ).addBlockActionsHandler(
//   SEARCH_REVIEWS_SUBMIT,
//   SearchReviews,
// ).addBlockActionsHandler(
//   CREATE_REVIEW_FORM,
//   CreateReviewForm,
// ).addBlockActionsHandler(
//   CREATE_REVIEW_SUBMIT,
//   CreateReview,
// ).addBlockActionsHandler(
//   CANCEL_BUTTON,
//   CancelButton,
// );
