import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { getOptionValue } from "../utils.ts";
import { SELECT_REVIEW_ID, SELECT_REVIEW_ACTION_ID, EDIT_REVIEW_FORM } from "../constants.ts";
import EditReviewFormController from "../controllers/edit_review_form.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";

export const EditReviewForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
    
  const metadata: Metadata = JSON.parse(action.value);
  const reviewIdFromSelection = getOptionValue(SELECT_REVIEW_ID,SELECT_REVIEW_ACTION_ID,body);
  const updateMessage: UpdateMessage ={
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  }
  metadata.pages.push(EDIT_REVIEW_FORM);

  console.log("EditReviewForm",metadata);

  await EditReviewFormController(metadata, client,updateMessage, reviewIdFromSelection);
};
