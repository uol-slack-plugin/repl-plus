import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { Metadata } from "../../../types/metadata.ts";
import DashboardController from "../controllers/dashboard.ts";
import { DASHBOARD, EDIT_REVIEW_MENU } from "../constants.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import EditReviewMenuController from "../controllers/edit_review_menu.ts";

export const PreviousResults: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  metadata.cursors.pop();
  metadata.cursors.pop();
  const updateMessage: UpdateMessage ={
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  }

  console.log("PreviousResults::", metadata);

  if (metadata.pages[metadata.pages.length - 1] === DASHBOARD) {
    await DashboardController(metadata,client, updateMessage );
  }

  if (metadata.pages[metadata.pages.length - 1] === EDIT_REVIEW_MENU) {
    await EditReviewMenuController(
      metadata,
      client,
      updateMessage,
    );
  }
};
