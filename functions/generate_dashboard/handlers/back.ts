import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { Metadata } from "../../../types/metadata.ts";
import DashboardController from "../controllers/dashboard.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { DASHBOARD, EDIT_REVIEW_MENU, READ_REVIEW } from "../constants.ts";
import EditReviewMenuController from "../controllers/edit_review_menu.ts";
import ReadReviewController from "../controllers/read_review.ts";

export const Back: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  
  const metadata: Metadata = JSON.parse(action.value);
  const updateMessage: UpdateMessage ={
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  }

  // update metadata
  metadata.pages.pop();
  console.log("Back::", metadata);

  if (metadata.pages[metadata.pages.length - 1] === DASHBOARD) {
    metadata.payload={};
    await DashboardController(metadata,client, updateMessage );
  }

  if (metadata.pages[metadata.pages.length - 1] === EDIT_REVIEW_MENU) {
    await EditReviewMenuController(
      metadata,
      client,
      updateMessage,
    );
  }

  if (metadata.pages[metadata.pages.length - 1] === READ_REVIEW) {
    await ReadReviewController(
      metadata,
      client,
      metadata.payload.reviewId,
      body.user.id,
      updateMessage,
    );
  }
};
