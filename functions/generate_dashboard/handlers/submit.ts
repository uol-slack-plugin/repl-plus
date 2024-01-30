import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import {
DASHBOARD,
  EDIT_REVIEW_FORM,
  EDIT_REVIEW_MENU,
  SELECT_REVIEW_ACTION_ID,
  SELECT_REVIEW_ID,
} from "../constants.ts";

import EditReviewFormController from "../controllers/edit_review_form.ts";
import UpdateReviewController from "../controllers/update_review.ts";
import { getOptionValue } from "../../../utils/state.ts";
import DashboardController from "../controllers/dashboard.ts";

export const Submit: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  const reviewIdFromSelection = getOptionValue(
    SELECT_REVIEW_ID,
    SELECT_REVIEW_ACTION_ID,
    body,
  );

  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  if (
    metadata.pages[metadata.pages.length - 1] === EDIT_REVIEW_MENU &&
    reviewIdFromSelection
  ) {
    metadata.pages.push(EDIT_REVIEW_FORM);

    await EditReviewFormController(
      metadata,
      client,
      updateMessage,
      reviewIdFromSelection,
    );
  }

  else if (
    metadata.pages[metadata.pages.length - 1] === EDIT_REVIEW_FORM &&
    metadata.payload.review
  ) {

    const validation = await UpdateReviewController(metadata, body, client);
    console.log("validation::", validation);

    if(validation.pass) {
      metadata.pages=[DASHBOARD];
      metadata.cursors = []
      metadata.payload = {}
      DashboardController(metadata,client,updateMessage);
    } 

  }

  console.log("Submit::", metadata);
  
};
