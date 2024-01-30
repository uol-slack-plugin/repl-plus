import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import {
  BACK,
  CREATE_REVIEW_FORM,
  CREATE_REVIEW_SUBMIT,
  DELETE_REVIEW,
  EDIT_REVIEW_FORM,
  EDIT_REVIEW_MENU,
  EDIT_REVIEW_SUBMIT,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ_REVIEW,
  SUBMIT,
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
import { EditReviewMenu } from "./handlers/edit_review_menu.ts";
import Init from "./controllers/init.ts";
import { Submit } from "./handlers/submit.ts";

export default SlackFunction(
  GenerateDashboardDefinition,
  async ({ inputs, client }) => {
    await Init(client, inputs.user_id);
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
    EDIT_REVIEW_MENU,
    EditReviewMenu,
  ).addBlockActionsHandler(
    SUBMIT,
    Submit
  )

// ).addBlockActionsHandler(
//   SEARCH_REVIEWS_FORM,
//   SearchForm,
// ).addBlockActionsHandler(
//   SEARCH_REVIEWS_SUBMIT,
//   SearchReviews,
// )
