import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import {
  EDIT_REVIEW_FORM,
  SELECT_REVIEW_ACTION_ID,
  SELECT_REVIEW_ID,
} from "../constants.ts";
import EditReviewFormController from "../controllers/edit_review_form.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";

export const EditReviewForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };
  
  metadata.pages.push(EDIT_REVIEW_FORM);

  console.log("EditReviewForm", metadata);


  if (metadata.payload) {
    await EditReviewFormController(
      metadata,
      client,
      updateMessage,
      metadata.payload.reviewId,
    );
  }
};
