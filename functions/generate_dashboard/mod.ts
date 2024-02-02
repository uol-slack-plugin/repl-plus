import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import {
  BACK,
  CREATE_REVIEW,
  DASHBOARD,
  DELETE,
  EDIT,
  EDIT_REVIEWS,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ,
  SEARCH_REVIEWS,
  SUBMIT,
} from "./constants.ts";
import Init from "./controllers/init.ts";
import { Module } from "../../types/module.ts";
import { NextResultsButton } from "./handlers/buttons/next_results.ts";
import { PreviousResultsButton } from "./handlers/buttons/previous_results.ts";
import { ReadButton } from "./handlers/buttons/read.ts";
import { EditButton } from "./handlers/buttons/edit.ts";
import { EditReviewsButton } from "./handlers/buttons/edit_reviews.ts";
import { BackButton } from "./handlers/buttons/back.ts";
import { SubmitButton } from "./handlers/buttons/submit.ts";
import { CreateReviewButton } from "./handlers/buttons/create_review.ts";
import { DeleteButton } from "./handlers/buttons/delete.ts";
import { SearchReviewsButton } from "./handlers/buttons/search_reviews.ts";
import { DashboardButton } from "./handlers/buttons/dashboard.ts";

export default SlackFunction(
  GenerateDashboardDefinition,
  async ({ inputs, client }) => {
    await Init(client, inputs.modules as Module[], inputs.user_id);
    return { completed: false };
  },
).addBlockActionsHandler(
  NEXT_RESULTS,
  NextResultsButton,
).addBlockActionsHandler(
  PREVIOUS_RESULTS,
  PreviousResultsButton,
).addBlockActionsHandler(
  READ,
  ReadButton,
).addBlockActionsHandler(
  EDIT,
  EditButton,
).addBlockActionsHandler(
  EDIT_REVIEWS,
  EditReviewsButton,
).addBlockActionsHandler(
  BACK,
  BackButton,
).addBlockActionsHandler(
  SUBMIT,
  SubmitButton,
).addBlockActionsHandler(
  CREATE_REVIEW,
  CreateReviewButton,
).addBlockActionsHandler(
  DELETE,
  DeleteButton,
).addBlockActionsHandler(
  SEARCH_REVIEWS,
  SearchReviewsButton,
).addBlockActionsHandler(
  DASHBOARD,
  DashboardButton,
)