import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import EditFormController from "../../controllers/edit_review_form.ts";
import { getOptionValue } from "../../../../utils/state.ts";
import DashboardController from "../../controllers/dashboard.ts";
import { separateString } from "../../../../utils/regular_expressions.ts";
import UpdateReviewController from "../../controllers/update.ts";
import {
  CREATE_REVIEW,
  DASHBOARD,
  EDIT,
  EDIT_REVIEWS,
  SEARCH_REVIEWS,
  SELECT_REVIEW_ACTION_ID,
  SELECT_REVIEW_ID,
} from "../../constants.ts";
import CreateReviewFormController from "../../controllers/create_review_form.ts";
import CreateReviewController from "../../controllers/create_review.ts";

export const SubmitButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const modules = body.function_data.inputs.modules;
  const userId = body.user.id;
  const reviewIdFromEditMenu = getOptionValue(
    SELECT_REVIEW_ID,
    SELECT_REVIEW_ACTION_ID,
    body,
  );

  // check if there is an id in action.value
  let metadata: Metadata;
  let reviewId: string | null = null;
  const result = separateString(action.value);
  if (result === null) metadata = JSON.parse(action.value);
  else {
    metadata = result.object as Metadata;
    reviewId = result.stringPart;
  }

  console.log("SubmitButton::", metadata);

  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  const lastPage = metadata.pages[metadata.pages.length - 1];
  if (lastPage === EDIT_REVIEWS && reviewIdFromEditMenu !== null) {
    metadata.pages.push(EDIT);
    console.log("SubmitButton::Next::", metadata);
    await EditFormController(
      metadata,
      client,
      updateMessage,
      modules,
      userId,
      reviewIdFromEditMenu,
    );
  }

  if (lastPage == EDIT && reviewId !== null) {
    await UpdateReviewController(body, client, reviewId);
    metadata.pages = [DASHBOARD];
    metadata.cursors = [];
    console.log("SubmitButton::Next::", metadata);
    await DashboardController(
      metadata,
      client,
      updateMessage,
      modules,
    );
  }

  if (lastPage == CREATE_REVIEW) {
    console.log("SubmitButton::Next::", metadata);
    const validation = await CreateReviewController(body, client, userId);
    if (validation.error) return validation.error;
    if (!validation.pass) {
      await CreateReviewFormController(
        metadata,
        client,
        updateMessage,
        modules,
        userId,
        validation.reviewEntry,
      );
    }
    if (validation.pass) {
      metadata.pages = [DASHBOARD];
      metadata.cursors = [];
      console.log("SubmitButton::Next::", metadata);
      await DashboardController(
        metadata,
        client,
        updateMessage,
        modules,
      );
    }
  }

  if (lastPage === SEARCH_REVIEWS)
  {
    console.log(body.state);
  }
};
